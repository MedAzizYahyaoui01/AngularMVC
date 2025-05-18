export interface DevisItem {
  id: number;
  partNumber: string;
  description: string;
  qty: number;
  amount: number;
  date: string;
  bin: string;
  eta: string;
  orderNumber: string;
  accepted?: boolean;
}


export interface Devis {
  devisId: number;
  items: DevisItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}
