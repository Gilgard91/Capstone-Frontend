export interface Region {
  id: number;
  name: string;
  country: Country;
}

export interface Country {
  id: number;
  code: string;
  name: string;
}
