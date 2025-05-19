<?php
namespace App\Http\Controllers;

use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
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

public function update(Request $request, $id)
{
$rating = Rating::findOrFail($id);
$rating->update($request->only(['rating', 'message']));
return $rating;
}

public function destroy($id)
{
return Rating::destroy($id);
}
}