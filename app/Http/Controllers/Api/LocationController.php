<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LocationCode;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * GET /api/locations/districts
     * Returns unique district list.
     */
    public function districts()
    {
        $districts = LocationCode::select('District')
            ->distinct()
            ->orderBy('District')
            ->pluck('District');

        return response()->json($districts);
    }

    /**
     * GET /api/locations/taluks?district=Coimbatore
     * Returns taluks for a given district.
     */
    public function taluks(Request $request)
    {
        $request->validate(['district' => 'required|string']);

        $taluks = LocationCode::where('District', $request->district)
            ->orderBy('Taluk')
            ->pluck('Taluk');

        return response()->json($taluks);
    }
}