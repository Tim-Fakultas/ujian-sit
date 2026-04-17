# Project Credentials

This file contains a list of test accounts available in the development environment.

## 1. Core Administrative Users
These users are defined in `UsersSeeder.php`.

| Role | Name | Username (NIP/NIM) | Password |
| :--- | :--- | :--- | :--- |
| **Superadmin** | Muhammad Adib Saputra | `2120803026` | `2120803026` |
| **Kaprodi** | Kaprodi Testiana, M.Kom | `Kaprodi12345` | `Kaprodi12345` |
| **Sekprodi** | Sekprodi Testiana, M.Kom | `Sekprodi12345` | `Sekprodi12345` |
| **Admin SI** | Admin Prodi Sistem Informasi | `AdminSI` | `AdminSI` |
| **Admin Biologi** | Admin Prodi Biologi | `AdminBio12345` | `AdminBio12345` |
| **Admin Kimia** | Admin Prodi Kimia | `AdminKimia123` | `AdminKimia123` |

## 2. Lecturers (Dosen)
Lecturers are defined in `DosenSeeder.php`. Most use a standard pattern for credentials.

**Standard Pattern:**
- **Username:** `[first_name][nip_first_8_digits]` (lowercase)
- **Password:** Same as username

| Name | Username | Password |
| :--- | :--- | :--- |
| Gusmelia Testiana, M.Kom. | `gusmelia19750801` | `gusmelia19750801` |
| Ruliansyah, S.T., M.Kom. | `ruliansyah19751122` | `ruliansyah19751122` |
| Dr. Fenny Purwani, M.Kom. | `fenny19671107` | `fenny19671107` |
| RUSMALA SANTI, M.Kom. | `rusmala19791125` | `rusmala19791125` |
| Catur Eri Gunawan, S.T., M.Cs. | `catur19860503` | `catur19860503` |
| Freddy Kurnia Wijaya | `Freddy1987654321` | `Freddy1987654321` |

## 3. Students (Mahasiswa)
Students are imported from local data.

**Standard Pattern:**
- **Username:** `[NIM]`
- **Password:** Same as NIM

| Name | NIM | Password |
| :--- | :--- | :--- |
| Muhammad Luqman Al-Fauzan | `23041450085` | `23041450085` |
| Farah Hasywaza Audremayna | `23041450086` | `23041450086` |
| Rizki Faruli | `23041450087` | `23041450087` |

---
*Note: This file is intended for development and testing purposes only.*
