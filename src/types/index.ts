
export interface Vendor {
  id: number;
  name: string;
  categoryPrices: { [category: string]: number }; // Changed from categories and price
}

export interface Event {
  id: number;
  clientId: number;
  eventName: string;
  categories: string[]; // Changed to array for multiple categories
  vendorId: number;
}

export interface Client {
  id: number;
  name: string;
  contactNo: string;
  events: Event[];
  totalCost: number;
}
