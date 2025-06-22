
import React, { useState } from 'react';
import { Vendor, Event } from '@/types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Event>) => void;
  vendors: Vendor[];
  eventNumber: number;
  totalEvents: number;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vendors,
  eventNumber,
  totalEvents
}) => {
  const [formData, setFormData] = useState({
    event_name: '',
    category: '',
    vendor_id: ''
  });

  // Get unique categories from all vendors
  const getAvailableCategories = () => {
    const allCategories = vendors.flatMap(vendor => 
      Object.keys(vendor.categoryPrices)
    );
    return [...new Set(allCategories)].filter(cat => cat.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.event_name.trim() || !formData.category) return;
    
    onSubmit({
      event_name: formData.event_name.trim(),
      category: formData.category,
      vendor_id: formData.vendor_id || null
    });

    // Reset form for next event
    setFormData({
      event_name: '',
      category: '',
      vendor_id: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  const availableCategories = getAvailableCategories();
  const selectedVendor = vendors.find(v => v.id === formData.vendor_id);
  const matchingVendors = vendors.filter(vendor => 
    Object.keys(vendor.categoryPrices).includes(formData.category)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Event {eventNumber} of {totalEvents}
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(eventNumber / totalEvents) * 100}%` }}
              ></div>
            </div>
          </div>
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
              Event Name
            </label>
            <input
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select category based on available vendor services
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor
            </label>
            <select
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a vendor (optional)</option>
              {matchingVendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name} - {formData.category && vendor.categoryPrices[formData.category] ? 
                    `$${vendor.categoryPrices[formData.category]}` : 'N/A'}
                </option>
              ))}
            </select>
            {formData.category && (
              <p className="text-xs text-gray-500 mt-1">
                Showing vendors that offer "{formData.category}" services
              </p>
            )}
          </div>

          {selectedVendor && formData.category && selectedVendor.categoryPrices[formData.category] && (
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Cost Breakdown:</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{formData.category}</span>
                  <span className="font-semibold">${selectedVendor.categoryPrices[formData.category]}</span>
                </div>
                <div className="border-t pt-1 mt-2">
                  <div className="flex justify-between font-bold text-green-800">
                    <span>Total:</span>
                    <span>${selectedVendor.categoryPrices[formData.category]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {eventNumber < totalEvents ? 'Next Event' : 'Complete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
