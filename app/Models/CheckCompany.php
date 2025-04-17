namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CheckCompany extends Model
{
use HasFactory;

protected $fillable = ['user_id', 'company_name', 'reason'];

public function user() {
return $this->belongsTo(User::class);
}
}
