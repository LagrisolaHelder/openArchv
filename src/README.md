# openArchv 📦

An ultra-minimalist, high-performance native desktop universal archive engine built with **Tauri v2**, **React**, and **Tailwind CSS**. Designed with a distraction-free monochrome interface that enforces zero system overhead and strict layout bounds.

![openArchv Dashboard Layout](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80)

## ✨ Core Features

-   **3-Second Minimalist Splash Screen:** A elegant, lightweight boot loader phase with a non-overflowing linear progress line before application initialization.
-   **Hardware-Enforced Viewport Lock:** Strict overflow prevention that completely disables window scrolling, bouncing, or jittering, perfectly stabilizing the 800x600 layout framework.
-   **Dynamic Machine Theme Synchronization:** Zero manual toggles. The application automatically monitors system-level preferences via `prefers-color-scheme`, repainting both the frontend viewport and the native desktop OS window frame to **Pure Obsidian Black (`#000000`)** or **Stark White (`#FFFFFF`)** instantaneously.
-   **Refined Interactive Elements:** Native hand cursor pointers (`cursor-pointer`) configured across all interactive states, turning to `cursor-not-allowed` dynamically during processing cycles.
-   **Ultra-Minimal Decompression Indicator:** Bulky loading animations were replaced with a razor-thin, layout-safe progress bar integrated directly into the core alert matrix.
-   **Terms of Software Consent:** Local storage tracking layer that securely remembers user clearance preferences across application lifecycles.

---

## 📦 Native Architecture Coverage

openArchv utilizes sandboxed memory buffers to map, read, and cleanly unpack deep file container structures across 7 standard serialization extensions:

-   **`.zip`** — Standard Zip Bundle Archive
-   **`.7z`** — High-Compression 7-Zip Multi-Stream Container
-   **`.rar`** — Roshal Archive Sequence
-   **`.tar`** — Consolidated Tape Architecture Layout
-   **`.gz`** — Single-Stream GNU Zip File block
-   **`.bz2`** — High-Integrity Bzip2 Chunk Decoder Payload
-   **`.xz`** — High-Efficiency LZMA2 Compression Payload

---

## 🛠️ Technical Stack Alignment

-   **Backend Core:** Rust / Tauri v2 (utilizing hardened permissions layers for webview execution context)
-   **Frontend Shell:** React (Vanilla State Hooks + Web API Intersection Observers)
-   **Styling Engine:** Tailwind CSS v4 (Class-based dark mode management strategy)
-   **Iconography Pack:** Lucide React (Vector rendering)

---

## 🚀 Development History & Prompt Journey

This application was engineered iteratively by continuously updating runtime code structures based on specific design constraints. Below is the exact prompt log sequence used to instruct the system, with corrected grammar and technical phrasing:

### 📑 Prompt History Log

1.  **Icon Realignment Phase:**
    > *"How do I fix the app logo icon? It currently displays an un-masked square white background on the macOS Dock container instead of looking like a native squircle asset."*
2.  **Target Directory Navigation:**
    > *"I replaced the new logo image asset but the icon remains exactly the same on my dock. I'm looking at files inside `src-tauri/target/debug/deps/`."*
3.  **Color System Initialization:**
    > *"I want to integrate `#1F2021` as the primary background color layer for the application's dark theme configuration."*
4.  **Source Consolidation Request:**
    > *"Please provide the full source code updates for both `App.jsx` and `index.css` layout modules."*
5.  **Native Shell Frame Painting:**
    > *"I want the parent native window frame color to turn pure black immediately when the application's dark theme layer is active."*
6.  **Architecture Specifications:**
    > *"Provide a complete list of every archive compression file extension supported natively by the decompressor engine."*
7.  **Local Test Case Generation:**
    > *"Generate or provide demo files matching each of those supported extensions so I can test the extraction interface pipeline directly on my machine."*
8.  **Interactivity Refinement:**
    > *"Explicitly add mouse hand cursor pointers (`cursor-pointer`) to all interactive buttons inside the markup trees."*
9.  **Marketing Web Infrastructure:**
    > *"Generate a single-file production-ready landing page (`index.html`) using raw CSS styles, Tailwind utility classes, vanilla JavaScript loops, and Lucide Icon vector bundles to promote openArchv."*
10. **Monochrome High-Contrast Shift:**
    > *"[Correction to landing page/app targets]: Modify the color parameters to enforce high-contrast pure black (`#000000`) for the dark mode theme layer and pure white (`#FFFFFF`) for the light mode layout canvas."*
11. **Automated Theme Synchronization:**
    > *"Remove the manual dark/light mode toggle switch completely from the top navigation row. Make the application theme dynamically match the local operating machine's system preferences automatically."*
12. **Layout Stabilization & Loading Upgrades:**
    > *"Completely disable viewport scrolling on the canvas, and simplify the loading bar animation down to an ultra-minimalist layout line so it never causes layout overflows when the responsive app scales down."*

---

## 🏃‍♂️ Local Installation & Development

To clone, compile, and run this Tauri v2 application workspace locally, ensure you have your Rust toolchain installed, and execute these layout initialization sequences:

```bash
# 1. Install frontend compilation dependencies
npm install

# 2. Map and copy your custom branding icon into the source folder
cp ./app-logo.png ./src/

# 3. Boot the Tauri Development Environment
npm run tauri dev