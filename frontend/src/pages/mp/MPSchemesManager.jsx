import React, { useEffect, useState } from 'react';
import MPNavbar from '../../components/layout/MPNavbar';
import { schemeService } from '../../services/schemeService';

const MPSchemesManager = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- new: modal state ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null); // null = creating, object = editing
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ward: '',
    category: '',
    status: 'planned',
    image_url: ''
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await schemeService.getAll();
      setSchemes(response.data);
    } catch (err) {
      console.error('Failed to fetch schemes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this scheme?')) {
      try {
        await schemeService.delete(id);
        fetchSchemes();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  // --- new: open modal for creating a scheme ---
  const openCreateModal = () => {
    setEditingScheme(null);
    setFormData({
      title: '',
      description: '',
      ward: '',
      category: '',
      status: 'planned',
      image_url: ''
    });
    setIsModalOpen(true);
  };

  // --- new: open modal for editing an existing scheme ---
  const openEditModal = (scheme) => {
    setEditingScheme(scheme);
    setFormData({
      title: scheme.title || '',
      description: scheme.description || '',
      ward: scheme.ward || '',
      category: scheme.category || '',
      status: scheme.status || 'planned',
      image_url: scheme.image_url || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingScheme(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- new: submit handler for both create and edit ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingScheme) {
        await schemeService.update(editingScheme._id, formData);
      } else {
        await schemeService.create(formData);
      }
      closeModal();
      fetchSchemes();
    } catch (err) {
      alert('Failed to save scheme');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <MPNavbar />
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-fraunces text-3xl font-bold text-ink-navy">Development Schemes</h1>
          <button
            onClick={openCreateModal}
            className="bg-marigold text-white px-6 py-2 rounded font-bold hover:bg-opacity-90 transition-all"
          >
            New Scheme
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schemes.map((s) => (
            <div key={s._id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${s.image_url || 'https://images.unsplash.com/photo-1622354573449-ce732931783f?fm=jpg&q=80&w=1200&auto=format&fit=crop'})` }}></div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-marigold">{s.category}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${s.status === 'completed' ? 'bg-moss text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {s.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-ink-navy mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-6">{s.description}</p>
                <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-gray-400">{s.ward}</span>
                  <div className="flex gap-4">
                    <button onClick={() => openEditModal(s)} className="text-xs font-bold text-ink-navy uppercase">Edit</button>
                    <button onClick={() => handleDelete(s._id)} className="text-xs font-bold text-stamp-red uppercase">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- new: create/edit modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="font-fraunces text-2xl font-bold text-ink-navy mb-6">
                {editingScheme ? 'Edit Scheme' : 'New Scheme'}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-marigold focus:border-marigold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-marigold focus:border-marigold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                    <input
                      type="text"
                      name="ward"
                      value={formData.ward}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-marigold focus:border-marigold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-marigold focus:border-marigold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-marigold focus:border-marigold"
                  >
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleFormChange}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-marigold focus:border-marigold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-marigold text-white py-3 rounded font-bold hover:bg-opacity-90 transition-all disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : editingScheme ? 'Update Scheme' : 'Create Scheme'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MPSchemesManager;