<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    /** GET /api/customers */
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('Name', 'like', "%{$search}%")
                  ->orWhere('Code', 'like', "%{$search}%")
                  ->orWhere('Phone', 'like', "%{$search}%");
            });
        }

        if ($type = $request->query('type')) {
            $query->where('Type', $type);
        }

        if ($status = $request->query('status')) {
            $query->where('Status', $status);
        }

        return response()->json(
            $query->orderByDesc('Id')->get()
        );
    }

    /** GET /api/customers/{id} */
    public function show($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        return response()->json($customer);
    }

    /** POST /api/customers */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:191',
            'phone'       => 'required|string|max:20',
            'email'       => 'nullable|email|max:191',
            'type'        => 'required|in:retail,wholesale',
            'district'    => 'required|string|max:100',
            'taluk'       => 'required|string|max:100',
            'address'     => 'nullable|string',
            'creditLimit' => 'nullable|numeric',
            'notes'       => 'nullable|string',
        ]);

        $customer = Customer::create([
            'Code'        => $this->generateCustomerCode(),
            'Name'        => $validated['name'],
            'Phone'       => $validated['phone'],
            'Email'       => $validated['email'] ?? null,
            'Type'        => $validated['type'],
            'District'    => $validated['district'],
            'Taluk'       => $validated['taluk'],
            'Address'     => $validated['address'] ?? null,
            'CreditLimit' => $validated['creditLimit'] ?? null,
            'Outstanding' => 0,
            'Status'      => 'pending',
            'Notes'       => $validated['notes'] ?? null,
            'CreatedBy'   => $request->user()->id,
        ]);

        return response()->json($customer, 201);
    }

    /** PUT /api/customers/{id} */
    public function update(Request $request, $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:191',
            'phone'       => 'sometimes|required|string|max:20',
            'email'       => 'nullable|email|max:191',
            'type'        => 'sometimes|required|in:retail,wholesale',
            'district'    => 'sometimes|required|string|max:100',
            'taluk'       => 'sometimes|required|string|max:100',
            'address'     => 'nullable|string',
            'creditLimit' => 'nullable|numeric',
            'outstanding' => 'nullable|numeric',
            'status'      => 'sometimes|required|in:approved,pending,declined',
            'notes'       => 'nullable|string',
        ]);

        $map = [
            'name' => 'Name', 'phone' => 'Phone', 'email' => 'Email', 'type' => 'Type',
            'district' => 'District', 'taluk' => 'Taluk', 'address' => 'Address',
            'creditLimit' => 'CreditLimit', 'outstanding' => 'Outstanding',
            'status' => 'Status', 'notes' => 'Notes',
        ];

        $update = [];
        foreach ($map as $reqKey => $column) {
            if (array_key_exists($reqKey, $validated)) {
                $update[$column] = $validated[$reqKey];
            }
        }

        if (isset($update['Status']) && $update['Status'] === 'approved') {
            $update['ApprovedBy'] = $request->user()->id;
        }

        $customer->update($update);

        return response()->json($customer);
    }

    /** DELETE /api/customers/{id} */
    public function destroy($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        $customer->delete();

        return response()->json(['message' => 'Customer deleted']);
    }

    /** PATCH /api/customers/{id}/status */
    public function updateStatus(Request $request, $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,pending,declined',
        ]);

        $update = ['Status' => $validated['status']];

        if ($validated['status'] === 'approved') {
            $update['ApprovedBy'] = $request->user()->id;
        }

        $customer->update($update);

        return response()->json($customer);
    }

    private function generateCustomerCode(): string
    {
        $last = Customer::orderByDesc('Id')->first();
        $nextNumber = $last ? ((int) Str::after($last->Code, 'CUST-')) + 1 : 1;

        return 'CUST-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}
