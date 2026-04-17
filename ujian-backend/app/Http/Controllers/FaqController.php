<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;

/**
 * FaqController — Mengelola data FAQ (Frequently Asked Questions).
 *
 * Menyediakan CRUD untuk FAQ yang ditampilkan kepada pengguna
 * sebagai panduan dan informasi umum.
 */
class FaqController extends Controller
{
    /**
     * Tampilkan daftar semua FAQ.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json(['data' => Faq::all()]);
    }

    /**
     * Simpan FAQ baru.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question'  => 'required|string',
            'answer'    => 'required|string',
            'is_active' => 'boolean',
        ]);

        $faq = Faq::create($validated);

        return response()->json(['data' => $faq], 201);
    }

    /**
     * Tampilkan detail satu FAQ.
     *
     * @param  Faq  $faq
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Faq $faq)
    {
        return response()->json(['data' => $faq]);
    }

    /**
     * Update data FAQ.
     *
     * @param  Request  $request
     * @param  Faq  $faq
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question'  => 'required|string',
            'answer'    => 'required|string',
            'is_active' => 'boolean',
        ]);

        $faq->update($validated);

        return response()->json(['data' => $faq]);
    }

    /**
     * Hapus FAQ.
     *
     * @param  Faq  $faq
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Faq $faq)
    {
        $faq->delete();

        return response()->json(null, 204);
    }
}
