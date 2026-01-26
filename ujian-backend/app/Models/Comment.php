<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    protected $fillable = [
        'proposal_id',
        'section_id',
        'user_id',
        'message',
        'is_resolved'
    ];

    protected $casts = [
        'is_resolved' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function proposal(): BelongsTo
    {
        return $this->belongsTo(PengajuanRanpel::class, 'proposal_id');
    }
}
