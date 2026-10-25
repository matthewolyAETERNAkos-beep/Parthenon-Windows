# Parthenon for Windows 11

Desktop version of the player (Electron). Folder picking, media keys, and
background playback all work like a normal Windows app.

## Option A - build the .exe on GitHub (recommended)
1. Create a new empty GitHub repo and upload everything in this folder
   (the hidden `.github` folder too; if it is skipped, create
   `.github/workflows/build.yml` with *Add file -> Create new file*).
2. Actions tab -> "Build Windows app" -> wait ~5 min for the green check.
3. Download the **Parthenon-Windows** artifact. Inside:
   - `Parthenon-Portable.exe`  - run it, nothing to install
   - `Parthenon-Setup.exe`     - installs it with a Start menu shortcut
4. Windows SmartScreen may warn (the app is unsigned): More info -> Run anyway.

## Option B - run on your PC with Node.js
    npm install
    npm start

## Option C - no build at all
Double-click `Open in Edge (no build needed).bat`.

## Updating the player
Replace `index.html` and commit; GitHub builds a new .exe.
