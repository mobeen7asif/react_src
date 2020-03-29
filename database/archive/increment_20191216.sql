
-- Add column for employee ID for staff users
alter table users add COLUMN `client_employee_no` varchar(200) NULL AFTER `client_customer_id`;
