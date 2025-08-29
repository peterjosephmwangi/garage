// app/api/mpesa/query/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MpesaService, validateMpesaConfig } from '../../../lib/mpesa-service';

export async function POST(request: NextRequest) {
  try {
    console.log('=== STK Query Request ===');
    
    // Validate configuration first
    const configErrors = validateMpesaConfig();
    if (configErrors.length > 0) {
      console.error('Configuration errors:', configErrors);
      return NextResponse.json({ 
        error: "M-Pesa configuration incomplete", 
        details: configErrors 
      }, { status: 400 });
    }

    const { checkoutRequestID } = await request.json();

    if (!checkoutRequestID) {
      return NextResponse.json(
        { error: 'CheckoutRequestID is required' },
        { status: 400 }
      );
    }

    console.log('Querying transaction:', checkoutRequestID);

    const mpesa = new MpesaService();
    const response = await mpesa.querySTKStatus(checkoutRequestID);
    
    console.log('Query completed successfully');
    return NextResponse.json(response);
  } catch (error) {
    console.error('STK Query API Error:', error);
    
    const errorDetails = {
      message: error instanceof Error ? error.message : "Failed to query payment status",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      { error: errorDetails.message, details: errorDetails },
      { status: 500 }
    );
  }
}