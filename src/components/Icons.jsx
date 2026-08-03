/** Inline SVG icons — no icon font, all inherit currentColor. */

const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
});

export const ChevronLeft = ({ size = 20 }) => (
  <svg {...base(size)}><path d="m14.5 5-6 7 6 7" /></svg>
);

export const ChevronRight = ({ size = 20 }) => (
  <svg {...base(size)}><path d="m9.5 5 6 7-6 7" /></svg>
);

export const ChevronDown = ({ size = 16 }) => (
  <svg {...base(size)}><path d="m5 9 7 6 7-6" /></svg>
);

export const ChevronUp = ({ size = 16 }) => (
  <svg {...base(size)}><path d="m5 15 7-6 7 6" /></svg>
);

export const CloseIcon = ({ size = 20 }) => (
  <svg {...base(size)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);

export const MenuIcon = ({ size = 22 }) => (
  <svg {...base(size)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

export const MailIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);

export const PhoneIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
  </svg>
);

export const PinIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const InstagramIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.6 8.5h-1.4a1.4 1.4 0 0 0-1.4 1.4V21m-1.6-8h4.4" />
  </svg>
);

export const LinkedInIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <path d="M8 10.5V16M8 7.6v.1M12 16v-3.2a1.8 1.8 0 0 1 3.6 0V16" />
  </svg>
);

/** WhatsApp glyph — filled, so it keeps its shape at small sizes. */
export const WhatsAppIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.55 3.75 1.5 5.29L2 22l4.98-1.63a9.8 9.8 0 0 0 5.06 1.4h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2Zm0 17.9h-.01a8.1 8.1 0 0 1-4.15-1.14l-.3-.18-3.07 1 1.02-3-.19-.31a8.1 8.1 0 0 1-1.25-4.33c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39a8.11 8.11 0 0 1 2.39 5.78c0 4.5-3.66 8.15-8.16 8.15Zm4.47-6.1c-.24-.13-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.28.19-.53.06a6.66 6.66 0 0 1-1.96-1.2 7.4 7.4 0 0 1-1.36-1.7c-.14-.24-.01-.37.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.24-.41.08-.17.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3c-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.73 2.64 4.2 3.7.58.26 1.04.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.45-.6 1.66-1.17.2-.58.2-1.07.14-1.18-.06-.1-.22-.17-.46-.29Z" />
  </svg>
);
