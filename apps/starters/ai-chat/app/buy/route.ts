const FALLBACK_MESSAGE =
  'Checkout is not configured. Set NEXT_PUBLIC_CHECKOUT_URL to your Stripe Payment Link or hosted checkout URL.';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL;
  if (!checkoutUrl) {
    return new Response(FALLBACK_MESSAGE, {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  return Response.redirect(checkoutUrl, 303);
}
