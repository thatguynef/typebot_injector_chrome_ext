Here is a professional, ready-to-use `README.md` for your GitHub repository. It includes installation instructions, usage, and a technical overview of how the branding logic works.

***

# Typebot Brand Injector 🤖🎨

**Instantly inject a fully branded Typebot into any website for sales demos and testing.**

This Chrome Extension scans the current webpage for branding elements (logos, fonts, colors) and dynamically injects a Typebot instance styled to match the target company's identity. It is the perfect tool for Sales Engineers and Agencies to demonstrate the value of Typebot to prospects directly on their own website.

## ✨ Features

*   **🎨 Automatic Branding Extraction:** Scans the DOM for:
    *   **Logo:** Prioritizes Favicons, OpenGraph images, and header images.
    *   **Colors:** Detects Primary/Secondary colors via CSS variables and computed styles (filtering out black/white/grays).
    *   **Fonts:** Extracts the primary font family used in H1/H2 headers.
*   **🔌 Two Display Modes:** Toggle between **Bubble** (chat widget in corner) or **Popup** (center screen overlay).
*   **🛠️ Safe Injection:** Uses `web_accessible_resources` to inject module scripts, bypassing standard CSP (Content Security Policy) restrictions on most websites.
*   **⚡ Live Preview:** changes happen instantly without reloading the page.

## 📥 Installation

Since this extension is for development/demo purposes, it is installed via "Developer Mode":

1.  **Clone or Download** this repository to your computer.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Toggle **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the folder where you downloaded this repository.

## 🚀 How to Use

1.  Navigate to a target website (e.g., a potential client's landing page).
2.  Click the **Typebot Injector** icon in your Chrome toolbar.
3.  Fill in the details:
    *   **Typebot ID:** The slug or ID of your bot (e.g., `adler-advisory-bot-v0b63zn`).
    *   **Company Name:** The name of the prospect (used to personalize variables).
    *   **Display Mode:** Choose `Bubble` or `Popup`.
4.  Click **Inject Typebot**.
5.  Watch the bot appear with the site's colors and fonts applied automatically!

## ⚙️ How it Works

The extension operates via a content script (`content.js`) and an injected module (`injected-script.js`).

1.  **Scraping:** When you click "Inject", `content.js` runs heuristics on the DOM.
    *   *Colors:* It looks for common CSS variable names (`--primary`, `--brand`) and falls back to computing the color of Header and Button elements.
    *   *Logos:* It checks `<link rel="icon">`, `<meta property="og:image">`, and standard `<nav>` images.
2.  **Configuration:** The extension creates a hidden JSON configuration element in the DOM containing the extracted branding and your Typebot ID.
3.  **Injection:** It injects `injected-script.js` as a module. This script reads the configuration and initializes the Typebot SDK (`@typebot.io/js`) directly into the page context.

## ⚠️ Known Limitations

*   **Strict CSP:** Some highly secure websites (e.g., GitHub, Facebook, Banking sites) enforce very strict Content Security Policies that block *any* external script from loading (including `cdn.jsdelivr.net`). The extension may not work on these specific sites.
*   **Variable Names:** The extension relies on Typebot variables named `companyName`, `logo`, `fontFamily`, `primaryBrandColor`, and `secondaryBrandColor`. Ensure your Typebot flow is set up to use these variables.

## 🤝 Contributing

Contributions are welcome! If you have a better way to detect brand colors or handle strict CSPs, please open a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.