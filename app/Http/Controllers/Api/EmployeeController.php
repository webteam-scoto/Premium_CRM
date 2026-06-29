<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /** GET /api/employees */
    public function index(Request $request)
    {
        $query = Employee::with('user');

        if ($status = $request->query('status')) {
            $query->where('Status', $status);
        }

        if ($role = $request->query('role')) {
            $query->where('Role', $role);
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('Name', 'like', "%{$search}%")
                  ->orWhere('Designation', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->orderByDesc('Id')->get()
        );
    }

    /** GET /api/employees/{id} */
    public function show($id)
    {
        $employee = Employee::with('user')->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        return response()->json($employee);
    }

    /**
     * POST /api/employees
     * System Admin creates an employee → role = admin
     * Admin creates an employee → role = end_user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Name'        => 'required|string|max:255',
            'Designation' => 'nullable|string|max:255',
            'District'    => 'nullable|string|max:255',
            'Taluk'       => 'nullable|string|max:255',
            'JoinedAt'    => 'nullable|date',
            'phone'       => 'required|string|unique:users,phone',
            'dob'         => 'required|string',  // ddmmyy — used as password
        ]);

        // Determine role based on who is creating
        $creatorRole = $request->user()->role ?? 'system_admin';
        $newRole = ($creatorRole === 'system_admin') ? 'admin' : 'end_user';

        // Create linked User
        $user = User::create([
            'name'     => $validated['Name'],
            'email'    => 'emp_' . $validated['phone'] . '@premiercrm.com',
            'phone'    => $validated['phone'],
            'dob'      => $validated['dob'],
            'password' => $validated['dob'],   // plain text dob as password
            'role'     => $newRole,
            'Status'   => 'pending',
        ]);

        // Create employee_mst record
        $employee = Employee::create([
            'UserId'      => $user->id,
            'Name'        => $validated['Name'],
            'Designation' => $validated['Designation'] ?? null,
            'District'    => $validated['District'] ?? null,
            'Taluk'       => $validated['Taluk'] ?? null,
            'Role'        => $newRole,
            'Status'      => 'pending',
            'JoinedAt'    => $validated['JoinedAt'] ?? null,
        ]);

        return response()->json($employee->load('user'), 201);
    }

    /**
     * PUT /api/employees/{id}
     * Edit employee details
     */
    public function update(Request $request, $id)
    {
        $employee = Employee::with('user')->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $validated = $request->validate([
            'Name'        => 'sometimes|string|max:255',
            'Designation' => 'sometimes|nullable|string|max:255',
            'District'    => 'sometimes|nullable|string|max:255',
            'Taluk'       => 'sometimes|nullable|string|max:255',
            'JoinedAt'    => 'sometimes|nullable|date',
            'Status'      => 'sometimes|in:approved,pending,inactive',
        ]);

        $employee->update($validated);

        if (isset($validated['Name']) && $employee->user) {
            $employee->user->update(['name' => $validated['Name']]);
        }

        return response()->json($employee->load('user'));
    }

    /** PATCH /api/employees/{id}/status */
    public function updateStatus(Request $request, $id)
    {
        $employee = Employee::with('user')->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,pending,inactive',
        ]);

        $employee->update(['Status' => $validated['status']]);

        // Sync linked user Status
        if ($employee->user) {
            $userStatus = $validated['status'] === 'approved' ? 'active' : 'inactive';
            $employee->user->update(['Status' => $userStatus]);
        }

        return response()->json($employee->load('user'));
    }
}