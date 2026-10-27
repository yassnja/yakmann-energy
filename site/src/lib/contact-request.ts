export interface ContactRequest {
  name: string;
  org: string;
  city: string;
  phone: string;
  email: string;
  type: string;
  message: string;
}

export function contactPayload(fields: ContactRequest, pageUrl: string): Record<string, string> {
  const page = new URL(pageUrl);
  const subjectName = (fields.org || fields.name).replace(/[\r\n]+/g, ' ').trim().slice(0, 100);
  const payload: Record<string, string> = {
    'Nom et prénom': fields.name.trim(),
    'Établissement': fields.org.trim(),
    'Ville': fields.city.trim(),
    'Téléphone': fields.phone.trim(),
    'Type de projet': fields.type.trim(),
    'Votre projet': fields.message.trim(),
    _subject: `Demande de projet — ${subjectName}`,
    _template: 'table',
    _url: `${page.origin}${page.pathname}#contact`,
  };
  // FormSubmit uses the email field as Reply-To; it never changes the recipient.
  if (fields.email.trim()) payload.email = fields.email.trim();
  return payload;
}

export async function sendContactRequest(
  endpoint: string,
  payload: Record<string, string>,
  fetcher: typeof fetch = fetch,
): Promise<'accepted' | 'activation-required'> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object') throw new Error('Invalid submission response');
    const result = data as { success?: unknown; message?: unknown };
    const message = typeof result.message === 'string' ? result.message : '';
    if (response.ok && /activat|confirm your email|check your email/i.test(message)) return 'activation-required';
    if (!response.ok || (result.success !== true && result.success !== 'true')) {
      throw new Error('Submission not accepted');
    }
    return 'accepted';
  } finally {
    clearTimeout(timeout);
  }
}
