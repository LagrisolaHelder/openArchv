# openArchv 📦

A lightweight, distraction-free native desktop universal archive engine built with **Tauri v2**, **React**, and **Tailwind CSS**. Optimized with an ultra-minimalist monochrome interface and zero system overhead.

---

## 📥 Download & Installation (macOS)

### Direct Installation
1. Click the button below to fetch the universal binary bundle:
   
   [![Download openArchv](https://img.shields.io/badge/Download-openArchv_v0.1.1-000000?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/user-attachments/files/28446946/openArchv.zip)

2. Double-click the downloaded `openArchv.zip` package in your `~/Downloads` directory to extract the executable container wrapper natively.
3. Drag `openArchv.app` into your system's `/Applications` folder directory.
4. Launch the interface tool. *Note: As an unsigned indie engine development snapshot, you may need to right-click the app bundle icon and select **Open** to bypass local Gatekeeper container rules on initial execution.*

---

## 🛠️ Tech Stack
- **Core Engine:** Rust / Tauri v2
- **UI Shell:** React
- **Design Language:** Tailwind CSS (Manual monochrome theme mapping)
- **Icon Pack:** Lucide React

---

## 📦 Supported Formats
The native extraction layer maps and unpacks deep structure layers for:
` .zip ` ` .7z ` ` .rar ` ` .tar ` ` .gz ` ` .bz2 ` ` .xz `

---

## 🔥 Key Mechanics
- **Manual Toggle Controller:** Uses an interactive button interface to switch states instantly between high-contrast pure black (`#000000`) and stark white (`#FFFFFF`), updating both the application webview and native macOS window background simultaneously.
- **Minimalist Loading State:** Features a sleek 3-second startup splash screen followed by a compact, inline extraction progress line to preserve layout constraints.
- **Persistent Consent Storage:** Uses a lightweight `localStorage` cache to automatically remember user terms confirmation parameters across application lifecycles.

---

## 🏃‍♂️ Local Development

Ensure your native Rust/Cargo toolchain is installed before starting:

```bash
# 1. Install dependencies
npm install

# 2. Inject logo assets into the source directory
cp ./app-logo.png ./src/

# 3. Boot dev server
npm run tauri dev
