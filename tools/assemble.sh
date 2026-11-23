#!/usr/bin/env bash
# Gabung scene (concat -c copy) + mux audio master → out/pengganti-wapres-<preview|final>.mp4
set -euo pipefail
KIND="${1:?preview|final}"
N=$(python3 -c "import json;print(len(json.load(open('docs/timeline.json'))['scenes']))")
: > out/concat.txt
for i in $(seq 1 "$N"); do echo "file 'scenes/scene-$i.mp4'" >> out/concat.txt; done
# parameter codec identik antar scene WAJIB
for i in $(seq 1 "$N"); do ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt -of csv=p=0 out/scenes/scene-$i.mp4; done | sort -u | awk 'END{if(NR!=1){print "FAIL parameter scene tidak identik"; exit 1} else print "PASS parameter scene identik"}'
ffmpeg -v error -y -f concat -safe 0 -i out/concat.txt -c copy out/video-only.mp4
ffmpeg -v error -y -i out/video-only.mp4 -i out/audio-final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/pengganti-wapres-$KIND.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,avg_frame_rate -of compact out/pengganti-wapres-$KIND.mp4
