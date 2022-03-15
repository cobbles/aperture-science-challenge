<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Subject extends Model
{
    use HasFactory;
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'test_chamber',
        'date_of_birth',
        'score',
        'alive',
        'user_id'
    ];

    public function save(array $options = [])
    {
        // Injecting the logged in user to the model save
        // This is perhaps better implemented as a Model Event
        // Or a directive in graphql
        if (!$this->user_id) {
            $this->user_id = Auth::user()->id;
        }
        parent::save($options);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
