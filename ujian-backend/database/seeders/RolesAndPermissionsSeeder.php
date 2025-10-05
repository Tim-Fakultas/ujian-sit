<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Daftar permission
        $permissions = [
            'view-dashboard',
            'manage-users',
            'manage-courses',
            'submit-assignment',
            'grade-assignment',
            'approve-course'
        ];

        // Buat permission
        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // Definisi role dan permission
        $roles = [
            'super admin' => ['view-dashboard', 'manage-users', 'manage-courses'],
            'admin prodi' => ['view-dashboard', 'manage-users', 'manage-courses'],
            'kaprodi' => ['approve-course'],
            'sekprodi' => ['approve-course'],
            'dosen' => ['grade-assignment'],
            'mahasiswa' => ['submit-assignment'],
        ];

        // Buat role dan assign permission
        foreach ($roles as $roleName => $perms) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($perms);
        }

        // Note: User role assignment is handled in DatabaseSeeder after user creation
    }
    }
