
// app/api/mpesa/debug/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mpesaConfig, validateMpesaConfig } from "../../../lib/mpesa-service";

export async function GET(request: NextRequest) {
  try {
    console.log('=== M-Pesa Debug Information ===');
    
    // Check environment variables
    const configErrors = validateMpesaConfig();
    
    const debugInfo = {
      environment: mpesaConfig.environment,
      hasConsumerKey: !!mpesaConfig.consumerKey,
      hasConsumerSecret: !!mpesaConfig.consumerSecret,
      hasShortCode: !!mpesaConfig.businessShortCode,
      hasPasskey: !!mpesaConfig.passkey,
      shortCode: mpesaConfig.businessShortCode,
      consumerKeyPreview: mpesaConfig.consumerKey ? 
        mpesaConfig.consumerKey.substring(0, 6) + '...' : 'NOT SET',
      configErrors,
      baseUrl: mpesaConfig.environment === 'production' 
        ? 'https://api.safaricom.co.ke' 
        : 'https://sandbox.safaricom.co.ke',
      callbackUrl: process.env.MPESA_CALLBACK_URL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    };

    console.log('Debug Info:', debugInfo);

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Debug failed" },
      { status: 500 }
    );
  }
}