
import React, { useState, useEffect } from 'react';
import VendorModal from '@/components/VendorModal';
import ClientModal from '@/components/ClientModal';
import EventModal from '@/components/EventModal';
import VendorTable from '@/components/VendorTable';
import ClientTable from '@/components/ClientTable';
import DashboardStats from '@/components/DashboardStats';
import { Vendor, Client, Event } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import {
  fetchVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  fetchDashboardStats
} from '@/services/database';

const Index = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [pendingEvents, setPendingEvents] = useState<Partial<Event>[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [pendingClientData, setPendingClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load data from database
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vendorsData, clientsData] = await Promise.all([
        fetchVendors(),
        fetchClients()
      ]);
      setVendors(vendorsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ title: 'Error loading data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSubmit = async (vendorData: Omit<Vendor, 'id'>) => {
    try {
      if (editingVendor) {
        const updatedVendor = await updateVendor(editingVendor.id, vendorData);
        setVendors(vendors.map(v => v.id === editingVendor.id ? updatedVendor : v));
        toast({ title: 'Vendor updated successfully' });
      } else {
        const newVendor = await createVendor(vendorData);
        setVendors([...vendors, newVendor]);
        toast({ title: 'Vendor added successfully' });
      }
      setIsVendorModalOpen(false);
      setEditingVendor(null);
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast({ title: 'Error saving vendor', variant: 'destructive' });
    }
  };

  const handleClientSubmit = async (clientData: any) => {
    if (editingClient) {
      // Handle client update - collect events first
      setPendingClientData({ ...clientData, isUpdate: true, clientId: editingClient.id });
      const events = Array.from({ length: clientData.numberOfEvents }, (_, i) => ({
        event_name: editingClient.events[i]?.event_name || '',
        category: editingClient.events[i]?.category || '',
        vendor_id: editingClient.events[i]?.vendor_id || null
      }));
      setPendingEvents(events);
      setCurrentEventIndex(0);
      setIsClientModalOpen(false);
      setIsEventModalOpen(true);
    } else {
      // Handle new client creation
      setPendingClientData(clientData);
      const events = Array.from({ length: clientData.numberOfEvents }, (_, i) => ({
        event_name: '',
        category: '',
        vendor_id: null
      }));
      setPendingEvents(events);
      setCurrentEventIndex(0);
      setIsClientModalOpen(false);
      setIsEventModalOpen(true);
    }
  };

  const handleEventSubmit = async (eventData: Partial<Event>) => {
    const updatedEvents = [...pendingEvents];
    updatedEvents[currentEventIndex] = eventData;
    setPendingEvents(updatedEvents);

    if (currentEventIndex < pendingEvents.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    } else {
      // All events completed, save client
      try {
        if (pendingClientData.isUpdate) {
          // Update existing client
          const updatedClient = await updateClient(
            pendingClientData.clientId,
            { name: pendingClientData.name, contact_no: pendingClientData.contactNo },
            updatedEvents
          );
          setClients(clients.map(c => c.id === pendingClientData.clientId ? updatedClient : c));
          toast({ title: 'Client updated successfully' });
        } else {
          // Create new client
          const newClient = await createClient(
            { name: pendingClientData.name, contact_no: pendingClientData.contactNo },
            updatedEvents
          );
          setClients([...clients, newClient]);
          toast({ title: 'Client added successfully' });
        }
        resetEventModal();
      } catch (error) {
        console.error('Error saving client:', error);
        toast({ title: 'Error saving client', variant: 'destructive' });
      }
    }
  };

  const resetEventModal = () => {
    setIsEventModalOpen(false);
    setPendingEvents([]);
    setCurrentEventIndex(0);
    setPendingClientData(null);
    setEditingClient(null);
  };

  const handleDeleteVendor = async (id: string) => {
    try {
      await deleteVendor(id);
      setVendors(vendors.filter(v => v.id !== id));
      toast({ title: 'Vendor deleted successfully' });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({ title: 'Error deleting vendor', variant: 'destructive' });
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
      toast({ title: 'Client deleted successfully' });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({ title: 'Error deleting client', variant: 'destructive' });
    }
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsVendorModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Vendor & Client Dashboard
          </h1>
          <p className="text-gray-600">Manage your vendors and clients efficiently</p>
        </div>

        {/* Dashboard Statistics */}
        <DashboardStats vendors={vendors} clients={clients} />

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setIsVendorModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            Add Vendor
          </button>
          <button
            onClick={() => setIsClientModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            Add Client
          </button>
          <Link
            to="/graph"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            View Graph
          </Link>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vendors</h2>
            <VendorTable
              vendors={vendors}
              onEdit={handleEditVendor}
              onDelete={handleDeleteVendor}
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Clients</h2>
            <ClientTable
              clients={clients}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
            />
          </div>
        </div>

        {/* Modals */}
        <VendorModal
          isOpen={isVendorModalOpen}
          onClose={() => {
            setIsVendorModalOpen(false);
            setEditingVendor(null);
          }}
          onSubmit={handleVendorSubmit}
          initialData={editingVendor}
        />

        <ClientModal
          isOpen={isClientModalOpen}
          onClose={() => {
            setIsClientModalOpen(false);
            setEditingClient(null);
          }}
          onSubmit={handleClientSubmit}
          initialData={editingClient}
        />

        <EventModal
          isOpen={isEventModalOpen}
          onClose={resetEventModal}
          onSubmit={handleEventSubmit}
          vendors={vendors}
          eventNumber={currentEventIndex + 1}
          totalEvents={pendingEvents.length}
        />
      </div>
    </div>
  );
};

export default Index;
