<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTemplateRequest;
use App\Http\Requests\UpdateTemplateRequest;
use App\Http\Resources\TemplateResource;
use App\Models\Template;

/**
 * TemplateController — Mengelola data template dokumen.
 *
 * Template digunakan untuk generate dokumen ujian
 * (Berita Acara, Daftar Hadir, dll) per jenis ujian.
 */
class TemplateController extends Controller
{
    /**
     * Tampilkan daftar semua template beserta jenis ujian.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return TemplateResource::collection(
            Template::with('jenisUjian')->get()
        );
    }

    /**
     * Simpan template baru.
     *
     * @param  StoreTemplateRequest  $request
     * @return TemplateResource
     */
    public function store(StoreTemplateRequest $request)
    {
        $template = Template::create($request->validated());

        return new TemplateResource($template);
    }

    /**
     * Tampilkan detail satu template.
     *
     * @param  int  $id
     * @return TemplateResource
     */
    public function show($id)
    {
        return new TemplateResource(
            Template::with('jenisUjian')->findOrFail($id)
        );
    }

    /**
     * Update data template.
     *
     * @param  UpdateTemplateRequest  $request
     * @param  Template  $template
     * @return TemplateResource
     */
    public function update(UpdateTemplateRequest $request, Template $template)
    {
        $template->update($request->validated());

        return new TemplateResource($template);
    }

    /**
     * Hapus template.
     *
     * @param  Template  $template
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Template $template)
    {
        $template->delete();

        return response()->json(['message' => 'Template berhasil dihapus.'], 200);
    }
}
