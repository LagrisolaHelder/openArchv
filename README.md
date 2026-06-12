# openArchv 📦

A lightweight, distraction-free native desktop universal archive engine built with **Tauri v2**, **React**, and **Tailwind CSS**. Optimized with an ultra-minimalist monochrome interface and zero system overhead.

---

## 📥 Download & Installation (macOS)

### Direct Installation
1. Click the button below to fetch the verified release bundle:
   
   [![Download openArchv](https://img.shields.io/badge/Download-openArchv_v0.1.1-000000?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/user-attachments/files/28900553/openArchv_0.1.1_aarch64.zip)

2. Double-click the downloaded `openArchv_0.1.1_aarch64.zip` package to extract the application.
3. Drag `openArchv.app` into your system's `/Applications` folder.
4. Launch the application. 

> 🔒 **Apple Notarized:** This production bundle is fully signed and notarized by Apple. macOS Gatekeeper will automatically verify its cryptographic ticket upon launch, ensuring a safe, seamless, and warning-free installation.

---

## 🛠️ Tech Stack
- **Core Engine:** Rust / Tauri v2
- **UI Shell:** React
- **Design Language:** Tailwind CSS (System-mapped monochrome interface)
- **Icon Pack:** Lucide React

---

## 📦 Supported Formats
The native extraction layer maps and unpacks deep structure layers for:
` .zip ` ` .7z ` ` .rar ` ` .tar ` ` .gz ` ` .bz2 ` ` .xz `

---

## 🔥 Key Mechanics
- **Minimalist Adaptive UI:** The interface has been completely redesigned for absolute minimalism. The manual light/dark switch has been stripped away in favor of seamless, automatic system theme matching.
- **Global Localization:** Features native multi-language support, allowing users to switch the entire interface language on the fly via a new dedicated settings panel.
- **Settings & Feedback Hub:** Integrated inline control buttons provide instant access to configuration options and direct developer feedback channels.
- **Minimalist Loading State:** Features a sleek startup splash screen followed by a compact, inline extraction progress line to preserve layout constraints.
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
