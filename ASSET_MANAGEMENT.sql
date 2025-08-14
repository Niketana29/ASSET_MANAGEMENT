CREATE DATABASE ASSET_MANAGEMENT;

USE ASSET_MANAGEMENT;

CREATE TABLE EMPLOYEE (
	eid INT AUTO_INCREMENT PRIMARY KEY,
    ename VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    gender ENUM('FEMALE', 'MALE'),
    contact_number VARCHAR(20),
    address VARCHAR(255),
    role ENUM('EMPLOYEE', 'ADMIN') DEFAULT 'EMPLOYEE'
);

CREATE TABLE ASSET (
	aid INT AUTO_INCREMENT PRIMARY KEY,
    asset_no VARCHAR(50) NOT NULL UNIQUE,
    aname VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    model VARCHAR(50),
    manufacturing_date DATE,
    expiry_date DATE,
    asset_value DECIMAL(10,2),
    status ENUM('AVAILABLE', 'ASSIGNED', 'UNDER_SERVICE') DEFAULT 'AVAILABLE'
);

CREATE TABLE ASSET_ALLOCATION (
	alloc_id INT AUTO_INCREMENT PRIMARY KEY,
    eid INT,
    aid INT,
    allocation_date DATE,
    return_date DATE,
    FOREIGN KEY (eid) REFERENCES EMPLOYEE(eid),
    FOREIGN KEY (aid) REFERENCES ASSET(aid)
);

CREATE TABLE SERVICE_REQUEST (
	srid INT AUTO_INCREMENT PRIMARY KEY,
    eid INT,
    aid INT,
    description TEXT,
    issue_type ENUM('MALFUNCTION', 'REPAIR') NOT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED'),
    FOREIGN KEY (eid) REFERENCES EMPLOYEE(eid),
    FOREIGN KEY (aid) REFERENCES ASSET(aid)
);

CREATE TABLE AUDIT_REQUEST (
	arid INT AUTO_INCREMENT PRIMARY KEY,
    eid INT,
    aid INT,
    status ENUM('PENDING', 'VERIFIED', 'REJECTED'),
    FOREIGN KEY (eid) REFERENCES EMPLOYEE(eid),
    FOREIGN KEY (aid) REFERENCES ASSET(aid)
);

SELECT * FROM EMPLOYEE;
SELECT * FROM ASSET;
SELECT * FROM ASSET_ALLOCATION;
SELECT * FROM AUDIT_REQUEST;
SELECT * FROM SERVICE_REQUEST;

SELECT * FROM user_info;

SHOW TABLES;
delete from employee;
delete from asset;
delete from asset_allocation;
delete from audit_request;
delete from service_request;
DESC ASSET;
SET SQL_SAFE_UPDATES = 0;
insert into employee values (100 , "Niraj" , "niraj@gmail.com" , "MALE" , "9876543210" , "Chennai" , "ADMIN");

INSERT INTO employee (eid, ename, email, gender, contact_number, address, role)
VALUES
(201, 'John Doe', 'john.doe@example.com', 'MALE', '9876543210', 'Bangalore', 'ADMIN'),
(202, 'Jane Smith', 'jane.smith@example.com', 'FEMALE', '9123456780', 'Chennai', 'EMPLOYEE'),
(203, 'Robert Brown', 'robert.brown@example.com', 'MALE', '9988776655', 'Hyderabad', 'EMPLOYEE');


INSERT INTO asset (aid, asset_no, aname, category, model, manufacturing_date, expiry_date, asset_value, status)
VALUES
(101, 'A1001', 'Laptop', 'Electronics', 'Dell XPS', '2023-01-10', '2026-01-10', 50000.0, 'AVAILABLE'),
(102, 'A1002', 'Projector', 'Electronics', 'Epson X200', '2022-05-15', '2025-05-15', 35000.0, 'AVAILABLE'),
(103, 'A1003', 'Printer', 'Electronics', 'HP LaserJet', '2021-11-20', '2024-11-20', 15000.0, 'UNDER_SERVICE');


INSERT INTO asset_allocation (alloc_id, eid, aid, allocation_date, return_date)
VALUES
(301, 202, 101, '2024-08-01', NULL),
(302, 203, 102, '2024-07-15', '2024-08-10');


INSERT INTO service_request VALUES
(401 , 202, 101, 'Laptop battery issue', 'REPAIR', 'PENDING'),
(402 , 203, 103, 'Printer not printing', 'MALFUNCTION', 'IN_PROGRESS');

drop table service_request;

INSERT INTO audit_request (arid, eid, aid, status)
VALUES
(501, 201, 101, 'PENDING'),
(502, 202, 102, 'VERIFIED'),
(503, 203, 103, 'REJECTED');

ALTER TABLE EMPLOYEE RENAME TO Employee;
ALTER TABLE SERVICE_REQUEST RENAME TO Service_Request;
ALTER TABLE AUDIT_REQUEST RENAME TO Audit_Request;
ALTER TABLE ASSET_ALLOCATION RENAME TO Asset_Allocation;
ALTER TABLE ASSET RENAME TO Asset;