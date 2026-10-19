interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Tooltip ringan: muncul saat hover atau fokus keyboard. */
export default function Tip({ label, children, className = "" }: Props) {
  return (
    <span className={`group/tip relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap bg-white px-2.5 py-1.5 font-mono text-[10px] font-bold text-black opacity-0 shadow-card transition-all duration-200 group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-focus-within/tip:translate-y-0 group-focus-within/tip:opacity-100"
      >
        {label}
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-white" />
      </span>
    </span>
  );
}
