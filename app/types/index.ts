export interface EnergyDeclarationResponse {
  energideklarationer: EnergyDeclaration[];
}

export interface EnergyDeclaration {
  id: number;
  energiklass: string;
  primarenergital?: string;
  energiprestanda?: string;
  radonmatning?: string;
  ventilationskontroll?: string;
  byggnadsar: number;
  utförd?: string;
  fastigheter: Fastighet[];
}

export interface Fastighet {
  kommun: string;
  fastighetsbeteckning: string;
  adresser: FastighetsAdress[];
}

export interface FastighetsAdress {
  adress: string;
  postnummer: string;
  postort: string;
}

// 2️⃣ Parsed OCR / Document
export interface ParsedDocumentResponse {
  ok: boolean;
  used_ocr: boolean;
  sha256: string;
  raw_text_preview?: string;
  parsed?: ParsedFields;
}

export interface ParsedFields {
  A_Blankett?: {
    fastighetsbeteckning?: string;
    gata?: string;
    postnr?: string;
    ort?: string;
  };
  // other sections could be added here
}

// 3️⃣ Real Estate Sale Record
export interface PropertySaleResponse {
  id: string;
  broker?: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  housingForm?: number;
  isPreOwned?: boolean;
  price?: {
    amount: number;
    currency: string;
  };
  soldAt?: string;
  tenure?: string;
  apartmentNumber?: string;
  floor?: number;
  livingArea?: number;
  monthlyFee?: {
    amount: number;
    currency: string;
  };
  numberOfRooms?: number;
  postCode?: string;
  postalArea?: string;
  streetAddress?: string;
  constructionSpan?: string;
  cooperativeRegistrationNumber?: string;
}
