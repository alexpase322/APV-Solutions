import { AnimatePresence, motion } from 'motion/react';
import { WarningCircleIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { EASE_OUT_EXPO } from '../../lib/motion';
import { fieldId } from './contactFields';

/** Labelled input (or textarea with `multiline`) with an animated inline error. */
export function FormField({
  field,
  label,
  value,
  error,
  onChange,
  onBlur,
  type = 'text',
  inputMode,
  autoComplete,
  placeholder,
  multiline = false,
  className,
}) {
  const id = fieldId(field);
  const errorId = `${id}-error`;
  const controlClass = cn(
    'w-full rounded-xl border bg-ink-900/70 px-4 text-[16px] text-ink-50 outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-ink-300 focus-visible:outline-none disabled:opacity-60',
    'focus:border-sage-300/70 focus:bg-ink-900/90 focus:shadow-[0_0_0_4px_rgba(180,198,143,0.14)]',
    error ? 'border-gold-400/60' : 'border-white/10 hover:border-white/20',
  );
  const controlProps = {
    id,
    name: field,
    value,
    onChange,
    onBlur,
    required: true,
    'aria-required': true,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink-100">
        {label}
      </label>
      {multiline ? (
        <textarea
          {...controlProps}
          rows={5}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(controlClass, 'min-h-[150px] resize-y py-3.5 leading-relaxed')}
        />
      ) : (
        <input
          {...controlProps}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(controlClass, 'h-12')}
        />
      )}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className="flex items-start gap-1.5 text-sm leading-snug text-gold-300"
          >
            <WarningCircleIcon weight="bold" className="mt-[3px] size-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
