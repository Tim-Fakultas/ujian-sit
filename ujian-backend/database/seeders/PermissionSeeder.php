namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        Permission::create(['name' => 'view_profile']);
        Permission::create(['name' => 'submit_assignment']);
        Permission::create(['name' => 'grade_assignments']);
        Permission::create(['name' => 'manage_students']);
        Permission::create(['name' => 'approve_proposals']);
        Permission::create(['name' => 'schedule_exams']);
        Permission::create(['name' => 'full_access']);

        // Create roles and assign permissions
        $roleMahasiswa = Role::create(['name' => 'mahasiswa']);
        $roleDosen = Role::create(['name' => 'dosen']);
        $roleKaprodi = Role::create(['name' => 'kaprodi']);
        $roleAdminProdi = Role::create(['name' => 'admin_prodi']);

        // Assign permissions to roles
        $roleDosen->givePermissionTo('grade_assignments');
        $roleDosen->givePermissionTo('manage_students');

        $roleKaprodi->givePermissionTo('approve_proposals');
        $roleKaprodi->givePermissionTo('schedule_exams');

        $roleAdminProdi->givePermissionTo('full_access');
    }
}
