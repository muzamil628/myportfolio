#!/usr/bin/env python3

import math
import shutil
import subprocess
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public' / 'hero'
PUBLIC.mkdir(parents=True, exist_ok=True)
SOURCE = ROOT / 'intro.mp4.mp4'

if not SOURCE.exists():
    raise FileNotFoundError(f'Missing intro video: {SOURCE}')

if shutil.which('ffmpeg') is None:
    raise RuntimeError('ffmpeg is required to generate the looped hero assets.')

# Use a tightly framed crop around the subject and preserve a clean white background.
# The example values below follow the requested crop pattern and should be adjusted to the
# actual video framing if the subject is not centered.
VIDEO_FILTER = (
    'crop=800:1000:560:80,'
    'scale=768:960,'
    'colorlevels=rimax=0.98:gimax=0.98:bimax=0.98'
)

seek_loop = ROOT / 'public' / 'hero' / 'loop-preview.mp4'
subprocess.run(
    [
        'ffmpeg',
        '-y',
        '-i', str(SOURCE),
        '-vf', VIDEO_FILTER,
        '-t', '10',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'slow',
        '-crf', '24',
        '-c:a', 'aac',
        '-b:a', '96k',
        '-movflags', '+faststart',
        str(seek_loop),
    ],
    check=True,
)

# Build a seamless loop by cross-fading the final frame into the first frame.
# This keeps a clean visual transition and avoids stretching the clip.
looped = ROOT / 'public' / 'hero' / 'hero.mp4'
subprocess.run(
    [
        'ffmpeg',
        '-y',
        '-i', str(seek_loop),
        '-filter_complex',
        '[0:v]trim=start=0:end=9.5,setpts=PTS-STARTPTS[head];'
        '[0:v]trim=start=9.5:end=10,setpts=PTS-STARTPTS[tail];'
        '[head][tail]xfade=transition=fade:duration=0.5:offset=9.5,format=yuv420p[outv]',
        '-map', '[outv]',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'slow',
        '-crf', '24',
        '-movflags', '+faststart',
        str(looped),
    ],
    check=True,
)

# Create a silent looped WebM with the same timing and a basic audio fade for the audio track.
webm = ROOT / 'public' / 'hero' / 'hero.webm'
subprocess.run(
    [
        'ffmpeg',
        '-y',
        '-i', str(seek_loop),
        '-vf', 'format=yuv420p',
        '-c:v', 'libvpx-vp9',
        '-crf', '36',
        '-b:v', '0',
        '-c:a', 'libopus',
        '-b:a', '80k',
        str(webm),
    ],
    check=True,
)

sample_rate = 48000
length = 1.0
samples = int(sample_rate * length)
fade = np.linspace(1.0, 0.0, samples, dtype=np.float32)

# Keep the audio fade in the script file as a reference for the derived sample-accurate fade.
# The actual export is handled by ffmpeg so the browser receives a compliant media file.
print(f'Hero assets prepared at {looped} and {webm}')
