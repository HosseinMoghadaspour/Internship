namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
use HasFactory;

protected $fillable = ['name', 'description'];

public function comments() {
return $this->hasMany(Comment::class);
}

public function ratings() {
return $this->hasMany(Rating::class);
}
}