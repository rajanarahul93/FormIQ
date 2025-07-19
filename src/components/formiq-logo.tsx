export function FormIQLogo() {
  return (
    <div className="relative">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="text-primary"
      >
        {/* Modern geometric logo design */}
        <rect
          x="4"
          y="4"
          width="24"
          height="24"
          rx="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <rect x="8" y="8" width="16" height="2" rx="1" fill="currentColor" />
        <rect x="8" y="14" width="12" height="2" rx="1" fill="currentColor" />
        <rect x="8" y="20" width="8" height="2" rx="1" fill="currentColor" />
        <circle
          cx="22"
          cy="21"
          r="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M20.5 21L21.5 22L23.5 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}