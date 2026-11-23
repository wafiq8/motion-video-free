#!/usr/bin/env bash
# Mix: narasi (master) + musik (ducked) + SFX → loudnorm −14 LUFS, TP −1.5 → out/audio-final.wav
set -euo pipefail
T=$(python3 -c "import json;print(json.load(open('docs/timeline.json'))['total_duration_s'])")
FC="[0:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:$T,asplit=2[nar][key];
[1:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:$T,volume=0.32,afade=t=in:d=0.4,afade=t=out:st=$(python3 -c "print($T-1.2)"):d=1.2[mus];
[mus][key]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[duck];
[2:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:$T[sfx];
[nar][duck][sfx]amix=inputs=3:normalize=0:duration=first[mix]"
ffmpeg -v error -y -i public/narasi.mp3 -i public/musik.mp3 -i out/sfx-track.wav -filter_complex "$FC" -map "[mix]" -c:a pcm_s16le out/audio-premix.wav
M=$(ffmpeg -hide_banner -i out/audio-premix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i out/audio-premix.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -c:a pcm_s16le out/audio-final.wav
ffmpeg -hide_banner -i out/audio-final.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2
