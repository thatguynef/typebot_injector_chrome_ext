(async () => {
    // 1. Read the config from the hidden element we created in content.js
    const configElement = document.getElementById('typebot-extension-config');
    if (!configElement) return;

    const config = JSON.parse(configElement.textContent);
    const { typebotId, mode, prefilledVars, theme } = config;

    // 2. Import Typebot from CDN
    // Note: If the site blocks cdn.jsdelivr.net, this will fail.
    const module = await import('https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js');
    const Typebot = module.default || module;

    // 3. Initialize
    if (mode === 'bubble') {
        Typebot.initBubble({
            typebot: typebotId,
            prefilledVariables: prefilledVars,
            theme: theme
        });
    } else {
        Typebot.initPopup({
            typebot: typebotId,
            apiHost: "https://typebot.io",
            prefilledVariables: prefilledVars
        });
        setTimeout(() => Typebot.open(), 1000);
    }
})();
