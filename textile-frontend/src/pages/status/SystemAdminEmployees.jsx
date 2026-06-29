import { useTheme } from "../../ThemeContext";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { getG, statusColor, G } from "../../theme";
import API from "../../services/api";

const getThemeColors = () => getG(localStorage.getItem("premier_theme") === "dark");


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
  cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
});

const inputStyle = {
  width: "100%", boxSizing: "border-box", background: "#f6f9f0",
  border: "1px solid rgba(106,163,38,0.22)", borderRadius: 8,
  padding: "9px 12px", fontSize: 13, color: "#1a3d2b",
  fontFamily: "inherit", outline: "none",
};

const fieldWrap = { marginBottom: 14 };
const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, color: "#5c6b4d", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 };

export default function SystemAdminEmployees() {
  const { isDark } = useTheme();
  const themeG = getG(isDark);

  const [filter, setFilter]     = useState("pending");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [actingId, setActingId] = useState(null);
  const [selected, setSelected] = useState(null);   // view/edit modal
  const [showAdd, setShowAdd]   = useState(false);  // add employee modal
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving]     = useState(false);

  // New employee form state
  const [newEmp, setNewEmp] = useState({
    Name: "", Designation: "", District: "", Taluk: "", JoinedAt: "", phone: "", dob: "",
  });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/employees", { params: filter !== "all" ? { status: filter } : {} });
      setEmployees(res.data);
    } catch {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

const td = { padding: "13px 16px", fontSize: 13.5, color: themeG.textMain }
const th = { textAlign: "left", fontSize: 11, color: themeG.textLabel, padding: "12px 16px", borderBottom: "1px solid rgba(106,163,38,0.13)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, background: "rgba(124,179,66,0.04)" }


  const setStatus = async (id, status) => {
    setActingId(id);
    setError("");
    try {
      await API.patch(`/employees/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setActingId(null);
    }
  };

  const openEdit = (e) => {
    setSelected(e);
    setEditData({
      Name: e.Name, Designation: e.Designation || "",
      District: e.District || "", Taluk: e.Taluk || "",
      JoinedAt: e.JoinedAt?.substring(0, 10) || "", Status: e.Status,
    });
    setEditMode(false);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await API.put(`/employees/${selected.Id}`, editData);
      setSelected(null);
      setEditMode(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    setAddError("");
    if (!newEmp.Name || !newEmp.phone || !newEmp.dob) {
      setAddError("Name, Phone, and Date of Birth are required.");
      return;
    }
    setAddLoading(true);
    try {
      await API.post("/employees", newEmp);
      setShowAdd(false);
      setNewEmp({ Name: "", Designation: "", District: "", Taluk: "", JoinedAt: "", phone: "", dob: "" });
      setFilter("pending");
      load();
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add employee.");
    } finally {
      setAddLoading(false);
    }
  };



  return (
    <Layout pageTitle="Employee Management">

      {/* Top bar: filters + Add button */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["pending", "approved", "inactive", "all"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "8px 18px", borderRadius: 20, border: "1.5px solid", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, textTransform: "capitalize", background: filter === f ? themeG.accent : themeG.card, color: filter === f ? themeG.card : themeG.textSub, borderColor: filter === f ? themeG.accent : themeG.border }}>
            {f}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowAdd(true)}
          style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: themeG.accent, color: themeG.card, fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
          <PlusIcon /> Add Employee
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 16, background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#a23528" }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{ background: themeG.card, border: `1px solid ${themeG.border}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 16px rgba(106,163,38,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Name", "Phone", "Designation", "District", "Taluk", "Joined", "Status", "Actions"].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ ...td, textAlign: "center", padding: 30 }}>Loading…</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan={8} style={{ ...td, textAlign: "center", padding: 30, color: themeG.textSub }}>No employees in this filter.</td></tr>
            ) : employees.map((e) => (
              <tr key={e.Id} style={{ borderBottom: "1px solid rgba(106,163,38,0.08)" }}>
                <td style={{ ...td, fontWeight: 600, color: themeG.accent, cursor: "pointer" }} onClick={() => openEdit(e)}>{e.Name}</td>
                <td style={td}>{e.user?.phone || "—"}</td>
                <td style={td}>{e.Designation}</td>
                <td style={td}>{e.District}</td>
                <td style={td}>{e.Taluk}</td>
                <td style={td}>{e.JoinedAt?.substring(0, 10)}</td>
                <td style={td}><Badge text={e.Status} /></td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => openEdit(e)} style={actionBtn("rgba(60,130,200,0.10)", "#1a5fa0", "rgba(60,130,200,0.26)")}>Edit</button>
                    {e.Status !== "approved" && (
                      <button disabled={actingId === e.Id} onClick={() => setStatus(e.Id, "approved")} style={actionBtn("rgba(124,179,66,0.12)", themeG.accent, "rgba(124,179,66,0.30)")}>Approve</button>
                    )}
                    {e.Status !== "pending" && (
                      <button disabled={actingId === e.Id} onClick={() => setStatus(e.Id, "pending")} style={actionBtn("rgba(200,160,40,0.10)", "#8a6510", "rgba(200,160,40,0.28)")}>Pending</button>
                    )}
                    {e.Status !== "inactive" && (
                      <button disabled={actingId === e.Id} onClick={() => setStatus(e.Id, "inactive")} style={actionBtn("rgba(150,150,150,0.10)", "#5a5a5a", "rgba(150,150,150,0.26)")}>Set Inactive</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 14, fontSize: 13, color: themeG.textSub }}>
        Showing {employees.length} employee{employees.length !== 1 ? "s" : ""} ({filter})
      </p>

      {/* ── Edit / View Modal ── */}
      {selected && (
        <div style={overlay} onClick={() => { setSelected(null); setEditMode(false); }}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 18, margin: 0, color: themeG.textMain }}>
                {editMode ? "Edit Employee" : selected.Name}
              </h3>
              <button onClick={() => setEditMode(!editMode)}
                style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${themeG.border}`, background: editMode ? "rgba(200,160,40,0.10)" : "rgba(124,179,66,0.10)", color: editMode ? "#8a6510" : themeG.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600 }}>
                {editMode ? "Cancel Edit" : "Edit"}
              </button>
            </div>

            {editMode ? (
              <>
                {[
                  ["Name", "Name", "text"],
                  ["Designation", "Designation", "text"],
                  ["District", "District", "text"],
                  ["Taluk", "Taluk", "text"],
                  ["JoinedAt", "Joined Date", "date"],
                ].map(([key, label, type]) => (
                  <div key={key} style={fieldWrap}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={editData[key] || ""} onChange={(ev) => setEditData({ ...editData, [key]: ev.target.value })} style={inputStyle} />
                  </div>
                ))}
                <div style={fieldWrap}>
                  <label style={labelStyle}>Status</label>
                  <select value={editData.Status} onChange={(ev) => setEditData({ ...editData, Status: ev.target.value })} style={{ ...inputStyle }}>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <button onClick={saveEdit} disabled={saving}
                    style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: themeG.accent, color: themeG.card, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button onClick={() => { setSelected(null); setEditMode(false); }}
                    style={{ flex: 1, padding: "10px", borderRadius: 9, border: `1px solid ${themeG.border}`, background: themeG.card, color: themeG.textSub, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {[
                  ["Designation", selected.Designation],
                  ["District", selected.District],
                  ["Taluk", selected.Taluk],
                  ["Joined", selected.JoinedAt?.substring(0, 10)],
                  ["Phone", selected.user?.phone ?? "—"],
                  ["Linked Login", selected.user?.email ?? "—"],
                  ["Role", selected.user?.role ?? "—"],
                  ["Status", selected.Status],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(106,163,38,0.08)" }}>
                    <span style={{ fontSize: 13, color: themeG.textSub }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: themeG.textMain }}>{v}</span>
                  </div>
                ))}
                <button onClick={() => { setSelected(null); setEditMode(false); }}
                  style={{ marginTop: 18, width: "100%", padding: "10px", borderRadius: 9, border: `1px solid ${themeG.border}`, background: themeG.card, color: themeG.textSub, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Add Employee Modal ── */}
      {showAdd && (
        <div style={overlay} onClick={() => setShowAdd(false)}>
          <div style={{ ...modal, width: 420 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 18, margin: "0 0 18px", color: themeG.textMain }}>
              Add New Employee
            </h3>
            <p style={{ fontSize: 12, color: themeG.textSub, margin: "0 0 16px", background: "rgba(124,179,66,0.07)", borderRadius: 8, padding: "8px 12px", border: "1px solid rgba(124,179,66,0.18)" }}>
              The employee's <strong>phone number</strong> will be their login username and their <strong>date of birth (ddmmyy)</strong> will be their password. They will be registered with <strong>Admin</strong> role, pending your approval.
            </p>

            {addError && (
              <div style={{ background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 8, padding: "9px 12px", marginBottom: 14, fontSize: 12, color: "#a23528" }}>
                {addError}
              </div>
            )}

            {[
              ["Name", "Name *", "text"],
              ["Designation", "Designation", "text"],
              ["District", "District", "text"],
              ["Taluk", "Taluk", "text"],
              ["JoinedAt", "Joined Date", "date"],
              ["phone", "Phone Number *", "text"],
              ["dob", "Date of Birth (ddmmyy) *", "text"],
            ].map(([key, label, type]) => (
              <div key={key} style={fieldWrap}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type}
                  placeholder={key === "dob" ? "e.g. 150190" : ""}
                  value={newEmp[key]}
                  onChange={(ev) => setNewEmp({ ...newEmp, [key]: ev.target.value })}
                  style={inputStyle}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button onClick={handleAdd} disabled={addLoading}
                style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: themeG.accent, color: themeG.card, cursor: addLoading ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, opacity: addLoading ? 0.6 : 1 }}>
                {addLoading ? "Adding…" : "Add Employee"}
              </button>
              <button onClick={() => setShowAdd(false)}
                style={{ flex: 1, padding: "10px", borderRadius: 9, border: `1px solid ${themeG.border}`, background: themeG.card, color: themeG.textSub, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function PlusIcon() {
  const themeG = getThemeColors();
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
const overlay = { position: "fixed", inset: 0, background: "rgba(20,30,15,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 };
const modal = { background: "#ffffff", borderRadius: 16, padding: 28, width: 380, boxShadow: "0 12px 40px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto" };
