
import React from 'react';
import { Vendor, Client } from '@/types';

interface DashboardStatsProps {
  vendors: Vendor[];
  clients: Client[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ vendors, clients }) => {
  const totalVendors = vendors.length;
  const totalClients = clients.length;
  const totalEarnings = clients.reduce((sum, client) => sum + client.totalCost, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">{totalVendors}</div>
        <div className="text-gray-600 font-medium">Total Vendors</div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-3xl font-bold text-green-600 mb-2">{totalClients}</div>
        <div className="text-gray-600 font-medium">Total Clients</div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-3xl font-bold text-purple-600 mb-2">
          ${totalEarnings.toLocaleString()}
        </div>
        <div className="text-gray-600 font-medium">Total Earnings</div>
      </div>
    </div>
  );
};

export default DashboardStats;
