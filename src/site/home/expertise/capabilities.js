import {
  ArrowsClockwiseIcon,
  BrowsersIcon,
  ChartBarIcon,
  ChartPieSliceIcon,
  ChatCircleDotsIcon,
  CloudArrowUpIcon,
  CpuIcon,
  DeviceMobileIcon,
  FlowArrowIcon,
  HardDrivesIcon,
  IdentificationCardIcon,
  KanbanIcon,
  PlugsIcon,
  PulseIcon,
  TrendUpIcon,
  WhatsappLogoIcon,
} from '@phosphor-icons/react';
import { CAPABILITIES, PRACTICES } from '../../lib/site';

const CAPABILITY_ICONS = {
  'Web & Mobile Apps': DeviceMobileIcon,
  'API Integration': PlugsIcon,
  'Legacy System Modernization': ArrowsClockwiseIcon,
  'Workflow Optimization': FlowArrowIcon,
  'CRM Automation': KanbanIcon,
  'Chatbot Implementation': ChatCircleDotsIcon,
  'Real-time Reporting': PulseIcon,
  'Data Visualization': ChartPieSliceIcon,
  'Predictive Analytics': TrendUpIcon,
  'Cloud Native on AWS & Google Cloud': CloudArrowUpIcon,
  'Java SpringBoot & Python backends': HardDrivesIcon,
  'React & Tailwind frontends': BrowsersIcon,
  'WhatsApp automations': WhatsappLogoIcon,
  'Power BI dashboards': ChartBarIcon,
  'AI-assisted CRMs': CpuIcon,
  'NFC digital business cards': IdentificationCardIcon,
};

/** Practice of the capabilities that aren't a bullet of one of the three PRACTICES. */
const EXTRA_PRACTICE = {
  'Cloud Native on AWS & Google Cloud': 'Custom Software',
  'Java SpringBoot & Python backends': 'Custom Software',
  'React & Tailwind frontends': 'Custom Software',
  'WhatsApp automations': 'Automation',
  'Power BI dashboards': 'Business Intelligence',
  'AI-assisted CRMs': 'Our products',
  'NFC digital business cards': 'Our products',
};

/** Every capability with its icon and the practice it belongs to. */
export const CAPABILITY_LIST = CAPABILITIES.map((name) => {
  const practice = PRACTICES.find((item) => item.bullets.includes(name));
  return { name, icon: CAPABILITY_ICONS[name], practice: practice?.short ?? EXTRA_PRACTICE[name] ?? 'Platform' };
});

/** Practices in order of first appearance, with how many capabilities each has. */
export const PRACTICE_BREAKDOWN = Array.from(new Set(CAPABILITY_LIST.map((cap) => cap.practice))).map((practice) => ({
  practice,
  count: CAPABILITY_LIST.filter((cap) => cap.practice === practice).length,
}));
