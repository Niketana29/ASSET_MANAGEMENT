package com.hexaware.AssetManagement.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.sql.Date;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.AssetManagement.entities.Asset;
import com.hexaware.AssetManagement.entities.AssetAllocation;
import com.hexaware.AssetManagement.entities.Employee;

@SpringBootTest
class AssetAllocationServiceTest {

    @Autowired
    private IAssetAllocationService allocationService;

    /*@Test
    void testAllocateAsset() {
        AssetAllocation allocation = new AssetAllocation();
        allocation.setEmployee(new Employee() {{ setEid(201); }});
        allocation.setAsset(new Asset() {{ setAid(101); }});
        allocation.setAllocationDate(Date.valueOf(LocalDate.now()));
        allocation.setReturnDate(Date.valueOf(LocalDate.now().plusMonths(6)));

        AssetAllocation saved = allocationService.allocateAsset(allocation);
        assertNotNull(saved);

        System.out.println("Allocated Asset: " + saved);
    }*/

    @Test
    void testGetAllAllocations() {
        var list = allocationService.getAllAllocations();
        assertNotNull(list);
        System.out.println("All Asset Allocations: " + list);
    }
}
