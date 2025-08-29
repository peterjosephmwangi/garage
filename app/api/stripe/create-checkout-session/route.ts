// app/api/stripe/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil', // Updated to match TypeScript definitions
});

export interface CheckoutSessionRequest {
  product: {
    id: string;
    title: string;
    price: string;
    description: string;
    imageUrl?: string;
    supplier: string;
    serviceType: string;
  };
  quantity: number;
  successUrl?: string;
  cancelUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutSessionRequest = await request.json();
    const { product, quantity, successUrl, cancelUrl } = body;

    // Validate required fields
    if (!product || !product.id || !product.title || !product.price) {
      return NextResponse.json(
        { error: 'Missing required product information' },
        { status: 400 }
      );
    }

    // Convert price to cents (assuming price is in KSH)
    const priceInCents = Math.round(parseFloat(product.price.replace(/[^\d.]/g, '')) * 100);

    if (isNaN(priceInCents) || priceInCents <= 0) {
      return NextResponse.json(
        { error: 'Invalid price format' },
        { status: 400 }
      );
    }

    // Get base URL - prefer from environment, fallback to request headers
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // Construct proper success and cancel URLs with session ID placeholder
    const finalSuccessUrl = successUrl || `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${baseUrl}/payment/cancel`;

    console.log('Creating checkout session with URLs:', {
      successUrl: finalSuccessUrl,
      cancelUrl: finalCancelUrl,
      baseUrl
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'kes', // Kenyan Shilling
            product_data: {
              name: product.title,
              description: product.description,
              images: product.imageUrl ? [product.imageUrl] : [],
              metadata: {
                supplier: product.supplier,
                serviceType: product.serviceType,
                productId: product.id,
              },
            },
            unit_amount: priceInCents,
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        productId: product.id,
        serviceType: product.serviceType,
        supplier: product.supplier,
        quantity: quantity.toString(),
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['KE'], // Kenya
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    console.log('Checkout session created:', {
      sessionId: session.id,
      url: session.url
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// // app/api/stripe/create-checkout-session/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';

// // Initialize Stripe with your secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-06-20',
// });

// export interface CheckoutSessionRequest {
//   product: {
//     id: string;
//     title: string;
//     price: string;
//     description: string;
//     imageUrl?: string;
//     supplier: string;
//     serviceType: string;
//   };
//   quantity: number;
//   successUrl: string;
//   cancelUrl: string;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body: CheckoutSessionRequest = await request.json();
//     const { product, quantity, successUrl, cancelUrl } = body;

//     // Validate required fields
//     if (!product || !product.id || !product.title || !product.price) {
//       return NextResponse.json(
//         { error: 'Missing required product information' },
//         { status: 400 }
//       );
//     }

//     // Convert price to cents (assuming price is in KSH)
//     const priceInCents = Math.round(parseFloat(product.price.replace(/[^\d.]/g, '')) * 100);

//     if (isNaN(priceInCents) || priceInCents <= 0) {
//       return NextResponse.json(
//         { error: 'Invalid price format' },
//         { status: 400 }
//       );
//     }

//     // Create Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'kes', // Kenyan Shilling
//             product_data: {
//               name: product.title,
//               description: product.description,
//               images: product.imageUrl ? [product.imageUrl] : [],
//               metadata: {
//                 supplier: product.supplier,
//                 serviceType: product.serviceType,
//                 productId: product.id,
//               },
//             },
//             unit_amount: priceInCents,
//           },
//           quantity,
//         },
//       ],
//       mode: 'payment',
//       success_url: successUrl,
//       cancel_url: cancelUrl,
//       metadata: {
//         productId: product.id,
//         serviceType: product.serviceType,
//         supplier: product.supplier,
//         quantity: quantity.toString(),
//       },
//       billing_address_collection: 'required',
//       shipping_address_collection: {
//         allowed_countries: ['KE'], // Kenya
//       },
//       phone_number_collection: {
//         enabled: true,
//       },
//     });

//     return NextResponse.json({ sessionId: session.id });
//   } catch (error) {
//     console.error('Stripe checkout session creation error:', error);
    
//     if (error instanceof Stripe.errors.StripeError) {
//       return NextResponse.json(
//         { error: error.message },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }