type P = { className?: string };

export const ReactIcon = ({ className }: P) => (
  <svg viewBox="-11.5 -10.2 23 20.4" className={className} aria-hidden>
    <circle r="2" fill="currentColor" />
    <g stroke="currentColor" fill="none" strokeWidth="1">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

export const Html5Icon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M3 2l1.6 18L12 22l7.4-2L21 2H3zm13.9 6H8.2l.2 2.2h8.3l-.6 6.6-4.1 1.1-4.1-1.1-.3-3h2.2l.1 1.5 2.1.6 2.1-.6.2-2.4H7.9L7.4 6h9.7l-.2 2z" />
  </svg>
);

export const ImageIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      fill="currentColor"
      d="M5 3h14a3 3 0 013 3v12a3 3 0 01-3 3H5a3 3 0 01-3-3V6a3 3 0 013-3zm0 2a1 1 0 00-1 1v8.6l3.3-3.3a1.5 1.5 0 012.1 0l3.1 3.1 1.4-1.4a1.5 1.5 0 012.1 0L20 16.4V6a1 1 0 00-1-1H5zm10 2.2a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6z"
    />
  </svg>
);

export const HeartIcon = ({ className, filled }: P & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      fill={filled ? "#FF4040" : "currentColor"}
      d="M12 21s-8-5.2-8-11a4.6 4.6 0 018-3 4.6 4.6 0 018 3c0 5.8-8 11-8 11z"
    />
  </svg>
);

export const TriangleLeft = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M18 3v18L4 12z" />
  </svg>
);
export const TriangleRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M6 3v18l14-9z" />
  </svg>
);

export const PlayIcon = ({ className }: P) => <TriangleRight className={className} />;
export const PauseIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);
export const VolumeIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4zM14 3.2v2.1a7 7 0 010 13.4v2.1a9 9 0 000-17.6z" />
  </svg>
);
export const MuteIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3zm13.6 3l2.9-2.9-1.4-1.4-2.9 2.9-2.9-2.9-1.4 1.4 2.9 2.9-2.9 2.9 1.4 1.4 2.9-2.9 2.9 2.9 1.4-1.4z" />
  </svg>
);
export const FullscreenIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z" />
  </svg>
);

export const YoutubeIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />
  </svg>
);

export const ItchIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M4.2 2.5C3 3.2 1 5.3 1 6.2v1.2c0 1.5 1.4 2.8 2.7 2.8 1.5 0 2.7-1.2 2.8-2.6 0 1.4 1.200 2.600 2.800 2.600 1.400 0 2.600-1.200 2.600-2.600 0 1.400 1.200 2.600 2.700 2.600 1.600 0 2.800-1.200 2.800-2.600 0 1.400 1.200 2.600 2.800 2.600 1.300 0 2.700-1.300 2.700-2.800V6.200c0-.9-2-3-3.200-3.700-3.500-.3-5.800-.3-8.300-.3S7.800 2.200 4.200 2.500zM9.300 12c-.5.700-.8 1.600-.9 2.500v.6c0 .500-.4 6.400.8 7.300 1.800.4 5.300.5 8.800 0 1.200-.9.800-6.800.8-7.300v-.6c-.1-.9-.4-1.800-.9-2.500-1.400 0-2.800-.8-3.100-1.800-.6.700-1.400 1.100-2.300 1.100-.9 0-1.700-.4-2.300-1.100-.3 1-1.700 1.800-3.100 1.800z" />
  </svg>
);

export const LinkedinIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M4.5 3A2.5 2.5 0 107 5.500 2.500 2.500 0 004.500 3zM2.500 9h4v12h-4V9zm7 0h3.800v1.700h.1c.5-1 1.800-2 3.800-2 4 0 4.800 2.600 4.800 6.100V21h-4v-5.400c0-1.300 0-3-1.800-3s-2.100 1.400-2.100 2.900V21h-4V9z" />
  </svg>
);

export const MenuIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M3 5h18v2.500H3zm0 5.800h18v2.500H3zM3 16.500h18V19H3z" />
  </svg>
);
export const CloseIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M5.400 3.600L12 10.200l6.600-6.600 1.800 1.800-6.600 6.600 6.600 6.600-1.800 1.800-6.600-6.600-6.600 6.600-1.800-1.800 6.600-6.600-6.600-6.600z" />
  </svg>
);

export const ArrowRightIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M4 11h12.200l-5.100-5.100L12.500 4.500 20 12l-7.500 7.500-1.400-1.400 5.100-5.100H4z" />
  </svg>
);
