import { CreditCard, KeyRound, Sticker, Watch } from 'lucide-react';

/** NFC products. Keep the ids in sync with the API (APV-back → src/config/products.js). */
export const PRODUCTS = [
  { id: 'card', label: 'NFC Card', short: 'Card', icon: CreditCard },
  { id: 'bracelet', label: 'NFC Bracelet', short: 'Bracelet', icon: Watch },
  { id: 'sticker', label: 'NFC Sticker', short: 'Sticker', icon: Sticker },
  { id: 'keychain', label: 'NFC Keychain', short: 'Keychain', icon: KeyRound },
];

export const productById = (id) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
