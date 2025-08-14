package com.hexaware.assetManagement.restcontroller;


import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.hexaware.assetManagement.dto.AssetAllocationDto;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AssetAllocationRestControllerTest {

	
	
	@Autowired
	RestTemplate restTemplate;
	
	Logger logger = LoggerFactory.getLogger(AssetAllocationRestControllerTest.class);
	
    @LocalServerPort
    private int port;
	
    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/allocations";
    }
	
    /*@Test
    void testAddAllocation() {
        AssetAllocationDto dto = new AssetAllocationDto();
        dto.setAid(101);
        dto.setEid(203);
        dto.setAllocationDate(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));
        dto.setReturnDate(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));

        AssetAllocation savedAllocation = restTemplate.postForObject(baseUrl + "/add", dto, AssetAllocation.class);

        logger.info("Saved Allocation: {}", savedAllocation);
        assertNotNull(savedAllocation);
    }*/

    /*@Test
    void testGetAllAllocations() {
        List<?> allocations = restTemplate.getForObject(baseUrl + "/getall", List.class);

        logger.info("Allocations List: {}", allocations);
        assertNotNull(allocations);
        assertTrue(allocations.size() > 0);
    }*/
    
    @Test
    void testGetAllAllocations() {
        ResponseEntity<List<AssetAllocationDto>> response = restTemplate.exchange(
                getBaseUrl() + "/getall",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<AssetAllocationDto>>() {}
        );

        List<AssetAllocationDto> allocations = response.getBody();
        logger.info("Allocations List: {}", allocations);

        assertNotNull(allocations);
        assertTrue(allocations.size() > 0);
    }

}
