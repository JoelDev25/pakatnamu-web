export default function ScoopDivider({ flip = false, color }) {
  return (
    <div
      className={`scoop-divider ${flip ? 'scoop-divider-flip' : ''}`}
      style={color ? { '--scoop-color': color } : undefined}
      aria-hidden="true"
    />
  )
}
