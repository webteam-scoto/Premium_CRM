import { useTheme } from "../../ThemeContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getG } from "../../theme";
import API from "../../services/api";

const FONT = "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const COLORS = [
  "#FFFFFF","#000000","#F5F5F5","#ECEFF1","#FFF9C4","#FFE0B2","#F3E5F5",
  "#E8F5E9","#E3F2FD","#FFCDD2","#D7CCC8","#1565C0","#2E7D32","#455A64",
  "#37474F","#BF360C","#F57F17","#4A148C","#880E4F",
];

// ─── Subtype configs ────────────────────────────────────────────────
// Each entry: { label, icon, fields: [{key, label, type, options?, placeholder}] }
const CLOTH_SUBTYPES = {
  Dhoti: {
    label: "Dhoti",
    icon: "🥻",
    description: "Traditional wraparound cloth",
    fields: [
      {
        key: "length",
        label: "Length",
        type: "chips",
        options: ["4 Meter", "8 Meter", "Other"],
      },
      {
        key: "border",
        label: "Border Type",
        type: "chips",
        options: ["Plain", "Fancy", "Zari", "Colour Border"],
      },
      {
        key: "count",
        label: "Count (Thread)",
        type: "text",
        placeholder: "e.g. 60s, 80s, 100s",
      },
    ],
  },
  Blouse: {
    label: "Blouse",
    icon: "👗",
    description: "Saree blouse piece",
    fields: [
      {
        key: "length",
        label: "Blouse Piece Length",
        type: "chips",
        options: ["0.8 Meter", "1 Meter", "1.2 Meter", "Other"],
      },
      {
        key: "size",
        label: "Size",
        type: "chips",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
      },
      {
        key: "neckType",
        label: "Neck Type",
        type: "chips",
        options: ["Round", "V-Neck", "Boat Neck", "Square"],
      },
    ],
  },
  Pant: {
    label: "Pant",
    icon: "👖",
    description: "Trousers / pants",
    fields: [
      {
        key: "size",
        label: "Waist Size (inches)",
        type: "chips",
        options: ["28", "30", "32", "34", "36", "38", "40", "42"],
      },
      {
        key: "length",
        label: "Length",
        type: "chips",
        options: ["28 inch", "30 inch", "32 inch", "34 inch", "36 inch", "Other"],
      },
      {
        key: "fit",
        label: "Fit Type",
        type: "chips",
        options: ["Regular", "Slim", "Loose", "Tapered"],
      },
    ],
  },
  Shirt: {
    label: "Shirt",
    icon: "👔",
    description: "Shirts / tops",
    fields: [
      {
        key: "size",
        label: "Size",
        type: "chips",
        options: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      },
      {
        key: "collarSize",
        label: "Collar Size (inches)",
        type: "chips",
        options: ["14", "14.5", "15", "15.5", "16", "16.5", "17", "17.5"],
      },
      {
        key: "sleeveLength",
        label: "Sleeve",
        type: "chips",
        options: ["Half Sleeve", "Full Sleeve"],
      },
    ],
  },
  Leggings: {
    label: "Leggings",
    icon: "🧣",
    description: "Leggings / churidar",
    fields: [
      {
        key: "length",
        label: "Length",
        type: "chips",
        options: ["1 Meter", "1.5 Meter", "2 Meter", "2.5 Meter", "Other"],
      },
      {
        key: "size",
        label: "Size",
        type: "chips",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
      },
      {
        key: "elasticType",
        label: "Waist Type",
        type: "chips",
        options: ["Elastic", "Drawstring", "Fixed"],
      },
    ],
  },
  Others: {
    label: "Others",
    icon: "🧶",
    description: "Other cloth types",
    fields: [
      {
        key: "length",
        label: "Length / Size",
        type: "text",
        placeholder: "e.g. 5 meter, 2.5 yard",
      },
      {
        key: "unit",
        label: "Unit",
        type: "chips",
        options: ["Meter", "Yard", "Piece", "Set"],
      },
    ],
  },
};

const YARN_SUBTYPES = {
  Bundle: {
    label: "Bundle",
    icon: "📦",
    description: "Yarn in bundle form",
    fields: [
      {
        key: "weight",
        label: "Bundle Weight",
        type: "chips",
        options: ["250g", "500g", "1 kg", "2 kg", "5 kg", "Other"],
      },
      {
        key: "ply",
        label: "Ply",
        type: "chips",
        options: ["2 Ply", "3 Ply", "4 Ply", "6 Ply", "8 Ply"],
      },
      {
        key: "count",
        label: "Count",
        type: "text",
        placeholder: "e.g. 40s, 60s, 80s",
      },
    ],
  },
  Hank: {
    label: "Hank",
    icon: "🪢",
    description: "Yarn wound into a hank",
    fields: [
      {
        key: "weight",
        label: "Hank Weight",
        type: "chips",
        options: ["100g", "200g", "250g", "500g", "1 kg", "Other"],
      },
      {
        key: "length",
        label: "Hank Length",
        type: "text",
        placeholder: "e.g. 100m, 200m",
      },
      {
        key: "count",
        label: "Count",
        type: "text",
        placeholder: "e.g. 40s, 60s",
      },
    ],
  },
  Cone: {
    label: "Cone",
    icon: "🔺",
    description: "Yarn wound on a cone",
    fields: [
      {
        key: "weight",
        label: "Cone Weight",
        type: "chips",
        options: ["500g", "1 kg", "1.5 kg", "2 kg", "Other"],
      },
      {
        key: "length",
        label: "Yarn Length",
        type: "text",
        placeholder: "e.g. 500m, 1000m",
      },
      {
        key: "count",
        label: "Count",
        type: "text",
        placeholder: "e.g. 40s, 60s",
      },
    ],
  },
};

// ─── Small components ───────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3d6b50", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: FONT }}>
      {label}
    </label>
    {children}
  </div>
);

const Input = (props) => (
  <input {...props} style={{ width: "100%", padding: "9px 13px", borderRadius: 9, border: "1px solid rgba(27,77,46,0.18)", fontSize: 14, fontFamily: FONT, color: "#1a3d2b", background: "#ffffff", outline: "none", boxSizing: "border-box", ...props.style }} />
);

const Select = ({ children, ...props }) => (
  <select {...props} style={{ width: "100%", padding: "9px 13px", borderRadius: 9, border: "1px solid rgba(27,77,46,0.18)", fontSize: 14, fontFamily: FONT, color: "#1a3d2b", background: "#ffffff", outline: "none", boxSizing: "border-box" }}>
    {children}
  </select>
);

// Chip selector: highlights selected, allows "Other" to show a text input
function ChipField({ options, value, onChange, themeG }) {
  const isOther = value && !options.includes(value) && value !== "";
  const [showCustom, setShowCustom] = useState(isOther);
  const [customVal, setCustomVal] = useState(isOther ? value : "");

  const pick = (opt) => {
    if (opt === "Other") {
      setShowCustom(true);
      onChange(customVal || "");
    } else {
      setShowCustom(false);
      setCustomVal("");
      onChange(opt);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: showCustom ? 10 : 0 }}>
        {options.map((opt) => {
          const isActive = opt === "Other" ? showCustom : value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => pick(opt)}
              style={{
                padding: "6px 16px", borderRadius: 20, border: "1.5px solid", cursor: "pointer",
                fontFamily: FONT, fontSize: 13, fontWeight: 600, transition: "all 0.12s",
                background:  isActive ? "rgba(45,106,79,0.12)" : "#ffffff",
                color:       isActive ? "#2d6a4f" : "#4a7a5a",
                borderColor: isActive ? "#2d6a4f" : "rgba(27,77,46,0.22)",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {showCustom && (
        <Input
          placeholder="Enter custom value…"
          value={customVal}
          onChange={(e) => { setCustomVal(e.target.value); onChange(e.target.value); }}
        />
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────
export default function AddProduct() {
  const { isDark } = useTheme();
  const themeG = getG(isDark);
  const navigate = useNavigate();

  // Read category from localStorage (set by SelectCategory page)
  const savedCat = localStorage.getItem("premier_category") || "cloth";

  const card      = { background: themeG.card, border: `1px solid ${themeG.border}`, borderRadius: 14, padding: 24, boxShadow: "0 4px 16px rgba(106,163,38,0.05)" };
  const cardTitle = { fontFamily: FONT, fontSize: 16, fontWeight: 600, margin: "0 0 20px", color: themeG.textMain };

  const [tab, setTab]         = useState(savedCat);
  const subtypeMap            = tab === "yarn" ? YARN_SUBTYPES : CLOTH_SUBTYPES;
  const defaultSubtype        = tab === "yarn" ? "Bundle" : "Dhoti";
  const [subType, setSubType] = useState(defaultSubtype);

  // subtype-specific field values: { fieldKey: value }
  const [specFields, setSpecFields] = useState({});

  const [form, setForm] = useState({
    name: "", price: "", qty: "",
    color: "#FFFFFF", quality: "", description: "", status: "active",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSpec = (k, v) => setSpecFields((f) => ({ ...f, [k]: v }));

  // When tab changes, reset subtype and spec fields
  const handleTabChange = (t) => {
    setTab(t);
    localStorage.setItem("premier_category", t);
    const def = t === "yarn" ? "Bundle" : "Dhoti";
    setSubType(def);
    setSpecFields({});
  };

  const handleSubTypeChange = (st) => {
    setSubType(st);
    setSpecFields({});
  };

  // Serialize spec fields into Size or Weight for storage
  const buildSizeWeight = () => {
    const parts = Object.entries(specFields)
      .filter(([, v]) => v && v.trim() !== "")
      .map(([k, v]) => `${k}:${v}`);
    return parts.join("|");
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.price || !form.qty) {
      setError("Please fill in name, price and quantity.");
      return;
    }
    setSaving(true);
    const specStr = buildSizeWeight();
    try {
      await API.post("/products", {
        tab,
        subType,
        name:        form.name,
        price:       form.price,
        qty:         form.qty,
        weight:      tab === "yarn"  ? specStr : null,
        size:        tab === "cloth" ? specStr : null,
        color:       form.color,
        quality:     form.quality || "Standard",
        description: form.description || null,
        status:      form.status,
      });
      navigate("/master/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const currentSubConfig = subtypeMap[subType] || subtypeMap[defaultSubtype];

  return (
    <Layout pageTitle="Add Product">

      {/* ── Category locked badge ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 10, background: themeG.card, border: `1px solid ${themeG.border}`, boxShadow: "0 2px 8px rgba(106,163,38,0.06)" }}>
          <span style={{ fontSize: 18 }}>{tab === "cloth" ? "👘" : "🧵"}</span>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: themeG.textMain }}>{tab === "cloth" ? "Cloth" : "Yarn"}</span>
        </div>
        <span style={{ fontSize: 12, color: themeG.textSub, fontFamily: FONT }}>
          Category locked — <span style={{ color: themeG.accent, cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/select-category")}>Switch category</span>
        </span>
      </div>

      {error && (
        <div style={{ marginBottom: 16, background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#a23528", fontFamily: FONT }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* ── Left card: Basic Info + Subtype ── */}
        <div style={card}>
          <h3 style={cardTitle}>Basic Info</h3>

          {/* Subtype pills */}
          <Field label="Product Sub-type">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(subtypeMap).map(([key, cfg]) => (
                <button key={key} onClick={() => handleSubTypeChange(key)}
                  style={{ padding: "7px 16px", borderRadius: 20, border: "1.5px solid", cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 600, transition: "all 0.12s",
                    background:  subType === key ? "rgba(45,106,79,0.13)" : themeG.card,
                    color:       subType === key ? "#2d6a4f"              : themeG.textSub,
                    borderColor: subType === key ? "#2d6a4f"              : themeG.border }}>
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Subtype description badge */}
          <div style={{ marginBottom: 18, padding: "8px 14px", borderRadius: 8, background: "rgba(45,106,79,0.07)", border: "1px solid rgba(45,106,79,0.15)", fontSize: 12, color: "#2d6a4f", fontFamily: FONT }}>
            {currentSubConfig.icon}  <strong>{currentSubConfig.label}</strong> — {currentSubConfig.description}
          </div>

          <Field label="Product Name">
            <Input placeholder={`e.g. ${tab === "yarn" ? "Cotton Bundle 2kg" : `White ${subType} Set`}`} value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>

          <Field label="Price (₹)">
            <Input type="number" placeholder="0.00" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </Field>

          <Field label="Quantity in Stock">
            <Input type="number" placeholder="0" value={form.qty} onChange={(e) => set("qty", e.target.value)} />
          </Field>

          <Field label="Quality Grade">
            <Select value={form.quality} onChange={(e) => set("quality", e.target.value)}>
              <option value="">Select grade…</option>
              <option>Premium</option>
              <option>Standard</option>
              <option>Economy</option>
            </Select>
          </Field>

          <Field label="Status">
            <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>
        </div>

        {/* ── Right card: Subtype-specific fields + color ── */}
        <div style={card}>
          <h3 style={cardTitle}>{currentSubConfig.icon} {currentSubConfig.label} — Specifications</h3>

          {/* Dynamic fields per subtype */}
          {currentSubConfig.fields.map((fieldCfg) => (
            <Field key={fieldCfg.key} label={fieldCfg.label}>
              {fieldCfg.type === "chips" ? (
                <ChipField
                  options={fieldCfg.options}
                  value={specFields[fieldCfg.key] || ""}
                  onChange={(v) => setSpec(fieldCfg.key, v)}
                  themeG={themeG}
                />
              ) : (
                <Input
                  placeholder={fieldCfg.placeholder}
                  value={specFields[fieldCfg.key] || ""}
                  onChange={(e) => setSpec(fieldCfg.key, e.target.value)}
                />
              )}
            </Field>
          ))}

          {/* Color picker */}
          <Field label="Product Color">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {COLORS.map((c) => (
                <div key={c} onClick={() => set("color", c)}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: c,
                    border:    form.color === c ? "2.5px solid #3d6b1f" : "1.5px solid rgba(0,0,0,0.14)",
                    cursor:    "pointer",
                    boxShadow: form.color === c ? "0 0 0 3px rgba(124,179,66,0.30)" : "none" }} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)}
                style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${themeG.border}`, cursor: "pointer", padding: 2 }} />
              <span style={{ fontSize: 13, color: themeG.textSub, fontFamily: FONT }}>Custom: {form.color}</span>
            </div>
          </Field>

          <Field label="Description">
            <textarea placeholder="Product description, notes, etc." value={form.description} onChange={(e) => set("description", e.target.value)} rows={3}
              style={{ width: "100%", padding: "9px 13px", borderRadius: 9, border: `1px solid ${themeG.border}`, fontSize: 14, fontFamily: FONT, color: themeG.textMain, background: themeG.card, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
          </Field>

          {/* Preview strip */}
          <div style={{ marginTop: 8, padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${themeG.border}`, background: themeG.bg, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: form.color, border: "1.5px solid rgba(0,0,0,0.14)", flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: themeG.textMain, fontFamily: FONT }}>{form.name || "Product name preview"}</p>
              <p style={{ margin: 0, fontSize: 12, color: themeG.textSub, fontFamily: FONT }}>
                {currentSubConfig.icon} {subType} ·{" "}
                {Object.entries(specFields).filter(([, v]) => v).map(([k, v]) => v).join(", ") || "No specs yet"} ·{" "}
                {form.price ? `₹${form.price}` : "Price TBD"} · Qty: {form.qty || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
        <button onClick={() => navigate("/master/products")}
          style={{ padding: "10px 24px", borderRadius: 9, border: `1px solid ${themeG.border}`, background: themeG.card, color: themeG.textSub, cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 500 }}>
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={saving}
          style={{ padding: "10px 28px", borderRadius: 9, border: "none", background: themeG.accent, color: themeG.card, cursor: saving ? "not-allowed" : "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700, boxShadow: "0 2px 10px rgba(124,179,66,0.32)", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : "Save Product"}
        </button>
      </div>
    </Layout>
  );
}