import { useTheme } from "../../ThemeContext";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { getG, statusColor } from "../../theme";
import API from "../../services/api";

const FONT = "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function BarRow({ label, count, max, color, themeG }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: themeG.textMain, textTransform: "capitalize", fontWeight: 500, fontFamily: FONT }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: FONT }}>{count}</span>
      </div>
      <div style={{ height: 10, borderRadius: 6, background: "rgba(106,163,38,0.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 6, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

function LineChart({ points, color }) {
  if (points.length === 0) return null;
  const w = 600, h = 160, pad = 24;
  const max = Math.max(...points.map((p) => p.value), 1);
  const stepX = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (p.value / max) * (h - pad * 2);
    return { x, y, ...p };
  });
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const area = `${path} L ${coords[coords.length - 1].x} ${h - pad} L ${coords[0].x} ${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 180 }}>
      <path d={area} fill={color} opacity={0.08} />
      <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {coords.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={3.5} fill={color} />
          <text x={c.x} y={h - 4} textAnchor="middle" fontSize={10} fill="#4a7a5a" fontFamily={FONT}>{c.label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function ReportsOrders() {
  const { isDark } = useTheme();
  const themeG = getG(isDark);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const card = { background: themeG.card, border: `1px solid ${themeG.border}`, borderRadius: 14, padding: 22, boxShadow: "0 4px 16px rgba(106,163,38,0.05)" };
  const cardTitle = { fontFamily: FONT, fontSize: 15, fontWeight: 600, margin: "0 0 16px", color: themeG.textMain };
  const statCard = { background: themeG.card, border: `1px solid ${themeG.border}`, borderRadius: 14, padding: "18px 20px", boxShadow: "0 4px 16px rgba(106,163,38,0.05)" };

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (err) {
        setError("Failed to load order report data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Layout pageTitle="Order Reports">
        <p style={{ color: themeG.textSub, fontFamily: FONT }}>Loading report…</p>
      </Layout>
    );
  }

  const statusCounts  = groupBy(orders, (o) => o.Status);
  const paymentCounts = groupBy(orders, (o) => o.PaymentStatus);
  const categoryCounts = groupBy(orders, (o) => o.Category);
  const maxStatus  = Math.max(...Object.values(statusCounts),  1);
  const maxPayment = Math.max(...Object.values(paymentCounts), 1);

  const totalRevenue  = orders.reduce((s, o) => s + (parseFloat(o.TotalAmount) || 0), 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  const byDate = {};
  orders.forEach((o) => {
    const day = o.CreatedAt ? o.CreatedAt.substring(5, 10) : "—";
    byDate[day] = (byDate[day] || 0) + (parseFloat(o.TotalAmount) || 0);
  });
  const trendPoints = Object.entries(byDate)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7)
    .map(([label, value]) => ({ label, value }));

  return (
    <Layout pageTitle="Order Reports">

      {error && (
        <div style={{ marginBottom: 16, background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#a23528", fontFamily: FONT }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Orders",    value: orders.length,                              accent: "#7cb342" },
          { label: "Total Revenue",   value: `₹${totalRevenue.toLocaleString()}`,        accent: "#558b2f" },
          { label: "Avg Order Value", value: `₹${avgOrderValue.toFixed(0)}`,             accent: "#9ccc65" },
          { label: "Pending Orders",  value: statusCounts.pending || 0,                  accent: "#8a6510" },
        ].map((c) => (
          <div key={c.label} style={statCard}>
            <p style={{ fontSize: 12, color: themeG.textLabel, margin: "0 0 6px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT }}>{c.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: c.accent, fontFamily: FONT }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={card}>
          <h3 style={cardTitle}>Revenue Trend (by day)</h3>
          {trendPoints.length === 0 ? (
            <p style={{ color: themeG.textSub, fontSize: 13, fontFamily: FONT }}>Not enough data yet.</p>
          ) : (
            <LineChart points={trendPoints} color={themeG.accent} />
          )}
        </div>
        <div style={card}>
          <h3 style={cardTitle}>By Category</h3>
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <BarRow key={cat} label={cat === "cloth" ? "👘 Cloth" : "🧵 Yarn"} count={count}
              max={Math.max(...Object.values(categoryCounts), 1)}
              color={cat === "yarn" ? "#d4a017" : "#3a9bd5"} themeG={themeG} />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={card}>
          <h3 style={cardTitle}>Orders by Status</h3>
          {Object.entries(statusCounts).map(([status, count]) => (
            <BarRow key={status} label={status} count={count} max={maxStatus} color={statusColor(status).color} themeG={themeG} />
          ))}
        </div>
        <div style={card}>
          <h3 style={cardTitle}>Orders by Payment Status</h3>
          {Object.entries(paymentCounts).map(([p, count]) => (
            <BarRow key={p} label={p} count={count} max={maxPayment}
              color={statusColor(p === "paid" ? "approved" : p === "unpaid" ? "declined" : "pending").color} themeG={themeG} />
          ))}
        </div>
      </div>
    </Layout>
  );
}