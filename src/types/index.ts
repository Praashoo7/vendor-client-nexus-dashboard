
export interface Vendor {
  id: string;
  name: string;
  categoryPrices: { [category: string]: number };
  created_at?: string;
  updated_at?: string;
}

export interface VendorCategory {
  id: string;
  vendor_id: string;
  category: string;
  price: number;
  created_at?: string;
}

export interface Event {
  id: string;
  client_id: string;
  event_name: string;
  category: string;
  vendor_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  name: string;
  contact_no: string;
  events: Event[];
  totalCost: number;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseStats {
  totalVendors: number;
  totalClients: number;
  totalEvents: number;
  totalEarnings: number;
}
