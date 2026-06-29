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
  padding: "7px 16px", borderRadius: 8, border: `1px solid ${border}`, background: bg, color,
  cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
});

export default function StatusCustomers() {
  const { isDark } = useTheme();
  const themeG = getG(isDark);

  const navigate = useNavigate();
  const [filter, setFilter] = useState("pending");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);


  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/customers", { params: filter !== "all" ? { status: filter } : {} });
      setCustomers(res.data);
    } catch (err) {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

const th = { textAlign: "left", fontSize: 11, color: themeG.textLabel, padding: "12px 16px", borderBottom: "1px solid rgba(106,163,38,0.13)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, background: "rgba(124,179,66,0.04)" }
const td = { padding: "13px 16px", fontSize: 13.5, color: themeG.textMain }


  const setStatus = async (id, status) => {
    setActingId(id);
    setError("");
    try {
      await API.patch(`/customers/${id}/status`, { status });
      setCustomers((list) => list.filter((c) => c.Id !== id || filter === "all"));
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setActingId(null);
    }
  };



  return (
    <Layout pageTitle="Customer Approvals">

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["pending", "approved", "declined", "all"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "8px 18px", borderRadius: 20, border: "1.5px solid", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, textTransform: "capitalize", background: filter === f ? themeG.accent : themeG.card, color: filter === f ? themeG.card : themeG.textSub, borderColor: filter === f ? themeG.accent : themeG.border }}>
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
              {["ID", "Name", "Phone", "District", "Type", "Status", "Actions"].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ ...td, textAlign: "center", padding: 30 }}>Loading…</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={7} style={{ ...td, textAlign: "center", padding: 30, color: themeG.textSub }}>No customers in this filter.</td></tr>
            ) : customers.map((c) => (
              <tr key={c.Id} style={{ borderBottom: "1px solid rgba(106,163,38,0.08)" }}>
                <td style={{ ...td, fontWeight: 600, color: themeG.accent, cursor: "pointer" }} onClick={() => navigate(`/master/customers/${c.Id}`)}>{c.Code}</td>
                <td style={td}>{c.Name}</td>
                <td style={td}>{c.Phone}</td>
                <td style={td}>{c.District}</td>
                <td style={td}>{c.Type}</td>
                <td style={td}><Badge text={c.Status} /></td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {c.Status !== "approved" && (
                      <button disabled={actingId === c.Id} onClick={() => setStatus(c.Id, "approved")} style={actionBtn("rgba(124,179,66,0.12)", themeG.accent, "rgba(124,179,66,0.30)")}>
                        Approve
                      </button>
                    )}
                    {c.Status !== "declined" && (
                      <button disabled={actingId === c.Id} onClick={() => setStatus(c.Id, "declined")} style={actionBtn("rgba(192,57,43,0.08)", "#a23528", "rgba(192,57,43,0.26)")}>
                        Decline
                      </button>
                    )}
                    {c.Status !== "pending" && (
                      <button disabled={actingId === c.Id} onClick={() => setStatus(c.Id, "pending")} style={actionBtn("rgba(200,160,40,0.10)", "#8a6510", "rgba(200,160,40,0.28)")}>
                        Reset
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 14, fontSize: 13, color: themeG.textSub }}>
        Showing {customers.length} customer{customers.length !== 1 ? "s" : ""} ({filter})
      </p>
    </Layout>
  );
}
