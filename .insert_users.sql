-- 1. Tambahkan ke tabel users
-- Password default: password
INSERT IGNORE INTO `users` (`nip_nim`, `nama`, `email`, `prodi_id`, `email_verified_at`, `password`, `created_at`, `updated_at`) VALUES
('198701012015011001', 'Dr. Jane Doe, M.T.', 'janedoe@example.com', 1, NOW(), '$2y$12$NmLtiSVx12/cx5wrVJ77GecT5Gj/szZaWd2xixMW53bFEnJ2N6yyi', NOW(), NOW()),
('198801012015011002', 'John Smith, M.Cs.', 'johnsmith@example.com', 1, NOW(), '$2y$12$NmLtiSVx12/cx5wrVJ77GecT5Gj/szZaWd2xixMW53bFEnJ2N6yyi', NOW(), NOW()),
('198901012015011003', 'Alice Johnson, M.Pd.', 'alice@example.com', 1, NOW(), '$2y$12$NmLtiSVx12/cx5wrVJ77GecT5Gj/szZaWd2xixMW53bFEnJ2N6yyi', NOW(), NOW()),
('199001012015011004', 'Dr. Robert Fox, M.Kom.', 'robertfox@example.com', 1, NOW(), '$2y$12$NmLtiSVx12/cx5wrVJ77GecT5Gj/szZaWd2xixMW53bFEnJ2N6yyi', NOW(), NOW());

-- 2. Berikan Role secara dinamis (Kaprodi, Sekprodi, Dosen)
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`)
SELECT r.id, 'App\\Models\\User', u.id FROM `roles` r, `users` u WHERE r.name = 'kaprodi' AND u.nip_nim = '198701012015011001'
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`)
SELECT r.id, 'App\\Models\\User', u.id FROM `roles` r, `users` u WHERE r.name = 'sekprodi' AND u.nip_nim = '198801012015011002'
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`)
SELECT r.id, 'App\\Models\\User', u.id FROM `roles` r, `users` u WHERE r.name = 'dosen' AND u.nip_nim = '198901012015011003'
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`)
SELECT r.id, 'App\\Models\\User', u.id FROM `roles` r, `users` u WHERE r.name = 'kaprodi' AND u.nip_nim = '199001012015011004'
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);

-- 3. Hubungkan ke tabel dosen
INSERT INTO `dosen` (`user_id`, `nidn`, `nip`, `nama`, `prodi_id`, `status`, `jabatan`, `created_at`, `updated_at`)
SELECT id, '0000000001', '198701012015011001', 'Dr. Jane Doe, M.T.', 1, 'aktif', 'Ka Prodi', NOW(), NOW() FROM `users` WHERE `nip_nim` = '198701012015011001'
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);

INSERT INTO `dosen` (`user_id`, `nidn`, `nip`, `nama`, `prodi_id`, `status`, `jabatan`, `created_at`, `updated_at`)
SELECT id, '0000000002', '198801012015011002', 'John Smith, M.Cs.', 1, 'aktif', 'Sekprodi', NOW(), NOW() FROM `users` WHERE `nip_nim` = '198801012015011002'
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);

INSERT INTO `dosen` (`user_id`, `nidn`, `nip`, `nama`, `prodi_id`, `status`, `jabatan`, `created_at`, `updated_at`)
SELECT id, '0000000003', '198901012015011003', 'Alice Johnson, M.Pd.', 1, 'aktif', 'Dosen', NOW(), NOW() FROM `users` WHERE `nip_nim` = '198901012015011003'
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);

INSERT INTO `dosen` (`user_id`, `nidn`, `nip`, `nama`, `prodi_id`, `status`, `jabatan`, `created_at`, `updated_at`)
SELECT id, '0000000004', '199001012015011004', 'Dr. Robert Fox, M.Kom.', 1, 'aktif', 'Ka Prodi', NOW(), NOW() FROM `users` WHERE `nip_nim` = '199001012015011004'
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);
