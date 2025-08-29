// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createOrderRecord } from '@/app/actions/createOrder';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook endpoint called!');
  console.log('📊 Request URL:', request.url);
  console.log('📊 Request method:', request.method);
  
  try {
    const body = await request.text();
    console.log('📦 Request body length:', body.length);
    
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');
    
    console.log('🔐 Stripe signature present:', !!signature);
    console.log('🔐 Webhook secret configured:', !!webhookSecret);

    if (!signature) {
      console.error('❌ Missing stripe signature');
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified successfully');
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    console.log('🎯 Received webhook event:', event.type);
    console.log('🎯 Event ID:', event.id);
    console.log('🎯 Event data:', JSON.stringify(event.data, null, 2));

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('💳 Processing checkout.session.completed');
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💳 Payment session completed:', session.id);
        await handleCheckoutSessionCompleted(session);
        break;

      case 'charge.succeeded':
        console.log('💰 Processing charge.succeeded');
        const charge = event.data.object as Stripe.Charge;
        console.log('💰 Charge succeeded:', charge.id);
        await handleChargeSucceeded(charge);
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Processing payment_intent.payment_failed');
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment failed:', failedPayment.id);
        await handleFailedPayment(failedPayment);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('💥 Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('🔄 Processing checkout session completion:', session.id);
    
    // Get expanded session with line items
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'payment_intent'],
    });

    console.log('📋 Expanded session retrieved:', expandedSession.id);

    const metadata = expandedSession.metadata || {};
    const lineItems = expandedSession.line_items?.data || [];
    
    console.log('📦 Line items count:', lineItems.length);
    console.log('📋 Session metadata:', metadata);
    
    if (lineItems.length === 0) {
      console.log('⚠️ No line items found in session');
      return;
    }

    const firstItem = lineItems[0];
    const productName = firstItem.description || 'Stripe Checkout Product';
    
    console.log('🛍️ First item:', {
      description: firstItem.description,
      quantity: firstItem.quantity,
      amount_total: firstItem.amount_total
    });
    
    // Create product object in the format expected by createOrderRecord
    const product = {
      $id: metadata.productId || 'stripe_product',
      title: productName,
      price: session.amount_total ? (session.amount_total / 100).toString() : '0',
      supplier: metadata.supplier || 'Online Store',
    };

    console.log('📦 Product object:', product);

    // Create customer info in the format you use
    const customerInfo = JSON.stringify({
      name: session.customer_details?.name || 'Stripe Customer',
      email: session.customer_email || 'no-email@stripe.com',
      phone: session.customer_details?.phone || 'No phone',
      address: session.customer_details?.address ? 
        `${session.customer_details.address.line1 || ''}, ${session.customer_details.address.city || ''}, ${session.customer_details.address.country || ''}`.replace(/^,\s*|,\s*$/g, '') : 
        'No address'
    });

    console.log('👤 Customer info:', customerInfo);

    // Use your existing createOrderRecord function
    console.log('💾 Creating order record...');
    await createOrderRecord(
      session.id, // transactionId
      'stripe', // paymentMethod
      session.payment_status === 'paid' ? 'paid' : 'pending', // status
      product,
      customerInfo,
      session.customer_details?.phone || undefined // phoneNumber
    );

    console.log('✅ Order record created successfully for session:', session.id);

  } catch (error) {
    console.error('💥 Error processing checkout session completion:', error);
  }
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  try {
    console.log('🔄 Processing successful charge:', charge.id);
    
    // Extract information from the charge object
    const billingDetails = charge.billing_details;
    const shippingDetails = charge.shipping;
    const paymentMethodDetails = charge.payment_method_details;
    
    console.log('📋 Charge details:', {
      amount: charge.amount,
      currency: charge.currency,
      status: charge.status,
      description: charge.description
    });
    
    // Format address
    const billingAddress = billingDetails.address ? 
      `${billingDetails.address.line1 || ''}, ${billingDetails.address.city || ''}, ${billingDetails.address.country || ''}`.replace(/^,\s*|,\s*$/g, '') : 'No address';
    
    const shippingAddress = shippingDetails?.address ? 
      `${shippingDetails.address.line1 || ''}, ${shippingDetails.address.city || ''}, ${shippingDetails.address.country || ''}`.replace(/^,\s*|,\s*$/g, '') : '';

    // Create product object from charge metadata or defaults
    const product = {
      $id: charge.metadata?.productId || 'stripe_charge_product',
      title: charge.description || 'Stripe Payment',
      price: (charge.amount / 100).toString(),
      supplier: charge.metadata?.supplier || 'Direct Payment',
    };

    console.log('📦 Product from charge:', product);

    // Create comprehensive customer info matching your M-Pesa format
    const customerInfo = JSON.stringify({
      name: billingDetails.name || shippingDetails?.name || 'Stripe Customer',
      email: billingDetails.email || charge.receipt_email || 'no-email@stripe.com',
      phone: billingDetails.phone || 'No phone',
      address: shippingAddress || billingAddress || 'No address',
      // Additional Stripe-specific data
      cardBrand: paymentMethodDetails?.card?.brand,
      cardLast4: paymentMethodDetails?.card?.last4,
      receiptUrl: charge.receipt_url,
      riskScore: charge.outcome?.risk_score,
      networkStatus: charge.outcome?.network_status,
    });

    console.log('👤 Customer info from charge:', customerInfo);

    // Create callback data similar to M-Pesa format but for Stripe
    const callbackData = JSON.stringify({
      Body: {
        stripeCallback: {
          ChargeId: charge.id,
          PaymentIntentId: typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id,
          Amount: charge.amount / 100, // Convert from cents
          Currency: charge.currency.toUpperCase(),
          Status: charge.status,
          Created: charge.created,
          Description: charge.description,
          ReceiptUrl: charge.receipt_url,
          PaymentMethod: {
            Type: charge.payment_method_details?.type,
            Card: charge.payment_method_details?.card ? {
              Brand: charge.payment_method_details.card.brand,
              Last4: charge.payment_method_details.card.last4,
              ExpMonth: charge.payment_method_details.card.exp_month,
              ExpYear: charge.payment_method_details.card.exp_year,
              Country: charge.payment_method_details.card.country,
            } : null
          },
          Outcome: charge.outcome,
          BillingDetails: billingDetails,
          ShippingDetails: shippingDetails,
        }
      }
    });

    console.log('💾 Creating order record for charge...');
    // Use your existing createOrderRecord function
    await createOrderRecord(
      charge.id, // transactionId
      'stripe', // paymentMethod
      charge.status === 'succeeded' ? 'paid' : charge.status, // status
      product,
      customerInfo,
      billingDetails.phone || undefined // phoneNumber
    );

    console.log('📝 Updating order with additional data...');
    // Now update the order with additional Stripe-specific data using updateOrderRecord
    const { updateOrderRecord } = await import('@/app/actions/createOrder');
    await updateOrderRecord(charge.id, {
      amount: charge.amount / 100,
      transactionDate: charge.created.toString(),
      callbackData: callbackData,
    });

    console.log('✅ Charge processed and order created/updated successfully:', charge.id);

  } catch (error) {
    console.error('💥 Error processing charge success:', error);
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('🔄 Processing failed payment:', paymentIntent.id);
    
    // Create product object for failed payment
    const product = {
      $id: paymentIntent.metadata?.productId || 'failed_payment',
      title: paymentIntent.description || 'Failed Payment',
      price: (paymentIntent.amount / 100).toString(),
      supplier: paymentIntent.metadata?.supplier || 'Failed Transaction',
    };

    // Create customer info with error details
    const customerInfo = JSON.stringify({
      name: 'Failed Payment',
      email: 'failed@payment.com',
      phone: 'No phone',
      address: 'No address',
      error: paymentIntent.last_payment_error?.message || 'Payment failed',
      errorCode: paymentIntent.last_payment_error?.code,
      errorType: paymentIntent.last_payment_error?.type,
    });

    // Create callback data for failed payment
    const callbackData = JSON.stringify({
      Body: {
        stripeCallback: {
          PaymentIntentId: paymentIntent.id,
          Status: 'failed',
          Amount: paymentIntent.amount / 100,
          Currency: paymentIntent.currency.toUpperCase(),
          Error: paymentIntent.last_payment_error,
          Created: paymentIntent.created,
        }
      }
    });

    console.log('💾 Creating failed payment record...');
    // Create order record for failed payment (optional - you might not want this)
    await createOrderRecord(
      paymentIntent.id,
      'stripe',
      'failed',
      product,
      customerInfo,
      undefined
    );

    // Update with callback data
    const { updateOrderRecord } = await import('@/app/actions/createOrder');
    await updateOrderRecord(paymentIntent.id, {
      amount: paymentIntent.amount / 100,
      transactionDate: paymentIntent.created.toString(),
      callbackData: callbackData,
    });

    console.log('✅ Failed payment processed successfully:', paymentIntent.id);
    
  } catch (error) {
    console.error('💥 Error processing failed payment:', error);
  }
}


// // app/api/stripe/webhook/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { headers } from 'next/headers';
// import { createOrderRecord } from '@/app/actions/createOrder';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-07-30.basil',
// });

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.text();
//     const headersList = await headers();
//     const signature = headersList.get('stripe-signature');

//     if (!signature) {
//       return NextResponse.json(
//         { error: 'Missing stripe signature' },
//         { status: 400 }
//       );
//     }

//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//     } catch (err) {
//       console.error('Webhook signature verification failed:', err);
//       return NextResponse.json(
//         { error: 'Webhook signature verification failed' },
//         { status: 400 }
//       );
//     }

//     console.log('Received webhook event:', event.type);

//     // Handle the event
//     switch (event.type) {
//       case 'checkout.session.completed':
//         const session = event.data.object as Stripe.Checkout.Session;
//         console.log('Payment session completed:', session.id);
//         await handleCheckoutSessionCompleted(session);
//         break;

//       case 'charge.succeeded':
//         const charge = event.data.object as Stripe.Charge;
//         console.log('Charge succeeded:', charge.id);
//         await handleChargeSucceeded(charge);
//         break;

//       case 'payment_intent.payment_failed':
//         const failedPayment = event.data.object as Stripe.PaymentIntent;
//         console.log('Payment failed:', failedPayment.id);
//         await handleFailedPayment(failedPayment);
//         break;

//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }

//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error('Webhook handler error:', error);
//     return NextResponse.json(
//       { error: 'Webhook handler failed' },
//       { status: 500 }
//     );
//   }
// }

// async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
//   try {
//     console.log('Processing checkout session completion:', session.id);
    
//     // Get expanded session with line items
//     const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
//       expand: ['line_items', 'payment_intent'],
//     });

//     const metadata = expandedSession.metadata || {};
//     const lineItems = expandedSession.line_items?.data || [];
    
//     if (lineItems.length === 0) {
//       console.log('No line items found in session');
//       return;
//     }

//     const firstItem = lineItems[0];
//     const productName = firstItem.description || 'Stripe Checkout Product';
    
//     // Create product object in the format expected by createOrderRecord
//     const product = {
//       $id: metadata.productId || 'stripe_product',
//       title: productName,
//       price: session.amount_total ? (session.amount_total / 100).toString() : '0',
//       supplier: metadata.supplier || 'Online Store',
//     };

//     // Create customer info in the format you use
//     const customerInfo = JSON.stringify({
//       name: session.customer_details?.name || 'Stripe Customer',
//       email: session.customer_email || 'no-email@stripe.com',
//       phone: session.customer_details?.phone || 'No phone',
//       address: session.customer_details?.address ? 
//         `${session.customer_details.address.line1 || ''}, ${session.customer_details.address.city || ''}, ${session.customer_details.address.country || ''}`.replace(/^,\s*|,\s*$/g, '') : 
//         'No address'
//     });

//     // Use your existing createOrderRecord function
//     await createOrderRecord(
//       session.id, // transactionId
//       'stripe', // paymentMethod
//       session.payment_status === 'paid' ? 'paid' : 'pending', // status
//       product,
//       customerInfo,
//       session.customer_details?.phone || undefined // phoneNumber
//     );

//   } catch (error) {
//     console.error('Error processing checkout session completion:', error);
//   }
// }

// async function handleChargeSucceeded(charge: Stripe.Charge) {
//   try {
//     console.log('Processing successful charge:', charge.id);
    
//     // Extract information from the charge object
//     const billingDetails = charge.billing_details;
//     const shippingDetails = charge.shipping;
//     const paymentMethodDetails = charge.payment_method_details;
    
//     // Format address
//     const billingAddress = billingDetails.address ? 
//       `${billingDetails.address.line1 || ''}, ${billingDetails.address.city || ''}, ${billingDetails.address.country || ''}`.replace(/^,\s*|,\s*$/g, '') : 'No address';
    
//     const shippingAddress = shippingDetails?.address ? 
//       `${shippingDetails.address.line1 || ''}, ${shippingDetails.address.city || ''}, ${shippingDetails.address.country || ''}`.replace(/^,\s*|,\s*$/g, '') : '';

//     // Create product object from charge metadata or defaults
//     const product = {
//       $id: charge.metadata?.productId || 'stripe_charge_product',
//       title: charge.description || 'Stripe Payment',
//       price: (charge.amount / 100).toString(),
//       supplier: charge.metadata?.supplier || 'Direct Payment',
//     };

//     // Create comprehensive customer info matching your M-Pesa format
//     const customerInfo = JSON.stringify({
//       name: billingDetails.name || shippingDetails?.name || 'Stripe Customer',
//       email: billingDetails.email || charge.receipt_email || 'no-email@stripe.com',
//       phone: billingDetails.phone || 'No phone',
//       address: shippingAddress || billingAddress || 'No address',
//       // Additional Stripe-specific data
//       cardBrand: paymentMethodDetails?.card?.brand,
//       cardLast4: paymentMethodDetails?.card?.last4,
//       receiptUrl: charge.receipt_url,
//       riskScore: charge.outcome?.risk_score,
//       networkStatus: charge.outcome?.network_status,
//     });

//     // Create callback data similar to M-Pesa format but for Stripe
//     const callbackData = JSON.stringify({
//       Body: {
//         stripeCallback: {
//           ChargeId: charge.id,
//           PaymentIntentId: typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id,
//           Amount: charge.amount / 100, // Convert from cents
//           Currency: charge.currency.toUpperCase(),
//           Status: charge.status,
//           Created: charge.created,
//           Description: charge.description,
//           ReceiptUrl: charge.receipt_url,
//           PaymentMethod: {
//             Type: charge.payment_method_details?.type,
//             Card: charge.payment_method_details?.card ? {
//               Brand: charge.payment_method_details.card.brand,
//               Last4: charge.payment_method_details.card.last4,
//               ExpMonth: charge.payment_method_details.card.exp_month,
//               ExpYear: charge.payment_method_details.card.exp_year,
//               Country: charge.payment_method_details.card.country,
//             } : null
//           },
//           Outcome: charge.outcome,
//           BillingDetails: billingDetails,
//           ShippingDetails: shippingDetails,
//         }
//       }
//     });

//     // Use your existing createOrderRecord function
//     await createOrderRecord(
//       charge.id, // transactionId
//       'stripe', // paymentMethod
//       charge.status === 'succeeded' ? 'paid' : charge.status, // status
//       product,
//       customerInfo,
//       billingDetails.phone || undefined // phoneNumber
//     );

//     // Now update the order with additional Stripe-specific data using updateOrderRecord
//     const { updateOrderRecord } = await import('@/app/actions/createOrder');
//     await updateOrderRecord(charge.id, {
//       amount: charge.amount / 100,
//       transactionDate: charge.created.toString(),
//       callbackData: callbackData,
//     });

//   } catch (error) {
//     console.error('Error processing charge success:', error);
//   }
// }

// async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
//   try {
//     console.log('Processing failed payment:', paymentIntent.id);
    
//     // Create product object for failed payment
//     const product = {
//       $id: paymentIntent.metadata?.productId || 'failed_payment',
//       title: paymentIntent.description || 'Failed Payment',
//       price: (paymentIntent.amount / 100).toString(),
//       supplier: paymentIntent.metadata?.supplier || 'Failed Transaction',
//     };

//     // Create customer info with error details
//     const customerInfo = JSON.stringify({
//       name: 'Failed Payment',
//       email: 'failed@payment.com',
//       phone: 'No phone',
//       address: 'No address',
//       error: paymentIntent.last_payment_error?.message || 'Payment failed',
//       errorCode: paymentIntent.last_payment_error?.code,
//       errorType: paymentIntent.last_payment_error?.type,
//     });

//     // Create callback data for failed payment
//     const callbackData = JSON.stringify({
//       Body: {
//         stripeCallback: {
//           PaymentIntentId: paymentIntent.id,
//           Status: 'failed',
//           Amount: paymentIntent.amount / 100,
//           Currency: paymentIntent.currency.toUpperCase(),
//           Error: paymentIntent.last_payment_error,
//           Created: paymentIntent.created,
//         }
//       }
//     });

//     // Create order record for failed payment (optional - you might not want this)
//     await createOrderRecord(
//       paymentIntent.id,
//       'stripe',
//       'failed',
//       product,
//       customerInfo,
//       undefined
//     );

//     // Update with callback data
//     const { updateOrderRecord } = await import('@/app/actions/createOrder');
//     await updateOrderRecord(paymentIntent.id, {
//       amount: paymentIntent.amount / 100,
//       transactionDate: paymentIntent.created.toString(),
//       callbackData: callbackData,
//     });
    
//   } catch (error) {
//     console.error('Error processing failed payment:', error);
//   }
// }