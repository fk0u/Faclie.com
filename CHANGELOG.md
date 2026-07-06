# Changelog - Faclie Client Simulator

All notable changes to the Faclie Client Simulator project will be documented in this file.

---

## [1.0.0] - 2026-07-06
### Added
-   **Desktop App Wrapper**: Added Electron integration to package Faclie into a cross-platform desktop application (Windows, macOS, Linux).
-   **Detailed Project Documentation**: Created the `docs/` folder with complete architectural specifications, client persona guides, dialogue system docs, and packaging tutorials.
-   **Professional PDF Scorecard**: Upgraded the PDF exporter to draw the **Performance Scorecard** (professional grades, overall rating, dynamic progress bars, and wrapped evaluation feedback text) when a simulation is successfully completed.

---

## [0.2.0] - 2026-07-06
### Added
-   **Tabbed Sidebar UI**: Redesigned the right sidebar inside the simulator page to support a dual-tabbed interface:
    -   *Project Spec Tab*: Tracks specifications, scope checklist, milestones, and risk indicators.
    -   *Client Persona Tab*: Displays psychological traits (Big-Five), bio, quirks, red flags, and live impression tags (e.g. *Easy Target*, *Protected Scope*).
-   **Systemic Security Enhancements**:
    -   *Input Sanitization*: Added regex filters to clean up HTML and script tags on both client-side message submissions and server-side route processing to prevent XSS and prompt injections.
    -   *Payload Schema Validation*: Integrated input verification to prevent API routing crashes.
    -   *IP Rate Limiting*: Implemented an in-memory token sliding rate limiter to protect the server from spamming and API key depletion.
    -   *Secure Error Boundary*: Log-stack errors internally while returning generic user-friendly messages.
-   **Colloquial Prompt Tuning**: Enhanced language prompts for authentic Indonesian conversational styling, Jaksel slang mixtures, and emotional typos.

---

## [0.1.0] - 2026-07-06
### Added
-   **Initial Simulator Launch**: Core framework release featuring:
    -   Next.js App Router & Tailwind CSS interface.
    -   Dialogue Engine supporting offline dialog trees and online NVIDIA AI route fallbacks.
    -   Zustand state managers for chat logs, clients, and projects.
    -   Web Audio API sound effect synthesizers.
    -   Web Speech API text-to-speech voice generators.
    -   Custom Client Creator forms.
    -   8 client persona metadata assets.
