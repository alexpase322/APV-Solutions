import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Loader2, Monitor, Moon, Plus, Save, Sun, Trash2, X } from 'lucide-react';
import CardProfile from './CardProfile';
import { Alert, Field, Section, inputClass } from './ui';
import { ACCENT_PRESETS, EMPTY_PROFILE, SOCIAL_PLATFORMS, platformById, readableOn } from '../../lib/nfc';
import useCardTheme from '../../hooks/useCardTheme';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_TAGS = 10;
const MAX_TAG_LENGTH = 30;

const THEMES = [
  { id: 'auto', label: 'Auto', icon: Monitor, hint: "Follows each visitor's phone: light by day, dark if their phone is in night mode." },
  { id: 'light', label: 'Light', icon: Sun, hint: 'Your card always shows in light mode.' },
  { id: 'dark', label: 'Night', icon: Moon, hint: 'Your card always shows in night mode.' },
];

const LINK_STYLES = [
  { id: 'accent', label: 'Card color', swatch: (accent) => accent },
  { id: 'brand', label: 'Brand colors', swatch: () => 'conic-gradient(#DD2A7B, #1877F2, #25D366, #FF0000, #DD2A7B)' },
];

/** Chip input: type a tag and press Enter or comma. Backspace on an empty field removes the last one. */
const TagsInput = ({ tags, onChange }) => {
  const [draft, setDraft] = useState('');
  const full = tags.length >= MAX_TAGS;

  const add = (raw) => {
    const tag = raw.replace(/,/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_TAG_LENGTH);
    setDraft('');
    if (!tag || full || tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
    onChange([...tags, tag]);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <Field id="tags" label="Tags" hint={`Shown under your bio. Press Enter or comma to add · ${tags.length}/${MAX_TAGS}`}>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 focus-within:border-[#94A378] focus-within:ring-2 focus-within:ring-[#94A378]/20 transition-all">
        {tags.map((tag, i) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#94A378]/15 pl-3 pr-1 py-1 text-sm font-medium text-[#263646]">
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((_, j) => j !== i))}
              aria-label={`Remove tag ${tag}`}
              className="rounded-full p-0.5 text-[#4d5a37] hover:bg-[#94A378]/30 transition-colors"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id="tags"
          className="flex-1 min-w-[8rem] bg-transparent py-1 text-[#263646] placeholder:text-gray-400 outline-none disabled:cursor-not-allowed"
          value={draft}
          onChange={(e) => (e.target.value.endsWith(',') ? add(e.target.value) : setDraft(e.target.value))}
          onKeyDown={onKeyDown}
          onBlur={() => draft && add(draft)}
          maxLength={MAX_TAG_LENGTH}
          disabled={full}
          placeholder={full ? 'Maximum reached' : tags.length ? 'Add another…' : 'e.g. Bilingual, First-time buyers'}
        />
      </div>
    </Field>
  );
};

const normalize = (profile) => ({
  ...EMPTY_PROFILE,
  ...profile,
  socials: profile?.socials ? profile.socials.map((s) => ({ label: '', ...s })) : [],
  links: profile?.links ? profile.links.map((l) => ({ ...l })) : [],
  tags: profile?.tags ? [...profile.tags] : [],
});

const ImagePicker = ({ label, value, onUpload, onClear, shape }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    if (file.size > MAX_IMAGE_BYTES) return setError('Image is too large (max 5 MB).');
    setError('');
    setBusy(true);
    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-sm font-medium text-[#263646] mb-2">{label}</p>
      <div className="flex items-center gap-4">
        <div
          className={`${shape === 'circle' ? 'w-20 h-20 rounded-full' : 'w-32 h-20 rounded-xl'} bg-[#F8F9FA] border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0`}
        >
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImagePlus className="text-gray-300" size={24} aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-[#263646] hover:border-[#263646] disabled:opacity-60 transition-colors"
          >
            {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={15} aria-hidden="true" />}
            {busy ? 'Uploading…' : value ? 'Change' : 'Upload'}
          </button>
          {value && !busy && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
            >
              <X size={15} aria-hidden="true" /> Remove
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={pick} />
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
};

/**
 * Profile editor with live preview.
 *
 * @param {object}   props.profile   Initial profile
 * @param {(profile) => Promise<object>} props.onSave  Persists and returns the saved profile
 * @param {(file, kind) => Promise<string>} props.onUpload Uploads an image and returns its URL
 */
const CardEditor = ({ profile: initialProfile, onSave, onUpload }) => {
  const [profile, setProfile] = useState(() => normalize(initialProfile));
  const [saved, setSaved] = useState(() => JSON.stringify(normalize(initialProfile)));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const dirty = useMemo(() => JSON.stringify(profile) !== saved, [profile, saved]);
  const previewDark = useCardTheme(profile.theme);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const set = (key) => (e) => setProfile((p) => ({ ...p, [key]: e.target.value }));
  const setValue = (key, value) => setProfile((p) => ({ ...p, [key]: value }));

  const updateItem = (list, index, key, value) =>
    setProfile((p) => ({ ...p, [list]: p[list].map((item, i) => (i === index ? { ...item, [key]: value } : item)) }));
  const removeItem = (list, index) => setProfile((p) => ({ ...p, [list]: p[list].filter((_, i) => i !== index) }));
  const moveItem = (list, index, dir) =>
    setProfile((p) => {
      const next = [...p[list]];
      const target = index + dir;
      if (target < 0 || target >= next.length) return p;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...p, [list]: next };
    });

  const upload = (kind) => async (file) => {
    const url = await onUpload(file, kind);
    setValue(kind === 'cover' ? 'coverUrl' : 'avatarUrl', url);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const next = normalize(await onSave(profile));
      setProfile(next);
      setSaved(JSON.stringify(next));
      setMessage({ kind: 'success', text: 'Changes saved. Your card is up to date.' });
    } catch (err) {
      setMessage({ kind: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const usedPlatforms = new Set(profile.socials.map((s) => s.platform));

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-8 items-start">
      <div className="space-y-6 min-w-0">
        <Section title="Photos" description="A clear headshot builds trust. Cover image is optional.">
          <div className="grid sm:grid-cols-2 gap-6">
            <ImagePicker
              label="Profile photo"
              shape="circle"
              value={profile.avatarUrl}
              onUpload={upload('avatar')}
              onClear={() => setValue('avatarUrl', '')}
            />
            <ImagePicker
              label="Cover image"
              value={profile.coverUrl}
              onUpload={upload('cover')}
              onClear={() => setValue('coverUrl', '')}
            />
          </div>
        </Section>

        <Section title="About you">
          <Field id="fullName" label="Full name">
            <input id="fullName" className={inputClass} value={profile.fullName} onChange={set('fullName')} maxLength={80} required placeholder="Jane Doe" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="jobTitle" label="Job title">
              <input id="jobTitle" className={inputClass} value={profile.jobTitle} onChange={set('jobTitle')} maxLength={80} placeholder="Real Estate Agent" />
            </Field>
            <Field id="company" label="Company">
              <input id="company" className={inputClass} value={profile.company} onChange={set('company')} maxLength={80} placeholder="Company LLC" />
            </Field>
          </div>
          <Field id="bio" label="Short bio" hint={`${profile.bio.length}/500`}>
            <textarea id="bio" rows={4} className={`${inputClass} resize-none`} value={profile.bio} onChange={set('bio')} maxLength={500} placeholder="What you do and how you help your clients." />
          </Field>
          <TagsInput tags={profile.tags} onChange={(tags) => setValue('tags', tags)} />
        </Section>

        <Section title="Contact" description="These power the Call, WhatsApp, Email and Save Contact buttons.">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="phone" label="Phone">
              <input id="phone" type="tel" autoComplete="tel" className={inputClass} value={profile.phone} onChange={set('phone')} maxLength={30} placeholder="+1 (863) 555-0100" />
            </Field>
            <Field id="whatsapp" label="WhatsApp" hint="Include country code, e.g. +1 863 555 0100">
              <input id="whatsapp" type="tel" className={inputClass} value={profile.whatsapp} onChange={set('whatsapp')} maxLength={30} placeholder="+1 863 555 0100" />
            </Field>
            <Field id="email" label="Email">
              <input id="email" type="email" autoComplete="email" className={inputClass} value={profile.email} onChange={set('email')} maxLength={254} placeholder="you@company.com" />
            </Field>
            <Field id="website" label="Website">
              <input id="website" className={inputClass} value={profile.website} onChange={set('website')} maxLength={500} placeholder="www.company.com" />
            </Field>
          </div>
          <Field id="address" label="Address">
            <input id="address" className={inputClass} value={profile.address} onChange={set('address')} maxLength={200} placeholder="123 Main St, Tampa, FL" />
          </Field>
        </Section>

        <Section
          title="Social media"
          description="Each one shows as a button with the network's logo and your text."
          action={
            profile.socials.length < 12 && (
              <button
                type="button"
                onClick={() => {
                  const next = SOCIAL_PLATFORMS.find((p) => !usedPlatforms.has(p.id)) || SOCIAL_PLATFORMS.at(-1);
                  setValue('socials', [...profile.socials, { platform: next.id, label: '', url: '' }]);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F9FA] px-3 py-2 text-sm font-semibold text-[#263646] hover:bg-gray-100 transition-colors"
              >
                <Plus size={15} aria-hidden="true" /> Add
              </button>
            )
          }
        >
          {profile.socials.length === 0 && <p className="text-sm text-gray-500">No social profiles yet.</p>}
          {profile.socials.map((s, i) => {
            const platform = platformById(s.platform);
            const BrandIcon = platform.icon;
            return (
              <div key={i} className="rounded-xl border border-gray-100 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: platform.background || profile.accentColor,
                      color: platform.background ? platform.color || '#ffffff' : readableOn(profile.accentColor),
                    }}
                    aria-hidden="true"
                  >
                    <BrandIcon size={18} />
                  </span>
                  <select
                    aria-label="Platform"
                    className={inputClass}
                    value={s.platform}
                    onChange={(e) => updateItem('socials', i, 'platform', e.target.value)}
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-shrink-0">
                    <button type="button" onClick={() => moveItem('socials', i, -1)} disabled={i === 0} aria-label="Move up" className="px-2 text-gray-500 hover:text-[#263646] disabled:opacity-30">
                      <ArrowUp size={16} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => moveItem('socials', i, 1)} disabled={i === profile.socials.length - 1} aria-label="Move down" className="px-2 text-gray-500 hover:text-[#263646] disabled:opacity-30">
                      <ArrowDown size={16} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => removeItem('socials', i)} aria-label="Remove" className="px-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <input
                  aria-label={`${platform.label} button text`}
                  className={inputClass}
                  value={s.label || ''}
                  onChange={(e) => updateItem('socials', i, 'label', e.target.value)}
                  placeholder={`Button text, e.g. "Mira mi ${platform.id === 'other' ? 'página' : platform.label}"`}
                  maxLength={60}
                />
                <input
                  aria-label={`${platform.label} link`}
                  className={inputClass}
                  value={s.url}
                  onChange={(e) => updateItem('socials', i, 'url', e.target.value)}
                  placeholder={platform.placeholder}
                  required
                />
              </div>
            );
          })}
        </Section>

        <Section
          title="Custom links"
          description="Booking page, portfolio, listings, menu, reviews…"
          action={
            profile.links.length < 10 && (
              <button
                type="button"
                onClick={() => setValue('links', [...profile.links, { label: '', url: '' }])}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F9FA] px-3 py-2 text-sm font-semibold text-[#263646] hover:bg-gray-100 transition-colors"
              >
                <Plus size={15} aria-hidden="true" /> Add
              </button>
            )
          }
        >
          {profile.links.length === 0 && <p className="text-sm text-gray-500">No custom links yet.</p>}
          {profile.links.map((l, i) => (
            <div key={i} className="rounded-xl border border-gray-100 p-3 space-y-2">
              <div className="flex gap-2">
                <input
                  aria-label="Link label"
                  className={inputClass}
                  value={l.label}
                  onChange={(e) => updateItem('links', i, 'label', e.target.value)}
                  placeholder="Book a meeting"
                  maxLength={60}
                  required
                />
                <div className="flex">
                  <button type="button" onClick={() => moveItem('links', i, -1)} disabled={i === 0} aria-label="Move up" className="px-2 text-gray-500 hover:text-[#263646] disabled:opacity-30">
                    <ArrowUp size={16} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => moveItem('links', i, 1)} disabled={i === profile.links.length - 1} aria-label="Move down" className="px-2 text-gray-500 hover:text-[#263646] disabled:opacity-30">
                    <ArrowDown size={16} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => removeItem('links', i)} aria-label="Remove" className="px-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <input
                aria-label="Link URL"
                className={inputClass}
                value={l.url}
                onChange={(e) => updateItem('links', i, 'url', e.target.value)}
                placeholder="https://calendly.com/you"
                required
              />
            </div>
          ))}
        </Section>

        <Section title="Appearance" description="Night mode and the main color for your buttons and header.">
          <div>
            <p className="text-sm font-medium text-[#263646] mb-2" id="theme-label">
              Mode
            </p>
            <div role="radiogroup" aria-labelledby="theme-label" className="inline-flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-[#F8F9FA] p-1">
              {THEMES.map((t) => {
                const selected = profile.theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setValue('theme', t.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      selected ? 'bg-[#263646] text-white shadow-sm' : 'text-gray-600 hover:text-[#263646]'
                    }`}
                  >
                    <t.icon size={16} aria-hidden="true" />
                    {t.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">{THEMES.find((t) => t.id === profile.theme)?.hint}</p>
          </div>
          <p className="text-sm font-medium text-[#263646] -mb-1">Color</p>
          <div className="flex flex-wrap items-center gap-3">
            {ACCENT_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setValue('accentColor', c)}
                aria-label={`Use color ${c}`}
                aria-pressed={profile.accentColor.toLowerCase() === c.toLowerCase()}
                className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                  profile.accentColor.toLowerCase() === c.toLowerCase() ? 'border-[#263646] ring-2 ring-offset-2 ring-[#263646]' : 'border-white shadow'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <label className="inline-flex items-center gap-2 text-sm text-gray-600 ml-1">
              <input
                type="color"
                value={profile.accentColor}
                onChange={(e) => setValue('accentColor', e.target.value)}
                className="w-9 h-9 rounded-full border border-gray-200 cursor-pointer bg-transparent"
              />
              Custom
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-[#263646] mb-2" id="link-style-label">
              Social &amp; link button borders
            </p>
            <div role="radiogroup" aria-labelledby="link-style-label" className="inline-flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-[#F8F9FA] p-1">
              {LINK_STYLES.map((s) => {
                const selected = profile.linkStyle === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setValue('linkStyle', s.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      selected ? 'bg-[#263646] text-white shadow-sm' : 'text-gray-600 hover:text-[#263646]'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full flex-shrink-0 ring-1 ring-black/10" style={{ background: s.swatch(profile.accentColor) }} aria-hidden="true" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Save bar */}
        <div className="sticky bottom-0 -mx-4 sm:mx-0 bg-white/95 backdrop-blur border-t sm:border border-gray-100 sm:rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 z-20">
          <div className="flex-1 min-w-0">
            {message ? (
              <Alert kind={message.kind}>{message.text}</Alert>
            ) : (
              <p className="text-sm text-gray-500">{dirty ? 'You have unsaved changes.' : 'All changes saved.'}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-[#263646]"
            >
              {showPreview ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              Preview
            </button>
            <button
              type="submit"
              disabled={saving || !dirty}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[#263646] px-6 py-3 font-bold text-white hover:bg-[#94A378] disabled:opacity-50 disabled:hover:bg-[#263646] transition-colors"
            >
              {saving ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <aside className={`${showPreview ? 'block' : 'hidden'} lg:block lg:sticky lg:top-24`}>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 text-center">
          Live preview{previewDark ? ' · night mode' : ''}
        </p>
        <div
          className={`rounded-3xl border py-4 max-h-[calc(100vh-8rem)] overflow-y-auto transition-colors ${
            previewDark ? 'bg-[#0b1119] border-[#0b1119]' : 'bg-[#F8F9FA] border-gray-100'
          }`}
        >
          <CardProfile profile={profile} preview />
        </div>
      </aside>
    </form>
  );
};

export default CardEditor;
