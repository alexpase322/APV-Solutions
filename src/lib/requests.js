/** Change requests a reseller can send to APV (keep in sync with APV-back → models/ChangeRequest.js). */
export const REQUEST_TYPES = {
  deactivate: { label: 'Turn card off', cls: 'bg-gray-200 text-gray-700', hint: 'The NFC link stops showing the profile (e.g. lost or stolen product).' },
  reactivate: { label: 'Turn card on', cls: 'bg-[#94A378]/15 text-[#4d5a37]', hint: 'Make a turned-off card visible again.' },
  delete: { label: 'Delete client', cls: 'bg-red-100 text-red-700', hint: 'Removes the client and their profile. The unit returns to your stock.' },
  other: { label: 'Other', cls: 'bg-[#E4B34C]/15 text-[#8a6412]', hint: 'Anything else — describe what you need.' },
};

export const REQUEST_STATUS = {
  pending: { label: 'Pending', cls: 'bg-[#E4B34C]/15 text-[#8a6412]' },
  approved: { label: 'Approved', cls: 'bg-[#94A378]/15 text-[#4d5a37]' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
};
