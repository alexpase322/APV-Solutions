import { CreditCard, KeyRound, Sticker, Watch } from 'lucide-react';

/** NFC products. Keep the ids in sync with the API (APV-back → src/config/products.js). */
export const PRODUCTS = [
  { id: 'card', label: 'NFC Card', short: 'Card', icon: CreditCard },
  { id: 'bracelet', label: 'NFC Bracelet', short: 'Bracelet', icon: Watch },
  { id: 'sticker', label: 'NFC Sticker', short: 'Sticker', icon: Sticker },
  { id: 'keychain', label: 'NFC Keychain', short: 'Keychain', icon: KeyRound },
];

export const productById = (id) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

/** Products of a client card (older API responses only had a single productType). */
export const productsOf = (card) =>
  card?.products?.length ? card.products : [{ type: card?.productType || 'card', qty: 1 }];

/** "1 NFC Card + 2 NFC Bracelets"-style summary. */
export const productsLabel = (products) =>
  products.map((p) => `${p.qty > 1 ? `${p.qty} ` : ''}${productById(p.type).label}${p.qty > 1 ? 's' : ''}`).join(' + ');
