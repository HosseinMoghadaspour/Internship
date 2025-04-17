namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
use HasFactory, Notifiable;

protected $fillable = ['username', 'password'];

public function comments() {
return $this->hasMany(Comment::class);
}

public function ratings() {
return $this->hasMany(Rating::class);
}

public function sentMessages() {
return $this->hasMany(Message::class, 'sender_id');
}

public function receivedMessages() {
return $this->hasMany(Message::class, 'receiver_id');
}

public function companyCheckRequests() {
return $this->hasMany(CompanyCheckRequest::class);
}
}
