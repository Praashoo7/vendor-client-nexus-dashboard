
export interface Vendor {
  id: number;
  name: string;
  categories: string; // comma-separated string
  price: number;
}

export interface Event {
  id: number;
  clientId: number;
  eventName: string;
  category: string; // comma-separated string
  vendorId: number;
}

export interface Client {
  id: number;
  name: string;
  contactNo: string;
  events: Event[];
  totalCost: number;
}
