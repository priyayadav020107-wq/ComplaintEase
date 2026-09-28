// Small dependency-free donut chart built from stroked SVG circles.
// data: [{ label, value, color }]
export default function PieChart({ data, size = 180, strokeWidth = 28 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offsetAccum = 0;

  return (
    <div className="pie-chart-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {total === 0 ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />
          ) : (
            data
              .filter((d) => d.value > 0)
              .map((d) => {
                const fraction = d.value / total;
                const dash = fraction * circumference;
                const gap = circumference - dash;
                const el = (
                  <circle
                    key={d.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={d.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={-offsetAccum}
                  />
                );
                offsetAccum += dash;
                return el;
              })
          )}
        </g>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="pie-chart-total">
          {total}
        </text>
      </svg>
      <ul className="pie-chart-legend">
        {data.map((d) => (
          <li key={d.label}>
            <span className="legend-dot" style={{ background: d.color }} />
            {d.label}: {d.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
