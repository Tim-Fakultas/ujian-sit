<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTemplateRequest;
use App\Http\Requests\UpdateTemplateRequest;
use App\Http\Resources\TemplateResource;
use App\Models\Template;

class TemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $template = Template::with(['jenis_ujian'])->get();
        return TemplateResource::collection($template);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTemplateRequest $request)
    {
        $request->validated();
        $template = Template::create($request->all());
        return new TemplateResource($template);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $template = Template::with(['jenisUjian'])->findOrFail($id);
        return new TemplateResource($template);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTemplateRequest $request, Template $template)
    {
        $request->validated();
        $template->update($request->all());

        return new TemplateResource($template);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Template $template)
    {
        $template->delete();
        return response()->json(['message' => 'Template berhasil dihapus.'], 200);
    }
}
