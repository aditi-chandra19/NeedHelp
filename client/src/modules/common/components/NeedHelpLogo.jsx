export default function NeedHelpLogo({
  className = "",
  showTagline = true,
  textClassName = "",
  taglineClassName = "",
}) {
  return (
    <div className={`inline-flex min-w-0 items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="h-12 w-12 flex-none"
      >
        <defs>
          <linearGradient id="needhelp-teal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a86b3" />
            <stop offset="100%" stopColor="#3fa6c9" />
          </linearGradient>
          <linearGradient id="needhelp-coral" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef626c" />
            <stop offset="100%" stopColor="#d84756" />
          </linearGradient>
        </defs>

        <path
          d="M8 39C12 18 30 8 45 11c7 1 11 5 14 8-7-15-25-20-39-14C13 8 8 17 8 39Z"
          fill="url(#needhelp-teal)"
        />
        <path
          d="M16 52c17 4 34-6 39-21 2-6 1-10 0-14 7 12 5 29-8 39-11 9-24 9-31 6Z"
          fill="url(#needhelp-coral)"
        />
        <path
          d="M29 11c4 16 4 29-1 43 7-7 11-15 13-25 1-6 1-12-1-18-3 0-7 0-11 0Z"
          fill="url(#needhelp-teal)"
        />
        <path
          d="M28 54c5-14 6-28 1-43-5 8-8 18-8 29 0 5 1 10 2 14h5Z"
          fill="url(#needhelp-coral)"
        />
      </svg>

      <div className="min-w-0">
        <p
          className={`truncate text-[2rem] font-black leading-none tracking-[-0.04em] text-[#233b5d] ${textClassName}`}
        >
          need help
        </p>
        {showTagline ? (
          <p
            className={`truncate pt-1 text-xs font-medium tracking-[0.04em] text-slate-500 ${taglineClassName}`}
          >
            Neighbors helping neighbors
          </p>
        ) : null}
      </div>
    </div>
  );
}
