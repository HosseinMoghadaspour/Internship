<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyImage;
use App\Models\User;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|unique:companies,name',
            'province'    => 'string',
            'city'        => 'string',
            'address'     => 'string',
            'description' => 'nullable|string',
            'introduced_by' => 'exists:users,id',
            'images.*'    => 'nullable|image|max:2048',
        ]);

        $company = Company::create([
            'name'          => $validated['name'],
            'province'      => $validated['province'],
            'city'          => $validated['city'],
            'address'       => $validated['address'],
            'description'   => $validated['description'] ?? null,
            'introduced_by' => $validated['introduced_by'],
            'is_verified'   => 0,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('companies', 'public');
                CompanyImage::create([
                    'company_id' => $company->id,
                    'image_path' => $path,
                ]);
            }
        }

        return response()->json([
            'message' => 'شرکت برای بررسی ثبت شد و پس از تأیید ادمین نمایش داده خواهد شد.',
            'company' => $company->load('images')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['message' => 'شرکت مورد نظر یافت نشد.'], 404);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|string|unique:companies,name,' . $company->id,
            'province'    => 'sometimes|string',
            'city'        => 'sometimes|string',
            'address'     => 'sometimes|string',
            'description' => 'sometimes|nullable|string',
        ]);

        $updateData = array_merge($validated, [
            'is_verified' => !$company->is_verified
        ]);

        $company->update($updateData);
        return response()->json([
            'message' => 'اطلاعات شرکت با موفقیت به‌روزرسانی شد.',
            'company' => $company
        ]);
    }


    public function index()
    {
        $companies = Company::with(['images', 'introducedBy'])
            ->withAvg('ratings', 'rating')
            ->where('is_verified', 1)
            ->get()
            ->map(function ($company) {
                $company->average_rating = (float) $company->ratings_avg_rating ?? 0;
                unset($company->ratings_avg_rating);
                return $company;
            });

        return response()->json([
            'companies' => $companies
        ]);
    }

    public function show($id)
    {
        $company = Company::with(['images', 'introducedBy'])
            ->withAvg('ratings', 'rating')
            ->find($id);

        if (!$company) {
            return response()->json(['message' => 'شرکت مورد نظر یافت نشد.'], 404);
        }
        $company->average_rating = (float) $company->ratings_avg_rating ?? 0;
        unset($company->ratings_avg_rating);
        return response()->json($company);
    }

    public function verified()
    {

        $unverifiedCompanies = Company::where('is_verified', true)
            ->with(['images', 'introducedBy'])
            ->get();

        return response()->json([
            'companies' => $unverifiedCompanies
        ]);
    }
    public function unverified()
    {

        $unverifiedCompanies = Company::where('is_verified', false)
            ->with(['images', 'introducedBy'])
            ->get();

        return response()->json([
            'companies' => $unverifiedCompanies
        ]);
    }
    public function getCompaniesByUserId($userId)
    {
        $user = User::findOrFail($userId);

        $companies = $user->introducedCompanies()
            ->with('images')
            ->latest()
            ->get();

        return response()->json($companies);
    }
    public function destroy($id)
    {
        $company = Company::findOrFail($id);
        $company->delete();

        return response()->json([
            'message' => 'شرکت با موفقیت حذف شد.'
        ], 200);
    }
}
