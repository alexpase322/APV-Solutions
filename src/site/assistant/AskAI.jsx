import { SparkleIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { Button } from '../ui/Button';
import { preloadAssistant, useAssistant } from './assistantStore';

/** Pill button that opens the assistant, optionally asking a suggested question (`chip`) or free text (`ask`). */
export function AskAIButton({ chip, ask, children = 'Ask our AI assistant', variant = 'secondary', size = 'md', className, onBeforeOpen }) {
  const { open } = useAssistant();
  return (
    <Button
      variant={variant}
      size={size}
      magnetic={false}
      icon={false}
      aria-haspopup="dialog"
      onPointerEnter={preloadAssistant}
      onFocus={preloadAssistant}
      onClick={() => {
        onBeforeOpen?.();
        open({ chip, ask });
      }}
      leading={<SparkleIcon weight="fill" className={cn('size-4', variant === 'primary' ? 'text-ink-950' : 'text-sage-300')} aria-hidden="true" />}
      className={className}
    >
      {children}
    </Button>
  );
}

/** Inline text link that opens the assistant. */
export function AskAILink({ chip, ask, children = 'Ask our AI assistant', className }) {
  const { open } = useAssistant();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onPointerEnter={preloadAssistant}
      onFocus={preloadAssistant}
      onClick={() => open({ chip, ask })}
      className={cn(
        'group/ai inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-sage-300 transition-colors hover:text-sage-200',
        className,
      )}
    >
      <SparkleIcon weight="fill" className="size-4 transition-transform duration-500 ease-out-expo group-hover/ai:rotate-90" aria-hidden="true" />
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out-expo group-hover/ai:bg-[length:100%_1px]">
        {children}
      </span>
    </button>
  );
}
