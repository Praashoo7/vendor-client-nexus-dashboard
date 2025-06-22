
import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import { Client, Vendor } from '@/types';

const GraphWrapper: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    // Load data (in a real app, this would be from an API or shared state)
    const loadData = () => {
      // Mock data matching the updated structure
      const mockVendors: Vendor[] = [
        { 
          id: 1, 
          name: 'Elite Catering', 
          categoryPrices: { 
            'catering': 5000, 
            'food': 3000 
          } 
        },
        { 
          id: 2, 
          name: 'Perfect Photos', 
          categoryPrices: { 
            'photography': 3000 
          } 
        },
        { 
          id: 3, 
          name: 'Sound Masters', 
          categoryPrices: {
            'audio': 2500,
            'equipment': 1500
          } 
        },
      ];

      const mockClients: Client[] = [
        {
          id: 1,
          name: 'John Smith',
          contactNo: '123-456-7890',
          events: [
            { 
              id: 1, 
              clientId: 1, 
              eventName: 'Wedding Reception', 
              categories: ['catering', 'photography'], 
              vendorId: 1 
            },
            { 
              id: 2, 
              clientId: 1, 
              eventName: 'Wedding Ceremony', 
              categories: ['photography', 'audio'], 
              vendorId: 2 
            }
          ],
          totalCost: 11000
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          contactNo: '987-654-3210',
          events: [
            { 
              id: 3, 
              clientId: 2, 
              eventName: 'Corporate Event', 
              categories: ['audio', 'equipment'], 
              vendorId: 3 
            }
          ],
          totalCost: 4000
        }
      ];

      setVendors(mockVendors);
      setClients(mockClients);
    };

    loadData();
  }, []);

  return <Graph clients={clients} vendors={vendors} />;
};

export default GraphWrapper;
