document.getElementById('injectBtn').addEventListener('click', async () => {
  const typebotId = document.getElementById('typebotId').value;
  const companyName = document.getElementById('companyName').value;
  const displayMode = document.getElementById('displayMode').value;
  const statusDiv = document.getElementById('status');

  if (!typebotId) {
    statusDiv.style.color = 'red';
    statusDiv.textContent = "Please enter a Typebot ID.";
    return;
  }

  // Get current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Send message to content script
  chrome.tabs.sendMessage(tab.id, {
    action: "inject_typebot",
    data: {
      typebotId,
      companyName,
      displayMode
    }
  }, (response) => {
    if (chrome.runtime.lastError) {
        statusDiv.style.color = 'red';
        statusDiv.textContent = "Error: Refresh page and try again.";
    } else {
        statusDiv.style.color = 'green';
        statusDiv.textContent = "Bot Injected Successfully!";
    }
  });
});
