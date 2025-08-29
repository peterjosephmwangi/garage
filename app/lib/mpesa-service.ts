// app/lib/mpesa-service.ts
export interface STKCallbackResponse {
    Body: {
      stkCallback: {
        MerchantRequestID: string;
        CheckoutRequestID: string;
        ResultCode: number;
        ResultDesc: string;
        CallbackMetadata?: {
          Item: Array<{ Name: string; Value: string | number }>;
        };
      };
    };
  }
  
  export interface STKCallbackData {
    success: boolean;
    message: string;
    checkoutRequestID: string;
    amount?: number;
    transactionId?: string;
    transactionDate?: string;
    phoneNumber?: string;
  }
  
  export interface STKPushRequest {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    transactionDesc: string;
    callbackUrl: string;
  }
  
  export interface STKPushResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
  }
  
  export interface STKQueryResponse {
    ResponseCode: string;
    ResponseDescription: string;
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResultCode: string;
    ResultDesc: string;
  }
  
  export interface MpesaConfig {
    consumerKey: string;
    consumerSecret: string;
    businessShortCode: string;
    passkey: string;
    environment: 'sandbox' | 'production';
  }
  
  export class MpesaService {
    private consumerKey: string;
    private consumerSecret: string;
    private environment: string;
    private shortCode: string;
    private passkey: string;
    private callbackUrl: string;
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;
  
    constructor() {
      this.consumerKey = process.env.MPESA_CONSUMER_KEY || "";
      this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || "";
      this.environment = process.env.MPESA_ENVIRONMENT || "sandbox";
      this.shortCode = process.env.MPESA_BUSINESS_SHORT_CODE || "";
      this.passkey = process.env.MPESA_PASSKEY || "";
      this.callbackUrl = process.env.MPESA_CALLBACK_URL || "";
  
      console.log("MpesaService initialized with:", {
        consumerKey: this.consumerKey ? "[REDACTED]" : "MISSING",
        consumerSecret: this.consumerSecret ? "[REDACTED]" : "MISSING",
        environment: this.environment,
        shortCode: this.shortCode,
        passkey: this.passkey ? "[REDACTED]" : "MISSING",
        callbackUrl: this.callbackUrl,
      });
  
      if (!this.consumerKey || !this.consumerSecret || !this.shortCode || !this.passkey || !this.callbackUrl) {
        throw new Error("M-Pesa configuration is incomplete");
      }
    }
  
    async getAccessToken(): Promise<string> {
      // Check if we have a valid token
      if (this.accessToken && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }
  
      try {
        const url =
          this.environment === "sandbox"
            ? "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
            : "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  
        const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64");
  
        console.log("Requesting access token from:", url, "with Authorization header");
  
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        });
  
        const responseText = await response.text();
        if (!response.ok) {
          console.error("Access token request failed:", {
            status: response.status,
            statusText: response.statusText,
            responseText,
            url,
            authHeader: `Basic [REDACTED]`,
          });
          throw new Error(`Failed to get access token: ${response.statusText}`);
        }
  
        const data = JSON.parse(responseText);
        
        if (!data.access_token) {
          throw new Error('No access token received from M-Pesa API');
        }
  
        console.log("Access token received");
        this.accessToken = data.access_token;
        // Set expiry to 50 minutes (tokens expire in 1 hour)
        this.tokenExpiry = Date.now() + (50 * 60 * 1000);
        
        return this.accessToken!;
      } catch (error) {
        console.error("Error in getAccessToken:", error);
        throw error;
      }
    }
  
    async initiateSTKPush(request: STKPushRequest): Promise<STKPushResponse> {
      try {
        const accessToken = await this.getAccessToken();
        const url =
          this.environment === "sandbox"
            ? "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
            : "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  
        const timestamp = new Date()
          .toISOString()
          .replace(/[-T:\.Z]/g, "")
          .slice(0, 14);
        const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString("base64");
  
        const payload = {
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.floor(request.amount), // Ensure integer
          PartyA: request.phoneNumber,
          PartyB: this.shortCode,
          PhoneNumber: request.phoneNumber,
          CallBackURL: request.callbackUrl,
          AccountReference: request.accountReference,
          TransactionDesc: request.transactionDesc,
        };
  
        console.log("Initiating STK Push with payload:", payload);
  
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        const responseText = await response.text();
        if (!response.ok) {
          console.error("STK Push request failed:", {
            status: response.status,
            statusText: response.statusText,
            responseText,
          });
          throw new Error(`Failed to initiate STK Push: ${response.statusText}`);
        }
  
        const data = JSON.parse(responseText);
        console.log("STK Push response:", data);
        return data;
      } catch (error) {
        console.error("Error in initiateSTKPush:", error);
        throw error;
      }
    }
  
    async querySTKStatus(checkoutRequestID: string): Promise<any> {
      try {
        const accessToken = await this.getAccessToken();
        const url =
          this.environment === "sandbox"
            ? "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
            : "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query";
  
        const timestamp = new Date()
          .toISOString()
          .replace(/[-T:\.Z]/g, "")
          .slice(0, 14);
        const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString("base64");
  
        const payload = {
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestID,
        };
  
        console.log("Querying STK status with payload:", {
          ...payload,
          Password: "[REDACTED]",
        });
  
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        const responseText = await response.text();
        if (!response.ok) {
          console.error("STK Query request failed:", {
            status: response.status,
            statusText: response.statusText,
            responseText,
            url,
            accessToken: "[REDACTED]",
          });
          throw new Error(`STK Query failed: ${response.statusText}`);
        }
  
        const data = JSON.parse(responseText);
        console.log("STK Query response:", data);
        return data;
      } catch (error) {
        console.error("Error in querySTKStatus:", error);
        throw error;
      }
    }
  
    extractCallbackData(body: STKCallbackResponse): STKCallbackData {
      const callback = body.Body.stkCallback;
      const success = callback.ResultCode === 0;
      const metadata = callback.CallbackMetadata?.Item || [];
  
      return {
        success,
        message: callback.ResultDesc,
        checkoutRequestID: callback.CheckoutRequestID,
        amount: Number(metadata.find((item) => item.Name === "Amount")?.Value),
        transactionId: String(metadata.find((item) => item.Name === "MpesaReceiptNumber")?.Value),
        transactionDate: String(metadata.find((item) => item.Name === "TransactionDate")?.Value),
        phoneNumber: String(metadata.find((item) => item.Name === "PhoneNumber")?.Value),
      };
    }
  }
  
  // Configuration
  export const mpesaConfig: MpesaConfig = {
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE || '174379',
    passkey: process.env.MPESA_PASSKEY || '',
    environment: (process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  };
  
  // Validate configuration
  export function validateMpesaConfig(): string[] {
    const errors: string[] = [];
    
    if (!mpesaConfig.consumerKey) {
      errors.push('MPESA_CONSUMER_KEY is not set');
    }
    
    if (!mpesaConfig.consumerSecret) {
      errors.push('MPESA_CONSUMER_SECRET is not set');
    }
    
    if (!mpesaConfig.businessShortCode) {
      errors.push('MPESA_BUSINESS_SHORT_CODE is not set');
    }
    
    if (!mpesaConfig.passkey) {
      errors.push('MPESA_PASSKEY is not set');
    }
    
    return errors;
  }
  
  // Helper function to extract callback data
  export function extractCallbackData(callback: STKCallbackResponse) {
    const stkCallback = callback.Body.stkCallback;
    const success = stkCallback.ResultCode === 0;
    
    let amount = 0;
    let transactionId = '';
    let transactionDate = '';
    let phoneNumber = '';
  
    if (success && stkCallback.CallbackMetadata) {
      const metadata = stkCallback.CallbackMetadata.Item;
      
      const amountItem = metadata.find(item => item.Name === 'Amount');
      const receiptItem = metadata.find(item => item.Name === 'MpesaReceiptNumber');
      const dateItem = metadata.find(item => item.Name === 'TransactionDate');
      const phoneItem = metadata.find(item => item.Name === 'PhoneNumber');
  
      amount = amountItem ? Number(amountItem.Value) : 0;
      transactionId = receiptItem ? String(receiptItem.Value) : '';
      transactionDate = dateItem ? String(dateItem.Value) : '';
      phoneNumber = phoneItem ? String(phoneItem.Value) : '';
    }
  
    return {
      success,
      message: stkCallback.ResultDesc,
      checkoutRequestID: stkCallback.CheckoutRequestID,
      amount,
      transactionId,
      transactionDate,
      phoneNumber,
    };
  }