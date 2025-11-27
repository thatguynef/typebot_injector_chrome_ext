# Typebot Injector (Chrome Extension)

This Chrome Extension allows you to inject a branded **Typebot** onto any website you are currently visiting. It automatically scrapes the website's branding assets (Logo, Fonts, and Colors) and applies them to the Typebot's theme dynamically.

This tool is perfect for sales demos, prospecting, or previewing how a chatbot would look on a client's site without writing a single line of code.

## 🌟 Features

*   **Auto-Branding:** Scrapes the favicon, primary colors (from buttons/CSS), and font family.
*   **Dynamic Injection:** Injects the Typebot script into the current page context.
*   **Bot Management:** Save multiple Typebot IDs (e.g., "Sales Bot", "Support Bot") and switch between them easily.
*   **Theming:** Automatically maps the scraped font and colors to the Typebot UI.
*   **Variable Injection:** Passes scraped data (Company Name, Logo URL) as Typebot variables for use in the chat flow.
*   **Modes:** Supports both `Bubble` (bottom right widget) and `Popup` (modal) modes.

## 📂 Installation

1.  Download or clone this repository to your local machine.
2.  Open Chrome and navigate to `chrome://extensions`.
3.  Toggle **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the folder containing the extension files (`manifest.json`, etc.).

## 🤖 Typebot Setup (Important)

For the branding to work effectively inside the chat bubbles, your Typebot needs to accept specific variables.

### 1. Create a Typebot
You can use this demo bot as a template: [View Demo Bot](https://app.typebot.io/typebots/lrcisse49sv13n01k2kuanqq/edit)

### 2. Define Variables
In your Typebot editor, ensure you have these variables defined if you want to use the scraped data in your text bubbles:

| Variable Name | Description | Example Usage in Typebot |
| :--- | :--- | :--- |
| `companyName` | Name entered in the extension popup | "Welcome to **{{companyName}}**!" |
| `logo` | URL of the scraped logo/favicon | Image block source set to `{{logo}}` |
| `fontFamily` | The CSS font stack scraped from the site | "We noticed you use **{{fontFamily}}**." |
| `primaryBrandColor` | Hex code of the primary color | (Used automatically for theme) |

### 3. Publish
Publish your bot and copy the **Typebot ID** (or slug) from the Share tab.

## 🚀 How to Use

### 1. Save your Bot(s)
1.  Click the extension icon.
2.  Click the **⚙️ Manage Bots** tab.
3.  Enter a name (e.g., "Sales Demo") and your Typebot ID/Slug.
4.  Click **Save Bot**.

### 2. Inject on a Website
1.  Navigate to a target website (e.g., `https://domain.com`). Please note, some sites have `Content Security Policy directives` and will block the extension from running. 
2.  Open the extension (defaults to the **🚀 Inject** tab).
3.  **Select Typebot:** Choose the bot you saved earlier.
4.  **Company Name:** Enter the prospect's name (e.g., "Stripe").
5.  **Display Mode:** Choose `Bubble` or `Popup`.
6.  Click **Inject Typebot**.

The bot will appear on the page, styled with the website's colors and fonts.

## 🛠 Project Structure

*   `manifest.json`: Configuration and permissions (Manifest V3).
*   `popup.html`: The extension interface (Tabs for Injecting and Managing).
*   `popup.js`: Logic for saving bots to Chrome Storage and sending injection messages.
*   `content.js`: Scrapes website styles and handles the DOM injection.
*   `injected-script.js`: The module that initializes the Typebot library on the page.

## ⚠️ Troubleshooting

*   **"Error: Refresh page and try again":** Content scripts sometimes disconnect if the extension is reloaded. Refreshing the web page usually fixes this.
*   **CSP Errors:** Some websites (like GitHub, Facebook) have strict Content Security Policies that block external scripts. The bot may fail to load on these specific sites.
*   **Font Rendering:** The extension attempts to use the site's computed font. If the font is not globally available on the user's machine, it falls back to standard sans-serif fonts.
