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

import com.hexaware.AssetManagement.dto.AuditRequestDto;
import com.hexaware.AssetManagement.entities.AuditRequest;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class AuditRequestRestControllerTest {

	
	@Autowired
	RestTemplate restTemplate;
	
	Logger logger = LoggerFactory.getLogger(AuditRequestRestControllerTest.class);

    String baseURL = "http://localhost:8092/api/auditrequests";
	
    /*@Test
    void testAddAuditRequest() {
        AuditRequestDto dto = new AuditRequestDto();
        dto.setAuditId(1);
        dto.setStatus("Pending");

        AuditRequest savedRequest = restTemplate.postForObject(baseURL + "/add", dto, AuditRequest.class);

        logger.info("Saved Audit Request: {}", savedRequest);
        assertNotNull(savedRequest);
    }*/

    @Test
    void testGetAllAuditRequests() {
        List<?> requests = restTemplate.getForObject(baseURL + "/getall", List.class);

        logger.info("Audit Requests List: {}", requests);
        assertNotNull(requests);
        assertTrue(requests.size() > 0);
    }

}
