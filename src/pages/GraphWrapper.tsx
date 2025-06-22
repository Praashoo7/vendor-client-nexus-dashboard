
import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import { Client, Vendor } from '@/types';
import { fetchVendors, fetchClients } from '@/services/database';
import { toast } from '@/hooks/use-toast';

const GraphWrapper: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Error loading graph data:', error);
      toast({ title: 'Error loading graph data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading graph data...</p>
        </div>
      </div>
    );
  }

  return <Graph clients={clients} vendors={vendors} />;
};

export default GraphWrapper;
