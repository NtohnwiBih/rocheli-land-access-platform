<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeamRequest;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/team-members/index', [
            'members' => Team::orderBy('order')->get()->map(fn (Team $m) => [
                'id' => $m->id,
                'name_en' => $m->name['en'] ?? '',
                'position_en' => $m->position['en'] ?? '',
                'image' => $m->image_url,
                'order' => $m->order,
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/team-members/form', ['member' => null]);
    }

    public function store(StoreTeamRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('team-members', 'public')
            : null;

        Team::create($this->mapPayload($validated, $imagePath));

        return redirect()->route('admin.team-members.index')->with('success', 'Team member created.');
    }

    public function edit(Team $team): Response
    {
        return Inertia::render('admin/team-members/form', [
            'member' => [
                'id' => $team->id,
                'name_en' => $team->name['en'] ?? '',
                'name_fr' => $team->name['fr'] ?? '',
                'position_en' => $team->position['en'] ?? '',
                'position_fr' => $team->position['fr'] ?? '',
                'order' => $team->order,
                'image' => $team->image_url,
            ],
        ]);
    }

    public function update(StoreTeamRequest $request, Team $team): RedirectResponse
    {
        $validated = $request->validated();

        $imagePath = $team->image_path;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('team-members', 'public');
        }

        $team->update($this->mapPayload($validated, $imagePath));

        return redirect()->route('admin.team-members.index')->with('success', 'Team member updated.');
    }

    public function destroy(Team $team): RedirectResponse
    {
        if ($team->image_path) {
            Storage::disk('public')->delete($team->image_path);
        }

        $team->delete();

        return back()->with('success', 'Team member removed.');
    }

    protected function mapPayload(array $validated, ?string $imagePath): array
    {
        return [
            'name' => ['en' => $validated['name_en'], 'fr' => $validated['name_fr']],
            'position' => ['en' => $validated['position_en'], 'fr' => $validated['position_fr']],
            'order' => $validated['order'] ?? 0,
            'image_path' => $imagePath,
        ];
    }
}