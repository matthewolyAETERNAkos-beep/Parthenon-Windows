@echo off
rem Fallback: runs the player in an Edge app window (needs internet for PDF/tag libraries)
start "" msedge --app="file:///%~dp0index.html" --autoplay-policy=no-user-gesture-required
