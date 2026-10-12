import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useAddressStore } from '../store/addressStore';
import type { Address } from '../store/addressStore';

export default function Addresses() {
  const addresses = useAddressStore(state => state.addresses);
  const addAddress = useAddressStore(state => state.addAddress);
  const updateAddress = useAddressStore(state => state.updateAddress);
  const removeAddress = useAddressStore(state => state.removeAddress);
  const setDefaultAddress = useAddressStore(state => state.setDefaultAddress);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: 'Home',
    name: '',
    phone: '',
    houseNumber: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateAddress(editingId, formData);
      setEditingId(null);
    } else {
      addAddress(formData);
    }
    
    setFormData({
      label: 'Home',
      name: '',
      phone: '',
      houseNumber: '',
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setShowForm(false);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      label: address.label,
      name: address.name,
      phone: address.phone,
      houseNumber: address.houseNumber,
      street: address.street,
      area: address.area,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  if (addresses.length === 0 && !showForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">📍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No addresses saved</h2>
          <p className="text-gray-500 mb-6">Add your delivery addresses for faster checkout</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} />
            Add Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Addresses</h1>
          <p className="text-gray-500">Manage your delivery addresses</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} />
            Add New
          </button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <select
                  value={formData.label}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House/Flat No.</label>
                <input
                  type="text"
                  value={formData.houseNumber}
                  onChange={e => setFormData({ ...formData, houseNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={e => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-200"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Set as default address
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    label: 'Home',
                    name: '',
                    phone: '',
                    houseNumber: '',
                    street: '',
                    area: '',
                    city: '',
                    state: '',
                    pincode: '',
                    isDefault: false,
                  });
                }}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map(address => (
          <div key={address.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MapPin size={20} className="text-orange-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{address.label}</h3>
                    {address.isDefault && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Check size={10} />
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.name} • {address.phone}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {address.houseNumber}, {address.street}, {address.area}, {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!address.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(address.id)}
                    className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                    title="Set as default"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => removeAddress(address.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
