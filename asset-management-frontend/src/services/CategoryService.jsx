import api from "./api";

class CategoryService {
  async getAllCategories() {
    const res = await api.get("/api/categories/getall");
      return res.data;
  }

  async getCategoryById(categoryId) {
    const res = await api.get(`/api/categories/getbyid/${categoryId}`);
      return res.data;
  }

  async addCategory(category) {
    const res = await api.post("/api/categories/add", category);
      return res.data;
  }

  async updateCategory(category) {
    const res = await api.put("/api/categories/update", category);
      return res.data;
  }

  async deleteCategory(categoryId) {
    const res = await api.delete(`/api/categories/deletebyid/${categoryId}`);
      return res.data;
  }
}

export default new CategoryService();
