const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

export default function NavIcon({ id }) {
  const svg = (children) => (
    <svg width={18} height={18} viewBox="0 0 24 24" {...p}>
      {children}
    </svg>
  );
  if (id === "overview")
    return svg(
      <>
        <rect x={3} y={3} width={7} height={7} />
        <rect x={14} y={3} width={7} height={7} />
        <rect x={3} y={14} width={7} height={7} />
        <rect x={14} y={14} width={7} height={7} />
      </>
    );
  if (id === "reviews") return svg(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />);
  if (id === "insights")
    return svg(<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />);
  if (id === "competitor")
    return svg(
      <>
        <path d="M3 3v18h18" />
        <path d="M7 14l3-4 4 3 4-6" />
      </>
    );
  if (id === "store")
    return svg(
      <>
        <path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M4 9h16" />
        <path d="M9 20v-6h6v6" />
      </>
    );
  return null;
}
