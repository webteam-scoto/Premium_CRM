<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard
     * Returns real counts + recent orders for the dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Base scopes
        $customerQ = Customer::query();
        $orderQ    = Order::with(['customer', 'product']);
        $productQ  = Product::query();

        // Scope by role
        if ($user->role === 'end_user') {
            $customerQ->where('District', $user->District)->where('Taluk', $user->Taluk);
            $orderQ->whereHas('customer', fn($q) => $q->where('Taluk', $user->Taluk));
        } elseif ($user->role === 'admin') {
            $customerQ->where('District', $user->District);
            $orderQ->whereHas('customer', fn($q) => $q->where('District', $user->District));
        }

        $totalCustomers = (clone $customerQ)->where('Status', 'approved')->count();
        $activeOrders   = (clone $orderQ)->whereIn('Status', ['pending', 'processing', 'approved'])->count();
        $totalProducts  = $productQ->where('Status', 'active')->count();
        $totalRevenue   = (clone $orderQ)->where('PaymentStatus', 'paid')->sum('TotalAmount');

        $recentOrders = (clone $orderQ)
            ->orderBy('CreatedAt', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($o) => [
                'id'            => $o->Code,
                'customer'      => $o->customer->Name ?? '—',
                'product'       => $o->product->Name ?? '—',
                'amount'        => $o->TotalAmount,
                'status'        => $o->Status,
                'payment'       => $o->PaymentStatus,
                'delivery_date' => $o->DeliveryDate,
            ]);

        return response()->json([
            'stats' => [
                'total_customers' => $totalCustomers,
                'active_orders'   => $activeOrders,
                'total_products'  => $totalProducts,
                'total_revenue'   => $totalRevenue,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }
}