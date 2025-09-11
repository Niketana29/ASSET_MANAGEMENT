package com.hexaware.AssetManagement.restcontroller;


import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.client.RestTemplate;

import com.hexaware.AssetManagement.dto.ServiceRequestDto;
import com.hexaware.AssetManagement.entities.ServiceRequest;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class ServiceRequestRestControllerTest {

	@Autowired
	RestTemplate restTemplate;
	
	Logger logger = LoggerFactory.getLogger(ServiceRequestRestControllerTest.class);

    String baseURL = "http://localhost:8092/api/servicerequests";
	
    /*@Test
    void testAddServiceRequest() {
        ServiceRequestDto dto = new ServiceRequestDto();
        dto.setAssetId(1);
        dto.setIssueType("MALFUNCTION");
        dto.setDescription("Repair keyboard");

        ServiceRequest savedRequest = restTemplate.postForObject(baseURL + "/add", dto, ServiceRequest.class);

        logger.info("Saved Service Request: {}", savedRequest);
        assertNotNull(savedRequest);
    }*/

    @Test
    void testGetAllServiceRequests() {
        List<?> requests = restTemplate.getForObject(baseURL + "/getall", List.class);

        logger.info("Service Requests List: {}", requests);
        assertNotNull(requests);
        assertTrue(requests.size() > 0);
    }

}
