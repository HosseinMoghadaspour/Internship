<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    /**
     * متد جدید: نمایش تمام نظرات برای ادمین
     */
    public function index()
    {
        // تمام نظرات را به همراه اطلاعات کاربر و شرکت مرتبط واکشی می‌کند
        $ratings = Rating::with(['user:id,username,img', 'company:id,name'])->latest()->get();

        return response()->json($ratings);
    }

    /**
     * ثبت یک نظر جدید توسط کاربر
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'company_id' => 'required|exists:companies,id',
            'rating' => 'required|integer|min:1|max:5',
            'message' => 'nullable'
        ]);

        return Rating::create($validated);
    }

    /**
     * به‌روزرسانی یک نظر توسط ادمین
     */
    public function update(Request $request, $id)
    {
        $rating = Rating::findOrFail($id);
        $rating->update($request->only(['rating', 'message'])); //
        return $rating;
    }

    /**
     * حذف یک نظر توسط ادمین
     */
    public function destroy($id)
    {
        Rating::destroy($id); //
        return response()->json(['message' => 'نظر با موفقیت حذف شد.']);
    }

    /**
     * نمایش نظرات مربوط به یک شرکت خاص
     */
    public function show($id)
    {
        return Rating::where('company_id', $id)
            ->with('user')
            ->get();
    }
}
