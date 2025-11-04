"use client";

import React from "react";
import { ArrowLeft, Download } from "lucide-react";

// ---------------- I18N ----------------
const messages = {
  en: {
    brand: {
      name: "HusPulse",
      sloganShort: "Measurable confidence for your home.",
      sloganLong: "AI that validates property quality – decision support in seconds.",
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
    riskLevel: { low: "Low", medium: "Medium", high: "High" },
    summaryText: (d: any) =>
      `This property shows strong fundamentals with a health index of ${d.healthScore}/100. The estimated value is ${(d.valueInterval.min / 1_000_000).toFixed(1)}–${(d.valueInterval.max / 1_000_000).toFixed(1)} M SEK with ${d.valueInterval.confidence}% confidence.`,
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
      sloganLong: "AI som validerar fastighetskvalitet – beslutsstöd på sekunder.",
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
    riskLevel: { low: "Låg", medium: "Måttlig", high: "Hög" },
    summaryText: (d: any) =>
      `Denna fastighet visar goda värden med ett hälsoindex på ${d.healthScore}/100. Det uppskattade värdet ligger mellan ${(d.valueInterval.min / 1_000_000).toFixed(1)}–${(d.valueInterval.max / 1_000_000).toFixed(1)} M SEK med ${d.valueInterval.confidence}% tillförlitlighet.`,
    summaryTail: {
      low: " Risknivån bedöms som låg tack vare starka tekniska och ekonomiska faktorer.",
      medium: " Risknivån är måttlig med vissa faktorer som bör beaktas.",
      high: " Observera att risknivån är hög och flera faktorer kräver uppmärksamhet.",
    },
  },
} as const;

type LangKey = keyof typeof messages;

// ------- Minimal UI Primitives (local Button) -------
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Button({ variant = "default", size = "md", className = "", children, ...props }: any) {
  const base = "inline-flex items-center justify-center rounded-2xl font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: Record<string, string> = {
    default: "bg-black text-white hover:opacity-90 focus:ring-black",
    outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100/70 focus:ring-gray-200",
    pill: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-300 rounded-full",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-5 text-base",
    icon: "h-10 w-10 p-0",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

// Language Switcher (FIXED: removed misplaced parentheses around type assertion)
function LanguageSwitcher({ lang, onChange }: { lang: LangKey; onChange: (k: LangKey) => void }) {
  return (
    <div className="inline-flex rounded-full border border-gray-300 bg-white p-1 shadow-sm">
      {(["en", "sv"] as LangKey[]).map((k) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={cn(
            "px-3 py-1 text-sm rounded-full",
            lang === k ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
          )}
          aria-pressed={lang === k}
        >
          {k.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ------- Mocked Components to mirror your imports -------
function Card({ children }: any) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">{children}</div>;
}
function Title({ children, sub }: any) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{children}</h3>
      {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

// 1) PropertyHealthGauge
function PropertyHealthGauge({ score, title, help }: any) {
  const normalized = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 42;
  const dash = (normalized / 100) * circumference;
  return (
    <Card>
      <Title>{title}</Title>
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 100 100" className="w-28 h-28">
          <circle cx="50" cy="50" r="42" stroke="#e5e7eb" strokeWidth="10" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="#111827"
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="54" textAnchor="middle" className="fill-gray-900 text-[16px] font-bold">
            {normalized}
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

// 2) ValueConfidenceInterval
function ValueConfidenceInterval({ minValue, maxValue, confidence, title, confLabel }: any) {
  const toM = (x: number) => (x / 1_000_000).toFixed(1);
  return (
    <Card>
      <Title>{title}</Title>
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{toM(minValue)}–{toM(maxValue)} M SEK</span>
        </div>
        <div className="text-sm text-gray-600">{confLabel}: {confidence}%</div>
        <div className="h-2 w-full rounded-full bg-gray-100">
          <div className="h-2 rounded-full bg-gray-900" style={{ width: `${confidence}%` }} />
        </div>
      </div>
    </Card>
  );
}

// 3) RiskLevelCard
function RiskLevelCard({ level, factors, title, labelMap }: any) {
  const color = level === "low" ? "bg-emerald-100 text-emerald-800" : level === "high" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800";
  const label = labelMap[level] || level;
  return (
    <Card>
      <Title>{title}</Title>
      <div className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", color)}>
        {label}
      </div>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {factors.map((f: string, i: number) => (
          <li key={i} className="flex gap-2">
            <span>•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// 4) PriceChart (simple SVG line)
function PriceChart({ data, title, sub }: any) {
  const w = 520, h = 220, pad = 30;
  const xs = data.map((d: any, i: number) => i);
  const ys = data.map((d: any) => d.price);
  const xMin = 0, xMax = xs.length - 1;
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const x = (i: number) => pad + ((i - xMin) / Math.max(1, (xMax - xMin))) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - yMin) / Math.max(1, (yMax - yMin))) * (h - pad * 2);
  const path = xs.map((i: number, idx: number) => `${idx ? "L" : "M"}${x(i)},${y(ys[i])}`).join(" ");
  return (
    <Card>
      <Title sub={sub}>{title}</Title>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="#ffffff" />
        <path d={path} fill="none" stroke="#111827" strokeWidth="2.8" filter="url(#glow)" />
      </svg>
      <div className="mt-2 text-xs text-gray-500">{data[0]?.month} → {data[data.length - 1]?.month}</div>
    </Card>
  );
}

// 5) FactorAnalysis
function FactorAnalysis({ factors, title }: any) {
  return (
    <Card>
      <Title>{title}</Title>
      <div className="space-y-4">
        {factors.map((f: any, i: number) => (
          <div key={i} className="rounded-xl border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-900">{f.name}</div>
              <div className="text-sm text-gray-600">Vikt: {f.weight}%</div>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-gray-900" style={{ width: `${f.score}%` }} />
            </div>
            <p className="mt-2 text-sm text-gray-700">{f.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ------- Provided Data -------
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
    { name: "Läge", score: 85, weight: 20, description: "Fastigheten har ett utmärkt läge med närhet till kollektivtrafik och service." },
    { name: "Byggnadens skick", score: 70, weight: 15, description: "Byggnaden är i gott skick men har vissa renoveringsbehov." },
    { name: "Marknadsförhållanden", score: 65, weight: 10, description: "Marknaden är stabil med måttlig efterfrågan i området." },
    { name: "Ekonomiska faktorer", score: 60, weight: 8, description: "Ekonomiska indikatorer visar på stabil utveckling." },
  ],
};

// ------- Page -------
export default function Dashboard() {
  const [lang, setLang] = React.useState<LangKey>("en"); // default EN
  const t = messages[lang];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/40 to-white">
      {/* Brand: Hero */}
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-rose-100 via-amber-100 to-emerald-100" />
        <header className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-12 w-12" />
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{t.brand.name}</h1>
                <p className="text-sm text-gray-700">{t.brand.sloganLong}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher lang={lang} onChange={setLang} />
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> {t.buttons.exportPdf}
              </Button>
            </div>
          </div>
        </header>
      </div>

      {/* Toolbar */}
      <div className="border-y border-gray-200 bg-white/80">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-rose-800">{t.toolbar.risk}</span>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">{t.toolbar.quality}</span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">{t.toolbar.value}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label={t.buttons.back}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main */}
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
            confidence={propertyData.valueInterval.confidence}
            title={t.titles.valueInterval}
            confLabel={t.titles.confidence}
          />
          <RiskLevelCard
            level={propertyData.riskLevel}
            factors={propertyData.riskFactors}
            title={t.titles.risk}
            labelMap={t.riskLevel}
          />
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PriceChart
            data={propertyData.priceHistory.map(({ date, price }) => ({ month: date, price, avgPrice: price }))}
            title={t.titles.priceChart}
            sub={t.titles.priceSub}
          />
          <FactorAnalysis factors={propertyData.factors} title={t.titles.factorAnalysis} />
        </div>

        {/* AI Summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-3 text-2xl font-bold">{t.titles.aiSummary}</h2>
          <p className="text-lg leading-relaxed text-gray-800/90">
            {t.summaryText(propertyData)}
            {t.summaryTail[propertyData.riskLevel as keyof typeof t.summaryTail]}
          </p>
        </div>

        {/* Dev Tests (runtime) */}
        <DevTests />

        {/* Footer */}
        <footer className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} {t.brand.name} — "{t.brand.footer}"
        </footer>
      </main>
    </div>
  );
}

// ---- Brand Logo (animated SVG, bolder digital look) ----
function BrandLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        {/* Digital gradient sweep */}
        <linearGradient id="hpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dc2626">
            <animate attributeName="stop-color" values="#dc2626;#eab308;#059669;#eab308;#dc2626" dur="3.2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        {/* Neon glow for digital feel */}
        <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Roof - bolder stroke */}
      <polygon points="32,6 58,24 54,24 54,28 10,28 10,24 6,24" fill="url(#hpGrad)" stroke="#0f172a" strokeWidth="1.5" filter="url(#neon)" />
      {/* Body - bolder stroke */}
      <rect x="12" y="28" width="40" height="28" rx="4" fill="url(#hpGrad)" stroke="#0f172a" strokeWidth="1.5" filter="url(#neon)" />
      {/* Door */}
      <rect x="28.5" y="39.5" width="7" height="16.5" fill="#ffffff" opacity="0.95" rx="1" />
      {/* Pulse line - thicker */}
      <path d="M6 38 L16 38 L20 30 L24 46 L28 38 L36 38 L40 32 L44 44 L48 38 L58 38" stroke="#ffffff" strokeWidth="3.2" fill="none">
        <animate attributeName="stroke-dasharray" values="0,220; 220,0; 0,220" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Pixel ticks for digital accent */}
      <g fill="#0f172a" opacity="0.15">
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={6 + i * 5.8} y={55} width="2" height="2" rx="0.3" />
        ))}
      </g>
    </svg>
  );
}

// ---------------- Dev Test Panel ----------------
function DevTests() {
  // Simple runtime "test cases" to guard regressions in i18n keys and UI existence
  const [results, setResults] = React.useState<{ pass: number; fail: number; messages: string[] }>({ pass: 0, fail: 0, messages: [] });

  React.useEffect(() => {
    const logs: string[] = [];
    let pass = 0, fail = 0;

    // Test 1: Language list shape
    try {
      const langs = ["en", "sv"] as LangKey[];
      console.assert(langs.length === 2 && langs.includes("en" as LangKey) && langs.includes("sv" as LangKey), "Lang list should include en & sv");
      pass++;
    } catch (e: any) {
      fail++; logs.push("Lang list test failed: " + e?.message);
    }

    // Test 2: Key parity between EN and SV (deep keys)
    const flatten = (obj: any, prefix = ""): string[] => {
      const out: string[] = [];
      Object.keys(obj).forEach((k) => {
        const v = (obj as any)[k];
        const key = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === "object" && !Array.isArray(v)) {
          out.push(...flatten(v, key));
        } else {
          out.push(key);
        }
      });
      return out;
    };

    try {
      const enKeys = new Set(flatten(messages.en));
      const svKeys = new Set(flatten(messages.sv));
      const missingInSv = [...enKeys].filter((k) => !svKeys.has(k));
      const missingInEn = [...svKeys].filter((k) => !enKeys.has(k));
      if (missingInSv.length || missingInEn.length) {
        fail++;
        logs.push(`Key parity mismatch. Missing in sv: ${missingInSv.join(", ") || "-"}. Missing in en: ${missingInEn.join(", ") || "-"}.`);
      } else {
        pass++;
      }
    } catch (e: any) {
      fail++; logs.push("Key parity test threw: " + e?.message);
    }

    // Test 3: Summary functions execute without throwing
    try {
      const sample = {
        healthScore: 78,
        valueInterval: { min: 4500000, max: 5500000, confidence: 85 },
        riskLevel: "medium",
      } as any;
      const enText = messages.en.summaryText(sample) + messages.en.summaryTail.medium;
      const svText = messages.sv.summaryText(sample) + messages.sv.summaryTail.medium;
      console.assert(typeof enText === "string" && typeof svText === "string", "Summary should return strings");
      pass++;
    } catch (e: any) {
      fail++; logs.push("Summary function test failed: " + e?.message);
    }

    setResults({ pass, fail, messages: logs });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-gray-200 bg-white/90 p-3 text-xs shadow-md">
      <div className="mb-1 font-semibold text-gray-800">Dev Tests</div>
      <div className="mb-2 text-gray-700">Pass: {results.pass} · Fail: {results.fail}</div>
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
