# Heisenberg Microscope (2D)

Interactive sandbox to visualise the Heisenberg microscope thought experiment: an electron drifts horizontally while photons fired from below measure its position and impart momentum. Shorter wavelengths give tighter localisation but kick the electron harder.

## Run

```bash
cd Heisenbergs-Microscope
npm install          # once
npm run build        # rebuild bundle.js after edits
npx http-server -c-1 .  # or any static server
```

Open `http://localhost:8080` (default http-server port).

## How to use

- Click the lamp to fire a photon. Spacebar toggles pause/resume.
- Toggle **Auto fire** and **Auto fire rate** to stream photons.
- **Photon lambda (nm)** changes wavelength (colour, wave thickness). Short lambda → high energy, tighter spot; long lambda → lower energy, more miss-prone.
- **Beam spread** controls aim jitter (matters most at long wavelengths).
- **Kick scale** and **Electron mass** set how strong the collision deflects.
- **Simulation speed** plus **Pause simulation** and **Pause on collision** control pacing. Scroll to zoom; left-drag (or Alt-drag) to pan.
- **Reset electron** recentres and restores its initial drift. A dashed guide shows the unperturbed path.

## Presets

- **Preset: Base** – lambda 520 nm, auto fire off, fire rate 1.5, pause-on-collision off (startup state).
- **Preset: High energy pause** – lambda 220 nm, auto fire off, pause-on-collision on, fire rate 1.5 (single dramatic hits).

## Screenshots

Embed these (already in `../Screenshots/`):

- Empty scene: `![Empty scene](../Screenshots/Empty.png)`
- Photon hit with vectors: `![Photon hit](../Screenshots/Hit.png)`
- Different wavelengths comparison: `![Different wavelengths](../Screenshots/Different_Wave_Lengths.png)`

## Presentation tips

- Show long wavelength first: broad spot, gentle/no deflection.
- Switch to short wavelength: tighter spot, visible kick; pause on collision for clear vectors (blue/orange photon, green/pink electron).
- Fire multiple photons to demonstrate accumulated momentum uncertainty.

## Files

- `index.html` – layout and canvas host.
- `style.css` – styling and overlay.
- `main.js` – simulation logic (bundled to `bundle.js` with `npm run build`).
- `vendor/lil-gui.esm.min.js` – on-page controls (no external CDN needed).
