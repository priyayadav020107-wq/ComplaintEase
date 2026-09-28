// Replaces the single donut chart with one progress ring per status,
// each showing that status's share of the user's total complaints.
// data: [{ label, value, color }]
export default function StatusRings({ data, total }) {
  const size = 140;
  const radius = 58;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="status-rings">
      {data.map((d) => {
        const pct = total ? Math.round((d.value / total) * 100) : 0;
        const dash = (pct / 100) * circumference;

        return (
          <div className="ring-card" key={d.label}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#e8f6ed"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
              <text x={size / 2} y={size / 2 + 8} textAnchor="middle" className="ring-value">
                {d.value}
              </text>
            </svg>
            <span className="ring-label">{d.label}</span>
            <span className="ring-pct">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}
