
import React from 'react';
import { Vendor } from '@/types';

interface VendorTableProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
}

const VendorTable: React.FC<VendorTableProps> = ({
  vendors,
  onEdit,
  onDelete
}) => {
  const handleDelete = (vendor: Vendor) => {
    if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
      onDelete(vendor.id);
    }
  };

  if (vendors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">No vendors added yet</p>
        <p className="text-sm">Click "Add Vendor" to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-2 font-semibold text-gray-700">Categories & Prices</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-2">
                <div className="font-medium text-gray-900">{vendor.name}</div>
              </td>
              <td className="py-3 px-2">
                <div className="space-y-1">
                  {Object.entries(vendor.categoryPrices).map(([category, price]) => (
                    <div key={category} className="flex justify-between items-center bg-blue-50 px-2 py-1 rounded text-sm">
                      <span className="text-blue-800 font-medium">{category}</span>
                      <span className="text-green-600 font-semibold">${price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-3 px-2">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(vendor)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vendor)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorTable;
