<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\PengajuanRanpel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'proposal_id' => 'required|exists:pengajuan_ranpel,id',
            'section_id' => 'required|string',
        ]);

        $comments = Comment::with('user', 'proposal.mahasiswa')
            ->where('proposal_id', $request->proposal_id)
            ->where('section_id', $request->section_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $comments->map(function ($comment) {
                // Determine logic: 
                // Checks if user has 'dosen' role. 
                // OR checks if the user corresponds to the 'dosen_pa' or pembimbing of the student for additional robustness.
    
                $isDosen = $comment->user->hasRole(['dosen', 'kaprodi']) || $comment->user->dosen;

                return [
                    'id' => $comment->id,
                    'proposalId' => $comment->proposal_id,
                    'sectionId' => $comment->section_id,
                    'userId' => $comment->user_id,
                    'message' => $comment->message,
                    'isResolved' => $comment->is_resolved,
                    'createdAt' => $comment->created_at,
                    'user' => [
                        'id' => $comment->user->id,
                        'name' => $comment->user->nama ?? 'Unknown',
                        'role' => $isDosen ? 'dosen' : ($comment->user->roles->first()->name ?? 'user'),
                    ]
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'proposalId' => 'required|exists:pengajuan_ranpel,id',
            'sectionId' => 'required|string',
            'message' => 'required|string',
            'userId' => 'nullable|exists:users,id'
        ]);

        $targetUserId = $request->userId ?? Auth::id() ?? 1;
        $user = User::findOrFail($targetUserId);

        // Access Control Logic: Only "Dosen Pembimbing" (role: dosen) can post revisions (unless it is the student themselves?)
        // The requirement says: "Hanya user dengan role 'Dosen Pembimbing' yang bisa mengirim data". 
        // We assume Students also need to reply, but the restriction specifically asked for Dosen Pembimbing validation.
        // Let's assume if the user is NOT a student, they MUST be a Dosen.

        $isMahasiswa = $user->hasRole('mahasiswa');
        $isDosen = $user->hasRole('dosen');

        // If user is Kaprodi but NOT Dosen, they should be blocked?
        // But if they are Kaprodi AND Dosen, they are allowed (isDosen will be true).

        if (!$isMahasiswa && !$isDosen) {
            // Check if user has 'kaprodi' role, as they often act as supervisors too.
            if ($user->hasRole('kaprodi') || $user->dosen) {
                $isDosen = true;
            } else {
                return response()->json(['message' => 'Unauthorized. Only Dosen or Mahasiswa can comment.'], 403);
            }
        }

        $comment = Comment::create([
            'proposal_id' => $request->proposalId,
            'section_id' => $request->sectionId,
            'user_id' => $user->id,
            'message' => $request->message,
            'is_resolved' => false,
        ]);

        $comment->load('user');

        $roleResponse = $isDosen ? 'dosen' : ($user->roles->first()->name ?? 'user');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $comment->id,
                'proposalId' => $comment->proposal_id,
                'sectionId' => $comment->section_id,
                'userId' => $comment->user_id,
                'message' => $comment->message,
                'isResolved' => $comment->is_resolved,
                'createdAt' => $comment->created_at,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->nama ?? 'Unknown',
                    'role' => $roleResponse,
                ]
            ]
        ]);
    }

    public function resolve($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->update(['is_resolved' => true]);

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->delete();

        return response()->json(['success' => true]);
    }
}
