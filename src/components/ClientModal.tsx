
import React, { useState, useEffect } from 'react';
import { Client } from '@/types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; contactNo: string; numberOfEvents: number }) => void;
  initialData?: Client | null;
}

const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNo: '',
    numberOfEvents: 1
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        contactNo: initialData.contact_no, // Fixed: use contact_no from the Client type
        numberOfEvents: initialData.events.length
      });
    } else {
      setFormData({
        name: '',
        contactNo: '',
        numberOfEvents: 1
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedContact = formData.contactNo.trim();

    if (!trimmedName || !trimmedContact) return;

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(trimmedContact)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    
    onSubmit({
      name: formData.name.trim(),
      contactNo: formData.contactNo.trim(),
      numberOfEvents: Number(formData.numberOfEvents)
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfEvents' ? Number(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Client' : 'Add Client'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter client name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter contact number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Events
            </label>
            <input
              type="number"
              name="numberOfEvents"
              value={formData.numberOfEvents}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter number of events"
              min="1"
              max="10"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You'll be prompted to enter details for each event
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {initialData ? 'Update' : 'Continue to Events'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
