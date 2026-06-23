import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/login", { email, password });
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (role === "super_admin") {
        navigate("/dashboard");
      } else {
        setError("Access denied. Super admin only.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.page}>
      {/* Google Fonts: Playfair Display (headings) + Inter (body) */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Subtle cotton-field texture overlay */}
      <div style={styles.textureBg} />
      {/* Soft warm glow */}
      <div style={styles.glow} />

      <div style={styles.card}>
        {/* Brand badge */}
        <div style={styles.badge}>
          <LeafIcon />
          <span style={styles.badgeText}>Textile CRM</span>
        </div>

        <h1 style={styles.title}>Admin Sign In</h1>
        <p style={styles.subtitle}>Restricted access — authorised personnel only</p>

        {error && (
          <div style={styles.errorBox}>
            <AlertIcon />
            <span>{error}</span>
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.label}>Email address</label>
          <div style={styles.inputWrap}>
            <MailIcon />
            <input
              type="email"
              placeholder="admin@yourcompany.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
              autoComplete="email"
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputWrap}>
            <LockIcon />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
              autoComplete="current-password"
            />
          </div>
        </div>

        <div style={styles.forgotRow}>
          <a href="/forgot-password" style={styles.forgotLink}>Forgot password?</a>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
        >
          <ShieldIcon />
          {loading ? "Signing in…" : "Sign in securely"}
        </button>

        <div style={styles.divider} />
        <p style={styles.footerText}>Premier Mills Group · Textile CRM</p>
      </div>
    </div>
  );
}

function LeafIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5a8a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ───────── Light theme palette (light-green accent) ───────── */
const GREEN = {
  pageBg:    "#faf7ee",                       // warm cream page background
  cardBg:    "#ffffff",
  border:    "rgba(106, 163, 38, 0.22)",
  accent:    "#7cb342",                       // light-green accent
  accentHov: "#689f38",
  muted:     "rgba(124, 179, 66, 0.10)",
  textMain:  "#27331c",                       // dark text on light bg
  textSub:   "#6b7a5e",
  textLabel: "#5c6b4d",
  inputBg:   "#f6f9f0",
  glow:      "rgba(124, 179, 66, 0.16)",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: GREEN.pageBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  textureBg: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(106,163,38,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(106,163,38,0.05) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${GREEN.glow} 0%, transparent 70%)`,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 2,
    background: GREEN.cardBg,
    border: `1px solid ${GREEN.border}`,
    borderRadius: 18,
    padding: "42px 38px",
    width: 368,
    boxShadow: "0 10px 40px rgba(106,163,38,0.08)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: GREEN.muted,
    border: `1px solid rgba(106,163,38,0.28)`,
    borderRadius: 20,
    padding: "5px 14px",
    marginBottom: 22,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: GREEN.accent,
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 26,
    fontWeight: 700,
    color: GREEN.textMain,
    margin: "0 0 5px",
    letterSpacing: "-0.4px",
  },
  subtitle: {
    fontSize: 13,
    color: GREEN.textSub,
    margin: "0 0 26px",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(192,57,43,0.08)",
    border: "1px solid rgba(192,57,43,0.25)",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 18,
    fontSize: 13,
    color: "#a23528",
  },
  field: { marginBottom: 17 },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: GREEN.textLabel,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    marginBottom: 7,
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: 13,
    width: 15,
    height: 15,
    color: GREEN.textLabel,
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: GREEN.inputBg,
    border: `1px solid rgba(106,163,38,0.22)`,
    borderRadius: 10,
    padding: "11px 14px 11px 40px",
    fontSize: 14,
    color: GREEN.textMain,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  },
  forgotRow: {
    textAlign: "right",
    marginTop: -8,
    marginBottom: 22,
  },
  forgotLink: {
    fontSize: 12,
    color: GREEN.accent,
    textDecoration: "none",
  },
  btn: {
    width: "100%",
    padding: "12px 0",
    background: GREEN.accent,
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: "0.01em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "opacity 0.2s",
  },
  btnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  divider: {
    borderTop: `1px solid rgba(106,163,38,0.15)`,
    margin: "22px 0 14px",
  },
  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: GREEN.textLabel,
    margin: 0,
    letterSpacing: "0.05em",
  },
};