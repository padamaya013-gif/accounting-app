-- ============================================
-- SEED DATABASE - INITIAL DATA
-- ============================================

-- 1. Insert Companies
INSERT INTO companies (id, name, address, phone, email, logo_url, tax_number) 
VALUES
('e1234567-1234-1234-1234-123456789001', 'PT SUKOY MANDIRI TEKNOLOGI', 'Perum Taman Juanda Blok Utama No. 16 Cilacap - Jawa Tengah', '(0282) 123-4567', 'info@sukoy.com', NULL, '12.345.678.9-123.000'),
('e1234567-1234-1234-1234-123456789002', 'PT GELYN SIDNI', 'Perum Taman Juanda Blok Utama No. 16 Cilacap - Jawa Tengah', '(0282) 987-6543', 'info@gelyn.com', NULL, '98.765.432.1-456.000')
ON CONFLICT DO NOTHING;

-- 2. Insert Projects
INSERT INTO projects (id, company_id, project_name, project_code, description, start_date, status)
VALUES
(gen_random_uuid(), 'e1234567-1234-1234-1234-123456789001', 'Website Redesign', 'PRJ-001', 'Redesign website perusahaan', '2024-01-01', 'ongoing'),
(gen_random_uuid(), 'e1234567-1234-1234-1234-123456789001', 'Mobile App Development', 'PRJ-002', 'Develop aplikasi mobile', '2024-02-01', 'ongoing'),
(gen_random_uuid(), 'e1234567-1234-1234-1234-123456789002', 'Sistem ERP', 'PRJ-003', 'Implementasi Sistem ERP', '2024-01-15', 'ongoing');

-- 3. Verifikasi Data
SELECT '=== COMPANIES ===' as section;
SELECT * FROM companies;

SELECT '=== PROJECTS ===' as section;
SELECT * FROM projects;
