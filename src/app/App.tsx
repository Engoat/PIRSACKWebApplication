import { useState, useRef, useEffect } from "react";
import {
  Home, Users, Briefcase, ClipboardList, Archive, Settings,
  Bell, ArrowLeft, Plus, X, MoreHorizontal, Upload, CheckCircle,
  Edit2, Trash2, Send, Link2, AlertTriangle, Star,
  Lock, FileText, ChevronRight, LayoutDashboard,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════
// COLORS
// ══════════════════════════════════════════════════════════════
const C = {
  blue: "#3B9EE5",
  darkBlue: "#1A7CC7",
  appBg: "#F4FAFF",
  lightBlueBg: "#EBF5FD",
  border: "#D0E8F7",
  text: "#0B2740",
  textSec: "#6A90AC",
  textTert: "#A0C0D4",
  white: "#ffffff",
  successBg: "#D5F5E9",
  successText: "#065F46",
  warningBg: "#FEF3C7",
  warningText: "#92400E",
  dangerBg: "#FEE2E2",
  dangerText: "#991B1B",
};

const AVATAR_COLORS = [
  "#3B9EE5", "#6366F1", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6",
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
}

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════

type KanbanStatus = "normal" | "accepted" | "refused";
interface KanbanCard {
  id: number; name: string; poste: string; score: string; date: string; status: KanbanStatus;
}

const KANBAN_COLS = ["Reçus", "Présélectionnés", "En test", "Entretien", "Décision"];
const KANBAN_DATA: Record<string, KanbanCard[]> = {
  "Reçus": [
    { id: 1, name: "Carine Ndongo", poste: "Développeur React", score: "92%", date: "10/06/2026", status: "normal" },
    { id: 2, name: "Brice Tchoupo", poste: "Data Analyst", score: "78%", date: "11/06/2026", status: "normal" },
    { id: 3, name: "Fatou Diallo", poste: "UI/UX Designer", score: "65%", date: "12/06/2026", status: "normal" },
  ],
  "Présélectionnés": [
    { id: 4, name: "Paul Eto'o", poste: "Développeur Backend", score: "88%", date: "05/06/2026", status: "normal" },
    { id: 5, name: "Aïcha Souley", poste: "Chargée RH", score: "71%", date: "07/06/2026", status: "normal" },
  ],
  "En test": [
    { id: 6, name: "Marc Etoundi", poste: "Développeur React", score: "95%", date: "01/06/2026", status: "accepted" },
  ],
  "Entretien": [
    { id: 7, name: "Diane Mbarga", poste: "Data Analyst", score: "82%", date: "28/05/2026", status: "normal" },
  ],
  "Décision": [
    { id: 8, name: "Jean Fochive", poste: "UI/UX Designer", score: "45%", date: "20/05/2026", status: "refused" },
  ],
};

const POSTES = [
  { id: 1, name: "Développeur React", creator: "M. Biya", skills: [{ name: "React", w: 35 }, { name: "JavaScript", w: 25 }, { name: "CSS", w: 20 }, { name: "Git", w: 20 }] },
  { id: 2, name: "Data Analyst", creator: "M. Atangana", skills: [{ name: "Python", w: 40 }, { name: "SQL", w: 30 }, { name: "Power BI", w: 20 }, { name: "Excel", w: 10 }] },
  { id: 3, name: "UI/UX Designer", creator: "M. Biya", skills: [{ name: "Figma", w: 40 }, { name: "Prototypage", w: 30 }, { name: "CSS", w: 20 }, { name: "Recherche UX", w: 10 }] },
  { id: 4, name: "Développeur Backend", creator: "Mme Fouda", skills: [{ name: "Python", w: 35 }, { name: "FastAPI", w: 30 }, { name: "MySQL", w: 25 }, { name: "Docker", w: 10 }] },
];

const TESTS_DATA = [
  {
    id: 1, title: "Test React Fondamentaux", questions: 10, duration: 30, creator: "M. Biya",
    link: { candidate: "Marc Etoundi", uuid: "test-react-marc-etoundi-a8f3d91e-2026", status: "active" as const, expiry: "18h", alerts: 1, score: null },
  },
  {
    id: 2, title: "Test Python & SQL", questions: 8, duration: 25, creator: "M. Atangana",
    link: { candidate: "Paul Eto'o", uuid: "test-python-paul-etoo-c4b7e22f-2026", status: "completed" as const, expiry: null, alerts: 0, score: "82%" },
  },
  {
    id: 3, title: "Test UI/UX Pratique", questions: 6, duration: 20, creator: "Mme Fouda",
    link: null,
  },
];

const STAGIAIRES = [
  { id: 1, name: "Henri Ngassa", firstName: "Henri", poste: "Développeur Backend", type: "Académique", dept: "Développement", encadreur: "M. Biya", debut: "01/06/2026", fin: "30/11/2026", statut: "Actif", rapport: false },
  { id: 2, name: "Carine Ndongo", firstName: "Carine", poste: "Data Analyst", type: "Professionnel", dept: "Data", encadreur: "M. Atangana", debut: "01/03/2026", fin: "31/08/2026", statut: "Actif", rapport: false },
  { id: 3, name: "Paul Eto'o", firstName: "Paul", poste: "UI/UX Designer", type: "Académique", dept: "Design", encadreur: "M. Biya", debut: "01/04/2026", fin: "30/09/2026", statut: "Actif", rapport: false },
  { id: 4, name: "Aïcha Souley", firstName: "Aïcha", poste: "Chargée RH", type: "Professionnel", dept: "RH", encadreur: "M. Atangana", debut: "01/02/2026", fin: "31/07/2026", statut: "Actif", rapport: false },
  { id: 5, name: "Brice Tchoupo", firstName: "Brice", poste: "Développeur React", type: "Académique", dept: "Développement", encadreur: "Mme Fouda", debut: "01/07/2026", fin: "31/12/2026", statut: "Actif", rapport: false },
  { id: 6, name: "Diane Mbarga", firstName: "Diane", poste: "Développeur Backend", type: "Professionnel", dept: "Développement", encadreur: "M. Biya", debut: "01/09/2026", fin: "28/02/2027", statut: "Actif", rapport: false },
  { id: 7, name: "Marc Etoundi", firstName: "Marc", poste: "Data Analyst", type: "Académique", dept: "Data", encadreur: "M. Atangana", debut: "01/01/2026", fin: "30/06/2026", statut: "Actif", rapport: false },
];

const ARCHIVES_DATA = [
  { id: 1, name: "Henri Ngassa", firstName: "Henri", poste: "Développeur Backend", type: "Académique", theme: "Migration d'une API REST vers GraphQL", debut: "01/06/2025", fin: "30/11/2025", encadreur: "M. Biya", noteRH: 15, noteEnc: 17, docs: { cv: true, lm: true, rapport: true } },
  { id: 2, name: "Carine Ndongo", firstName: "Carine", poste: "UI/UX Designer", type: "Professionnel", theme: "Refonte de l'application mobile KIAMA", debut: "01/01/2025", fin: "30/06/2025", encadreur: "M. Biya", noteRH: 18, noteEnc: 16, docs: { cv: true, lm: true, rapport: true } },
  { id: 3, name: "Marc Etoundi", firstName: "Marc", poste: "Data Analyst", type: "Académique", theme: "Tableau de bord analytique Power BI", debut: "01/09/2024", fin: "28/02/2025", encadreur: "M. Atangana", noteRH: 14, noteEnc: 15, docs: { cv: true, lm: true, rapport: false } },
  { id: 4, name: "Brice Tchoupo", firstName: "Brice", poste: "Développeur React", type: "Professionnel", theme: "Développement du module de paiement en ligne", debut: "01/03/2024", fin: "31/08/2024", encadreur: "Mme Fouda", noteRH: 12, noteEnc: 13, docs: { cv: true, lm: true, rapport: true } },
];

const DEPTS_DATA = [
  { id: 1, name: "Développement", responsable: "M. Biya", count: 4 },
  { id: 2, name: "Design", responsable: "M. Biya", count: 2 },
  { id: 3, name: "Data", responsable: "M. Atangana", count: 1 },
  { id: 4, name: "RH", responsable: "M. Atangana", count: 1 },
  { id: 5, name: "Réseaux", responsable: "Mme Fouda", count: 1 },
  { id: 6, name: "Communication", responsable: null, count: 0 },
];

const ENCADREURS_DATA = [
  { id: 1, name: "M. Atangana", depts: ["Data", "RH"], count: 2 },
  { id: 2, name: "Mme Fouda", depts: ["Réseaux", "Dev"], count: 2 },
  { id: 3, name: "M. Biya", depts: ["Design", "Dev"], count: 3 },
];

// ══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ══════════════════════════════════════════════════════════════

function Avt({ name, size = 32, idx = 0, ring = false }: { name: string; size?: number; idx?: number; ring?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      color: "#fff", fontWeight: 700, fontSize: size * 0.36,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      boxShadow: ring ? `0 0 0 2.5px ${C.blue}` : "none",
      transition: "box-shadow 0.15s",
    }}>
      {getInitials(name)}
    </div>
  );
}

function Bdg({ v, children }: { v: "success" | "warning" | "danger" | "blue" | "grey" | "dark"; children: React.ReactNode }) {
  const map = {
    success: { bg: C.successBg, color: C.successText },
    warning: { bg: C.warningBg, color: C.warningText },
    danger: { bg: C.dangerBg, color: C.dangerText },
    blue: { bg: C.lightBlueBg, color: C.darkBlue },
    dark: { bg: C.darkBlue, color: "#fff" },
    grey: { bg: "#EEF3F8", color: C.textSec },
  };
  const s = map[v];
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function StarRating({ score }: { score: number }) {
  const filled = Math.round(score / 20 * 5);
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} fill={i <= filled ? "#F59E0B" : "none"} color={i <= filled ? "#F59E0B" : C.textTert} />
      ))}
    </div>
  );
}

function Modal({ open, onClose, title, children, width = 520 }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; width?: number;
}) {
  if (!open) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(11,39,64,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: C.white, borderRadius: 12, width, maxWidth: "95vw", maxHeight: "88vh", overflow: "auto", boxShadow: "0 8px 40px rgba(11,39,64,0.20)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.white, zIndex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textSec, padding: 4, borderRadius: 6, display: "flex" }}>
            <X size={17} />
          </button>
        </div>
        <div style={{ padding: "18px 20px" }}>{children}</div>
      </div>
    </div>
  );
}

function Inp({ label, type = "text", placeholder = "", value, onChange, req }: {
  label?: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void; req?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}{req ? " *" : ""}</label>}
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 10px", fontSize: 13, color: C.text, background: C.white, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }} />
    </div>
  );
}

function Sel({ label, value, onChange, opts, ph }: { label?: string; value: string; onChange: (v: string) => void; opts: string[]; ph?: string; }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 10px", fontSize: 13, color: value ? C.text : C.textTert, background: C.white, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
        {ph && <option value="">{ph}</option>}
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ v = "primary", children, onClick, full, sm }: { v?: "primary" | "sec" | "danger" | "ghost" | "orange"; children: React.ReactNode; onClick?: () => void; full?: boolean; sm?: boolean; }) {
  const map = {
    primary: { bg: C.blue, color: "#fff", border: "none" },
    sec: { bg: C.white, color: C.textSec, border: `1px solid ${C.border}` },
    danger: { bg: "#DC2626", color: "#fff", border: "none" },
    ghost: { bg: "transparent", color: C.textSec, border: "none" },
    orange: { bg: "#D97706", color: "#fff", border: "none" },
  };
  const s = map[v];
  return (
    <button onClick={onClick} style={{ background: s.bg, color: s.color, border: s.border, borderRadius: 6, padding: sm ? "4px 10px" : "7px 13px", fontSize: sm ? 11 : 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "inherit", width: full ? "100%" : undefined, justifyContent: full ? "center" : undefined, transition: "opacity 0.15s" }}
      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"}
      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
    >
      {children}
    </button>
  );
}

function AccessDenied() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360, gap: 16 }}>
      <div style={{ width: 64, height: 64, background: C.warningBg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Lock size={28} color={C.warningText} />
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Accès réservé au RH</div>
      <div style={{ fontSize: 13, color: C.textSec, textAlign: "center", maxWidth: 320 }}>
        Cette section est uniquement accessible aux membres de l'équipe Ressources Humaines.
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════

type Page = "portal" | "dashboard" | "pipeline" | "postes" | "tests" | "stagiaires" | "archives" | "admin";

const NAV: { group: string; items: { id: Page; label: string; icon: React.ReactNode; rhOnly?: boolean }[] }[] = [
  {
    group: "RECRUTEMENT",
    items: [
      { id: "dashboard", label: "Accueil", icon: <Home size={14} /> },
      { id: "pipeline", label: "Pipeline", icon: <LayoutDashboard size={14} />, rhOnly: true },
    ],
  },
  {
    group: "COMPÉTENCES",
    items: [
      { id: "postes", label: "Postes & Compétences", icon: <Briefcase size={14} /> },
    ],
  },
  {
    group: "TESTS",
    items: [
      { id: "tests", label: "Tests techniques", icon: <ClipboardList size={14} /> },
    ],
  },
  {
    group: "STAGIAIRES",
    items: [
      { id: "stagiaires", label: "Stagiaires actifs", icon: <Users size={14} /> },
      { id: "archives", label: "Infos stagiaires", icon: <Archive size={14} /> },
    ],
  },
  {
    group: "ADMINISTRATION",
    items: [
      { id: "admin", label: "Administration", icon: <Settings size={14} />, rhOnly: true },
    ],
  },
];

function Sidebar({ cur, go, role, setRole }: { cur: Page; go: (p: Page) => void; role: "RH" | "Encadreur"; setRole: (r: "RH" | "Encadreur") => void }) {
  return (
    <div style={{ width: 220, minWidth: 220, background: C.blue, display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Inter','Segoe UI',sans-serif", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "15px 14px 12px", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 17, color: "#fff", flexShrink: 0 }}>P</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", letterSpacing: 0.5, lineHeight: 1.2 }}>PIRSACK</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.3 }}>KIAMA S.A.</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
        {NAV.map(section => {
          const visible = section.items.filter(it => !(it.rhOnly && role === "Encadreur"));
          if (!visible.length) return null;
          return (
            <div key={section.group} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: 1.2, padding: "4px 8px 5px", textTransform: "uppercase" }}>{section.group}</div>
              {visible.map(item => {
                const active = cur === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 9px", background: active ? "rgba(255,255,255,0.22)" : "transparent", border: "none", borderRadius: 8, cursor: "pointer", color: active ? "#fff" : "rgba(255,255,255,0.78)", fontSize: 13, fontWeight: active ? 600 : 400, textAlign: "left", fontFamily: "inherit", transition: "background 0.12s" }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    <span style={{ opacity: active ? 1 : 0.75, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 12 }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Role switch + user */}
      <div style={{ padding: "10px 12px 14px", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ background: "rgba(0,0,0,0.22)", borderRadius: 10, padding: 3, display: "flex", gap: 2, marginBottom: 10 }}>
          {(["RH", "Encadreur"] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{ flex: 1, padding: "5px 0", borderRadius: 7, border: "none", background: role === r ? C.white : "transparent", color: role === r ? C.darkBlue : "rgba(255,255,255,0.65)", fontWeight: role === r ? 700 : 500, fontSize: 11, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}
            >{r}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, color: "#fff", flexShrink: 0 }}>
            {role === "RH" ? "AF" : "ME"}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#fff", lineHeight: 1.3 }}>{role === "RH" ? "Ambre Fouda" : "Marc Etoundi"}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TOPBAR
// ══════════════════════════════════════════════════════════════

const PAGE_TITLES: Record<Page, string> = {
  portal: "Portail candidature",
  dashboard: "Tableau de bord",
  pipeline: "Pipeline de recrutement",
  postes: "Postes & Compétences",
  tests: "Tests techniques",
  stagiaires: "Stagiaires actifs",
  archives: "Infos stagiaires",
  admin: "Administration",
};

function TopBar({ cur, go }: { cur: Page; go: (p: Page) => void }) {
  return (
    <div style={{ height: 48, background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {cur !== "dashboard" && (
          <button onClick={() => go("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", color: C.textSec, fontSize: 12, display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", padding: "4px 8px", borderRadius: 6, transition: "background 0.12s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = C.lightBlueBg}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
          >
            <ArrowLeft size={13} />Accueil
          </button>
        )}
        <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{PAGE_TITLES[cur]}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => go("portal")} style={{ background: C.lightBlueBg, border: `1px solid ${C.border}`, cursor: "pointer", color: C.darkBlue, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, fontFamily: "inherit" }}>
          → Portail public
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 6, display: "flex" }}>
          <Bell size={17} color={C.textSec} />
          <span style={{ position: "absolute", top: 5, right: 5, width: 6, height: 6, background: "#EF4444", borderRadius: "50%", border: "1.5px solid #fff" }} />
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 0 — PUBLIC PORTAL
// ══════════════════════════════════════════════════════════════

function PublicPortal({ onEnter }: { onEnter: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", poste: "", dispo: "", cvFile: "", lmFile: "" });
  const [cvDrag, setCvDrag] = useState(false);
  const [lmDrag, setLmDrag] = useState(false);

  const upd = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  function FileZone({ field, drag, setDrag, label, optional }: { field: string; drag: boolean; setDrag: (b: boolean) => void; label: string; optional?: boolean }) {
    const val = form[field as keyof typeof form];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{label}{optional ? " (optionnel)" : " *"}</label>
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) upd(field)(f.name); }}
          onClick={() => upd(field)(val ? "" : `${label.split("(")[0].trim().toLowerCase().replace(/\s/g, "_")}.pdf`)}
          style={{ border: `2px dashed ${drag ? C.blue : C.border}`, borderRadius: 8, padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: drag ? C.lightBlueBg : C.appBg, cursor: "pointer", transition: "all 0.15s" }}
        >
          {val ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.successText }}>
              <CheckCircle size={16} /><span style={{ fontWeight: 600, fontSize: 13 }}>{val}</span>
            </div>
          ) : (
            <>
              <Upload size={20} color={C.textTert} />
              <span style={{ fontSize: 12, color: C.textSec, fontWeight: 500 }}>Glissez votre {field === "cvFile" ? "CV" : "lettre"} ici ou cliquez pour parcourir</span>
              <span style={{ fontSize: 11, color: C.textTert }}>PDF uniquement · max 10 Mo</span>
            </>
          )}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(145deg, ${C.appBg} 0%, ${C.lightBlueBg} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ background: C.white, borderRadius: 16, padding: "40px 36px 24px", maxWidth: 520, width: "100%", boxShadow: "0 4px 28px rgba(11,39,64,0.10)", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.successBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
            <CheckCircle size={30} color={C.successText} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.text, marginBottom: 12 }}>Candidature envoyée !</div>
          <p style={{ color: C.textSec, fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
            Vous recevrez un email de confirmation à <strong>{form.email || "votre adresse email"}</strong>.<br />Notre équipe RH examinera votre dossier dans les meilleurs délais.
          </p>
          <div style={{ fontSize: 11, color: C.textTert, marginBottom: 24 }}>Vous pouvez fermer cette page.</div>
          <button onClick={onEnter} style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Accéder au panneau RH →
          </button>
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textTert }}>© 2026 KIAMA S.A. — Yaoundé, Cameroun</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(145deg, ${C.appBg} 0%, ${C.lightBlueBg} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: C.white, borderRadius: 16, padding: "28px 32px 22px", maxWidth: 580, width: "100%", boxShadow: "0 4px 28px rgba(11,39,64,0.10)" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, background: C.lightBlueBg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: C.darkBlue }}>P</div>
            <span style={{ fontWeight: 800, fontSize: 17, color: C.darkBlue }}>PIRSACK</span>
            <span style={{ color: C.textTert, fontSize: 13 }}>|</span>
            <span style={{ fontSize: 13, color: C.textSec, fontWeight: 500 }}>KIAMA S.A.</span>
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 21, color: C.text, margin: "0 0 6px" }}>Déposez votre candidature</h1>
          <p style={{ fontSize: 12, color: C.textSec, margin: 0, lineHeight: 1.6 }}>Remplissez le formulaire ci-dessous. CV et lettre de motivation en PDF uniquement (max 10 Mo chacun).</p>
        </div>

        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp label="Nom" value={form.nom} onChange={upd("nom")} req />
            <Inp label="Prénom" value={form.prenom} onChange={upd("prenom")} req />
          </div>
          <Inp label="Email" type="email" value={form.email} onChange={upd("email")} req />
          <Sel label="Poste visé" value={form.poste} onChange={upd("poste")} opts={["Développeur React", "Développeur Backend", "UI/UX Designer", "Data Analyst", "Chargé(e) RH"]} ph="Sélectionner un poste..." />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: 0.5 }}>Disponibilité *</label>
            <input type="date" value={form.dispo} onChange={e => upd("dispo")(e.target.value)} style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 10px", fontSize: 13, color: C.text, background: C.white, outline: "none", fontFamily: "inherit" }} />
          </div>
          <FileZone field="cvFile" drag={cvDrag} setDrag={setCvDrag} label="Curriculum Vitae (PDF)" />
          <FileZone field="lmFile" drag={lmDrag} setDrag={setLmDrag} label="Lettre de motivation (PDF)" optional />
          <button type="submit" style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", width: "100%", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginTop: 2 }}>
            Envoyer ma candidature
          </button>
        </form>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textTert, textAlign: "center" }}>© 2026 KIAMA S.A. — Yaoundé, Cameroun</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 1 — DASHBOARD
// ══════════════════════════════════════════════════════════════

function Dashboard({ role }: { role: "RH" | "Encadreur" }) {
  const dateStr = new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const name = role === "RH" ? "Ambre" : "Marc";

  const rhTiles = [
    { label: "Candidatures en cours", value: "12", ctx: "3 nouvelles cette semaine", wide: true, color: C.blue, progress: undefined },
    { label: "Stagiaires actifs", value: "7 / 10", ctx: "Quota d'accueil", color: "#10B981", progress: 70 },
    { label: "Tests en cours", value: "3", ctx: "2 expirent bientôt", color: "#F59E0B", progress: undefined },
    { label: "Postes configurés", value: "5", ctx: "4 actifs", color: "#6366F1", progress: undefined },
    { label: "Anciens stagiaires", value: "18", ctx: "Dossiers archivés", color: C.darkBlue, progress: undefined },
    { label: "Départements", value: "6", ctx: "3 avec encadreur actif", color: "#8B5CF6", progress: undefined },
  ];
  const encTiles = [
    { label: "Stagiaires actifs", value: "3", ctx: "Sous ma supervision", color: "#10B981", progress: undefined },
    { label: "Tests en cours", value: "1", ctx: "En attente de résultat", color: "#F59E0B", progress: undefined },
    { label: "Postes configurés", value: "5", ctx: "Accès lecture seule", color: "#6366F1", progress: undefined },
    { label: "Anciens stagiaires", value: "8", ctx: "Dossiers archivés", color: C.darkBlue, progress: undefined },
  ];
  const tiles = role === "RH" ? rhTiles : encTiles;
  const cols = role === "RH" ? "2fr 1fr 1fr" : "1fr 1fr";

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 11, color: C.textSec, textTransform: "capitalize", marginBottom: 3 }}>{dateStr}</div>
        <h1 style={{ fontWeight: 800, fontSize: 22, color: C.text, margin: 0 }}>Bonjour, {name} 👋</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 12 }}>
        {tiles.map((tile, i) => (
          <div
            key={tile.label}
            style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 11, padding: "16px 18px", cursor: "pointer", gridColumn: tile.wide ? "1 / -1" : undefined, position: "relative", transition: "box-shadow 0.15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 18px rgba(59,158,229,0.13)"}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, background: C.lightBlueBg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 14, height: 14, background: tile.color, borderRadius: 4 }} />
              </div>
              <ChevronRight size={15} color={C.textTert} />
            </div>
            <div style={{ fontWeight: 800, fontSize: tile.wide ? 30 : 24, color: C.text, marginBottom: 2, lineHeight: 1 }}>{tile.value}</div>
            <div style={{ fontWeight: 600, fontSize: 12, color: C.text, marginBottom: 10 }}>{tile.label}</div>
            {tile.progress !== undefined && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${tile.progress}%`, background: tile.progress >= 90 ? "#EF4444" : C.blue, borderRadius: 2 }} />
                </div>
              </div>
            )}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, fontSize: 11, color: C.textSec }}>{tile.ctx}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 2 — PIPELINE (KANBAN)
// ══════════════════════════════════════════════════════════════

function KanbanCardItem({ card, isOpen, onToggle }: { card: KanbanCard; isOpen: boolean; onToggle: () => void }) {
  const borderStyle = card.status === "accepted"
    ? { border: "1.5px solid #6EE7B7", background: "#F0FDF9" }
    : card.status === "refused"
    ? { border: "1.5px solid #FCA5A5", background: "#fff", opacity: 0.7 }
    : { border: `1px solid ${C.border}`, background: "#fff" };

  const menuItems = [
    { label: "→ Étape suivante", color: C.text },
    { label: "⤭ Sauter une étape", color: C.text },
    { label: "✉ Envoyer lien test", color: C.text },
    { label: "✕ Refuser", color: "#DC2626" },
  ];

  return (
    <div style={{ ...borderStyle, borderRadius: 6, padding: "9px 10px", marginBottom: 5, position: "relative", cursor: "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: C.text, lineHeight: 1.4 }}>{card.name}</span>
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: C.textTert, padding: "1px 3px", borderRadius: 4, marginTop: -1, marginRight: -3 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = C.lightBlueBg; (e.currentTarget as HTMLButtonElement).style.color = C.textSec; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = C.textTert; }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
      <div style={{ fontSize: 11, color: C.textSec, marginBottom: 7 }}>{card.poste}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ background: C.lightBlueBg, color: C.darkBlue, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{card.score}</span>
        <span style={{ fontSize: 10, color: C.textTert }}>{card.date}</span>
      </div>
      {isOpen && (
        <div
          onClick={e => e.stopPropagation()}
          style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 4px 20px rgba(11,39,64,0.14)", width: 168, zIndex: 200, overflow: "hidden" }}
        >
          {menuItems.map(mi => (
            <button key={mi.label} style={{ display: "block", width: "100%", padding: "8px 13px", background: "none", border: "none", cursor: "pointer", color: mi.color, fontSize: 12, textAlign: "left", fontFamily: "inherit" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = C.lightBlueBg}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "none"}
            >{mi.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function Pipeline({ role }: { role: "RH" | "Encadreur" }) {
  const [openId, setOpenId] = useState<number | null>(null);

  if (role === "Encadreur") return <AccessDenied />;

  return (
    <div onClick={() => setOpenId(null)}>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
        {KANBAN_COLS.map(col => {
          const cards = KANBAN_DATA[col];
          return (
            <div key={col} style={{ flex: "1 1 0", minWidth: 170, background: C.lightBlueBg, borderRadius: 8, border: `1px solid ${C.border}`, padding: "8px 7px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 11, color: C.darkBlue, textTransform: "uppercase", letterSpacing: 0.5 }}>{col}</span>
                <span style={{ background: C.white, color: C.darkBlue, padding: "1px 7px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{cards.length}</span>
              </div>
              {cards.map(card => (
                <KanbanCardItem key={card.id} card={card} isOpen={openId === card.id} onToggle={() => setOpenId(openId === card.id ? null : card.id)} />
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, background: C.lightBlueBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 16, height: 16, background: C.blue, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>i</span>
        </div>
        <span style={{ fontSize: 11, color: C.darkBlue }}>L'aperçu email s'affiche uniquement après avoir choisi une action sur une fiche candidat via le menu «···».</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 3 — POSTES & COMPÉTENCES
// ══════════════════════════════════════════════════════════════

interface SkillRow { name: string; w: number }

function PosteCard({ p, currentUser }: { p: typeof POSTES[0]; currentUser: string }) {
  const total = p.skills.reduce((s, sk) => s + sk.w, 0);
  const isCreator = p.creator === currentUser;
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 2 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: C.textTert }}>Créé par {p.creator}</div>
        </div>
        {isCreator && (
          <div style={{ display: "flex", gap: 5 }}>
            <button style={{ background: C.lightBlueBg, border: "none", borderRadius: 5, padding: "4px 8px", cursor: "pointer", color: C.darkBlue, fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
              <Edit2 size={11} />Modifier
            </button>
            <button style={{ background: C.dangerBg, border: "none", borderRadius: 5, padding: "4px 8px", cursor: "pointer", color: C.dangerText, fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
        {p.skills.map(sk => (
          <div key={sk.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.text, width: 110, flexShrink: 0 }}>{sk.name}</span>
            <div style={{ flex: 1, height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${sk.w}%`, background: C.blue, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 11, color: C.textSec, width: 32, textAlign: "right" }}>{sk.w}%</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, display: "flex", justifyContent: "flex-end" }}>
        <Bdg v={total === 100 ? "success" : "danger"}>Total : {total}%</Bdg>
      </div>
    </div>
  );
}

function Postes({ role }: { role: "RH" | "Encadreur" }) {
  const [showModal, setShowModal] = useState(false);
  const [posteName, setPosteName] = useState("");
  const [skills, setSkills] = useState<SkillRow[]>([{ name: "", w: 0 }]);
  const total = skills.reduce((s, sk) => s + Number(sk.w), 0);
  const currentUser = role === "RH" ? "M. Biya" : "M. Etoundi";

  function addSkill() { setSkills(s => [...s, { name: "", w: 0 }]); }
  function removeSkill(i: number) { setSkills(s => s.filter((_, j) => j !== i)); }
  function updateSkill(i: number, field: "name" | "w", val: string) {
    setSkills(s => s.map((sk, j) => j === i ? { ...sk, [field]: field === "w" ? Number(val) : val } : sk));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>Gérez les profils de postes et leurs compétences pondérées.</div>
        </div>
        <Btn v="primary" onClick={() => setShowModal(true)}><Plus size={14} />Nouveau poste</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {POSTES.map(p => <PosteCard key={p.id} p={p} currentUser={currentUser} />)}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Créer un poste">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Inp label="Nom du poste" value={posteName} onChange={setPosteName} req />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Compétences</div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 32px", background: C.lightBlueBg, padding: "6px 12px", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.textSec }}>Compétence</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.textSec }}>Poids (%)</span>
                <span />
              </div>
              {skills.map((sk, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 32px", padding: "7px 12px", gap: 8, borderTop: `1px solid ${C.border}`, alignItems: "center" }}>
                  <input value={sk.name} onChange={e => updateSkill(i, "name", e.target.value)} placeholder="Ex: React" style={{ border: `1px solid ${C.border}`, borderRadius: 5, padding: "5px 8px", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
                  <input type="number" value={sk.w || ""} onChange={e => updateSkill(i, "w", e.target.value)} placeholder="0" min={0} max={100} style={{ border: `1px solid ${C.border}`, borderRadius: 5, padding: "5px 8px", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
                  <button onClick={() => removeSkill(i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.dangerText, display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} /></button>
                </div>
              ))}
            </div>
            <button onClick={addSkill} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 12, fontWeight: 600, padding: "8px 0 0", fontFamily: "inherit" }}>+ Ajouter une compétence</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: total === 100 ? C.successBg : total > 100 ? C.dangerBg : C.lightBlueBg, borderRadius: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: total === 100 ? C.successText : total > 100 ? C.dangerText : C.darkBlue }}>Total des poids : {total}%</span>
            {total !== 100 && <span style={{ fontSize: 11, color: total > 100 ? C.dangerText : C.textSec }}>{total > 100 ? "(dépasse 100%)" : "(doit atteindre 100%)"}</span>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
            <Btn v="sec" onClick={() => setShowModal(false)}>Annuler</Btn>
            <Btn v="primary">Enregistrer</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 4 — TESTS TECHNIQUES
// ══════════════════════════════════════════════════════════════

interface Question { id: number; enonce: string; type: "QCM" | "Texte libre"; options: string[]; }

function Tests({ role }: { role: "RH" | "Encadreur" }) {
  const [showModal, setShowModal] = useState(false);
  const [testTitle, setTestTitle] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [questions, setQuestions] = useState<Question[]>([{ id: 1, enonce: "", type: "QCM", options: ["", "", "", ""] }]);

  function addQ() { setQuestions(q => [...q, { id: Date.now(), enonce: "", type: "QCM", options: ["", "", "", ""] }]); }
  function removeQ(id: number) { setQuestions(q => q.filter(x => x.id !== id)); }
  function updateQ(id: number, field: string, val: string) {
    setQuestions(q => q.map(x => x.id === id ? { ...x, [field]: val, options: field === "type" && val === "QCM" ? ["", "", "", ""] : x.options } : x));
  }
  function updateOpt(qid: number, oi: number, val: string) {
    setQuestions(q => q.map(x => x.id === qid ? { ...x, options: x.options.map((o, i) => i === oi ? val : o) } : x));
  }

  const currentCreator = role === "RH" ? "Ambre Fouda" : "Marc Etoundi";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Btn v="primary" onClick={() => setShowModal(true)}><Plus size={14} />Nouveau test</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TESTS_DATA.map((t, ti) => {
          const isCreator = true;
          const hasActive = !!t.link;
          return (
            <div key={t.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 3 }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: C.textTert }}>{t.questions} questions · {t.duration} min · Créé par {t.creator}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {isCreator && (
                    <>
                      <button style={{ background: hasActive ? C.lightBlueBg : C.white, border: `1px solid ${C.border}`, borderRadius: 5, padding: "4px 9px", cursor: hasActive ? "not-allowed" : "pointer", color: hasActive ? C.textTert : C.textSec, fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
                        <Edit2 size={11} />Modifier
                      </button>
                      <button style={{ background: C.dangerBg, border: "none", borderRadius: 5, padding: "4px 8px", cursor: hasActive ? "not-allowed" : "pointer", opacity: hasActive ? 0.5 : 1, color: C.dangerText, fontSize: 11, display: "flex", alignItems: "center" }}>
                        <Trash2 size={11} />
                      </button>
                    </>
                  )}
                  {role === "RH" && (
                    <Btn v="primary" sm><Send size={11} />Envoyer lien</Btn>
                  )}
                </div>
              </div>
              {hasActive && t.link && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{t.link.candidate}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, minWidth: 0 }}>
                      <Link2 size={12} color={C.textTert} />
                      <code style={{ fontSize: 10, color: C.textSec, background: C.lightBlueBg, padding: "3px 8px", borderRadius: 4, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>{t.link.uuid}</code>
                    </div>
                    {t.link.status === "active" ? (
                      <Bdg v="warning">Expire dans {t.link.expiry}</Bdg>
                    ) : (
                      <Bdg v="success">Score : {t.link.score}</Bdg>
                    )}
                    {t.link.alerts > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.warningText, fontSize: 11 }}>
                        <AlertTriangle size={12} />{t.link.alerts} alerte{t.link.alerts > 1 ? "s" : ""} fraude
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nouveau test" width={580}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 150px", gap: 12 }}>
            <Inp label="Titre du test" value={testTitle} onChange={setTestTitle} req />
            <Inp label="Durée (minutes)" type="number" value={testDuration} onChange={setTestDuration} req />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Questions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {questions.map((q, qi) => (
                <div key={q.id} style={{ border: `1.5px solid ${C.lightBlueBg}`, borderRadius: 8, padding: "12px 14px", background: C.appBg }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.darkBlue }}>Question {qi + 1}</span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 5, overflow: "hidden" }}>
                        {(["QCM", "Texte libre"] as const).map(t => (
                          <button key={t} onClick={() => updateQ(q.id, "type", t)} style={{ padding: "3px 9px", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", background: q.type === t ? C.blue : C.white, color: q.type === t ? "#fff" : C.textSec, fontFamily: "inherit" }}>{t}</button>
                        ))}
                      </div>
                      {questions.length > 1 && <button onClick={() => removeQ(q.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.dangerText }}><X size={14} /></button>}
                    </div>
                  </div>
                  <textarea value={q.enonce} onChange={e => updateQ(q.id, "enonce", e.target.value)} placeholder="Énoncé de la question..." rows={2} style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 9px", fontSize: 12, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
                  {q.type === "QCM" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
                      {q.options.map((opt, oi) => (
                        <input key={oi} value={opt} onChange={e => updateOpt(q.id, oi, e.target.value)} placeholder={`Option ${oi + 1}`} style={{ border: `1px solid ${C.border}`, borderRadius: 5, padding: "5px 8px", fontSize: 11, fontFamily: "inherit", outline: "none" }} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addQ} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 12, fontWeight: 600, padding: "8px 0 0", fontFamily: "inherit" }}>+ Ajouter une question</button>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
            <Btn v="sec" onClick={() => setShowModal(false)}>Annuler</Btn>
            <Btn v="primary">Enregistrer</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 5 — STAGIAIRES ACTIFS
// ══════════════════════════════════════════════════════════════

const TABLE_POSITIONS = [
  { left: 120, top: 18 },
  { left: 200, top: 56 },
  { left: 220, top: 142 },
  { left: 165, top: 212 },
  { left: 77, top: 212 },
  { left: 22, top: 142 },
  { left: 42, top: 56 },
];

function Stagiaires({ role }: { role: "RH" | "Encadreur" }) {
  const [selected, setSelected] = useState(STAGIAIRES[0]);
  const [filterDept, setFilterDept] = useState("");
  const [filterEnc, setFilterEnc] = useState("");
  const [filterType, setFilterType] = useState("");
  const [quotaModal, setQuotaModal] = useState(false);
  const [quota, setQuota] = useState("10");

  const filtered = STAGIAIRES.filter(s =>
    (!filterDept || s.dept === filterDept) &&
    (!filterEnc || s.encadreur === filterEnc) &&
    (!filterType || s.type === filterType)
  );

  return (
    <div>
      {/* Quota bar */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Quota d'accueil : <span style={{ color: C.blue }}>7 / {quota} stagiaires</span></span>
          </div>
          <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(7 / Number(quota)) * 100}%`, background: (7 / Number(quota)) >= 1 ? "#EF4444" : C.blue, borderRadius: 3, transition: "width 0.3s" }} />
          </div>
        </div>
        {role === "RH" && <Btn v="sec" sm onClick={() => setQuotaModal(true)}>Définir</Btn>}
      </div>

      {/* Round table + Fiche */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14, marginBottom: 14 }}>
        {/* Round table */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 16, alignSelf: "flex-start" }}>Table ronde des stagiaires</div>
          <div style={{ position: "relative", width: 280, height: 280 }}>
            {/* outer circle */}
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px dashed ${C.border}` }} />
            {/* inner circle */}
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 64, height: 64, borderRadius: "50%", background: C.lightBlueBg, border: `1.5px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: C.textSec, textAlign: "center", lineHeight: 1.3 }}>Table<br />{STAGIAIRES.length} stag.</span>
            </div>
            {/* avatars */}
            {STAGIAIRES.map((s, i) => {
              const pos = TABLE_POSITIONS[i];
              const isSelected = selected.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  style={{ position: "absolute", left: pos.left, top: pos.top, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", transform: "translate(-50%,-50%)" }}
                >
                  <Avt name={s.name} size={36} idx={i} ring={isSelected} />
                  <span style={{ fontSize: 9, fontWeight: 600, color: isSelected ? C.darkBlue : C.textSec, whiteSpace: "nowrap", background: C.white, padding: "1px 4px", borderRadius: 3 }}>{s.firstName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fiche */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: C.blue, padding: "18px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <Avt name={selected.name} size={46} idx={STAGIAIRES.findIndex(s => s.id === selected.id)} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{selected.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{selected.poste}</div>
            </div>
          </div>
          <div style={{ padding: "14px 16px" }}>
            {[
              { label: "Statut", value: <Bdg v="success">Actif</Bdg> },
              { label: "Type", value: <Bdg v="blue">{selected.type}</Bdg> },
              { label: "Département", value: selected.dept },
              { label: "Encadreur", value: selected.encadreur },
              { label: "Début", value: selected.debut },
              { label: "Fin de stage", value: <strong>{selected.fin}</strong> },
              { label: "Rapport", value: selected.rapport ? <Bdg v="success">Disponible</Bdg> : <Bdg v="grey">Non uploadé</Bdg> },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 11, color: C.textSec }}>{row.label}</span>
                <span style={{ fontSize: 12, color: C.text }}>{row.value}</span>
              </div>
            ))}
            {role === "RH" && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                <Btn v="sec" sm>Renouveler</Btn>
                <Btn v="orange" sm>Fin anticipée</Btn>
                <Btn v="sec" sm><Upload size={11} />Rapport</Btn>
                <Btn v="danger" sm>Clôturer</Btn>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 0 }}>
          <Sel value={filterDept} onChange={setFilterDept} opts={["Développement", "Data", "Design", "RH", "Réseaux"]} ph="Département" />
          <Sel value={filterEnc} onChange={setFilterEnc} opts={["M. Biya", "M. Atangana", "Mme Fouda"]} ph="Encadreur" />
          <Sel value={filterType} onChange={setFilterType} opts={["Académique", "Professionnel"]} ph="Type de stage" />
          <Sel value="" onChange={() => {}} opts={["30/06/2026", "31/07/2026", "31/08/2026", "30/09/2026", "30/11/2026", "31/12/2026", "28/02/2027"]} ph="Date de fin" />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.lightBlueBg }}>
              {["Stagiaire", "Type", "Département", "Encadreur", "Date fin", "Statut", ""].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textSec, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ borderTop: `1px solid ${C.border}`, transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = C.appBg}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
              >
                <td style={{ padding: "8px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avt name={s.name} size={26} idx={i} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: C.textTert }}>{s.poste}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "8px 12px" }}><Bdg v={s.type === "Académique" ? "blue" : "grey"}>{s.type}</Bdg></td>
                <td style={{ padding: "8px 12px", fontSize: 12, color: C.text }}>{s.dept}</td>
                <td style={{ padding: "8px 12px", fontSize: 12, color: C.textSec }}>{s.encadreur}</td>
                <td style={{ padding: "8px 12px", fontSize: 12, color: C.text, fontWeight: 600 }}>{s.fin}</td>
                <td style={{ padding: "8px 12px" }}><Bdg v="success">{s.statut}</Bdg></td>
                <td style={{ padding: "8px 12px" }}>
                  <button onClick={() => setSelected(s)} style={{ background: C.lightBlueBg, border: "none", borderRadius: 5, padding: "4px 9px", cursor: "pointer", color: C.darkBlue, fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>Fiche</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={quotaModal} onClose={() => setQuotaModal(false)} title="Définir le quota d'accueil">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Inp label="Quota maximum de stagiaires" type="number" value={quota} onChange={setQuota} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Btn v="sec" onClick={() => setQuotaModal(false)}>Annuler</Btn>
            <Btn v="primary" onClick={() => setQuotaModal(false)}>Enregistrer</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 6 — INFOS STAGIAIRES (ARCHIVES)
// ══════════════════════════════════════════════════════════════

function Archives() {
  const [filterDept, setFilterDept] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterEnc, setFilterEnc] = useState("");
  const [selected, setSelected] = useState<typeof ARCHIVES_DATA[0] | null>(null);

  const filtered = ARCHIVES_DATA.filter(a =>
    (!filterType || a.type === filterType) &&
    (!filterEnc || a.encadreur === filterEnc)
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Sel value={filterDept} onChange={setFilterDept} opts={["Développement", "Data", "Design", "RH"]} ph="Département" />
        <Sel value={filterType} onChange={setFilterType} opts={["Académique", "Professionnel"]} ph="Type de stage" />
        <Sel value={filterEnc} onChange={setFilterEnc} opts={["M. Biya", "M. Atangana", "Mme Fouda"]} ph="Encadreur" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {filtered.map((a, i) => (
          <div
            key={a.id}
            onClick={() => setSelected(a)}
            style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 15px", cursor: "pointer", transition: "box-shadow 0.15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(59,158,229,0.12)"}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
              <Avt name={a.name} size={36} idx={i} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{a.name}</div>
                <div style={{ fontSize: 10, color: C.textTert }}>{a.poste} · {a.type}</div>
              </div>
            </div>
            <div style={{ background: C.appBg, borderRadius: 6, padding: "7px 10px", marginBottom: 10, fontSize: 11, color: C.textSec, fontStyle: "italic", lineHeight: 1.5 }}>
              «&nbsp;{a.theme}&nbsp;»
            </div>
            <div style={{ fontSize: 11, color: C.textTert, marginBottom: 10 }}>{a.debut} → {a.fin} · {a.encadreur}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
              {[{ label: "Note RH", score: a.noteRH }, { label: "Note Encadreur", score: a.noteEnc }].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: C.textSec }}>{row.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{row.score}/20</span>
                    <StarRating score={row.score} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {a.docs.cv && <Bdg v="success">CV</Bdg>}
              {a.docs.lm && <Bdg v="success">LM</Bdg>}
              {a.docs.rapport ? <Bdg v="success">Rapport</Bdg> : <Bdg v="grey">Rapport manquant</Bdg>}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="Dossier archivé" width={560}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: C.lightBlueBg, borderRadius: 8, marginBottom: 16 }}>
              <Avt name={selected.name} size={48} idx={ARCHIVES_DATA.findIndex(a => a.id === selected.id)} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: C.textSec }}>{selected.poste} · {selected.type}</div>
                <div style={{ fontSize: 11, color: C.textTert, marginTop: 2 }}>{selected.debut} → {selected.fin}</div>
              </div>
            </div>
            <div style={{ background: C.appBg, borderRadius: 7, padding: "10px 13px", marginBottom: 14, fontSize: 12, color: C.textSec, fontStyle: "italic" }}>«&nbsp;{selected.theme}&nbsp;»</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Note RH", score: selected.noteRH, editable: true },
                { label: "Note Encadreur", score: selected.noteEnc, editable: false },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: C.textSec, fontWeight: 600 }}>{row.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StarRating score={row.score} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{row.score}/20</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Documents</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Curriculum Vitae", ok: selected.docs.cv },
                { label: "Lettre de motivation", ok: selected.docs.lm },
                { label: "Rapport de stage", ok: selected.docs.rapport },
              ].map(doc => (
                <div key={doc.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: doc.ok ? C.successBg : C.appBg, borderRadius: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <FileText size={13} color={doc.ok ? C.successText : C.textTert} />
                    <span style={{ fontSize: 12, color: doc.ok ? C.successText : C.textTert, fontWeight: 500 }}>{doc.label}</span>
                  </div>
                  {doc.ok ? (
                    <button style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 5, padding: "3px 9px", fontSize: 11, cursor: "pointer", color: C.darkBlue, fontFamily: "inherit", fontWeight: 600 }}>Télécharger</button>
                  ) : (
                    <Bdg v="grey">Manquant</Bdg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 7 — ADMINISTRATION
// ══════════════════════════════════════════════════════════════

const DEPT_ICONS: Record<string, string> = {
  "Développement": "💻", "Design": "🎨", "Data": "📊", "RH": "👥", "Réseaux": "🌐", "Communication": "📢",
};

function Administration({ role }: { role: "RH" | "Encadreur" }) {
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showEncModal, setShowEncModal] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptResp, setDeptResp] = useState("");
  const [encName, setEncName] = useState("");
  const [encDepts, setEncDepts] = useState("");

  if (role === "Encadreur") return <AccessDenied />;

  return (
    <div>
      {/* Departements */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Départements</span>
          <Btn v="primary" sm onClick={() => setShowDeptModal(true)}><Plus size={13} />Nouveau</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {DEPTS_DATA.map(d => (
            <div key={d.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 15px" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{DEPT_ICONS[d.name] || "📁"}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3 }}>{d.name}</div>
              <div style={{ fontSize: 11, color: C.textSec, marginBottom: 10 }}>
                Responsable : {d.responsable ? <strong>{d.responsable}</strong> : <span style={{ color: C.textTert }}>—</span>}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Bdg v={d.count > 0 ? "blue" : "grey"}>{d.count} stagiaire{d.count !== 1 ? "s" : ""}</Bdg>
                <div style={{ display: "flex", gap: 5 }}>
                  <button style={{ background: C.lightBlueBg, border: "none", borderRadius: 5, padding: "3px 7px", cursor: "pointer", color: C.darkBlue, fontSize: 10, display: "flex", alignItems: "center" }}><Edit2 size={10} /></button>
                  <button style={{ background: C.dangerBg, border: "none", borderRadius: 5, padding: "3px 7px", cursor: "pointer", color: C.dangerText, fontSize: 10, display: "flex", alignItems: "center" }}><Trash2 size={10} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Encadreurs */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Encadreurs</span>
          <Btn v="primary" sm onClick={() => setShowEncModal(true)}><Plus size={13} />Ajouter</Btn>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.lightBlueBg }}>
                {["Encadreur", "Départements couverts", "Stagiaires", ""].map(h => (
                  <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textSec, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENCADREURS_DATA.map((enc, i) => (
                <tr key={enc.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Avt name={enc.name} size={30} idx={i} />
                      <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{enc.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {enc.depts.map(d => <Bdg key={d} v="blue">{d}</Bdg>)}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <Bdg v={enc.count > 0 ? "dark" : "grey"}>{enc.count}</Bdg>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ background: C.lightBlueBg, border: "none", borderRadius: 5, padding: "4px 9px", cursor: "pointer", color: C.darkBlue, fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><Edit2 size={11} />Modifier</button>
                      <button style={{ background: C.dangerBg, border: "none", borderRadius: 5, padding: "4px 8px", cursor: "pointer", color: C.dangerText, fontSize: 11, display: "flex", alignItems: "center" }}><Trash2 size={11} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showDeptModal} onClose={() => setShowDeptModal(false)} title="Nouveau département">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Inp label="Nom du département" value={deptName} onChange={setDeptName} req />
          <Sel label="Responsable" value={deptResp} onChange={setDeptResp} opts={["M. Biya", "M. Atangana", "Mme Fouda"]} ph="Sélectionner..." />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Btn v="sec" onClick={() => setShowDeptModal(false)}>Annuler</Btn>
            <Btn v="primary" onClick={() => setShowDeptModal(false)}>Enregistrer</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={showEncModal} onClose={() => setShowEncModal(false)} title="Ajouter un encadreur">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Inp label="Nom de l'encadreur" value={encName} onChange={setEncName} req />
          <Inp label="Départements couverts (séparés par virgule)" value={encDepts} onChange={setEncDepts} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Btn v="sec" onClick={() => setShowEncModal(false)}>Annuler</Btn>
            <Btn v="primary" onClick={() => setShowEncModal(false)}>Enregistrer</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState<Page>("portal");
  const [role, setRole] = useState<"RH" | "Encadreur">("RH");

  function go(p: Page) {
    if (p === "pipeline" && role === "Encadreur") return;
    if (p === "admin" && role === "Encadreur") return;
    setPage(p);
  }

  if (page === "portal") {
    return <PublicPortal onEnter={() => setPage("dashboard")} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", fontSize: 13 }}>
      <Sidebar cur={page} go={go} role={role} setRole={r => { setRole(r); if (r === "Encadreur" && (page === "pipeline" || page === "admin")) setPage("dashboard"); }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar cur={page} go={go} />
        <main style={{ flex: 1, overflow: "auto", padding: "18px", background: C.appBg }}>
          {page === "dashboard" && <Dashboard role={role} />}
          {page === "pipeline" && <Pipeline role={role} />}
          {page === "postes" && <Postes role={role} />}
          {page === "tests" && <Tests role={role} />}
          {page === "stagiaires" && <Stagiaires role={role} />}
          {page === "archives" && <Archives />}
          {page === "admin" && <Administration role={role} />}
        </main>
      </div>
    </div>
  );
}
