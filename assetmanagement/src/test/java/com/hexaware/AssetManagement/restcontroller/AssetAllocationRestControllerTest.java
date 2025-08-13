package com.hexaware.assetManagement.restcontroller;


import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.client.RestTemplate;

import com.hexaware.assetManagement.dto.AssetAllocationDto;
import com.hexaware.assetManagement.entities.AssetAllocation;


@SpringBootTest
class AssetAllocationRestControllerTest {

	
	
	@Autowired
	RestTemplate restTemplate;
	
	Logger logger = LoggerFactory.getLogger(AssetAllocationRestControllerTest.class);
	
	String baseUrl = "http://localhost:8092/api/allocations";
	
    @Test
    void testAddAllocation() {
        AssetAllocationDto dto = new AssetAllocationDto();
        dto.setAid(1);
        dto.setEid(1);
        dto.setAllocationDate(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));

        AssetAllocation savedAllocation = restTemplate.postForObject(baseUrl + "/add", dto, AssetAllocation.class);

        logger.info("Saved Allocation: {}", savedAllocation);
        assertNotNull(savedAllocation);
    }

    @Test
    void testGetAllAllocations() {
        List<?> allocations = restTemplate.getForObject(baseUrl + "/getall", List.class);

        logger.info("Allocations List: {}", allocations);
        assertNotNull(allocations);
        assertTrue(allocations.size() > 0);
    }

}
