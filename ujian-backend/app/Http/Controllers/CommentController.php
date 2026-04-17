<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * CommentController — Mengelola komentar revisi pada proposal penelitian.
 *
 * Dosen (PA/pembimbing/kaprodi) dan mahasiswa dapat memberikan komentar
 * pada section tertentu dari proposal pengajuan ranpel.
 * Komentar dapat di-resolve untuk menandai bahwa revisi telah selesai.
 */
class CommentController extends Controller
{
    /**
     * Tampilkan daftar komentar berdasarkan proposal dan section.
     *
     * @param  Request  $request  Harus berisi: proposal_id, section_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $request->validate([
            'proposal_id' => 'required|exists:pengajuan_ranpel,id',
            'section_id'  => 'required|string',
        ]);

        $comments = Comment::with('user', 'proposal.mahasiswa')
            ->where('proposal_id', $request->proposal_id)
            ->where('section_id', $request->section_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $comments->map(function ($comment) {
                $isDosen = $comment->user->hasRole(['dosen', 'kaprodi', 'sekprodi', 'superadmin']) || $comment->user->dosen;

                return [
                    'id'         => $comment->id,
                    'proposalId' => $comment->proposal_id,
                    'sectionId'  => $comment->section_id,
                    'userId'     => $comment->user_id,
                    'message'    => $comment->message,
                    'isResolved' => $comment->is_resolved,
                    'createdAt'  => $comment->created_at,
                    'user'       => [
                        'id'   => $comment->user->id,
                        'name' => $comment->user->nama ?? 'Unknown',
                        'role' => $isDosen ? 'dosen' : ($comment->user->roles->first()->name ?? 'user'),
                    ],
                ];
            }),
        ]);
    }

    /**
     * Simpan komentar baru pada section proposal.
     *
     * Hanya dosen (termasuk kaprodi) dan mahasiswa yang diizinkan.
     * Jika `userId` tidak dikirim, menggunakan user yang sedang login.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'proposalId' => 'required|exists:pengajuan_ranpel,id',
            'sectionId'  => 'required|string',
            'message'    => 'required|string',
            'userId'     => 'nullable|exists:users,id',
        ]);

        $targetUserId = $request->userId ?? Auth::id() ?? 1;
        $user = User::findOrFail($targetUserId);

        // Validasi akses: Hanya dosen yang boleh berkomentar (Mahasiswa hanya boleh baca)
        $isDosen = $user->hasRole(['dosen', 'kaprodi', 'sekprodi', 'superadmin']) || $user->dosen;

        if (!$isDosen) {
            return response()->json([
                'message' => 'Unauthorized. Hanya Dosen yang dapat memberikan komentar atau revisi.',
            ], 403);
        }

        $comment = Comment::create([
            'proposal_id' => $request->proposalId,
            'section_id'  => $request->sectionId,
            'user_id'     => $user->id,
            'message'     => $request->message,
            'is_resolved' => false,
        ]);

        $comment->load('user');

        return response()->json([
            'success' => true,
            'data'    => [
                'id'         => $comment->id,
                'proposalId' => $comment->proposal_id,
                'sectionId'  => $comment->section_id,
                'userId'     => $comment->user_id,
                'message'    => $comment->message,
                'isResolved' => $comment->is_resolved,
                'createdAt'  => $comment->created_at,
                'user'       => [
                    'id'   => $comment->user->id,
                    'name' => $comment->user->nama ?? 'Unknown',
                    'role' => $isDosen ? 'dosen' : ($user->roles->first()->name ?? 'user'),
                ],
            ],
        ]);
    }

    /**
     * Tandai komentar sebagai resolved (revisi selesai).
     *
     * @param  int  $id  ID Komentar
     * @return \Illuminate\Http\JsonResponse
     */
    public function resolve($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->update(['is_resolved' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Hapus komentar.
     *
     * @param  int  $id  ID Komentar
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->delete();

        return response()->json(['success' => true]);
    }
}
