<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // همه می‌توانند درخواست ثبت‌نام بدهند
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
            'mobile' => 'required|string|regex:/^09\d{9}$/|unique:users,mobile',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048' // بهتر است mimes را هم مشخص کنید
        ];
    }
}
