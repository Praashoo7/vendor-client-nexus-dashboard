
import React from 'react';
import { Client } from '@/types';

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  onEdit,
  onDelete
}) => {
  const handleDelete = (client: Client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      onDelete(client.id);
    }
  };

  const getUniqueCategories = (client: Client): string[] => {
    const allCategories = client.events
      .flatMap(event => event.categories)
      .filter(cat => cat.length > 0);
    return [...new Set(allCategories)];
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">No clients added yet</p>
        <p className="text-sm">Click "Add Client" to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-2 font-semibold text-gray-700">Events</th>
            <th className="text-left py-3 px-2 font-semibold text-gray-700">Categories</th>
            <th className="text-left py-3 px-2 font-semibold text-gray-700">Cost</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-2">
                <div className="font-medium text-gray-900">{client.name}</div>
                <div className="text-sm text-gray-500">{client.contactNo}</div>
              </td>
              <td className="py-3 px-2">
                <div className="font-semibold text-blue-600">
                  {client.events.length} event{client.events.length !== 1 ? 's' : ''}
                </div>
                {client.events.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {client.events.slice(0, 2).map(event => event.eventName).join(', ')}
                    {client.events.length > 2 && ` +${client.events.length - 2} more`}
                  </div>
                )}
              </td>
              <td className="py-3 px-2">
                <div className="flex flex-wrap gap-1">
                  {getUniqueCategories(client).slice(0, 3).map((category, index) => (
                    <span
                      key={index}
                      className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                  {getUniqueCategories(client).length > 3 && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      +{getUniqueCategories(client).length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-2">
                <span className="font-bold text-green-600 text-lg">
                  ${client.totalCost.toLocaleString()}
                </span>
              </td>
              <td className="py-3 px-2">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(client)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client)}
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

export default ClientTable;
