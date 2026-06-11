const AlignLeftArrowIcon = ({ size = 24, color = "white" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Left Arrow */}
    <path d="M10 6L4 12L10 18" />
    <line x1="4" y1="12" x2="20" y2="12" />

    {/* Three horizontal lines */}
    <line x1="14" y1="6" x2="20" y2="6" />
    <line x1="14" y1="18" x2="20" y2="18" />
  </svg>
);

export default AlignLeftArrowIcon;
