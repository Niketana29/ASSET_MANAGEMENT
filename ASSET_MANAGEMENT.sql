DROP DATABASE IF EXISTS asset_management;
CREATE DATABASE ASSET_MANAGEMENT;

USE ASSET_MANAGEMENT;

-- Step 2: Create Tables (Spring Boot will handle this with JPA, but here's the manual version)

-- User Info Table
CREATE TABLE user_info (
    id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    roles VARCHAR(100) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_username (username)
);

-- Employees Table
CREATE TABLE employees (
    employee_id BIGINT NOT NULL AUTO_INCREMENT,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contact_number VARCHAR(20),
    gender VARCHAR(10) NOT NULL,
    address VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id),
    INDEX idx_email (email),
    INDEX idx_employee_name (employee_name)
);

-- Categories Table
CREATE TABLE categories (
    category_id BIGINT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    is_auto_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (category_id),
    INDEX idx_category_name (category_name),
    INDEX idx_auto_approved (is_auto_approved)
);

-- Assets Table
CREATE TABLE assets (
    asset_id BIGINT NOT NULL AUTO_INCREMENT,
    asset_no VARCHAR(50) NOT NULL UNIQUE,
    asset_name VARCHAR(200) NOT NULL,
    category_id BIGINT NOT NULL,
    asset_model VARCHAR(100),
    manufacturing_date DATE,
    expiry_date DATE,
    asset_value DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (asset_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    INDEX idx_asset_no (asset_no),
    INDEX idx_asset_name (asset_name),
    INDEX idx_status (status),
    INDEX idx_category (category_id)
);

-- Asset Allocations Table
CREATE TABLE asset_allocations (
    allocation_id BIGINT NOT NULL AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    asset_id BIGINT NOT NULL,
    allocated_date TIMESTAMP NULL,
    return_date TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
    request_reason VARCHAR(500),
    admin_comments VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (allocation_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_asset (asset_id),
    INDEX idx_status (status),
    INDEX idx_allocated_date (allocated_date)
);

-- Service Requests Table
CREATE TABLE service_requests (
    request_id BIGINT NOT NULL AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    asset_id BIGINT NOT NULL,
    asset_no VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    issue_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    admin_comments VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (request_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_asset (asset_id),
    INDEX idx_status (status),
    INDEX idx_asset_no (asset_no)
);

-- Audit Requests Table
CREATE TABLE audit_requests (
    audit_id BIGINT NOT NULL AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    asset_id BIGINT NOT NULL,
    audit_date TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    employee_comments VARCHAR(500),
    admin_comments VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (audit_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_asset (asset_id),
    INDEX idx_status (status)
);

-- =====================================================
-- STEP 3: INSERT SAMPLE DATA
-- =====================================================

-- Insert Categories (Auto-approval settings)
INSERT INTO categories (category_name, description, is_auto_approved) VALUES
('Stationery', 'Office supplies like pens, papers, notebooks', TRUE),
('Basic Peripherals', 'Mouse, keyboard, cables, basic accessories', TRUE),
('Printing Equipment', 'Small printers, scanners for individual use', TRUE),
('Office Supplies', 'Desk organizers, staplers, calculators', TRUE),
('Laptops', 'All laptop computers and notebooks', FALSE),
('Desktop Computers', 'Desktop PCs and workstations', FALSE),
('Conference Equipment', 'Projectors, conference room booking', FALSE),
('Furniture', 'Office furniture, chairs, desks', FALSE),
('Mobile Devices', 'Smartphones, tablets', FALSE),
('Networking Equipment', 'Routers, switches, access points', FALSE);

-- Insert Admin User (password: Admin@123)
-- INSERT INTO user_info (username, password, roles) VALUES --
-- ('admin', '$2a$10$5Zj8Vjh4KXB8Y3wO8YnFjOJ6JYlJdqEtv2rGJz5Y9J6JYlJdqEtv2r', 'ROLE_ADMIN'); --

-- Insert Sample Employees
INSERT INTO employees (employee_name, email, contact_number, gender, address) VALUES
('John Doe', 'john.doe@example.com', '+1234567890', 'Male', '123 Main St, City, State'),
('Jane Smith', 'jane.smith@example.com', '+1234567891', 'Female', '456 Oak Ave, City, State'),
('Mike Johnson', 'mike.johnson@example.com', '+1234567892', 'Male', '789 Pine Rd, City, State'),
('Sarah Wilson', 'sarah.wilson@example.com', '+1234567893', 'Female', '321 Elm St, City, State'),
('David Brown', 'david.brown@example.com', '+1234567894', 'Male', '654 Maple Dr, City, State');

-- Insert Sample User Accounts for Employees (password: User@123)
INSERT INTO user_info (username, password, roles) VALUES 
('john.doe@example.com', '$2a$10$5Zj8Vjh4KXB8Y3wO8YnFjOJ6JYlJdqEtv2rGJz5Y9J6JYlJdqEtv2u', 'ROLE_USER'),
('jane.smith@example.com', '$2a$10$5Zj8Vjh4KXB8Y3wO8YnFjOJ6JYlJdqEtv2rGJz5Y9J6JYlJdqEtv2u', 'ROLE_USER'),
('mike.johnson@example.com', '$2a$10$5Zj8Vjh4KXB8Y3wO8YnFjOJ6JYlJdqEtv2rGJz5Y9J6JYlJdqEtv2u', 'ROLE_USER');

-- Insert Sample Assets
INSERT INTO assets (asset_no, asset_name, category_id, asset_model, manufacturing_date, expiry_date, asset_value, status, description) VALUES
-- Simple Assets (Auto-approved category)
('PEN-001', 'Blue Ballpoint Pen', 1, 'BIC Classic', '2023-01-15', '2025-01-15', 0.50, 'AVAILABLE', 'Standard office ballpoint pen'),
('PEN-002', 'Black Ballpoint Pen', 1, 'BIC Classic', '2023-01-15', '2025-01-15', 0.50, 'AVAILABLE', 'Standard office ballpoint pen'),
('MOUSE-001', 'Wireless Mouse', 2, 'Logitech M705', '2023-02-01', '2026-02-01', 45.99, 'AVAILABLE', 'Wireless optical mouse'),
('MOUSE-002', 'USB Mouse', 2, 'Dell MS116', '2023-02-01', '2026-02-01', 15.99, 'AVAILABLE', 'Wired optical mouse'),
('KB-001', 'Wireless Keyboard', 2, 'Logitech K380', '2023-02-01', '2026-02-01', 39.99, 'AVAILABLE', 'Compact wireless keyboard'),
('PRINT-001', 'Inkjet Printer', 3, 'HP DeskJet 2755', '2023-03-01', '2026-03-01', 89.99, 'AVAILABLE', 'All-in-one inkjet printer'),

-- Complex Assets (Admin approval required)
('LAPTOP-001', 'Business Laptop', 5, 'Dell Latitude 7420', '2023-01-01', '2026-01-01', 1299.99, 'AVAILABLE', 'High-performance business laptop'),
('LAPTOP-002', 'Developer Laptop', 5, 'ThinkPad X1 Carbon', '2023-01-01', '2026-01-01', 1599.99, 'AVAILABLE', 'Premium developer laptop'),
('LAPTOP-003', 'Standard Laptop', 5, 'HP ProBook 450', '2023-01-01', '2026-01-01', 899.99, 'AVAILABLE', 'Standard business laptop'),
('PROJ-001', 'Conference Room Projector', 7, 'Epson PowerLite 2247U', '2023-02-15', '2028-02-15', 899.99, 'AVAILABLE', 'WUXGA projector for conference rooms'),
('DESK-001', 'Executive Desk', 8, 'Herman Miller', '2023-03-01', '2033-03-01', 1200.00, 'AVAILABLE', 'Premium executive office desk'),
('CHAIR-001', 'Ergonomic Office Chair', 8, 'Steelcase Leap V2', '2023-03-01', '2033-03-01', 800.00, 'AVAILABLE', 'Ergonomic office chair with lumbar support');

