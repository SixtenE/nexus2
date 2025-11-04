"use server";

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function greet(name: string): Promise<string> {
  const result = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a poet." },
      { role: "user", content: `Write a poem about ${name}.` },
    ],
  });

  return result.choices[0].message.content ?? "Unable to generate poem.";
}

function normalizeStreet(s: string) {
  return s.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}
const HEMNET_URL =
  "https://raw.githubusercontent.com/SixtenE/nexus/refs/heads/main/data/mock_sales_100.json";
const BOLAGSVERKET_URL =
  "https://raw.githubusercontent.com/SixtenE/nexus/refs/heads/main/data/boverket_stockholm_100.json";
const TECHNICAL_URL =
  "https://raw.githubusercontent.com/SixtenE/nexus/refs/heads/main/data/mock_hvac_100.json";

export async function getHemnetData(address: string) {
  const res = await fetch(HEMNET_URL);
  const data = await res.json();
  const target = normalizeStreet(address);
  return data.filter(
    (p: any) =>
      typeof p.streetAddress === "string" &&
      normalizeStreet(p.streetAddress) === target
  );
}

export async function getPropertyDetails(address: string) {
  const res = await fetch(BOLAGSVERKET_URL);
  const data = await res.json();
  const target = normalizeStreet(address);

  return data.filter(
    (p: any) =>
      typeof p.address === "string" && normalizeStreet(p.address) === target
  );
}

export async function getTechnicalData(address: string) {
  const res = await fetch(TECHNICAL_URL);
  const data = await res.json();
  const target = normalizeStreet(address);

  return data.filter(
    (p: any) =>
      typeof p.address === "string" && normalizeStreet(p.address) === target
  );
}

export type PropertyDetails = {
  energiklass: string;
  primarenergital?: string;
  energiprestanda?: string;
  radonmatning?: string;
  ventilationskontroll?: string;
  byggnadsar: number;
};

export type MarketData = {
  propertyPrice: number; // this property's sale price
  saleDate: string;
  streetSales: {
    amount: number;
    soldAt: string;
    livingArea: number;
    numberOfRooms: number;
  }[];
  livingArea: number;
};

export type TechnicalData = {
  sfp_kw_per_m3s: number;
  proj_floede_ls?: number;
  uppm_floede_ls?: number;
  tilluft_filterklass?: string;
  franluft_filterklass?: string;
};

export type ValueInterval = {
  minValue: number;
  maxValue: number;
  confidence: number; // percentage
};

export async function calculateValue(input: {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  technicalData: TechnicalData;
}): Promise<ValueInterval> {
  const { propertyDetails, marketData, technicalData } = input;

  if (!propertyDetails || !marketData || !technicalData) {
    throw new Error(
      "Missing required input data: propertyDetails, marketData, or technicalData is undefined"
    );
  }

  const currentYear = new Date().getFullYear();
  const propertyArea = marketData.livingArea;

  // 1️⃣ Base price from this property's sale
  let basePrice = marketData.propertyPrice;

  // 2️⃣ Street average price per m²
  const streetPricesPerM2 = (marketData.streetSales || []).map(
    (s) => s.amount / s.livingArea
  );
  const avgStreetPricePerM2 =
    streetPricesPerM2.reduce((sum, val) => sum + val, 0) /
    streetPricesPerM2.length;

  // Adjust property price towards street average
  const propertyPricePerM2 = basePrice / propertyArea;
  const adjustmentFactor = avgStreetPricePerM2 / propertyPricePerM2;
  basePrice *= adjustmentFactor;

  // 3️⃣ Energy class adjustment
  const energyFactor: Record<string, number> = {
    A: 1.05,
    B: 1.03,
    C: 1.0,
    D: 0.97,
    E: 0.95,
  };
  basePrice *= energyFactor[propertyDetails.energiklass] ?? 1;

  // 4️⃣ Building age adjustment
  const age = currentYear - propertyDetails.byggnadsar;
  if (age < 10) basePrice *= 1.05;
  else if (age > 40) basePrice *= 0.85;

  // 5️⃣ Technical system adjustment
  if (technicalData.sfp_kw_per_m3s && technicalData.sfp_kw_per_m3s > 2) {
    basePrice *= 0.95; // lower efficiency reduces value
  }

  // 6️⃣ Temporal adjustment using last sale date
  const lastSaleYear = new Date(marketData.saleDate).getFullYear();
  const yearsSinceSale = currentYear - lastSaleYear;
  const annualGrowthRate = 0.03; // 3% per year
  basePrice *= Math.pow(1 + annualGrowthRate, yearsSinceSale);

  // 7️⃣ Confidence interval based on number of comparables
  const comparablesCount = marketData.streetSales.length;
  const confidence = Math.min(0.9, 0.8 + 0.02 * comparablesCount); // more comparables = higher confidence
  const minValue = basePrice * (1 - (1 - confidence) / 2);
  const maxValue = basePrice * (1 + (1 - confidence) / 2);

  return {
    minValue,
    maxValue,
    confidence: confidence * 100,
  };
}

export async function mock() {
  const mockPropertyData = {
    address: "Strandvägen 45, Stockholm",
    healthScore: 78,
    valueInterval: {
      min: 3200000,
      max: 3600000,
      confidence: 87,
    },
    riskLevel: "low" as const,
    riskFactors: [
      "Energiklass B - god energiprestanda",
      "Senaste OVK godkänd för 6 månader sedan",
      "Avgift 15% under områdets snitt",
      "Stambyte genomfört 2019",
    ],
    priceHistory: [
      { month: "Jan 23", price: 3100000, avgPrice: 2900000 },
      { month: "Mar 23", price: 3150000, avgPrice: 2950000 },
      { month: "Maj 23", price: 3200000, avgPrice: 3000000 },
      { month: "Jul 23", price: 3250000, avgPrice: 3050000 },
      { month: "Sep 23", price: 3300000, avgPrice: 3100000 },
      { month: "Nov 23", price: 3350000, avgPrice: 3150000 },
      { month: "Jan 24", price: 3400000, avgPrice: 3200000 },
    ],
    factors: [
      {
        name: "Byggnadstekniskt",
        score: 85,
        weight: 20,
        description: "Energiklass B, OVK godkänd, låg radonnivå",
        details:
          "Fastigheten har genomgått omfattande energioptimering med nya fönster 2020 och tilläggsisolering av vind. OVK-besiktning visar inga anmärkningar.",
      },
      {
        name: "Ekonomi",
        score: 72,
        weight: 30,
        description:
          "Måttlig avgift, stabil driftskostnad, värdering över taxering",
        details:
          "Månadsavgiften på 4,850 SEK/månad är 15% lägre än områdessnitt. Driftskostnaderna har varit stabila de senaste 5 åren. Senaste taxeringsvärde: 2.8M SEK.",
      },
      {
        name: "Läge & Bekvämlighet",
        score: 90,
        weight: 15,
        description: "Utmärkt läge med närhet till centrum och kollektivtrafik",
        details:
          "150m till tunnelbana, 5 min promenad till centrum. Garage ingår. Låg bullernivå (<50 dB). Grönområde 100m från fastigheten.",
      },
      {
        name: "Underhåll & Renovering",
        score: 80,
        weight: 15,
        description:
          "Större renoveringar genomförda, planerat underhåll positivt",
        details:
          "Stambyte 2019, fasadrenovering 2018, nytt tak 2017. Balkong renoverad 2021. Ventilationssystem uppgraderat 2020. Inget akut underhåll planerat.",
      },
      {
        name: "Miljö & Energi",
        score: 88,
        weight: 10,
        description: "Låga CO₂-utsläpp, fjärrvärme, hög energieffektivitet",
        details:
          "CO₂-utsläpp: 8 kg/m²/år (betydligt under genomsnitt). Fjärrvärme med grön energi. Energiförbrukning: 85 kWh/m²/år.",
      },
      {
        name: "Marknadsindikatorer",
        score: 75,
        weight: 10,
        description: "Positiv prisutveckling i området, stabil marknad",
        details:
          "Området har visat 9.7% prisökning senaste 12 månaderna. Snittlig försäljningstid: 18 dagar. Få konkurrerande objekt på marknaden.",
      },
    ],
  };
  return mockPropertyData;
}
