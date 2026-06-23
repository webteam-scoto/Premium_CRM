import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [masterOpen, setMasterOpen] = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role || role !== "super_admin") navigate("/");
  }, []);

  return (
    <div style={styles.page}>
      {/* Google Fonts: Playfair Display (headings) + Inter (body) */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoWrap}>
          <LeafIcon />
          <span style={styles.logoText}>Textile CRM</span>
        </div>

        <nav style={styles.nav}>
          {/* Dashboard - single link */}
          <div style={{ ...styles.navItem, ...styles.navItemActive }}>
            <span style={styles.navIcon}><GridIcon /></span>
            <span>Dashboard</span>
          </div>

          {/* Master - expandable group */}
          <NavGroup
            label="Master"
            icon={<LayersIcon />}
            open={masterOpen}
            onToggle={() => setMasterOpen(!masterOpen)}
            items={[
              { label: "Products", sub: ["Add product", "Product list", "Product description"] },
              { label: "Orders", sub: ["Add order", "Order list", "Order description"] },
              { label: "Customer", sub: ["Add customer", "Customer list", "Customer description"] },
            ]}
          />

          {/* Status - expandable group */}
          <NavGroup
            label="Status"
            icon={<ActivityIcon />}
            open={statusOpen}
            onToggle={() => setStatusOpen(!statusOpen)}
            items={[
              { label: "Customers", sub: ["Approved", "Declined", "Pending"] },
              { label: "Orders", sub: ["Approved", "Declined", "Pending"] },
              { label: "Employee", sub: ["Approved", "Declined", "Pending"] },
            ]}
          />

          {/* Reports - expandable group */}
          <NavGroup
            label="Reports"
            icon={<ChartIcon />}
            open={reportsOpen}
            onToggle={() => setReportsOpen(!reportsOpen)}
            items={[
              { label: "Orders" },
              { label: "Products" },
              { label: "Employees" },
            ]}
          />
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.userChip}>
            <div style={styles.avatar}>
              {(user.email || "SA")[0].toUpperCase()}
            </div>
            <div>
              <p style={styles.userEmail}>{user.email || "Super Admin"}</p>
              <p style={styles.userRole}>Super Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logout}>
            <LogoutIcon /> Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.heading}>Dashboard</h1>
            <p style={styles.headingSub}>Welcome back, {user.email || "Super Admin"}</p>
          </div>
          <div style={styles.liveBadge}>
            <span style={styles.liveDot} />
            Live
          </div>
        </div>

        {/* Stat cards */}
        <div style={styles.grid}>
          {[
            { label: "Total Customers", value: "1,284", icon: "👥", accent: "#7cb342" },
            { label: "Active Orders",   value: "342",   icon: "📦", accent: "#558b2f" },
            { label: "Products",        value: "89",    icon: "🧵", accent: "#9ccc65" },
            { label: "Revenue",         value: "₹4.2L", icon: "📈", accent: "#689f38" },
          ].map((card) => (
            <div key={card.label} style={styles.statCard}>
              <div style={{ ...styles.cardStripe, background: card.accent }} />
              <div style={styles.cardIconRow}>
                <span style={styles.cardIcon}>{card.icon}</span>
              </div>
              <p style={styles.cardLabel}>{card.label}</p>
              <p style={{ ...styles.cardValue, color: card.accent }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Recent orders table */}
        <div style={styles.tableBox}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Recent Orders</h2>
            <span style={styles.tableCount}>4 records</span>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Order ID", "Customer", "Product", "Amount", "Status"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["#1021", "Ravi Kumar",  "Cotton Fabric", "₹12,000", "Delivered"],
                ["#1022", "Meena Devi",  "Silk Saree",    "₹8,500",  "Pending"],
                ["#1023", "Arun Singh",  "Polyester",     "₹5,200",  "Processing"],
                ["#1024", "Priya Nair",  "Linen Cloth",   "₹9,800",  "Delivered"],
              ].map(([id, customer, product, amount, status]) => (
                <tr key={id} style={styles.tr}>
                  <td style={{ ...styles.td, color: "#558b2f", fontWeight: 600 }}>{id}</td>
                  <td style={styles.td}>{customer}</td>
                  <td style={styles.td}>{product}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: "#33401f" }}>{amount}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, ...statusStyle(status) }}>
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────── Reusable expandable nav group (Master / Status / Reports) ───────── */
function NavGroup({ label, icon, open, onToggle, items }) {
  return (
    <div style={styles.navGroup}>
      <div style={styles.navGroupHeader} onClick={onToggle}>
        <span style={styles.navIcon}>{icon}</span>
        <span style={styles.navGroupLabel}>{label}</span>
        <span style={{ ...styles.chevron, transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>
          <ChevronIcon />
        </span>
      </div>
      {open && (
        <div style={styles.navGroupBody}>
          {items.map((item) => (
            <NavSubItem key={item.label} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Sub-item that itself can expand into 3 tabs: Add / List / Description */
function NavSubItem({ item }) {
  const [open, setOpen] = useState(false);
  const hasChildren = Array.isArray(item.sub) && item.sub.length > 0;

  if (!hasChildren) {
    return <div style={styles.navSubItem}>{item.label}</div>;
  }

  return (
    <div>
      <div style={styles.navSubItem} onClick={() => setOpen(!open)}>
        <span>{item.label}</span>
        <span style={{ ...styles.chevron, transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>
          <ChevronIcon small />
        </span>
      </div>
      {open && (
        <div style={styles.navLeafGroup}>
          {item.sub.map((leaf) => (
            <div key={leaf} style={styles.navLeafItem}>{leaf}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function statusStyle(s) {
  if (s === "Delivered")  return { background: "rgba(124,179,66,0.14)",  color: "#558b2f",  border: "1px solid rgba(124,179,66,0.30)" };
  if (s === "Pending")    return { background: "rgba(200,160,40,0.12)",  color: "#a3791f",  border: "1px solid rgba(200,160,40,0.28)" };
  return                         { background: "rgba(124,179,66,0.08)",  color: "#689f38",  border: "1px solid rgba(124,179,66,0.20)" };
}

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7cb342" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ChevronIcon({ small }) {
  const size = small ? 11 : 13;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

/* ───────── Light theme palette (light-green accent) ───────── */
const G = {
  bg:        "#faf7ee",                     // warm cream page background
  sidebar:   "#ffffff",
  card:      "#ffffff",
  border:    "rgba(106,163,38,0.16)",
  accent:    "#7cb342",
  textMain:  "#27331c",
  textSub:   "#6b7a5e",
  textLabel: "#5c6b4d",
};

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: G.bg,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: G.textMain,
  },

  /* ── Sidebar ── */
  sidebar: {
    width: 230,
    background: G.sidebar,
    borderRight: `1px solid ${G.border}`,
    display: "flex",
    flexDirection: "column",
    padding: "24px 14px",
    flexShrink: 0,
    overflowY: "auto",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    paddingLeft: 6,
    marginBottom: 22,
  },
  logoText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 18,
    fontWeight: 700,
    color: G.accent,
    letterSpacing: "-0.3px",
  },
  nav: { flex: 1 },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: 9,
    marginBottom: 3,
    cursor: "pointer",
    fontSize: 14,
    color: G.textSub,
    transition: "all 0.15s",
  },
  navItemActive: {
    background: "rgba(124,179,66,0.14)",
    color: "#3d5a1f",
    fontWeight: 600,
    border: `1px solid rgba(124,179,66,0.28)`,
  },
  navIcon: {
    display: "flex",
    alignItems: "center",
    color: "inherit",
  },

  /* Master / Status / Reports group header */
  navGroup: {
    marginBottom: 3,
  },
  navGroupHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: 9,
    cursor: "pointer",
    fontSize: 14,
    color: G.textSub,
  },
  navGroupLabel: {
    flex: 1,
    fontWeight: 500,
  },
  chevron: {
    display: "flex",
    alignItems: "center",
    color: G.textLabel,
    transition: "transform 0.15s",
  },
  navGroupBody: {
    paddingLeft: 14,
    marginTop: 2,
    marginBottom: 4,
  },

  /* Products / Orders / Customer (level 2) */
  navSubItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    fontSize: 13.5,
    color: G.textMain,
    cursor: "pointer",
    borderRadius: 7,
  },

  /* Add / List / Description (level 3 leaves) */
  navLeafGroup: {
    paddingLeft: 14,
    marginBottom: 2,
  },
  navLeafItem: {
    padding: "7px 12px",
    fontSize: 12.5,
    color: G.textSub,
    cursor: "pointer",
    borderRadius: 6,
  },

  sidebarBottom: {
    borderTop: `1px solid ${G.border}`,
    paddingTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 10,
    background: "rgba(124,179,66,0.08)",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "rgba(124,179,66,0.20)",
    border: `1px solid rgba(124,179,66,0.35)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    color: G.accent,
    flexShrink: 0,
  },
  userEmail: {
    fontSize: 12,
    color: G.textMain,
    margin: 0,
    fontWeight: 500,
    maxWidth: 130,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  userRole: {
    fontSize: 11,
    color: G.textSub,
    margin: 0,
  },
  logout: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 12px",
    borderRadius: 9,
    background: "rgba(180,50,40,0.08)",
    border: "1px solid rgba(180,50,40,0.20)",
    color: "#a23528",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    fontWeight: 500,
    textAlign: "left",
  },

  /* ── Main ── */
  main: {
    flex: 1,
    padding: "32px 36px",
    overflowY: "auto",
  },
  topBar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  heading: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 28,
    fontWeight: 700,
    margin: "0 0 4px",
    color: G.textMain,
    letterSpacing: "-0.4px",
  },
  headingSub: {
    fontSize: 13,
    color: G.textSub,
    margin: 0,
  },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#3d5a1f",
    background: "rgba(124,179,66,0.12)",
    border: "1px solid rgba(124,179,66,0.28)",
    padding: "5px 14px",
    borderRadius: 20,
  },
  liveDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#7cb342",
  },

  /* ── Stat cards ── */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 30,
  },
  statCard: {
    background: G.card,
    border: `1px solid ${G.border}`,
    borderRadius: 14,
    padding: "20px 20px 18px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(106,163,38,0.06)",
  },
  cardStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: "14px 14px 0 0",
  },
  cardIconRow: {
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardLabel: {
    fontSize: 12,
    color: G.textLabel,
    margin: "0 0 6px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.5px",
  },

  /* ── Table ── */
  tableBox: {
    background: G.card,
    border: `1px solid ${G.border}`,
    borderRadius: 14,
    padding: "24px 26px",
    boxShadow: "0 4px 16px rgba(106,163,38,0.06)",
  },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  tableTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 17,
    fontWeight: 600,
    margin: 0,
    color: G.textMain,
  },
  tableCount: {
    fontSize: 12,
    color: G.textSub,
    background: "rgba(124,179,66,0.09)",
    padding: "3px 10px",
    borderRadius: 20,
    border: `1px solid rgba(124,179,66,0.18)`,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    fontSize: 11,
    color: G.textLabel,
    padding: "8px 12px",
    borderBottom: `1px solid rgba(106,163,38,0.13)`,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    fontWeight: 600,
  },
  tr: {
    borderBottom: `1px solid rgba(106,163,38,0.08)`,
  },
  td: {
    padding: "13px 12px",
    fontSize: 14,
    color: "#4a5a3a",
  },
  statusBadge: {
    padding: "3px 11px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
};