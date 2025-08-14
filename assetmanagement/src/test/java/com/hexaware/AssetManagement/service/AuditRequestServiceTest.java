package com.hexaware.assetManagement.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.assetManagement.entities.Asset;
import com.hexaware.assetManagement.entities.AuditRequest;
import com.hexaware.assetManagement.entities.Employee;

@SpringBootTest
class AuditRequestServiceTest {

    @Autowired
    private IAuditRequestService auditRequestService;

    @Test
    void testCreateAuditRequest() {
        AuditRequest ar = new AuditRequest();
        ar.setEmployee(new Employee() {{ setEid(1); }});
        ar.setAsset(new Asset() {{ setAid(1); }});
        ar.setStatus("PENDING");

        AuditRequest saved = auditRequestService.createAuditRequest(ar);
        assertNotNull(saved);

        System.out.println("Created Audit Request: " + saved);
    }

    @Test
    void testGetAllAuditRequests() {
        var list = auditRequestService.getAllAuditRequests();
        assertNotNull(list);
        System.out.println("All Audit Requests: " + list);
    }
}
