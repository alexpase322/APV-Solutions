import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Alert, CopyButton } from '../../components/nfc/ui';
import { inviteWhatsappHref } from '../../lib/nfc';

/**
 * Activation link with copy / WhatsApp share and the email delivery status.
 * kind: 'client' (card owner) or 'reseller' (changes labels and the WhatsApp message).
 */
const InviteLinkBox = ({ name, inviteUrl, email, kind = 'client' }) => {
  const who = kind === 'reseller' ? 'reseller' : 'client';
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 space-y-3">
      <p className="text-sm font-semibold text-ink-50">Activation link for the {who}</p>
      <p className="font-mono text-xs break-all rounded-xl border border-white/[0.08] bg-ink-900/60 px-3 py-2 text-ink-100">{inviteUrl}</p>
      <div className="flex flex-wrap gap-2">
        <CopyButton value={inviteUrl} label="Copy invite link" />
        <a
          href={inviteWhatsappHref(name, inviteUrl, kind)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-[#0b3d1f] hover:bg-[#1eb457] transition-colors"
        >
          <MessageCircle size={15} aria-hidden="true" /> Send by WhatsApp
        </a>
      </div>
      {email &&
        (email.sent ? (
          <Alert kind="success">Activation email sent to the {who}.</Alert>
        ) : (
          <Alert kind="info">Email not sent ({email.reason}). Share the activation link above by WhatsApp or text message.</Alert>
        ))}
    </div>
  );
};

export default InviteLinkBox;
