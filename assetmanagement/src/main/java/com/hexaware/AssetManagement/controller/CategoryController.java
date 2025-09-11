package com.hexaware.AssetManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.AssetManagement.dto.CategoryDto;
import com.hexaware.AssetManagement.service.ICategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

	@Autowired
	private ICategoryService categoryService;

	@GetMapping
	public ResponseEntity<List<CategoryDto>> getAllCategories() {
		List<CategoryDto> categories = categoryService.getAllCategories();
		return ResponseEntity.ok(categories);
	}

	@GetMapping("/{id}")
	public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long id) {
		CategoryDto category = categoryService.getCategoryById(id);
		return ResponseEntity.ok(category);
	}

	@GetMapping("/name/{name}")
	public ResponseEntity<CategoryDto> getCategoryByName(@PathVariable String name) {
		CategoryDto category = categoryService.getCategoryByName(name);
		return ResponseEntity.ok(category);
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto categoryDto) {
		CategoryDto createdCategory = categoryService.createCategory(categoryDto);
		return ResponseEntity.ok(createdCategory);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id,
			@Valid @RequestBody CategoryDto categoryDto) {
		CategoryDto updatedCategory = categoryService.updateCategory(id, categoryDto);
		return ResponseEntity.ok(updatedCategory);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
		categoryService.deleteCategory(id);
		return ResponseEntity.ok().build();
	}
}