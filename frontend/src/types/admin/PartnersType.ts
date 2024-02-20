export interface Partner {
  id: number;
  name: string;
  img: string;
  link: string;
  created_at: string;
}

export interface Data {
  count: number;
  next: any;
  previous: any;
  results: Partner[];
}

export interface PartnerAdmin {
  data: Data;
}
