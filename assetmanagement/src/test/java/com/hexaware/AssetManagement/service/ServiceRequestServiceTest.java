package com.hexaware.assetManagement.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.assetManagement.entities.Asset;
import com.hexaware.assetManagement.entities.Employee;
import com.hexaware.assetManagement.entities.ServiceRequest;

@SpringBootTest
class ServiceRequestServiceTest {

    @Autowired
    private IServiceRequestService serviceRequestService;

    @Test
    void testCreateServiceRequest() {
        ServiceRequest sr = new ServiceRequest();
        sr.setEmployee(new Employee() {{ setEid(1); }});
        sr.setAsset(new Asset() {{ setAid(1); }});
        sr.setDescription("Repair request");
        sr.setIssueType("REPAIR");
        sr.setStatus("PENDING");

        ServiceRequest saved = serviceRequestService.createServiceRequest(sr);
        assertNotNull(saved);

        System.out.println("Created Service Request: " + saved);
    }

    @Test
    void testGetAllServiceRequests() {
        var list = serviceRequestService.getAllServiceRequests();
        assertNotNull(list);
        System.out.println("All Service Requests: " + list);
    }
}
