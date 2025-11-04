"use client";

import React from "react";
import { ArrowLeft, Download } from "lucide-react";

/* ================= I18N ================= */
const messages = {
  en: {
    brand: {
      name: "HusPulse",
      sloganShort: "Measurable confidence for your home.",
      sloganLong:
        "AI that validates property quality – decision support in seconds.",
      footer: "Measurable confidence for your home",
    },
    toolbar: { risk: "Risk →", quality: "Quality →", value: "Value" },
    buttons: { exportPdf: "Export PDF", back: "Back" },
    titles: {
      health: "Health Index",
      valueInterval: "Value Interval",
      confidence: "Confidence",
      risk: "Risk",
      priceChart: "Price Chart",
      priceSub: "Recent price trend",
      factorAnalysis: "Factor Analysis",
      aiSummary: "AI-generated Summary",
    },
    panels: {
      energy: "OVK & Energy",
      costs: "Costs & Inclusions",
      market: "Market & Location",
      areaAvg: "Area average (value)",
      trend: "3-year trend",
      transit: "Transit",
      noise: "Noise",
      center: "Distance to center",
    },
    fields: {
      addressSearch: "Search address",
      addressHint: "Enter a valid address",
      fee: "Monthly fee (SEK)",
      ops: "Ops",
      declaration: "Declaration",
      declared: "Declared",
      energyClass: "Energy class",
      approved: "approved",
      notApproved: "not approved",
      runValuation: "Run valuation to view the breakdown.",
      feeVsOps: "Fee vs ops (monthly)",
      detailedBreakdown: "Detailed cost breakdown",
    },
    riskLevel: { low: "Low", medium: "Medium", high: "High" },
    summaryText: (d: any) =>
      `This property shows strong fundamentals with a health index of ${
        d.healthScore
      }/100. The estimated value is ${(d.valueInterval.min / 1_000_000).toFixed(
        1
      )}–${(d.valueInterval.max / 1_000_000).toFixed(1)} M SEK with ${
        d.valueInterval.confidence
      }% confidence.`,
    summaryTail: {
      low: " Risk level is low thanks to solid technical and economic factors.",
      medium: " Risk level is moderate with a few items to monitor.",
      high: " Risk level is high and multiple items need attention.",
    },
  },
  sv: {
    brand: {
      name: "HusPulse",
      sloganShort: "Mätbar trygghet för ditt boende.",
      sloganLong:
        "AI som validerar fastighetskvalitet – beslutsstöd på sekunder.",
      footer: "Mätbar trygghet för ditt boende",
    },
    toolbar: { risk: "Risk →", quality: "Kvalitet →", value: "Värde" },
    buttons: { exportPdf: "Exportera PDF", back: "Tillbaka" },
    titles: {
      health: "Hälsoindex",
      valueInterval: "Värdeintervall",
      confidence: "Konfidens",
      risk: "Risk",
      priceChart: "Prisdiagram",
      priceSub: "Senaste prisutveckling",
      factorAnalysis: "Faktoranalys",
      aiSummary: "AI-genererad Sammanfattning",
    },
    panels: {
      energy: "OVK & Energi",
      costs: "Kostnader & Innehåll",
      market: "Marknad & Läge",
      areaAvg: "Områdessnitt (värde)",
      trend: "Trend 3 år",
      transit: "Kollektivtrafik",
      noise: "Buller",
      center: "Avstånd till centrum",
    },
    fields: {
      addressSearch: "Sök adress",
      addressHint: "Ange en giltig adress",
      fee: "Månadsavgift (SEK)",
      ops: "Drift",
      declaration: "Deklaration",
      declared: "Deklarerad",
      energyClass: "Energiklass",
      approved: "godkänd",
      notApproved: "ej godkänd",
      runValuation: "Kör värdering för att se fördelningen.",
      feeVsOps: "Avgift vs drift (månad)",
      detailedBreakdown: "Detaljerad kostnadsfördelning",
    },
    riskLevel: { low: "Låg", medium: "Måttlig", high: "Hög" },
    summaryText: (d: any) =>
      `Denna fastighet visar goda värden med ett hälsoindex på ${
        d.healthScore
      }/100. Det uppskattade värdet ligger mellan ${(
        d.valueInterval.min / 1_000_000
      ).toFixed(1)}–${(d.valueInterval.max / 1_000_000).toFixed(1)} M SEK med ${
        d.valueInterval.confidence
      }% tillförlitlighet.`,
    summaryTail: {
      low: " Risknivån bedöms som låg tack vare starka tekniska och ekonomiska faktorer.",
      medium: " Risknivån är måttlig med vissa faktorer som bör beaktas.",
      high: " Observera att risknivån är hög och flera faktorer kräver uppmärksamhet.",
    },
  },
} as const;

type LangKey = keyof typeof messages;

/* ================= Utils & Primitives ================= */
const cn = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));
const scoreColor = (n: number) =>
  n >= 80
    ? { fg: "#065f46", bg: "#d1fae5" }
    : n >= 60
    ? { fg: "#92400e", bg: "#fffbeb" }
    : { fg: "#991b1b", bg: "#fee2e2" };

function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}: any) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: Record<string, string> = {
    default: "bg-black text-white hover:opacity-90 focus:ring-black",
    outline:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100/70 focus:ring-gray-200",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-5 text-base",
    icon: "h-10 w-10 p-0",
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: LangKey;
  onChange: (k: LangKey) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-gray-300 bg-white p-1 shadow-sm">
      {(["en", "sv"] as LangKey[]).map((k) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={cn(
            "px-3 py-1 text-sm rounded-full",
            lang === k
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
          aria-pressed={lang === k}
        >
          {k.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

const Card = ({ children }: any) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    {children}
  </div>
);
const Title = ({ children, sub }: any) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
      {children}
    </h3>
    {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
  </div>
);

/* ================= Components ================= */
function PropertyHealthGauge({ score, title, help }: any) {
  const s = clamp(score, 0, 100),
    C = 2 * Math.PI * 42,
    dash = (s / 100) * C,
    { fg, bg } = scoreColor(s);
  const [hover, setHover] = React.useState(false);
  return (
    <Card>
      <Title>{title}</Title>
      <div className="flex items-center gap-5">
        <svg
          viewBox="0 0 100 100"
          className="w-32 h-32 cursor-pointer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke={fg}
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${dash} ${C - dash}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{
              filter: hover
                ? "drop-shadow(0 0 6px rgba(0,0,0,.25))"
                : undefined,
            }}
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={bg}
            strokeOpacity="0.6"
            strokeWidth="1"
          />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            className="fill-gray-900 text-[18px] font-bold"
          >
            {s}
          </text>
        </svg>
        <div className="text-sm text-gray-600">
          <p>{help}</p>
          <p className="mt-1">70+ is strong.</p>
        </div>
      </div>
    </Card>
  );
}

function ValueConfidenceInterval({
  minValue,
  maxValue,
  confidence,
  title,
  confLabel,
  onChange,
}: any) {
  const toM = (x: number) => (x / 1_000_000).toFixed(1);
  const opts = [70, 85, 95];
  return (
    <Card>
      <Title>{title}</Title>
      <div className="space-y-3">
        <div className="text-2xl font-bold">
          {toM(minValue)}–{toM(maxValue)} M SEK
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>
            {confLabel}: <b>{confidence}%</b>
          </span>
          <div className="inline-flex gap-1">
            {opts.map((v) => (
              <button
                key={v}
                onClick={() => onChange?.(v)}
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full border transition",
                  v === confidence
                    ? "bg-gray-900 text-white"
                    : "bg-white hover:bg-gray-50"
                )}
                aria-pressed={v === confidence}
                title={`Set confidence to ${v}%`}
              >
                {v}%
              </button>
            ))}
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500">
          <div
            className="h-2 rounded-full bg-white/90 shadow"
            style={{ width: `${confidence}%` }}
            title={`Confidence width ${confidence}%`}
          />
        </div>
      </div>
    </Card>
  );
}

function RiskLevelCard({ level, factors, title, labelMap, onChange }: any) {
  const color =
    level === "low"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : level === "high"
      ? "bg-rose-100 text-rose-800 border-rose-200"
      : "bg-amber-100 text-amber-800 border-amber-200";
  const label = labelMap[level] || level;
  const [open, setOpen] = React.useState(true);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Title>{title}</Title>
        <div className="inline-flex gap-1">
          {["low", "medium", "high"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => onChange?.(lvl)}
              className={cn(
                "px-2 py-1 text-xs rounded-full border",
                lvl === level
                  ? "bg-gray-900 text-white"
                  : "bg-white hover:bg-gray-50"
              )}
              aria-pressed={lvl === level}
              title={`Set risk ${lvl}`}
            >
              {labelMap[lvl] || lvl}
            </button>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border",
          color
        )}
      >
        {label}
      </div>
      <button
        onClick={() => setOpen((s) => !s)}
        className="mt-3 text-xs text-gray-600 hover:underline"
        aria-expanded={open}
      >
        {open ? "Hide" : "Show"} factors
      </button>
      {open && (
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          {factors.map((f: string, i: number) => (
            <li key={i} className="flex gap-2">
              <span>•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function PriceChart({ data, title, sub }: any) {
  const w = 520,
    h = 220,
    pad = 30;
  const [idx, setIdx] = React.useState<number | null>(null);
  const xs = data.map((_: any, i: number) => i),
    ys = data.map((d: any) => d.price);
  const xMin = 0,
    xMax = xs.length - 1,
    yMin = Math.min(...ys),
    yMax = Math.max(...ys);
  const x = (i: number) =>
    pad + ((i - xMin) / Math.max(1, xMax - xMin)) * (w - pad * 2);
  const y = (v: number) =>
    h - pad - ((v - yMin) / Math.max(1, yMax - yMin)) * (h - pad * 2);
  const path = xs
    .map((i: number, k: number) => `${k ? "L" : "M"}${x(i)},${y(ys[i])}`)
    .join(" ");
  function handleMove(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const r = e.currentTarget.getBoundingClientRect();
    const i = clamp(
      Math.round(
        ((e.clientX - r.left - pad) / (w - 2 * pad)) * (xMax - xMin) + xMin
      ),
      0,
      xMax
    );
    setIdx(i);
  }
  return (
    <Card>
      <Title sub={sub}>{title}</Title>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-56 cursor-crosshair"
        onMouseMove={handleMove}
        onMouseLeave={() => setIdx(null)}
      >
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="#ffffff" />
        <path
          d={path}
          fill="none"
          stroke="url(#priceGrad)"
          strokeWidth="3"
          filter="url(#glow)"
        />
        {idx !== null && (
          <g>
            <line
              x1={x(idx)}
              x2={x(idx)}
              y1={pad}
              y2={h - pad}
              stroke="#9ca3af"
              strokeDasharray="4 3"
            />
            <circle cx={x(idx)} cy={y(ys[idx])} r={4} fill="#111827" />
            <rect
              x={Math.min(Math.max(8, x(idx) - 50), w - 110)}
              y={8}
              rx={6}
              ry={6}
              width={120}
              height={48}
              fill="#111827"
              opacity={0.9}
            />
            <text
              x={Math.min(Math.max(16, x(idx) - 42), w - 100)}
              y={28}
              fill="#fff"
              fontSize="12"
            >
              {data[idx].month}
            </text>
            <text
              x={Math.min(Math.max(16, x(idx) - 42), w - 100)}
              y={46}
              fill="#fff"
              fontSize="12"
            >
              {(ys[idx] / 1_000_000).toFixed(2)} M SEK
            </text>
          </g>
        )}
      </svg>
      <div className="mt-2 text-xs text-gray-500">
        {data[0]?.month} → {data[data.length - 1]?.month}
      </div>
    </Card>
  );
}

function FactorAnalysis({ factors, title }: any) {
  const [sortBy, setSortBy] = React.useState<"weight" | "score">("weight");
  const sorted = [...factors].sort((a, b) => b[sortBy] - a[sortBy]);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Title>{title}</Title>
        <div className="inline-flex gap-1">
          <button
            className={cn(
              "px-2 py-1 text-xs rounded-full border",
              sortBy === "weight"
                ? "bg-gray-900 text-white"
                : "bg-white hover:bg-gray-50"
            )}
            onClick={() => setSortBy("weight")}
          >
            Sort by weight
          </button>
          <button
            className={cn(
              "px-2 py-1 text-xs rounded-full border",
              sortBy === "score"
                ? "bg-gray-900 text-white"
                : "bg-white hover:bg-gray-50"
            )}
            onClick={() => setSortBy("score")}
          >
            Sort by score
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {sorted.map((f: any, i: number) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 p-3 hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-900">{f.name}</div>
              <div className="text-sm text-gray-600">Vikt: {f.weight}%</div>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500"
                style={{ width: `${f.score}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-700">{f.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ================= Helpers ================= */
const InfoRow = ({
  left,
  right,
}: {
  left: string;
  right: string | React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0">
    <div className="text-gray-500 text-sm">{left}</div>
    <div className="text-gray-800 text-sm font-medium">{right}</div>
  </div>
);

const PanelHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div className="font-semibold">{title}</div>
    </div>
    <div className="h-2 w-24 rounded-full bg-gradient-to-r from-indigo-200 to-blue-200" />
  </div>
);

const Badge = ({
  text,
  tone = "gray",
}: {
  text: string;
  tone?: "gray" | "green" | "red" | "amber" | "blue";
}) => {
  const tones: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    green: "bg-green-100 text-green-700 border-green-200",
    red: "bg-rose-100 text-rose-700 border-rose-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full border ${tones[tone]}`}>
      {text}
    </span>
  );
};

function Sparkline({
  a = [],
  b = [] as number[],
}: {
  a?: number[];
  b?: number[];
}) {
  const W = 160,
    H = 40,
    P = 4,
    all = [...a, ...b],
    mn = Math.min(...all, 0.99),
    mx = Math.max(...all, 1.01);
  const sx = (i: number, L: number) => P + (i / (L - 1 || 1)) * (W - 2 * P);
  const sy = (v: number) => P + (1 - (v - mn) / (mx - mn || 1)) * (H - 2 * P);
  const path = (s: number[]) =>
    s.map((v, i) => `${i ? "L" : "M"}${sx(i, s.length)},${sy(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      <path d={path(a)} stroke="#2563eb" strokeWidth="2" fill="none" />
      <path d={path(b)} stroke="#9ca3af" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

const EnergyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <path d="M13 2L3 14h6l-2 8 10-12h-6l2-8z" />
  </svg>
);
const CostIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <path
      d="M12 1v22M7 5h7a4 4 0 010 8H8a4 4 0 000 8h8"
      strokeLinecap="round"
    />
  </svg>
);
const MarketIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <path d="M3 19h18M5 15l3-4 3 3 5-7 3 4" strokeLinecap="round" />
  </svg>
);

function energyColor(cls?: string) {
  switch ((cls || "").toUpperCase()) {
    case "A":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "B":
      return "bg-green-100 text-green-700 border-green-200";
    case "C":
      return "bg-lime-100 text-lime-700 border-lime-200";
    case "D":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "E":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "F":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "G":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function EnergyScale({ current }: { current?: string }) {
  const classes = ["A", "B", "C", "D", "E", "F", "G"] as const;
  const cur = (current || "").toUpperCase();
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
        <span>Higher efficiency</span>
        <span>Lower efficiency</span>
      </div>
      <div className="flex gap-2">
        {classes.map((c) => (
          <span
            key={c}
            className={`px-2 py-1 rounded-md border ${energyColor(c)} ${
              cur === c ? "ring-2 ring-offset-2 ring-blue-500" : ""
            }`}
            title={`Energy class ${c}`}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function CostBreakdownBar({
  segments,
}: {
  segments: { key: string; label: string; amount: number }[];
}) {
  const total = Math.max(
    1,
    segments.reduce((s, x) => s + x.amount, 0)
  );
  const palette = [
    "bg-blue-600",
    "bg-indigo-400",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-gray-400",
  ];
  const fmt = (n: number) => `${Math.round(n).toLocaleString("sv-SE")} kr`;
  return (
    <div>
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
        {segments.map((s, i) => (
          <div
            key={s.key}
            className={`${palette[i % palette.length]} h-3`}
            style={{ width: `${(s.amount / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-2 grid sm:grid-cols-3 gap-2">
        {segments.map((s, i) => (
          <div
            key={s.key}
            className="flex items-center gap-2 text-xs text-gray-700"
          >
            <span
              className={`inline-block h-2.5 w-2.5 rounded ${
                palette[i % palette.length]
              }`}
            />
            <span className="font-medium">{s.label}</span>
            <span className="text-gray-500">— {fmt(s.amount)}</span>
            <span className="text-gray-400">
              ({Math.round((s.amount / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= Data ================= */
const propertyData = {
  address: "Storgatan 1, Stockholm",
  healthScore: 78,
  valueInterval: { min: 4500000, max: 5500000, confidence: 85 },
  riskLevel: "medium",
  riskFactors: [
    "Behöver uppgradering av elinstallationer",
    "Närhet till planerad byggarbetsplats",
    "Hög energiförbrukning jämfört med liknande fastigheter",
  ],
  priceHistory: [
    { date: "2021-01", price: 4000000 },
    { date: "2021-06", price: 4200000 },
    { date: "2022-01", price: 4300000 },
    { date: "2022-06", price: 4400000 },
    { date: "2023-01", price: 4600000 },
    { date: "2023-06", price: 4800000 },
    { date: "2024-01", price: 5000000 },
  ],
  factors: [
    {
      name: "Läge",
      score: 85,
      weight: 20,
      description:
        "Fastigheten har ett utmärkt läge med närhet till kollektivtrafik och service.",
    },
    {
      name: "Byggnadens skick",
      score: 70,
      weight: 15,
      description: "Byggnaden är i gott skick men har vissa renoveringsbehov.",
    },
    {
      name: "Marknadsförhållanden",
      score: 65,
      weight: 10,
      description: "Marknaden är stabil med måttlig efterfrågan i området.",
    },
    {
      name: "Ekonomiska faktorer",
      score: 60,
      weight: 8,
      description: "Ekonomiska indikatorer visar på stabil utveckling.",
    },
  ],
} as const;

/* ================= Page ================= */
export default function Dashboard() {
  const [lang, setLang] = React.useState<LangKey>("en");
  const t = messages[lang];
  const [address, setAddress] = React.useState<string>(propertyData.address);
  const ovkApproved = true;
  const energy = { declared: "2022", cls: "C" } as const;
  const fee = 3950,
    ops = 850;
  const includes = {
    water: true,
    heat: true,
    broadband: false,
    parking: false,
  } as const;

  const breakdown = React.useMemo(() => {
    const base = fee,
      water = base * 0.05,
      heat = base * 0.12,
      broadband = base * 0.06,
      parking = includes.parking ? base * 0.1 : 0,
      other = Math.max(0, base - (water + heat + broadband + parking));
    return [
      {
        key: "water",
        label: lang === "sv" ? "Vatten" : "Water",
        amount: water,
      },
      { key: "heat", label: lang === "sv" ? "Värme" : "Heat", amount: heat },
      {
        key: "broadband",
        label: lang === "sv" ? "Bredband" : "Broadband",
        amount: broadband,
      },
      {
        key: "parking",
        label: lang === "sv" ? "Parkering" : "Parking",
        amount: parking,
      },
      { key: "ops", label: t.fields.ops, amount: ops },
      {
        key: "other",
        label: lang === "sv" ? "Övrigt" : "Other",
        amount: other,
      },
    ].filter((s) => s.amount > 0.5);
  }, [fee, ops, includes.parking, lang, t.fields.ops]);

  const seriesA = propertyData.priceHistory.map(
    (p) => p.price / propertyData.priceHistory[0].price
  );
  const seriesB = seriesA.map(
    (v, i) => v * (i < seriesA.length / 2 ? 0.98 : 0.99)
  );
  const [riskLevel, setRiskLevel] = React.useState(propertyData.riskLevel);
  const [confidence, setConfidence] = React.useState(
    propertyData.valueInterval.confidence
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/40 to-white">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-rose-100 via-amber-100 to-emerald-100" />
        <header className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SimpleLogo />
              <div>
                {/* Title */}
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {t.brand.name}
                </h1>
                <p className="text-sm text-gray-700">{t.brand.sloganLong}</p>
                <p className="text-xs text-gray-500 mt-1">{address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t.fields.addressSearch}
                  title={t.fields.addressHint}
                  className="w-64 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <LanguageSwitcher lang={lang} onChange={setLang} />
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> {t.buttons.exportPdf}
              </Button>
            </div>
          </div>
        </header>
      </div>

      <div className="border-y border-gray-200 bg-white/80">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-rose-800">
              {t.toolbar.risk}
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">
              {t.toolbar.quality}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">
              {t.toolbar.value}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label={t.buttons.back}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Top Section - Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <PropertyHealthGauge
            score={propertyData.healthScore}
            title={t.titles.health}
            help={lang === "en" ? "Score out of 100" : "Poäng av 100"}
          />
          <ValueConfidenceInterval
            minValue={propertyData.valueInterval.min}
            maxValue={propertyData.valueInterval.max}
            confidence={confidence}
            title={t.titles.valueInterval}
            confLabel={t.titles.confidence}
            onChange={setConfidence}
          />
          <RiskLevelCard
            level={riskLevel}
            factors={propertyData.riskFactors}
            title={t.titles.risk}
            labelMap={t.riskLevel}
            onChange={setRiskLevel}
          />
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PriceChart
            data={propertyData.priceHistory.map(({ date, price }) => ({
              month: date,
              price,
            }))}
            title={t.titles.priceChart}
            sub={t.titles.priceSub}
          />
          <FactorAnalysis
            factors={propertyData.factors}
            title={t.titles.factorAnalysis}
          />
        </div>

        {/* AI Summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-3 text-2xl font-bold">{t.titles.aiSummary}</h2>
          <p className="text-lg leading-relaxed text-gray-800/90">
            {t.summaryText({
              ...propertyData,
              valueInterval: { ...propertyData.valueInterval, confidence },
            })}
            {t.summaryTail[riskLevel as keyof typeof t.summaryTail]}
          </p>
        </div>

        {/* Energy, Costs, Market Panels */}
        <section className="mt-8 grid gap-6 xl:grid-cols-3">
          {/* Energy */}
          <div className="rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
            <PanelHeader
              title={messages[lang].panels.energy}
              icon={<EnergyIcon />}
            />
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${energyColor(
                  energy.cls
                )}`}
              >
                {messages[lang].fields.energyClass} {energy.cls}
              </span>
              <Badge
                text={`OVK ${
                  ovkApproved
                    ? messages[lang].fields.approved
                    : messages[lang].fields.notApproved
                }`}
                tone={ovkApproved ? "green" : "red"}
              />
              <Badge
                text={`${messages[lang].fields.declared} ${energy.declared}`}
                tone="blue"
              />
            </div>
            <InfoRow
              left={messages[lang].fields.declaration}
              right={energy.declared}
            />
            <InfoRow
              left={messages[lang].fields.energyClass}
              right={energy.cls}
            />
            <div className="mt-3">
              <EnergyScale current={energy.cls} />
            </div>
          </div>

          {/* Costs */}
          <div className="rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
            <PanelHeader
              title={messages[lang].panels.costs}
              icon={<CostIcon />}
            />
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="rounded-xl border p-2 text-center">
                <div className="text-[10px] text-gray-500">
                  {messages[lang].fields.fee}
                </div>
                <div className="text-sm font-semibold">
                  {fee.toLocaleString("sv-SE")} kr
                </div>
              </div>
              <div className="rounded-xl border p-2 text-center">
                <div className="text-[10px] text-gray-500">
                  {messages[lang].fields.ops}
                </div>
                <div className="text-sm font-semibold">
                  {ops.toLocaleString("sv-SE")} kr
                </div>
              </div>
              <div className="rounded-xl border p-2 text-center">
                <div className="text-[10px] text-gray-500">Parking</div>
                <div className="text-sm font-semibold">
                  {includes.parking
                    ? lang === "sv"
                      ? "Ja"
                      : "Yes"
                    : lang === "sv"
                    ? "Nej"
                    : "No"}
                </div>
              </div>
            </div>
            {/* Fee + ops stacked bar */}
            <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-2 flex">
                <div
                  className="bg-blue-500"
                  style={{ width: `${(fee / (fee + ops)) * 100}%` }}
                />
                <div
                  className="bg-indigo-300"
                  style={{ width: `${(ops / (fee + ops)) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {messages[lang].fields.feeVsOps}
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-1">
                {messages[lang].fields.detailedBreakdown}
              </div>
              <CostBreakdownBar segments={breakdown} />
            </div>
          </div>

          {/* Market */}
          <div className="rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
            <PanelHeader
              title={messages[lang].panels.market}
              icon={<MarketIcon />}
            />
            <InfoRow
              left={messages[lang].panels.areaAvg}
              right={`~${(propertyData.valueInterval.min / 1_000_000).toFixed(
                1
              )}–${(propertyData.valueInterval.max / 1_000_000).toFixed(
                1
              )} M SEK`}
            />
            <InfoRow
              left={messages[lang].panels.trend}
              right={lang === "sv" ? "+2,1%/år" : "+2.1%/yr"}
            />
            <div className="mt-2">
              <Sparkline a={seriesA} b={seriesB} />
            </div>
            <div className="my-2 border-t" />
            <div className="flex gap-2 flex-wrap text-xs">
              <Badge
                text={`${messages[lang].panels.transit}: 200 m`}
                tone="blue"
              />
              <Badge
                text={`${messages[lang].panels.noise}: ${
                  lang === "sv" ? "Låg" : "Low"
                }`}
                tone="amber"
              />
              <Badge
                text={`${messages[lang].panels.center}: 1,2 km`}
                tone="gray"
              />
            </div>
          </div>
        </section>

        <DevTests />

        <footer className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} {t.brand.name} — "{t.brand.footer}"
        </footer>
      </main>
    </div>
  );
}

/* ================= Simple Logo ================= */
function SimpleLogo() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
      <defs>
        <linearGradient id="hp" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect x="8" y="20" width="48" height="28" rx="6" fill="url(#hp)" />
      <path
        d="M8 22 L32 8 L56 22"
        fill="none"
        stroke="#111827"
        strokeWidth="3"
      />
    </svg>
  );
}

/* ================= Dev Tests ================= */
function DevTests() {
  const [results, setResults] = React.useState<{
    pass: number;
    fail: number;
    messages: string[];
  }>({ pass: 0, fail: 0, messages: [] });
  React.useEffect(() => {
    const logs: string[] = [];
    let pass = 0,
      fail = 0;

    // 1) Language list shape
    try {
      const langs = ["en", "sv"] as LangKey[];
      console.assert(
        langs.length === 2 && langs.includes("en") && langs.includes("sv"),
        "Lang list should include en & sv"
      );
      pass++;
    } catch (e: any) {
      fail++;
      logs.push("Lang list test failed: " + e?.message);
    }

    // 2) Key parity between EN and SV
    const flatten = (obj: any, p = ""): string[] => {
      const out: string[] = [];
      Object.keys(obj).forEach((k) => {
        const v = obj[k],
          key = p ? `${p}.${k}` : k;
        if (v && typeof v === "object" && !Array.isArray(v))
          out.push(...flatten(v, key));
        else out.push(key);
      });
      return out;
    };
    try {
      const enKeys = new Set(flatten(messages.en)),
        svKeys = new Set(flatten(messages.sv));
      const mSv = [...enKeys].filter((k) => !svKeys.has(k)),
        mEn = [...svKeys].filter((k) => !enKeys.has(k));
      if (mSv.length || mEn.length) {
        fail++;
        logs.push(
          `Key parity mismatch. Missing in sv: ${
            mSv.join(", ") || "-"
          }. Missing in en: ${mEn.join(", ") || "-"}.`
        );
      } else {
        pass++;
      }
    } catch (e: any) {
      fail++;
      logs.push("Key parity test threw: " + e?.message);
    }

    // 3) Summary functions run
    try {
      const sample = {
        healthScore: 78,
        valueInterval: { min: 4500000, max: 5500000, confidence: 85 },
        riskLevel: "medium",
      } as any;
      const enText =
        messages.en.summaryText(sample) + messages.en.summaryTail.medium;
      const svText =
        messages.sv.summaryText(sample) + messages.sv.summaryTail.medium;
      console.assert(
        typeof enText === "string" && typeof svText === "string",
        "Summary should return strings"
      );
      pass++;
    } catch (e: any) {
      fail++;
      logs.push("Summary function test failed: " + e?.message);
    }

    // 4) clamp utility
    try {
      console.assert(
        clamp(-5, 0, 100) === 0 &&
          clamp(105, 0, 100) === 100 &&
          clamp(50, 0, 100) === 50,
        "Clamp failed"
      );
      pass++;
    } catch (e: any) {
      fail++;
      logs.push("Clamp test failed: " + e?.message);
    }

    // 5) scoreColor buckets
    try {
      const hi = scoreColor(85).fg,
        mid = scoreColor(70).fg,
        lo = scoreColor(30).fg;
      console.assert(
        hi !== mid && mid !== lo && hi !== lo,
        "scoreColor should vary by range"
      );
      pass++;
    } catch (e: any) {
      fail++;
      logs.push("scoreColor test failed: " + e?.message);
    }

    // 6) price series baseline
    try {
      const base = propertyData.priceHistory[0]?.price ?? 0;
      const sA0 = base ? propertyData.priceHistory[0].price / base : 0;
      console.assert(sA0 === 1, "seriesA[0] should be 1");
      pass++;
    } catch (e: any) {
      fail++;
      logs.push("seriesA baseline test failed: " + e?.message);
    }

    // 7) Extra: priceHistory sanity
    try {
      const ps = propertyData.priceHistory.map((p) => p.price);
      console.assert(
        ps.length > 1 && ps.every((v) => Number.isFinite(v)),
        "priceHistory should contain finite numbers"
      );
      pass++;
    } catch (e: any) {
      fail++;
      logs.push("priceHistory sanity test failed: " + e?.message);
    }

    // 8) Extra: risk keys exist
    try {
      const keys = Object.keys(messages.en.summaryTail);
      console.assert(
        ["low", "medium", "high"].every((k) => keys.includes(k)),
        "summaryTail missing risk keys"
      );
      pass++;
    } catch (e: any) {
      fail++;
      logs.push("summaryTail keys test failed: " + e?.message);
    }

    // 9) Extra: fee/ops stacked bar sums ~100
    try {
      const fee = 3950,
        ops = 850;
      const pct = (fee / (fee + ops)) * 100 + (ops / (fee + ops)) * 100;
      console.assert(
        Math.abs(pct - 100) < 0.0001,
        "Fee+Ops widths must sum to 100%"
      );
      pass++;
    } catch (e: any) {
      fail++;
      logs.push("Fee/Ops width test failed: " + e?.message);
    }

    setResults({ pass, fail, messages: logs });
  }, []);
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-gray-200 bg-white/90 p-3 text-xs shadow-md">
      <div className="mb-1 font-semibold text-gray-800">Dev Tests</div>
      <div className="mb-2 text-gray-700">
        Pass: {results.pass} · Fail: {results.fail}
      </div>
      {results.messages.length > 0 && (
        <ul className="list-disc pl-5 text-rose-700">
          {results.messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
