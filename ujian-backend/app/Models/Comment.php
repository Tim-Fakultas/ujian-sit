<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Comment — Komentar revisi pada section proposal penelitian.
 *
 * Dosen dan mahasiswa dapat saling memberikan komentar per section.
 * Komentar dapat di-resolve untuk menandai revisi telah selesai.
 *
 * @property int         $id
 * @property int         $proposal_id   FK ke pengajuan_ranpel
 * @property string      $section_id    ID section dalam proposal
 * @property int         $user_id
 * @property string      $message
 * @property bool        $is_resolved
 */
class Comment extends Model
{
    protected $fillable = [
        'proposal_id', 'section_id', 'user_id', 'message', 'is_resolved',
    ];

    protected $casts = [
        'is_resolved' => 'boolean',
    ];

    /** User yang memberikan komentar. */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Proposal (pengajuan ranpel) yang dikomentari. */
    public function proposal(): BelongsTo
    {
        return $this->belongsTo(PengajuanRanpel::class, 'proposal_id');
    }
}
