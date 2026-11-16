/** Contact form config, validation and Web3Forms submission. */

/** Web3Forms public access key (it only lets the form deliver to APV's inbox). */
export const WEB3FORMS_ACCESS_KEY = '89a663b2-90c1-4785-a363-9b66025dcaba';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export const FIELDS = ['first_name', 'last_name', 'email', 'message'];
export const EMPTY_VALUES = { first_name: '', last_name: '', email: '', message: '' };
export const ALL_TOUCHED = { first_name: true, last_name: true, email: true, message: true };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Error message for a field, or undefined when it's valid. */
export function validateField(name, value) {
  const v = value.trim();
  switch (name) {
    case 'first_name':
      return v ? undefined : 'Please enter your first name.';
    case 'last_name':
      return v ? undefined : 'Please enter your last name.';
    case 'email':
      if (!v) return 'Please enter your email address.';
      return EMAIL_RE.test(v) ? undefined : 'Enter a valid email address, like name@company.com.';
    case 'message':
      if (!v) return 'Tell us a little about your project.';
      return v.length < 10 ? 'Add a few more details (at least 10 characters).' : undefined;
    default:
      return undefined;
  }
}

/** DOM id of a field's control, e.g. first_name -> contact-first-name. */
export const fieldId = (name) => `contact-${name.replace('_', '-')}`;

/**
 * POSTs the form (including the hidden access_key and botcheck inputs) to Web3Forms.
 * Resolves on success, rejects on network/API errors or when aborted.
 */
export async function sendToWeb3Forms(formData, signal) {
  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
    signal,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || `Web3Forms request failed (${response.status})`);
  }
  return result;
}
