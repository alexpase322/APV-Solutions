import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, ExternalLink, Nfc } from 'lucide-react';
import { CopyButton } from './ui';

/**
 * Shows the public card URL (the one programmed into the NFC chip) with copy, open and a QR code.
 */
const CardLinkBox = ({ url, code, title = 'Your card link', description, compact = false }) => {
  const canvasRef = useRef(null);

  const downloadQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `apv-card-${code}.png`;
    a.click();
  };

  return (
    <div
      className={`border border-white/[0.08] bg-ink-850 bg-linear-to-br from-gold-400/[0.07] via-transparent to-sage-300/[0.06] text-ink-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${
        compact ? 'rounded-2xl p-4' : 'rounded-3xl p-5 sm:p-6'
      } flex flex-col sm:flex-row gap-5 sm:items-center`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-gold-300 font-mono text-[11px] font-medium uppercase tracking-[0.2em] mb-2.5">
          <Nfc size={16} aria-hidden="true" />
          {title}
        </div>
        <p className="font-mono text-sm sm:text-base break-all rounded-xl border border-white/[0.08] bg-ink-950/50 px-3 py-2 text-ink-50">{url}</p>
        {description && <p className="text-xs text-ink-200 mt-2">{description}</p>}
        <div className="flex flex-wrap gap-2 mt-3">
          <CopyButton value={url} label="Copy link" />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-ink-50 hover:border-white/25 hover:bg-white/[0.07] transition-colors"
          >
            <ExternalLink size={15} aria-hidden="true" /> Open
          </a>
          <button
            type="button"
            onClick={downloadQr}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-ink-50 hover:border-white/25 hover:bg-white/[0.07] transition-colors"
          >
            <Download size={15} aria-hidden="true" /> QR
          </button>
        </div>
      </div>
      {/* QR stays dark-on-white so phones can scan it */}
      <div className="bg-white p-2.5 rounded-2xl ring-1 ring-white/15 self-start sm:self-center">
        <QRCodeCanvas ref={canvasRef} value={url} size={compact ? 96 : 120} marginSize={1} level="M" fgColor="#263646" />
      </div>
    </div>
  );
};

export default CardLinkBox;
