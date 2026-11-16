import { motion } from 'motion/react';
import { PRODUCTS } from '../lib/site';
import { Marquee } from '../ui/Marquee';
import { Container, CountUp, Eyebrow, Reveal, SplitText } from '../ui/primitives';
import { BrandIcon, TechChip } from '../ui/TechLogo';
import { SHARED_STACK, STACK, STACK_COPY } from './content';

const STACK_REVERSED = [...STACK].reverse();

const FIGURES = [
  { label: 'Technologies', value: STACK.length },
  { label: 'Products', value: PRODUCTS.length },
  { label: 'In all three', value: SHARED_STACK.length },
];

/** "Used" dots pop in row by row, product by product (delay passed through `custom`). */
const DOT_POP = {
  hidden: { scale: 0, opacity: 0 },
  show: (delay) => ({ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 420, damping: 16, delay: 0.25 + delay } }),
};

/** Technology × product table. */
function StackMatrix() {
  return (
    <div className="surface overflow-hidden rounded-4xl">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-4 py-4 sm:px-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">Stack matrix</span>
        <span aria-hidden="true" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-200">
          <span className="size-2 rounded-full bg-sage-300" />
          Used
        </span>
      </div>
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">Technologies used in each APV product</caption>
        <colgroup>
          <col className="w-[38%] sm:w-[40%]" />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th scope="col" className="px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-200 sm:px-6">
              Technology
            </th>
            {PRODUCTS.map((product) => (
              <th
                key={product.slug}
                scope="col"
                className="px-1 py-3 text-center text-[12px] font-medium leading-tight tracking-[-0.01em] text-ink-100 sm:text-[13px]"
              >
                {product.name}
              </th>
            ))}
          </tr>
        </thead>
        <motion.tbody initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          {STACK.map((tech, row) => (
            <tr
              key={tech.name}
              className="border-b border-white/[0.04] transition-colors duration-300 last:border-0 hover:bg-white/[0.025]"
            >
              <th scope="row" className="px-4 py-2.5 font-normal sm:px-6">
                <span className="flex items-center gap-2.5 text-[15px] font-medium leading-snug text-ink-100">
                  <BrandIcon slug={tech.logo} name={tech.name} className="size-5 shrink-0 text-ink-200 max-sm:hidden" />
                  <span className="min-w-0">{tech.name}</span>
                </span>
              </th>
              {PRODUCTS.map((product, col) => (
                <td key={product.slug} className="px-1 py-2.5 text-center">
                  {product.stack.includes(tech.name) ? (
                    <>
                      <motion.span
                        aria-hidden="true"
                        variants={DOT_POP}
                        custom={row * 0.045 + col * 0.09}
                        className="mx-auto block size-2.5 rounded-full bg-sage-300 shadow-[0_0_0_4px_rgba(180,198,143,0.12)]"
                      />
                      <span className="sr-only">Used</span>
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true" className="mx-auto block h-px w-3 bg-white/15" />
                      <span className="sr-only">Not used</span>
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}

/** "One stack, three products": copy + figures, the stack matrix, and two opposing tech marquees. */
export function StackSection() {
  return (
    <section aria-labelledby="stack-title" className="relative isolate overflow-x-clip py-24 sm:py-28 lg:pb-36 lg:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute right-[-10%] top-[10%] aspect-square w-[min(900px,130vw)] rounded-full bg-[radial-gradient(circle,rgba(52,82,110,0.3),transparent_62%)]" />
        <div className="absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_25%_40%,#000_20%,transparent_75%)]" />
      </div>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="mb-6">
              <Eyebrow>{STACK_COPY.eyebrow}</Eyebrow>
            </Reveal>
            <SplitText
              as="h2"
              id="stack-title"
              text={STACK_COPY.title}
              className="text-[clamp(2.1rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-50"
            />
            <Reveal as="p" delay={0.1} className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-200 sm:text-lg">
              {STACK_COPY.description}
            </Reveal>
            <Reveal delay={0.16}>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/[0.07] pt-7">
                {FIGURES.map((figure) => (
                  <div key={figure.label} className="flex flex-col-reverse">
                    <dt className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-200">{figure.label}</dt>
                    <dd className="text-[2rem] font-semibold leading-none tracking-[-0.04em] text-ink-50 sm:text-[2.5rem]">
                      <CountUp value={figure.value} duration={1.4} />
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7" amount={0.15}>
            <StackMatrix />
          </Reveal>
        </div>
      </Container>
      <div className="mt-16 grid gap-3 sm:mt-20 sm:gap-4">
        <Reveal amount={0.1}>
          <Marquee duration={46} gap="0.75rem" repeat={2} label="Technologies used across the products">
            {STACK.map((tech) => (
              <TechChip key={tech.name} tech={tech} size="lg" className="bg-ink-850/80" />
            ))}
          </Marquee>
        </Reveal>
        <Reveal amount={0.1} delay={0.08}>
          <div aria-hidden="true" inert>
            <Marquee duration={54} gap="0.75rem" repeat={2} reverse>
              {STACK_REVERSED.map((tech) => (
                <TechChip key={tech.name} tech={tech} size="lg" className="bg-ink-850/80" />
              ))}
            </Marquee>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
