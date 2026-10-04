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
    <div className={`bg-[#263646] text-white rounded-2xl ${compact ? 'p-4' : 'p-5 sm:p-6'} flex flex-col sm:flex-row gap-5 sm:items-center`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[#E4B34C] text-xs font-bold uppercase tracking-widest mb-2">
          <Nfc size={16} aria-hidden="true" />
          {title}
        </div>
        <p className="font-mono text-sm sm:text-base break-all bg-white/10 rounded-lg px-3 py-2">{url}</p>
        {description && <p className="text-xs text-gray-300 mt-2">{description}</p>}
        <div className="flex flex-wrap gap-2 mt-3">
          <CopyButton value={url} label="Copy link" className="!bg-[#E4B34C] !text-[#263646] hover:!bg-white" />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ExternalLink size={15} aria-hidden="true" /> Open
          </a>
          <button
            type="button"
            onClick={downloadQr}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Download size={15} aria-hidden="true" /> QR
          </button>
        </div>
      </div>
      <div className="bg-white p-2.5 rounded-xl self-start sm:self-center">
        <QRCodeCanvas ref={canvasRef} value={url} size={compact ? 96 : 120} marginSize={1} level="M" fgColor="#263646" />
      </div>
    </div>
  );
};

export default CardLinkBox;
