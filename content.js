chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "inject_typebot") {
    const { typebotId, companyName, displayMode } = request.data;
    const branding = scanWebsiteBranding();
    injectTypebotScript(typebotId, companyName, displayMode, branding);
    sendResponse({ status: "success" });
  }
});

function scanWebsiteBranding() {
  return {
    logo: findLogo(),
    fontFamily: findFontFamily(),
    colors: findBrandColors()
  };
}

function findLogo() {
  const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  if (favicon && favicon.href) return favicon.href;
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && ogImage.content) return ogImage.content;
  const navImg = document.querySelector('nav img, header img');
  if (navImg && navImg.src) return navImg.src;
  return ""; 
}

function findFontFamily() {
  const h1 = document.querySelector('h1');
  if (h1) return cleanFontString(window.getComputedStyle(h1).fontFamily);
  const h2 = document.querySelector('h2');
  if (h2) return cleanFontString(window.getComputedStyle(h2).fontFamily);
  return "Arial, sans-serif";
}

function cleanFontString(font) {
  return font.replace(/['"]/g, '').split(',')[0].trim();
}

function findBrandColors() {
  let primary = "";
  let secondary = "";
  const style = getComputedStyle(document.documentElement);
  
  // Check CSS vars
  const commonPrimaryVars = ['--primary-color', '--primary', '--brand-color', '--brand'];
  for (let v of commonPrimaryVars) {
    const val = style.getPropertyValue(v).trim();
    if (val && !isGrayscale(val)) { primary = val; break; }
  }

  // Fallback to computed styles
  if (!primary) {
    const h1 = document.querySelector('h1');
    if (h1) {
      const color = window.getComputedStyle(h1).color;
      if (!isGrayscale(color)) primary = color;
    }
  }

  // Check buttons
  if (!primary) {
    const btn = document.querySelector('button, .btn, input[type="submit"]');
    if (btn) {
      const bg = window.getComputedStyle(btn).backgroundColor;
      if (!isGrayscale(bg)) primary = bg;
    }
  }

  if (!primary) primary = "#0042DA";
  if (!secondary) secondary = primary;

  return { primary, secondary };
}

function isGrayscale(colorString) {
  if (colorString.startsWith('#')) {
    const c = colorString.toLowerCase();
    return ['#fff','#ffffff','#000','#000000'].includes(c);
  }
  const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
    if (maxDiff < 15 && (r < 30 || r > 220)) return true;
  }
  return false;
}

/**
 * UPDATED INJECTION LOGIC TO FIX CSP ERROR
 */
function injectTypebotScript(id, companyName, mode, branding) {
  
  // 1. Cleanup previous injections
  const existingScript = document.getElementById('typebot-injector-script');
  const existingConfig = document.getElementById('typebot-extension-config');
  if (existingScript) existingScript.remove();
  if (existingConfig) existingConfig.remove();

  // 2. Prepare Config Object
  const config = {
    typebotId: id,
    mode: mode,
    prefilledVars: {
      logo: branding.logo,
      companyName: companyName,
      fontFamily: branding.fontFamily,
      primaryBrandColor: branding.colors.primary,
      secondaryBrandColor: branding.colors.secondary
    },
    theme: {
      button: { backgroundColor: branding.colors.primary },
      chatWindow: { backgroundColor: "#fff" }
    }
  };

  // 3. Inject Config as a hidden DOM element (Script can read this)
  const configScript = document.createElement("script");
  configScript.id = "typebot-extension-config";
  configScript.type = "application/json";
  configScript.textContent = JSON.stringify(config);
  document.body.appendChild(configScript);

  // 4. Inject the External Script file
  const script = document.createElement("script");
  script.id = "typebot-injector-script";
  script.type = "module";
  // This loads the file from your extension folder
  script.src = chrome.runtime.getURL("injected-script.js"); 
  
  document.body.appendChild(script);
}
