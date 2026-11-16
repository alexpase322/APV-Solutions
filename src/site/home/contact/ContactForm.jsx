import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowClockwiseIcon, CheckCircleIcon, PaperPlaneTiltIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { EASE_OUT_EXPO, SPRING_SOFT } from '../../lib/motion';
import { SITE } from '../../lib/site';
import { ArrowSwap } from '../../ui/Button';
import { FormField } from './FormField';
import {
  ALL_TOUCHED,
  EMPTY_VALUES,
  FIELDS,
  WEB3FORMS_ACCESS_KEY,
  fieldId,
  sendToWeb3Forms,
  validateField,
} from './contactFields';

/**
 * Contact card: validated form that posts to Web3Forms, with sending / success / error states.
 * Focus follows the state: the success panel, the "Try again" button, or the first field again.
 */
export function ContactForm() {
  const formRef = useRef(null);
  const requestRef = useRef(null); // AbortController of the submission in flight
  const focusTargetRef = useRef(null); // 'form' | 'success' | 'retry': element to focus once it mounts
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  useEffect(() => () => requestRef.current?.abort(), []);

  const focusIfTarget = (target, element) => {
    if (element && focusTargetRef.current === target) {
      focusTargetRef.current = null;
      element.focus({ preventScroll: true });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    if (status === 'error') setStatus('idle');
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const nextErrors = {};
    for (const name of FIELDS) nextErrors[name] = validateField(name, values[name]);
    setErrors(nextErrors);
    setTouched(ALL_TOUCHED);
    const firstInvalid = FIELDS.find((name) => nextErrors[name]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    // Read the form before the fieldset gets disabled: disabled controls are left out of FormData.
    const formData = new FormData(event.currentTarget);
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setStatus('submitting');
    try {
      await sendToWeb3Forms(formData, controller.signal);
      setValues(EMPTY_VALUES);
      setErrors({});
      setTouched({});
      focusTargetRef.current = 'success';
      setStatus('success');
    } catch {
      if (controller.signal.aborted) return;
      focusTargetRef.current = 'retry';
      setStatus('error');
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
    }
  };

  const sendAnother = () => {
    focusTargetRef.current = 'form';
    setStatus('idle');
  };

  const submitting = status === 'submitting';

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="glass relative overflow-hidden rounded-4xl p-6 sm:p-8 lg:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(180,198,143,0.16),transparent_70%)]"
      />
      <p role="status" aria-live="polite" className="sr-only">
        {submitting ? 'Sending your message.' : ''}
        {status === 'success' ? "Message sent. Thanks, we'll get back to you within one business day." : ''}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="success"
            ref={(element) => focusIfTarget('success', element)}
            tabIndex={-1}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="relative flex min-h-[520px] flex-col items-start justify-center outline-none"
          >
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...SPRING_SOFT, stiffness: 260, damping: 14, delay: 0.15 }}
              className="grid size-16 place-items-center rounded-3xl border border-sage-300/30 bg-sage-300/10 text-sage-300"
            >
              <CheckCircleIcon weight="duotone" className="size-8" aria-hidden="true" />
            </motion.span>
            <h3 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-ink-50 sm:text-4xl">Message sent</h3>
            <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-ink-200 sm:text-lg">
              Thanks — we'll get back to you within one business day. If it's urgent, call us at{' '}
              <a href={SITE.phoneHref} className="nums text-ink-50 underline decoration-white/25 underline-offset-4">
                {SITE.phoneDisplay}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={sendAnother}
              className="mt-10 inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 text-[15px] font-medium text-ink-50 transition-colors hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.98]"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={(form) => {
              formRef.current = form;
              focusIfTarget('form', form?.querySelector(`#${fieldId('first_name')}`) ?? null);
            }}
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="contact-form-title"
            aria-busy={submitting}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="relative"
          >
            <div className="mb-8">
              <h3 id="contact-form-title" className="text-2xl font-semibold tracking-[-0.035em] text-ink-50">
                Tell us about your project
              </h3>
              <p className="mt-2 text-sm text-ink-200">All fields are required.</p>
            </div>

            <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
            {/* Honeypot: bots tick it, Web3Forms then drops the submission */}
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <fieldset disabled={submitting} className="grid gap-5 sm:grid-cols-2">
              <legend className="sr-only">Your details and message</legend>
              <FormField
                field="first_name"
                label="First name"
                autoComplete="given-name"
                value={values.first_name}
                error={errors.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormField
                field="last_name"
                label="Last name"
                autoComplete="family-name"
                value={values.last_name}
                error={errors.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormField
                field="email"
                label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                error={errors.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="sm:col-span-2"
              />
              <FormField
                field="message"
                label="Message"
                multiline
                placeholder="Tell us about your project..."
                value={values.message}
                error={errors.message}
                onChange={handleChange}
                onBlur={handleBlur}
                className="sm:col-span-2"
              />
            </fieldset>

            <AnimatePresence initial={false}>
              {status === 'error' && (
                <motion.div
                  key="error"
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                  className="mt-6 flex flex-col gap-4 rounded-2xl border border-gold-400/30 bg-gold-400/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-50">
                    <WarningCircleIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-gold-300" aria-hidden="true" />
                    <span>
                      We couldn't send your message. Check your connection and try again, or email us at{' '}
                      <a href={`mailto:${SITE.email}`} className="underline underline-offset-4 [overflow-wrap:anywhere]">
                        {SITE.email}
                      </a>
                      .
                    </span>
                  </p>
                  <button
                    type="button"
                    ref={(element) => focusIfTarget('retry', element)}
                    onClick={() => formRef.current?.requestSubmit()}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-gold-400/40 px-5 text-sm font-medium text-gold-300 transition-colors hover:bg-gold-400/10"
                  >
                    <ArrowClockwiseIcon weight="bold" className="size-4" aria-hidden="true" />
                    Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  'group/btn relative inline-flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full px-8 text-base font-medium tracking-[-0.01em] transition-[background-color,transform] duration-300 ease-out-expo sm:w-auto',
                  'bg-sage-300 text-ink-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_32px_-12px_rgba(148,163,120,0.6)] hover:bg-sage-200 active:scale-[0.98]',
                  submitting && 'cursor-wait',
                )}
              >
                {submitting && <span aria-hidden="true" className="absolute inset-0 shimmer opacity-90" />}
                <span className="relative">{submitting ? 'Sending your message…' : 'Send message'}</span>
                {submitting ? (
                  <PaperPlaneTiltIcon weight="duotone" className="relative size-4" aria-hidden="true" />
                ) : (
                  <ArrowSwap className="relative" />
                )}
              </button>
              <p className="text-[13px] leading-relaxed text-ink-200">
                By sending, you agree to our{' '}
                <Link
                  to="/legal"
                  className="text-ink-50 underline decoration-white/25 underline-offset-4 hover:decoration-sage-300"
                >
                  Terms &amp; Privacy
                </Link>
                .
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
