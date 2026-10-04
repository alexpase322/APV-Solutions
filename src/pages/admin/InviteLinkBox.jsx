import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Alert, CopyButton } from '../../components/nfc/ui';
import { inviteWhatsappHref } from '../../lib/nfc';

/** Activation link for a client, with copy / WhatsApp share and the email delivery status. */
const InviteLinkBox = ({ name, inviteUrl, email }) => (
  <div className="rounded-2xl border border-gray-100 bg-[#F8F9FA] p-4 space-y-3">
    <p className="text-sm font-semibold text-[#263646]">Activation link for the client</p>
    <p className="font-mono text-xs break-all bg-white rounded-lg border border-gray-100 px-3 py-2 text-gray-600">{inviteUrl}</p>
    <div className="flex flex-wrap gap-2">
      <CopyButton value={inviteUrl} label="Copy invite link" />
      <a
        href={inviteWhatsappHref(name, inviteUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-[#0b3d1f] hover:bg-[#1eb457] transition-colors"
      >
        <MessageCircle size={15} aria-hidden="true" /> Send by WhatsApp
      </a>
    </div>
    {email &&
      (email.sent ? (
        <Alert kind="success">Activation email sent to the client.</Alert>
      ) : (
        <Alert kind="info">Email not sent ({email.reason}). Share the activation link above by WhatsApp or text message.</Alert>
      ))}
  </div>
);

export default InviteLinkBox;
