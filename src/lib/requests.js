/** Change requests a reseller can send to APV (keep in sync with APV-back → models/ChangeRequest.js). */
export const REQUEST_TYPES = {
  deactivate: { label: 'Turn card off', cls: 'border-white/10 bg-white/[0.04] text-ink-100', hint: 'The NFC link stops showing the profile (e.g. lost or stolen product).' },
  reactivate: { label: 'Turn card on', cls: 'border-sage-300/30 bg-sage-300/10 text-sage-200', hint: 'Make a turned-off card visible again.' },
  delete: { label: 'Delete client', cls: 'border-red-400/30 bg-red-500/10 text-red-300', hint: 'Removes the client and their profile. The unit returns to your stock.' },
  other: { label: 'Other', cls: 'border-gold-400/30 bg-gold-400/10 text-gold-300', hint: 'Anything else — describe what you need.' },
};

export const REQUEST_STATUS = {
  pending: { label: 'Pending', cls: 'border-gold-400/30 bg-gold-400/10 text-gold-300' },
  approved: { label: 'Approved', cls: 'border-sage-300/30 bg-sage-300/10 text-sage-200' },
  rejected: { label: 'Rejected', cls: 'border-red-400/30 bg-red-500/10 text-red-300' },
};
