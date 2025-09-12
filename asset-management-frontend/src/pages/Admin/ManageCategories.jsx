import React, { useState, useEffect } from 'react';
import CategoryService from '../../services/CategoryService';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    isAutoApproved: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await CategoryService.getAllCategories();
      setCategories(data);
      setError('');
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryName: '',
      description: '',
      isAutoApproved: false
    });
    setFormErrors({});
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        categoryName: category.categoryName,
        description: category.description || '',
        isAutoApproved: category.isAutoApproved || false
      });
    } else {
      setEditingCategory(null);
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.categoryName.trim()) {
      errors.categoryName = 'Category name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await CategoryService.updateCategory(editingCategory.categoryId, formData);
      } else {
        await CategoryService.createCategory(formData);
      }

      closeModal();
      loadCategories();
    } catch (err) {
      setError(editingCategory ? 'Failed to update category' : 'Failed to create category');
      console.error('Error saving category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.categoryName}"? This action cannot be undone.`)) {
      try {
        await CategoryService.deleteCategory(category.categoryId);
        loadCategories();
      } catch (err) {
        setError('Failed to delete category');
        console.error('Error deleting category:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
        <p className="mt-2 text-gray-600">
          Organize your assets into categories and set auto-approval preferences
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Add Category Button */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total categories: <span className="font-medium">{categories.length}</span>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.categoryId} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-semibold">
                    {category.categoryName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.categoryName}
                  </h3>
                  {category.isAutoApproved && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ⚡ Auto-approved
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(category)}
                  className="text-indigo-600 hover:text-indigo-800 p-1"
                  title="Edit category"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete category"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {category.description ? (
                <p className="text-gray-600 text-sm">{category.description}</p>
              ) : (
                <p className="text-gray-400 text-sm italic">No description provided</p>
              )}

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Approval Type:</span>
                  <span className={`font-medium ${category.isAutoApproved ? 'text-green-600' : 'text-orange-600'
                    }`}>
                    {category.isAutoApproved ? 'Automatic' : 'Manual'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📂</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first asset category.</p>
          <button
            onClick={() => openModal()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create Category
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formErrors.categoryName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Enter category name"
                />
                {formErrors.categoryName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.categoryName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter category description"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAutoApproved"
                  checked={formData.isAutoApproved}
                  onChange={(e) => setFormData({ ...formData, isAutoApproved: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isAutoApproved" className="ml-2 block text-sm text-gray-700">
                  Auto-approve asset requests in this category
                </label>
              </div>

              {formData.isAutoApproved && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex">
                    <span className="text-green-500 mr-2">ℹ️</span>
                    <div className="text-sm text-green-700">
                      <p className="font-medium">Auto-approval enabled</p>
                      <p>Asset requests in this category will be automatically approved without admin review. This is ideal for simple, low-value items like stationery and basic peripherals.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Information Panel */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">About Auto-Approval</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">✅ Auto-Approved Categories</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• Simple, low-value items</li>
              <li>• Commonly requested assets</li>
              <li>• Office supplies and stationery</li>
              <li>• Basic peripherals (mouse, keyboard)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">👤 Manual Approval Categories</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• High-value equipment</li>
              <li>• Limited availability items</li>
              <li>• Laptops and computers</li>
              <li>• Conference room bookings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;