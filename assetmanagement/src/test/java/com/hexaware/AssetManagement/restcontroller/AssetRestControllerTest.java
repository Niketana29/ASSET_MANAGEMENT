package com.hexaware.assetManagement.restcontroller;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.client.RestTemplate;

import com.hexaware.assetManagement.dto.AssetDto;
import com.hexaware.assetManagement.entities.Asset;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class AssetRestControllerTest {

	
	@Autowired
	RestTemplate restTemplate;
	
    Logger logger = LoggerFactory.getLogger(AssetRestControllerTest.class);

    String baseURL = "http://localhost:8092/api/assets";
	
    @Test
    void testAddAsset() {
        AssetDto dto = new AssetDto();
        dto.setAname("Laptop");
        dto.setCategory("Electronics");
        dto.setStatus("Available");

        Asset asset = restTemplate.postForObject(baseURL + "/add", dto, Asset.class);

        logger.info("Asset Added: {}", asset);
        assertNotNull(asset);
    }

    @Test
    void testGetAllAssets() {
        List<?> list = restTemplate.getForObject(baseURL + "/getall", List.class);
        logger.info("List of Assets: {}", list);
        assertNotNull(list);
    }

}
