package com.hexaware.AssetManagement.service;

import java.util.List;

import com.hexaware.AssetManagement.dto.CategoryDto;

public interface ICategoryService {
	public CategoryDto createCategory(CategoryDto categoryDto);

	public CategoryDto getCategoryById(Long categoryId);

	public CategoryDto getCategoryByName(String categoryName);

	public List<CategoryDto> getAllCategories();

	public CategoryDto updateCategory(Long categoryId, CategoryDto categoryDto);

	public void deleteCategory(Long categoryId);
}