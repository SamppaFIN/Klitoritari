# Audio Assets

This directory contains MP3 audio files for the game. Since we can't generate actual MP3 files in this environment, the AssetManager will fall back to Web Audio API generated sounds.

## Required Audio Files

- `ambient_hum.mp3` - Background ambient sound
- `step_sound.mp3` - Step counting sound effect
- `quest_complete.mp3` - Quest completion sound
- `combat_win.mp3` - Combat victory sound
- `combat_lose.mp3` - Combat defeat sound
- `flag_place.mp3` - Flag placement sound
- `region_capture.mp3` - Territory capture sound
- `notification.mp3` - General notification sound
- `error.mp3` - Error notification sound

## Fallback Behavior

If MP3 files are not found, the AssetManager will automatically generate fallback sounds using Web Audio API with appropriate frequencies and durations for each sound type.
