// Temporary recipient requested for form tests. On Netlify, override it with the
// PUBLIC_CONTACT_RECIPIENT build variable once the Zoho mailbox is ready.
const recipient = import.meta.env.PUBLIC_CONTACT_RECIPIENT?.trim() || 'njari.yassine61@gmail.com';

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
  throw new Error('PUBLIC_CONTACT_RECIPIENT must contain a valid email address.');
}

export const contactDelivery = {
  recipient,
  subject: 'Nouvelle demande de projet — Yakmann Energy',
} as const;
