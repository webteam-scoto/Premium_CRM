import { useTheme } from "../../ThemeContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getG, statusColor, G } from "../../theme";
import API from "../../services/api";

const Badge = ({ text }) => {
  const s = statusColor(text);
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {text.charAt(0).toUpperCase() + text.slice(1)}
    </span>
  );
};

const actionBtn = (bg, color, border) => ({
  padding: "7px 14px", borderRadius: 8, border: `1px solid ${border}`, background: bg, color,
  cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
});

export default function StatusOrders() {
  const { isDark } = useTheme();
  const themeG = getG(isDark);

  const navigate = useNavigate();
  const tab = localStorage.getItem("premier_category") || "cloth";
  const [filter, setFilter] = useState("pending");
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);


  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/orders", { params: filter !== "all" ? { status: filter } : {} });
      setAllOrders(res.data);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const orders = allOrders.filter((o) => o.Category === tab);

const th = { textAlign: "left", fontSize: 11, color: themeG.textLabel, padding: "12px 16px", borderBottom: "1px solid rgba(106,163,38,0.13)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, background: "rgba(124,179,66,0.04)" }
const td = { padding: "13px 16px", fontSize: 13.5, color: themeG.textMain }


  const setStatus = async (id, status) => {
    setActingId(id);
    setError("");
    try {
      await API.patch(`/orders/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setActingId(null);
    }
  };



  return (
    <Layout pageTitle="Order Approvals">

      {/* ── Category badge ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 10, background: themeG.card, border: `1px solid ${themeG.border}`, boxShadow: "0 2px 8px rgba(106,163,38,0.06)" }}>
          <span style={{ fontSize: 18 }}>{tab === "cloth" ? "👘" : "🧵"}</span>
          <span style={{ fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: themeG.textMain }}>{tab === "cloth" ? "Cloth" : "Yarn"} Orders</span>
        </div>
        <span style={{ fontSize: 12, color: themeG.textSub }}>
          <span style={{ color: themeG.accent, cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/select-category")}>Switch category</span>
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["pending", "approved", "processing", "delivered", "declined", "all"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "8px 16px", borderRadius: 20, border: "1.5px solid", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, textTransform: "capitalize", background: filter === f ? themeG.accent : themeG.card, color: filter === f ? themeG.card : themeG.textSub, borderColor: filter === f ? themeG.accent : themeG.border }}>
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ marginBottom: 16, background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#a23528" }}>
          {error}
        </div>
      )}

      <div style={{ background: themeG.card, border: `1px solid ${themeG.border}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 16px rgba(106,163,38,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Order", "Customer", "Product", "Amount", "Status", "Actions"].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ ...td, textAlign: "center", padding: 30 }}>Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} style={{ ...td, textAlign: "center", padding: 30, color: themeG.textSub }}>No orders in this filter.</td></tr>
            ) : orders.map((o) => (
              <tr key={o.Id} style={{ borderBottom: "1px solid rgba(106,163,38,0.08)" }}>
                <td style={{ ...td, fontWeight: 600, color: themeG.accent, cursor: "pointer" }} onClick={() => navigate(`/master/orders/${o.Id}`)}>{o.Code}</td>
                <td style={td}>{o.customer?.Name ?? "—"}</td>
                <td style={td}>{o.product?.Name ?? "—"}</td>
                <td style={{ ...td, fontWeight: 600 }}>₹{parseFloat(o.TotalAmount).toLocaleString()}</td>
                <td style={td}><Badge text={o.Status} /></td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {o.Status === "pending" && (
                      <>
                        <button disabled={actingId === o.Id} onClick={() => setStatus(o.Id, "approved")} style={actionBtn("rgba(124,179,66,0.12)", themeG.accent, "rgba(124,179,66,0.30)")}>Approve</button>
                        <button disabled={actingId === o.Id} onClick={() => setStatus(o.Id, "declined")} style={actionBtn("rgba(192,57,43,0.08)", "#a23528", "rgba(192,57,43,0.26)")}>Decline</button>
                      </>
                    )}
                    {o.Status === "approved" && (
                      <button disabled={actingId === o.Id} onClick={() => setStatus(o.Id, "processing")} style={actionBtn("rgba(60,130,200,0.10)", "#1a5fa0", "rgba(60,130,200,0.26)")}>Start Processing</button>
                    )}
                    {o.Status === "processing" && (
                      <button disabled={actingId === o.Id} onClick={() => setStatus(o.Id, "delivered")} style={actionBtn("rgba(124,179,66,0.12)", themeG.accent, "rgba(124,179,66,0.30)")}>Mark Delivered</button>
                    )}
                    {(o.Status === "delivered" || o.Status === "declined") && (
                      <span style={{ fontSize: 12, color: themeG.textSub }}>No further action</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 14, fontSize: 13, color: themeG.textSub }}>
        Showing {orders.length} {tab} order{orders.length !== 1 ? "s" : ""} ({filter})
      </p>
    </Layout>
  );
}
