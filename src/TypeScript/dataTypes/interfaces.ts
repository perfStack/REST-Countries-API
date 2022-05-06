interface currencies {
  currency: { [key: string]: { name: string; symbol: string } };
}

export interface APIData {
  readonly borders?: string[];
  readonly capital?: string[];
  readonly cca3: string;
  readonly currencies?: Record<string, currencies['currency']>;
  readonly flags: { png: string; svg: string };
  readonly languages: { [key: string]: string };
  readonly name: {
    common: string;
    official: string;
    nativeName: { [key: string]: { official: string; common: string } };
  };
  readonly population: number;
  readonly region: string;
  readonly subregion: string;
  readonly tld?: string[];
}
