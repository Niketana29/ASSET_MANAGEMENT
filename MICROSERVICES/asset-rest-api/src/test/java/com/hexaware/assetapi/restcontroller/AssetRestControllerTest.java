package com.hexaware.assetapi.restcontroller;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.hexaware.assetapi.dto.AssetDto;
import com.hexaware.assetapi.entity.Asset;


@SpringBootTest
class AssetRestControllerTest {

	@Autowired
    RestTemplate restTemplate;

    String baseURL = "http://localhost:8283/api/assets";

    @Test
    void testAddAsset() {
        AssetDto dto = new AssetDto();
        dto.setAssetName("Printer");
        dto.setAssetType("Electronics");
        Asset asset = restTemplate.postForObject(baseURL + "/add", dto, Asset.class);
        assertNotNull(asset);
    }

    @Test
    void testGetById() {
        int id = 1;
        ResponseEntity<Asset> response = restTemplate.getForEntity(baseURL + "/get/" + id, Asset.class);
        assertNotNull(response.getBody());
    }
}
