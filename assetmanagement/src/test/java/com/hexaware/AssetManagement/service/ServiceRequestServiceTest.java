package com.hexaware.AssetManagement.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.AssetManagement.entities.Asset;
import com.hexaware.AssetManagement.entities.Employee;
import com.hexaware.AssetManagement.entities.ServiceRequest;

@SpringBootTest
class ServiceRequestServiceTest {

    @Autowired
    private IServiceRequestService serviceRequestService;

    /*@Test
    void testCreateServiceRequest() {
        ServiceRequest sr = new ServiceRequest();
        sr.setEmployee(new Employee() {{ setEid(201); }});
        sr.setAsset(new Asset() {{ setAid(101); }});
        sr.setDescription("Repair request");
        sr.setIssueType("REPAIR");
        sr.setStatus("PENDING");

        ServiceRequest saved = serviceRequestService.createServiceRequest(sr);
        assertNotNull(saved);

        System.out.println("Created Service Request: " + saved);
    }*/

    @Test
    void testGetAllServiceRequests() {
        var list = serviceRequestService.getAllServiceRequests();
        assertNotNull(list);
        System.out.println("All Service Requests: " + list);
    }
}
