import { AddressBookIcon, ArrowsClockwiseIcon, CardsIcon, ChartLineUpIcon, DeviceMobileIcon, QrCodeIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { SpotlightCard } from '../ui/Cards';
import { Container, IconTile, Section, SectionHeading, Stagger, StaggerItem } from '../ui/primitives';
import { AnalyticsMock } from './AnalyticsMock';
import { NFC_FEATURES } from './content';
import { ForeverMock } from './ForeverMock';
import { NoAppMock } from './NoAppMock';
import { QrMock } from './QrMock';
import { SaveContactMock } from './SaveContactMock';
import { UpdateMock } from './UpdateMock';

/** Bento tiles: copy comes from NFC_FEATURES[key]; `span` places the tile in the 12-column grid. */
const TILES = [
  { key: 'noApp', icon: DeviceMobileIcon, Mock: NoAppMock, span: 'md:col-span-2 xl:col-span-5 xl:row-span-2', tall: true },
  { key: 'saveContact', icon: AddressBookIcon, Mock: SaveContactMock, span: 'xl:col-span-7' },
  { key: 'update', icon: ArrowsClockwiseIcon, Mock: UpdateMock, span: 'xl:col-span-4' },
  { key: 'qr', icon: QrCodeIcon, Mock: QrMock, span: 'xl:col-span-3' },
  { key: 'analytics', icon: ChartLineUpIcon, Mock: AnalyticsMock, span: 'xl:col-span-7' },
  { key: 'forever', icon: CardsIcon, Mock: ForeverMock, span: 'md:col-span-2 xl:col-span-5' },
];

/** "Why APV cards": feature bento, each tile with a live mini mockup. */
export function Features() {
  return (
    <Section aria-labelledby="nfc-why-title" className="isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[30%] h-[900px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(52,82,110,0.22),transparent)]" />
      </div>
      <Container>
        <SectionHeading
          id="nfc-why-title"
          layout="split"
          eyebrow="Why APV cards"
          title="Everything a modern *professional needs*"
          description="It works with the NFC reader built into modern iPhone and Android phones, comes with a QR code backup and updates live from your dashboard — one smart card instead of hundreds of paper ones."
        />
        <p className="mt-8 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-gold-400" />
          Sample data · demo profile (Alex Rivera)
        </p>
        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:gap-5 md:grid-cols-2 xl:grid-cols-12" gap={0.08} amount={0.1}>
          {TILES.map((tile, index) => (
            <StaggerItem key={tile.key} className={cn('flex min-w-0', tile.span)}>
              <FeatureTile tile={tile} index={index} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

function FeatureTile({ tile, index }) {
  const copy = NFC_FEATURES[tile.key];
  const titleId = `nfc-feature-${tile.key}`;
  const { Mock, icon: Icon } = tile;

  return (
    <SpotlightCard as="article" aria-labelledby={titleId} className="flex w-full flex-col overflow-hidden">
      <div className={cn('relative px-5 pt-5 sm:px-7 sm:pt-7', tile.tall && 'flex flex-1 flex-col')}>
        <div
          className={cn(
            'relative overflow-hidden rounded-3xl border border-white/[0.05] bg-ink-850/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-5',
            tile.tall && 'flex flex-1 flex-col',
          )}
        >
          <Mock />
        </div>
      </div>
      <div className="flex items-start gap-4 px-5 pb-6 pt-6 sm:px-7 sm:pb-8">
        <IconTile size="sm">
          <Icon weight="duotone" className="size-5" />
        </IconTile>
        <div className="min-w-0">
          <span aria-hidden="true" className="nums font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
            0{index + 1}
          </span>
          <h3 id={titleId} className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-ink-50 sm:text-2xl">
            {copy.title}
          </h3>
          <p className="mt-2.5 max-w-[46ch] text-[15px] leading-relaxed text-ink-200 sm:text-base">{copy.description}</p>
        </div>
      </div>
    </SpotlightCard>
  );
}
