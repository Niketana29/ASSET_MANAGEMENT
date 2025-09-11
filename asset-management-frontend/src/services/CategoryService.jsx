import api from './api';

class CategoryService {
  async getAllCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  }

  async getCategoryById(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch category details' };
    }
  }

  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create category' };
    }
  }

  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update category' };
    }
  }

  async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete category' };
    }
  }
}

export default new CategoryService();
