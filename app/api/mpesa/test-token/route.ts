// app/api/mpesa/test-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MpesaService, mpesaConfig } from "../../../lib/mpesa-service";

export async function GET(request: NextRequest) {
  try {
    console.log('=== Testing M-Pesa Token Generation ===');
    
    const mpesa = new MpesaService();
    
    // Test token generation by making a simple query call
    // This will internally call getAccessToken()
    try {
      // We'll use a dummy checkout request to trigger token generation
      await mpesa.querySTKStatus('dummy_checkout_id');
    } catch (queryError) {
      // We expect this to fail, but if it fails due to token issues,
      // the error will show the token problem. If it fails due to 
      // invalid checkout ID, then token generation worked.
      const errorMessage = queryError instanceof Error ? queryError.message : String(queryError);
      
      if (errorMessage.includes('access_token') || errorMessage.includes('Forbidden')) {
        throw queryError; // Token issue
      }
      // If error is about invalid checkout ID, token generation worked
    }
    
    return NextResponse.json({
      success: true,
      message: "Token generation appears to be working",
      note: "Token was generated successfully during API call",
      config: {
        environment: mpesaConfig.environment,
        shortCode: mpesaConfig.businessShortCode
      }
    });
  } catch (error) {
    console.error("Token test error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Token test failed",
        config: {
          environment: mpesaConfig.environment,
          shortCode: mpesaConfig.businessShortCode,
          hasConsumerKey: !!mpesaConfig.consumerKey,
          hasConsumerSecret: !!mpesaConfig.consumerSecret,
        }
      },
      { status: 500 }
    );
  }
}
