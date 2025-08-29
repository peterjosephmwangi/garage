// app/api/paypal/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateOrderRecord } from '@/app/actions/createOrder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.event_type;
    
    console.log('PayPal webhook received:', eventType);

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const capture = body.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id;
      const transactionId = capture.id;
      
      // Update the order status in your database
      await updateOrderRecord(transactionId, {
        status: 'completed',
        transactionDate: new Date().toISOString(),
        callbackData: JSON.stringify(body),
      });

      console.log(`Order ${orderId} marked as completed`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
