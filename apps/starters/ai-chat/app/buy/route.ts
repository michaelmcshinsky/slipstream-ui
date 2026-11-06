import { getMessages, resolveLocaleFromAcceptLanguage, translate } from '@slipstream-ui/i18n';

export const dynamic = 'force-dynamic';

export async function GET(request?: Request): Promise<Response> {
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL;
  if (!checkoutUrl) {
    const locale = resolveLocaleFromAcceptLanguage(request?.headers.get('accept-language'));
    return new Response(translate(getMessages(locale), 'errors.checkoutMissing'), {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  return Response.redirect(checkoutUrl, 303);
}
