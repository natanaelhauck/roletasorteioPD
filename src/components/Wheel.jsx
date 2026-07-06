const COLORS = [
  '#ff2f92',
  '#744cff',
  '#168cff',
  '#00aed9',
  '#ff9d19',
  '#f85f37',
]

const SIZE = 500
const CENTER = SIZE / 2
const RADIUS = 238

function polarToCartesian(angle, radius = RADIUS) {
  const radians = (angle * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  }
}

function createSlicePath(startAngle, endAngle) {
  const start = polarToCartesian(startAngle)
  const end = polarToCartesian(endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

function truncateName(name, maxLength) {
  return name.length > maxLength ? `${name.slice(0, maxLength - 1)}…` : name
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360
}

export default function Wheel({
  participants,
  rotation,
  isSpinning,
  onSpinEnd,
}) {
  const count = participants.length
  const sliceAngle = count ? 360 / count : 360
  const labelSize = Math.max(10, Math.min(18, 190 / Math.max(count, 6)))
  const labelRadius = count > 18 ? 168 : 156

  return (
    <div className="wheel-stage" aria-label={`Roleta com ${count} participantes`}>
      <div className={`wheel-pointer ${isSpinning ? 'is-spinning' : ''}`}>
        <span />
      </div>

      <div className="wheel-aura" />
      <svg
        className="wheel"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? 'transform 4.8s cubic-bezier(0.12, 0.72, 0.08, 1)'
            : 'none',
        }}
        onTransitionEnd={(event) => {
          if (event.propertyName === 'transform') onSpinEnd()
        }}
      >
        <defs>
          <filter id="inner-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.35" />
          </filter>
          <radialGradient id="center-gradient" cx="35%" cy="30%">
            <stop offset="0" stopColor="#25253b" />
            <stop offset="1" stopColor="#0a0a13" />
          </radialGradient>
        </defs>

        <circle cx={CENTER} cy={CENTER} r="246" fill="#0b0b15" stroke="#34344b" strokeWidth="3" />

        {count === 1 ? (
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={COLORS[0]} />
        ) : (
          participants.map((name, index) => {
            const centerAngle = -90 + index * sliceAngle
            const startAngle = centerAngle - sliceAngle / 2
            const endAngle = centerAngle + sliceAngle / 2

            return (
              <path
                key={`${name}-${index}`}
                d={createSlicePath(startAngle, endAngle)}
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(5, 5, 15, 0.72)"
                strokeWidth={count > 40 ? 0.7 : 1.7}
                filter="url(#inner-shadow)"
              />
            )
          })
        )}

        {count <= 40 &&
          participants.map((name, index) => {
            const centerAngle = -90 + index * sliceAngle
            const normalizedAngle = normalizeAngle(centerAngle)
            const labelPoint = polarToCartesian(centerAngle, labelRadius)
            const shouldFlip = normalizedAngle > 90 && normalizedAngle < 270
            const labelRotation = centerAngle + (shouldFlip ? 180 : 0)
            const maxLength = count > 18 ? 10 : count > 10 ? 13 : 17

            return (
              <text
                key={`label-${name}-${index}`}
                x={labelPoint.x}
                y={labelPoint.y}
                dy="0.35em"
                transform={`rotate(${labelRotation} ${labelPoint.x} ${labelPoint.y})`}
                textAnchor="middle"
                className="wheel-label"
                fontSize={labelSize}
              >
                {truncateName(name, maxLength)}
              </text>
            )
          })}

        {!count && (
          <g className="empty-wheel">
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#151522" stroke="#34344b" strokeWidth="2" />
            <text x={CENTER} y={CENTER - 8} textAnchor="middle">Adicione</text>
            <text x={CENTER} y={CENTER + 22} textAnchor="middle">participantes</text>
          </g>
        )}

        <circle cx={CENTER} cy={CENTER} r="54" fill="url(#center-gradient)" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="2.5" />
      </svg>
    </div>
  )
}
