import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ActionButton, Alert, selectClass } from './ui';
import { PRODUCTS, productById, productsOf } from '../../lib/products';

/**
 * Products programmed with a client's link (card, bracelet…).
 *
 * @param {object}  props.card
 * @param {(type, qty) => Promise} props.onAdd      Adds units (same link)
 * @param {(type) => Promise}      [props.onRemove] Removes a product type (APV only — omit for resellers)
 * @param {Object<string, number>} [props.stock]   Available units per product (resellers)
 */
const ProductsEditor = ({ card, onAdd, onRemove, stock }) => {
  const products = productsOf(card);
  const options = PRODUCTS.filter((p) => !stock || (stock[p.id] || 0) > 0);
  const [type, setType] = useState(options[0]?.id || 'card');
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState(null);
  const max = stock ? Math.min(20, stock[type] || 0) : 20;

  const run = async (key, fn, okText) => {
    setBusy(key);
    setMsg(null);
    try {
      await fn();
      setMsg({ kind: 'success', text: okText });
    } catch (err) {
      setMsg({ kind: 'error', text: err.message });
    } finally {
      setBusy('');
    }
  };

  const remove = (p) => {
    const label = productById(p.type).label;
    if (!window.confirm(`Remove ${p.qty} × ${label} from this client? Program the link only on the products they keep.`)) return;
    run(`remove-${p.type}`, () => onRemove(p.type), `${label} removed.`);
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-4 space-y-3">
      <div>
        <p className="font-semibold text-[#263646]">Products with this link</p>
        <p className="text-xs text-gray-500">Program the same NFC link on every product the client bought.</p>
      </div>
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}

      <ul className="flex flex-wrap gap-2">
        {products.map((p) => {
          const product = productById(p.type);
          return (
            <li key={p.type} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white pl-3 pr-1 py-1 text-sm text-[#263646]">
              <product.icon size={16} aria-hidden="true" />
              <span className="font-semibold">
                {p.qty} × {product.label}
              </span>
              {onRemove && products.length > 1 ? (
                <button
                  type="button"
                  onClick={() => remove(p)}
                  disabled={!!busy}
                  aria-label={`Remove ${product.label}`}
                  className="rounded-md p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              ) : (
                <span className="w-1" />
              )}
            </li>
          );
        })}
      </ul>

      {options.length === 0 ? (
        <p className="text-xs text-gray-500">No units in stock to add more products.</p>
      ) : (
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-sm text-[#263646]">
            <span className="block mb-1 font-medium">Add product</span>
            <select
              className={selectClass}
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setQty(1);
              }}
            >
              {options.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                  {stock ? ` (${stock[p.id]} left)` : ''}
                </option>
              ))}
            </select>
          </label>
          <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white" role="group" aria-label="Quantity to add">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Less" className="p-2.5 text-[#263646] disabled:opacity-30">
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-[#263646]" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label="More" className="p-2.5 text-[#263646] disabled:opacity-30">
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>
          <ActionButton
            icon={Plus}
            busy={busy === 'add'}
            disabled={!!busy || max < 1}
            onClick={() => run('add', () => onAdd(type, qty), `${qty} × ${productById(type).label} added. Program it with the same link.`)}
          >
            Add
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default ProductsEditor;
