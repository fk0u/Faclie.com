# Desktop Application Guide - Faclie Client Simulator

Faclie can be compiled and packaged into a standalone desktop application for Windows, macOS, and Linux using Electron and `electron-builder`.

## Desktop Architecture

The desktop wrapper consists of:
1.  **Main Process** ([electron/main.js](file:///d:/Project/Faclie.com/electron/main.js)): The entry point. In production, it spawns a local Next.js background server process and manages the BrowserWindow lifecycle.
2.  **Renderer Process**: Renders the Next.js pages loaded from the local server (`http://localhost:3000`).
3.  **Process Lifecycle Control**: Spawns the server on startup, checks for active ports, and kills the child node process cleanly when the window is closed to prevent orphaned processes.

## Packaging Configuration

The packaging settings are defined in [package.json](file:///d:/Project/Faclie.com/package.json) inside the `build` field:
-   **App ID**: `com.faclie.simulator`
-   **Files to include**: Compiled `.next` bundle, `public` assets, and necessary runtime scripts. Excludes source codes and workspace documentation to keep package sizes optimal.
-   **Targets**:
    -   *Windows*: Portable executables or NSIS installers (`.exe`).
    -   *macOS*: Disk Images (`.dmg`) or zip files.
    -   *Linux*: AppImage or deb installers.

## Desktop Run & Build Commands

Ensure all node modules are installed:
```bash
npm install
```

### 1. Run Desktop in Development
Launches the Next.js server in development mode, waits for port 3000 to become active, and opens Electron:
```bash
npm run desktop:dev
```

### 2. Package Locally for Testing
Creates a quick, unpackaged desktop bundle in the `dist` folder to test the UI:
```bash
npm run desktop:pack
```

### 3. Compile and Build Installers
Builds the Next.js production files, packages the app, and outputs standalone installers for distribution:
```bash
npm run desktop:build
```
Installers will be placed in the `dist/` directory.

## GitHub Release Instructions

To publish desktop installers on your GitHub project:
1.  Verify that your build works locally using `npm run desktop:build`.
2.  In your GitHub repository, go to **Releases** -> **Draft a new release**.
3.  Fill in the version tag (e.g. `v1.0.0`).
4.  Drag and drop the installer binaries from your local `dist/` directory:
    -   *Windows*: `Faclie Setup 1.0.0.exe`
    -   *macOS*: `Faclie-1.0.0.dmg`
    -   *Linux*: `Faclie-1.0.0.AppImage`
5.  Click **Publish release** to make them downloadable for all developers and agencies.
