<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|unique:companies,name',
            'province'    => 'nullable|string',
            'city'        => 'nullable|string',
            'description' => 'nullable|string',
            'introduced_by' => 'nullable|exists:users,id',
            'images.*'    => 'nullable|image|max:2048', // multiple images
        ]);

        // ساخت شرکت
        $company = Company::create([
            'name'          => $validated['name'],
            'province'      => $validated['province'] ?? null,
            'city'          => $validated['city'] ?? null,
            'description'   => $validated['description'] ?? null,
            'introduced_by' => $validated['introduced_by'] ?? null,
        ]);

        // ذخیره عکس‌ها
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('companies', 'public'); // ذخیره در storage/app/public/companies
                CompanyImage::create([
                    'company_id' => $company->id,
                    'image_path' => $path,
                ]);
            }
        }

        return response()->json([
            'message' => 'شرکت با موفقیت ثبت شد.',
            'company' => $company->load('images')
        ], 201);
    }
}
