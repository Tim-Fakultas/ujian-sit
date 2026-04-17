-- 1. Tambahkan ke tabel users (ID akan otomatis/Auto Increment)
INSERT INTO `users` (`nip_nim`, `nama`, `email`, `prodi_id`, `email_verified_at`, `password`, `created_at`, `updated_at`) VALUES
('198701012015011001', 'Dr. Jane Doe, M.T.', 'janedoe@example.com', 1, '2026-04-16 09:39:03', '$2y$12$6LYbEqom8.oefK63Dr.v.uWfVj0vO3PTe9E6kFvB2Z8k6P4oFpG9u', NOW(), NOW()),
('198801012015011002', 'John Smith, M.Cs.', 'johnsmith@example.com', 1, '2026-04-16 09:39:04', '$2y$12$tEAqaze5UH3qyW.13D4kHu.pX1j3m7P5v9E6kFvB2Z8k6P4oFpG9u', NOW(), NOW()),
('198901012015011003', 'Alice Johnson, M.Pd.', 'alice@example.com', 1, '2026-04-16 09:39:04', '$2y$12$ARB7XT/xO5JbnUwCxdB6k.e9sVj0vO3PTe9E6kFvB2Z8k6P4oFpG9u', NOW(), NOW());

-- 2. Tambahkan ke tabel dosen dengan mengambil user_id dari hasil insert di atas
INSERT INTO `dosen` (`user_id`, `nidn`, `nip`, `nama`, `prodi_id`, `status`, `jabatan`, `created_at`, `updated_at`)
SELECT id, '0000000001', '198701012015011001', 'Dr. Jane Doe, M.T.', 1, 'aktif', 'Ka Prodi', NOW(), NOW() FROM `users` WHERE `nip_nim` = '198701012015011001';

INSERT INTO `dosen` (`user_id`, `nidn`, `nip`, `nama`, `prodi_id`, `status`, `jabatan`, `created_at`, `updated_at`)
SELECT id, '0000000002', '198801012015011002', 'John Smith, M.Cs.', 1, 'aktif', 'Sekprodi', NOW(), NOW() FROM `users` WHERE `nip_nim` = '198801012015011002';

INSERT INTO `dosen` (`user_id`, `nidn`, `nip`, `nama`, `prodi_id`, `status`, `jabatan`, `created_at`, `updated_at`)
SELECT id, '0000000003', '198901012015011003', 'Alice Johnson, M.Pd.', 1, 'aktif', 'Dosen', NOW(), NOW() FROM `users` WHERE `nip_nim` = '198901012015011003';
