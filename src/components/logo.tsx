export default function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 300"
      width="120"
      height="30"
      fill="currentColor"
      role="img"
      aria-label="ASM Shad logo"
    >
      <defs>
        <style>
          {`
          .word {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          .asm { font-size: 160px; }
          .shad { font-size: 160px; font-weight: 500; }
          .bar { fill: currentColor; opacity: 0.8; }
          .dot { fill: #4c82ff; }
        `}
        </style>
      </defs>

      {/* subtle underline accent */}
      <rect x="0" y="250" width="420" height="6" rx="3" className="bar" />

      {/* text: bold + medium contrast */}
      <text x="40" y="190" className="word asm">
        ASM
      </text>
      <text x="380" y="190" className="word shad">
        Shad
      </text>

      {/* tiny "cursor" dot to hint coding */}
      <rect x="900" y="160" width="14" height="28" rx="2" className="dot" />
    </svg>
  );
}
