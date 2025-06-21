
import React, { useState, useEffect } from 'react';
import VendorModal from '@/components/VendorModal';
import ClientModal from '@/components/ClientModal';
import EventModal from '@/components/EventModal';
import VendorTable from '@/components/VendorTable';
import ClientTable from '@/components/ClientTable';
import DashboardStats from '@/components/DashboardStats';
import { Vendor, Client, Event } from '@/types';
import { toast } from '@/hooks/use-toast';

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

  // Load initial data
  useEffect(() => {
    loadVendors();
    loadClients();
  }, []);

  const loadVendors = async () => {
    try {
      // Mock data for demonstration
      const mockVendors: Vendor[] = [
        { id: 1, name: 'Elite Catering', categories: 'catering,food', price: 5000 },
        { id: 2, name: 'Perfect Photos', categories: 'photography', price: 3000 },
        { id: 3, name: 'Sound Masters', categories: 'audio,equipment', price: 2500 },
      ];
      setVendors(mockVendors);
    } catch (error) {
      toast({ title: 'Error loading vendors', variant: 'destructive' });
    }
  };

  const loadClients = async () => {
    try {
      // Mock data with calculated costs
      const mockClients: Client[] = [
        {
          id: 1,
          name: 'John Smith',
          contactNo: '123-456-7890',
          events: [
            { id: 1, clientId: 1, eventName: 'Wedding', category: 'catering', vendorId: 1 }
          ],
          totalCost: 5000
        },
      ];
      setClients(mockClients);
    } catch (error) {
      toast({ title: 'Error loading clients', variant: 'destructive' });
    }
  };

  const handleVendorSubmit = async (vendorData: Omit<Vendor, 'id'>) => {
    try {
      if (editingVendor) {
        // Update existing vendor
        const updatedVendor = { ...editingVendor, ...vendorData };
        setVendors(vendors.map(v => v.id === editingVendor.id ? updatedVendor : v));
        toast({ title: 'Vendor updated successfully' });
      } else {
        // Add new vendor
        const newVendor: Vendor = {
          id: Date.now(),
          ...vendorData
        };
        setVendors([...vendors, newVendor]);
        toast({ title: 'Vendor added successfully' });
      }
      setIsVendorModalOpen(false);
      setEditingVendor(null);
    } catch (error) {
      toast({ title: 'Error saving vendor', variant: 'destructive' });
    }
  };

  const handleClientSubmit = async (clientData: any) => {
    setPendingClientData(clientData);
    const events = Array.from({ length: clientData.numberOfEvents }, (_, i) => ({
      eventName: '',
      category: '',
      vendorId: null
    }));
    setPendingEvents(events);
    setCurrentEventIndex(0);
    setIsClientModalOpen(false);
    setIsEventModalOpen(true);
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
        const newClient: Client = {
          id: Date.now(),
          name: pendingClientData.name,
          contactNo: pendingClientData.contactNo,
          events: updatedEvents.map((event, index) => ({
            id: Date.now() + index,
            clientId: Date.now(),
            eventName: event.eventName || '',
            category: event.category || '',
            vendorId: event.vendorId || 0
          })),
          totalCost: calculateClientCost(updatedEvents)
        };
        
        setClients([...clients, newClient]);
        toast({ title: 'Client added successfully' });
        resetEventModal();
      } catch (error) {
        toast({ title: 'Error saving client', variant: 'destructive' });
      }
    }
  };

  const calculateClientCost = (events: Partial<Event>[]): number => {
    let totalCost = 0;
    events.forEach(event => {
      if (event.vendorId) {
        const vendor = vendors.find(v => v.id === event.vendorId);
        if (vendor && event.category) {
          const eventCategories = event.category.split(',').map(c => c.trim());
          const vendorCategories = vendor.categories.split(',').map(c => c.trim());
          const hasMatchingCategory = eventCategories.some(cat => 
            vendorCategories.includes(cat)
          );
          if (hasMatchingCategory) {
            totalCost += vendor.price;
          }
        }
      }
    });
    return totalCost;
  };

  const resetEventModal = () => {
    setIsEventModalOpen(false);
    setPendingEvents([]);
    setCurrentEventIndex(0);
    setPendingClientData(null);
  };

  const handleDeleteVendor = async (id: number) => {
    try {
      setVendors(vendors.filter(v => v.id !== id));
      toast({ title: 'Vendor deleted successfully' });
    } catch (error) {
      toast({ title: 'Error deleting vendor', variant: 'destructive' });
    }
  };

  const handleDeleteClient = async (id: number) => {
    try {
      setClients(clients.filter(c => c.id !== id));
      toast({ title: 'Client deleted successfully' });
    } catch (error) {
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
