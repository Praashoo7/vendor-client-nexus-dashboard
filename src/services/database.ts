
import { supabase } from '@/integrations/supabase/client';
import { Vendor, Client, Event, VendorCategory, DatabaseStats } from '@/types';

// Vendor operations
export const fetchVendors = async (): Promise<Vendor[]> => {
  const { data: vendors, error: vendorsError } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: true });

  if (vendorsError) throw vendorsError;

  const { data: categories, error: categoriesError } = await supabase
    .from('vendor_categories')
    .select('*');

  if (categoriesError) throw categoriesError;

  return vendors.map(vendor => ({
    ...vendor,
    categoryPrices: categories
      .filter(cat => cat.vendor_id === vendor.id)
      .reduce((acc, cat) => ({ ...acc, [cat.category]: Number(cat.price) }), {})
  }));
};

export const createVendor = async (vendorData: Omit<Vendor, 'id'>): Promise<Vendor> => {
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .insert({ name: vendorData.name })
    .select()
    .single();

  if (vendorError) throw vendorError;

  // Insert categories
  const categoryInserts = Object.entries(vendorData.categoryPrices).map(([category, price]) => ({
    vendor_id: vendor.id,
    category,
    price: Number(price)
  }));

  if (categoryInserts.length > 0) {
    const { error: categoriesError } = await supabase
      .from('vendor_categories')
      .insert(categoryInserts);

    if (categoriesError) throw categoriesError;
  }

  return { ...vendor, categoryPrices: vendorData.categoryPrices };
};

export const updateVendor = async (id: string, vendorData: Omit<Vendor, 'id'>): Promise<Vendor> => {
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .update({ name: vendorData.name })
    .eq('id', id)
    .select()
    .single();

  if (vendorError) throw vendorError;

  // Delete existing categories
  await supabase.from('vendor_categories').delete().eq('vendor_id', id);

  // Insert new categories
  const categoryInserts = Object.entries(vendorData.categoryPrices).map(([category, price]) => ({
    vendor_id: id,
    category,
    price: Number(price)
  }));

  if (categoryInserts.length > 0) {
    const { error: categoriesError } = await supabase
      .from('vendor_categories')
      .insert(categoryInserts);

    if (categoriesError) throw categoriesError;
  }

  return { ...vendor, categoryPrices: vendorData.categoryPrices };
};

export const deleteVendor = async (id: string): Promise<void> => {
  const { error } = await supabase.from('vendors').delete().eq('id', id);
  if (error) throw error;
};

// Client operations
export const fetchClients = async (): Promise<Client[]> => {
  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: true });

  if (clientsError) throw clientsError;

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*');

  if (eventsError) throw eventsError;

  const { data: vendors, error: vendorsError } = await supabase
    .from('vendors')
    .select('id, name');

  if (vendorsError) throw vendorsError;

  const { data: categories, error: categoriesError } = await supabase
    .from('vendor_categories')
    .select('*');

  if (categoriesError) throw categoriesError;

  return clients.map(client => {
    const clientEvents = events.filter(event => event.client_id === client.id);
    
    const totalCost = clientEvents.reduce((sum, event) => {
      if (event.vendor_id) {
        const category = categories.find(cat => 
          cat.vendor_id === event.vendor_id && cat.category === event.category
        );
        return sum + (category ? Number(category.price) : 0);
      }
      return sum;
    }, 0);

    return {
      ...client,
      events: clientEvents,
      totalCost
    };
  });
};

export const createClient = async (clientData: { name: string; contact_no: string }, eventsData: Partial<Event>[]): Promise<Client> => {
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert(clientData)
    .select()
    .single();

  if (clientError) throw clientError;

  // Insert events
  const eventInserts = eventsData.map(event => ({
    client_id: client.id,
    event_name: event.event_name || '',
    category: event.category || '',
    vendor_id: event.vendor_id || null
  }));

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .insert(eventInserts)
    .select();

  if (eventsError) throw eventsError;

  // Calculate total cost
  const { data: categories } = await supabase
    .from('vendor_categories')
    .select('*')
    .in('vendor_id', events.map(e => e.vendor_id).filter(Boolean));

  const totalCost = events.reduce((sum, event) => {
    if (event.vendor_id) {
      const category = categories?.find(cat => 
        cat.vendor_id === event.vendor_id && cat.category === event.category
      );
      return sum + (category ? Number(category.price) : 0);
    }
    return sum;
  }, 0);

  return {
    ...client,
    events: events || [],
    totalCost
  };
};

export const updateClient = async (id: string, clientData: { name: string; contact_no: string }, eventsData: Partial<Event>[]): Promise<Client> => {
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', id)
    .select()
    .single();

  if (clientError) throw clientError;

  // Delete existing events
  await supabase.from('events').delete().eq('client_id', id);

  // Insert new events
  const eventInserts = eventsData.map(event => ({
    client_id: id,
    event_name: event.event_name || '',
    category: event.category || '',
    vendor_id: event.vendor_id || null
  }));

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .insert(eventInserts)
    .select();

  if (eventsError) throw eventsError;

  // Calculate total cost
  const { data: categories } = await supabase
    .from('vendor_categories')
    .select('*')
    .in('vendor_id', events.map(e => e.vendor_id).filter(Boolean));

  const totalCost = events.reduce((sum, event) => {
    if (event.vendor_id) {
      const category = categories?.find(cat => 
        cat.vendor_id === event.vendor_id && cat.category === event.category
      );
      return sum + (category ? Number(category.price) : 0);
    }
    return sum;
  }, 0);

  return {
    ...client,
    events: events || [],
    totalCost
  };
};

export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw error;
};

// Stats operations
export const fetchDashboardStats = async (): Promise<DatabaseStats> => {
  const [vendorsResult, clientsResult, eventsResult] = await Promise.all([
    supabase.from('vendors').select('id', { count: 'exact', head: true }),
    supabase.from('clients').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true })
  ]);

  // Calculate total earnings
  const clients = await fetchClients(); // Fixed: removed .data property access
  const totalEarnings = clients.reduce((sum, client) => sum + client.totalCost, 0);

  return {
    totalVendors: vendorsResult.count || 0,
    totalClients: clientsResult.count || 0,
    totalEvents: eventsResult.count || 0,
    totalEarnings
  };
};
