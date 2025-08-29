
// app/api/mpesa/stk-push/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MpesaService, validateMpesaConfig, STKPushRequest } from "../../../lib/mpesa-service";

export async function POST(request: NextRequest) {
  try {
    console.log('=== STK Push Request ===');
    
    // Validate configuration first
    const configErrors = validateMpesaConfig();
    if (configErrors.length > 0) {
      console.error('Configuration errors:', configErrors);
      return NextResponse.json({ 
        error: "M-Pesa configuration incomplete", 
        details: configErrors 
      }, { status: 400 });
    }

    const { phoneNumber, amount, accountReference, transactionDesc } = await request.json();

    // Validate input
    if (!phoneNumber || !amount || !accountReference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^254[17]\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json({ 
        error: "Invalid phone number format. Use format: 254XXXXXXXXX" 
      }, { status: 400 });
    }

    const mpesa = new MpesaService();

    const stkRequest: STKPushRequest = {
      phoneNumber,
      amount: parseFloat(amount),
      accountReference,
      transactionDesc: transactionDesc || "Payment for product",
      callbackUrl: process.env.MPESA_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
    };

    console.log('Processing STK Push with:', {
      phoneNumber,
      amount: stkRequest.amount,
      accountReference,
      callbackUrl: stkRequest.callbackUrl
    });

    const response = await mpesa.initiateSTKPush(stkRequest);

    console.log('STK Push completed successfully');
    return NextResponse.json(response);
  } catch (error) {
    console.error("STK Push API Error:", error);
    
    const errorDetails = {
      message: error instanceof Error ? error.message : "Failed to initiate payment",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      { error: errorDetails.message, details: errorDetails },
      { status: 500 }
    );
  }
}
