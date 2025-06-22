
import React, { useState, useEffect } from 'react';
import { Vendor } from '@/types';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Vendor, 'id'>) => void;
  initialData?: Vendor | null;
}

const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryPrices: {} as { [category: string]: number }
  });
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        categoryPrices: { ...initialData.categoryPrices }
      });
    } else {
      setFormData({
        name: '',
        categoryPrices: {}
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || Object.keys(formData.categoryPrices).length === 0) return;
    
    onSubmit({
      name: formData.name.trim(),
      categoryPrices: formData.categoryPrices
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const addCategoryPrice = () => {
    if (!newCategory.trim() || newPrice <= 0) return;
    
    setFormData(prev => ({
      ...prev,
      categoryPrices: {
        ...prev.categoryPrices,
        [newCategory.trim()]: newPrice
      }
    }));
    
    setNewCategory('');
    setNewPrice(0);
  };

  const removeCategoryPrice = (category: string) => {
    setFormData(prev => {
      const newCategoryPrices = { ...prev.categoryPrices };
      delete newCategoryPrices[category];
      return {
        ...prev,
        categoryPrices: newCategoryPrices
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Vendor' : 'Add Vendor'}
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
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter vendor name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category-Price Pairs
            </label>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category name"
              />
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Price"
                min="0"
                step="0.01"
              />
              <button
                type="button"
                onClick={addCategoryPrice}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {Object.entries(formData.categoryPrices).map(([category, price]) => (
                <div key={category} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm">
                    <strong>{category}</strong>: ${price.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCategoryPrice(category)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            {Object.keys(formData.categoryPrices).length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Add at least one category-price pair
              </p>
            )}
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {initialData ? 'Update' : 'Add'} Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorModal;
