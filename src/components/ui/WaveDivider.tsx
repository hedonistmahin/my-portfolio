export function WaveDivider() {
  return (
    <div className="wave" aria-hidden="true">
      <svg viewBox="0 0 2880 70" preserveAspectRatio="none">
        <defs>
          <path id="w" d="M0 35Q180 0 360 35T720 35V70H0Z" />
        </defs>
        <g fill="rgba(61,220,151,.1)">
          <use href="#w" />
          <use href="#w" x="720" />
          <use href="#w" x="1440" />
          <use href="#w" x="2160" />
        </g>
        <g fill="rgba(255,138,61,.07)" transform="translate(-200 12)">
          <use href="#w" />
          <use href="#w" x="720" />
          <use href="#w" x="1440" />
          <use href="#w" x="2160" />
        </g>
      </svg>
    </div>
  )
}
