import { CHAT } from '../lib/site';

/**
 * Live chat widget (Chatwoot). The SDK is loaded on demand instead of with the page so it never
 * delays the first render; it adds its own floating bubble at the bottom right.
 *
 * The bubble belongs to the marketing site only: it is shown while the site layout is mounted
 * (`setChatActive`) and nothing is covering the page (`setChatSuppressed`, e.g. the mobile menu).
 */

let ready; // Promise that resolves with window.$chatwoot once the widget can be used
let active = false;
const suppressedBy = new Set();

const bubbleVisible = () => active && suppressedBy.size === 0;
const applyBubble = () => window.$chatwoot?.toggleBubbleVisibility(bubbleVisible() ? 'show' : 'hide');

/** Loads the chat SDK once. Rejects if the script is blocked or the widget never starts. */
export function loadChat() {
  if (ready) return ready;
  ready = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('The chat took too long to load')), 20000);
    window.addEventListener(
      'chatwoot:ready',
      () => {
        window.clearTimeout(timeout);
        applyBubble();
        resolve(window.$chatwoot);
      },
      { once: true },
    );

    // Read by the SDK when it starts. Always dark: the site has no light theme.
    window.chatwootSettings = { position: 'right', type: 'standard', darkMode: 'dark', useBrowserLanguage: true };

    const script = document.createElement('script');
    script.src = `${CHAT.baseUrl}/packs/js/sdk.js`;
    script.async = true;
    script.onload = () => window.chatwootSDK.run({ websiteToken: CHAT.websiteToken, baseUrl: CHAT.baseUrl });
    script.onerror = () => {
      // Network error or a content blocker: forget this attempt so a later click can try again
      window.clearTimeout(timeout);
      script.remove();
      ready = undefined;
      reject(new Error('The chat could not be loaded'));
    };
    document.head.appendChild(script);
  });
  return ready;
}

/** Opens the chat window (loading the widget first if needed). */
export async function openChat() {
  const chat = await loadChat();
  chat.toggle('open');
}

/** Marketing site mounted / unmounted. Leaving it closes the chat and hides its bubble. */
export function setChatActive(value) {
  active = value;
  if (!value) window.$chatwoot?.toggle('close');
  applyBubble();
}

/** Temporarily hides the bubble while something covers the page (pass a reason so several can overlap). */
export function setChatSuppressed(reason, suppressed) {
  if (suppressed) suppressedBy.add(reason);
  else suppressedBy.delete(reason);
  applyBubble();
}
