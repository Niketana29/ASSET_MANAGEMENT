package com.hexaware.AssetManagement.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.AssetManagement.dto.CategoryDto;
import com.hexaware.AssetManagement.entities.Category;
import com.hexaware.AssetManagement.exception.BusinessException;
import com.hexaware.AssetManagement.exception.ResourceNotFoundException;
import com.hexaware.AssetManagement.repository.CategoryRepository;

@Service
@Transactional
public class CategoryServiceImpl implements ICategoryService {

	private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);

	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public CategoryDto createCategory(CategoryDto categoryDto) {
		logger.info("Creating category: {}", categoryDto.getCategoryName());

		if (categoryRepository.existsByCategoryName(categoryDto.getCategoryName())) {
			throw new BusinessException("Category already exists: " + categoryDto.getCategoryName());
		}

		Category category = convertToEntity(categoryDto);
		Category savedCategory = categoryRepository.save(category);

		logger.info("Category created successfully with ID: {}", savedCategory.getCategoryId());
		return convertToDto(savedCategory);
	}

	@Override
	public CategoryDto getCategoryById(Long categoryId) {
		Category category = categoryRepository.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
		return convertToDto(category);
	}

	@Override
	public CategoryDto getCategoryByName(String categoryName) {
		Category category = categoryRepository.findByCategoryName(categoryName)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "name", categoryName));
		return convertToDto(category);
	}

	@Override
	public List<CategoryDto> getAllCategories() {
		return categoryRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public CategoryDto updateCategory(Long categoryId, CategoryDto categoryDto) {
		logger.info("Updating category with ID: {}", categoryId);

		Category existingCategory = categoryRepository.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

		// Check if name is being changed and if new name already exists
		if (!existingCategory.getCategoryName().equals(categoryDto.getCategoryName())
				&& categoryRepository.existsByCategoryName(categoryDto.getCategoryName())) {
			throw new BusinessException("Category already exists: " + categoryDto.getCategoryName());
		}

		existingCategory.setCategoryName(categoryDto.getCategoryName());
		existingCategory.setDescription(categoryDto.getDescription());
		existingCategory.setIsAutoApproved(categoryDto.getIsAutoApproved());

		Category updatedCategory = categoryRepository.save(existingCategory);

		logger.info("Category updated successfully: {}", categoryId);
		return convertToDto(updatedCategory);
	}

	@Override
	public void deleteCategory(Long categoryId) {
		logger.info("Deleting category with ID: {}", categoryId);

		if (!categoryRepository.existsById(categoryId)) {
			throw new ResourceNotFoundException("Category", "id", categoryId);
		}

		categoryRepository.deleteById(categoryId);
		logger.info("Category deleted successfully: {}", categoryId);
	}

	private CategoryDto convertToDto(Category category) {
		CategoryDto dto = new CategoryDto();
		dto.setCategoryId(category.getCategoryId());
		dto.setCategoryName(category.getCategoryName());
		dto.setDescription(category.getDescription());
		dto.setIsAutoApproved(category.getIsAutoApproved());
		return dto;
	}

	private Category convertToEntity(CategoryDto dto) {
		Category category = new Category();
		category.setCategoryName(dto.getCategoryName());
		category.setDescription(dto.getDescription());
		category.setIsAutoApproved(dto.getIsAutoApproved() != null ? dto.getIsAutoApproved() : false);
		return category;
	}
}