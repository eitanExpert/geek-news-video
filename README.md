# Geek News video engine

Motion-graphics renderer for the Geek News pipeline, built with [Remotion](https://www.remotion.dev).

- `src/scenes/` – animated scene types (hook, kinetic, phone, stat, countdown, versus, list, broll, quote, outro)
- `src/components/` – captions, backgrounds, transitions, overlays
- `sample-props.json` – example input (the Instagram Stories video)
- `.github/workflows/render.yml` – renders a video on GitHub Actions and publishes it as a release asset

The n8n pipeline starts a render by calling the workflow with a `job_id` and the video `props` (JSON).
The finished MP4 appears as a release named after the `job_id`.

Remotion is free for individuals and companies of up to 3 people; see remotion.dev/license.
Sound effects in `public/sfx/` were synthesised for this project.
