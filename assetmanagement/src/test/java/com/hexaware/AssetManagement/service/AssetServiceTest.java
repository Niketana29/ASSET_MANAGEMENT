package com.hexaware.assetManagement.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.assetManagement.entities.Asset;

@SpringBootTest
class AssetServiceTest {

    @Autowired
    private IAssetService assetService;

    @Test
    void testAddAsset() {
        Asset asset = new Asset();
        asset.setAname("Laptop");
        asset.setAssetNo("L1001");
        asset.setCategory("Electronics");
        asset.setModel("Dell XPS");
        asset.setAssetValue(55000.0);
        asset.setManufacturingDate(Date.valueOf(LocalDate.of(2024, 1, 1)));
        asset.setExpiryDate(Date.valueOf(LocalDate.of(2026, 1, 1)));
        asset.setStatus("AVAILABLE");

        Asset saved = assetService.addAsset(asset);

        assertNotNull(saved);
        assertEquals("Laptop", saved.getAname());

        System.out.println("Added Asset: " + saved);
    }

    @Test
    void testGetAllAssets() {
        List<Asset> assets = assetService.getAllAssets();
        assertNotNull(assets);

        System.out.println("All Assets:");
        assets.forEach(System.out::println);
    }

    /*@Test
    void testGetAssetById() {
        // Make sure an asset with ID 1 exists in DB, or change ID accordingly
        int id = 1;
        Asset asset = assetService.getAssetById(id);
        assertNotNull(asset);

        System.out.println("Asset fetched by ID " + id + ": " + asset);
    }*/
}
