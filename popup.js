document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const injectView = document.getElementById('inject-view');
  const manageView = document.getElementById('manage-view');
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  const botSelector = document.getElementById('botSelector');
  const injectBtn = document.getElementById('injectBtn');
  const statusDiv = document.getElementById('status');
  const companyNameInput = document.getElementById('companyName');
  const displayModeInput = document.getElementById('displayMode');
  
  const newBotName = document.getElementById('newBotName');
  const newBotId = document.getElementById('newBotId');
  const addBotBtn = document.getElementById('addBotBtn');
  const botList = document.getElementById('botList');
  const emptyState = document.getElementById('emptyState');

  // --- TAB SWITCHING ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update Tab UI
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update View
      if (btn.dataset.tab === 'inject-view') {
        injectView.classList.remove('hidden');
        manageView.classList.add('hidden');
        loadBotsIntoDropdown(); // Refresh dropdown in case list changed
      } else {
        injectView.classList.add('hidden');
        manageView.classList.remove('hidden');
        renderBotList();
      }
    });
  });

  // --- STORAGE & DATA LOGIC ---

  async function getSavedBots() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('savedBots', (data) => {
        resolve(data.savedBots || []);
      });
    });
  }

  async function saveBots(bots) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ savedBots: bots }, resolve);
    });
  }

  // --- INJECT VIEW LOGIC ---

  async function loadBotsIntoDropdown() {
    const bots = await getSavedBots();
    botSelector.innerHTML = '';

    if (bots.length === 0) {
      const option = document.createElement('option');
      option.text = "No bots saved. Go to Manage tab.";
      botSelector.appendChild(option);
      injectBtn.disabled = true;
      return;
    }

    injectBtn.disabled = false;
    bots.forEach(bot => {
      const option = document.createElement('option');
      option.value = bot.id;
      option.text = bot.name;
      botSelector.appendChild(option);
    });
  }

  injectBtn.addEventListener('click', async () => {
    const typebotId = botSelector.value;
    const companyName = companyNameInput.value;
    const displayMode = displayModeInput.value;

    if (!typebotId || typebotId === "No bots saved. Go to Manage tab.") {
      statusDiv.style.color = 'red';
      statusDiv.textContent = "Please select a valid bot.";
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

  // --- MANAGE VIEW LOGIC ---

  async function renderBotList() {
    const bots = await getSavedBots();
    botList.innerHTML = '';
    
    if (bots.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }
    
    emptyState.classList.add('hidden');

    bots.forEach((bot, index) => {
      const li = document.createElement('li');
      li.className = 'bot-item';
      li.innerHTML = `
        <div class="bot-info">
          <span class="bot-name">${escapeHtml(bot.name)}</span>
          <span class="bot-slug">${escapeHtml(bot.id)}</span>
        </div>
        <button class="delete-btn" data-index="${index}">&times;</button>
      `;
      botList.appendChild(li);
    });

    // Add Delete Listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const index = parseInt(e.target.dataset.index);
        await deleteBot(index);
      });
    });
  }

  addBotBtn.addEventListener('click', async () => {
    const name = newBotName.value.trim();
    const id = newBotId.value.trim();

    if (!name || !id) {
      alert("Please enter both a Name and an ID.");
      return;
    }

    const bots = await getSavedBots();
    bots.push({ name, id });
    await saveBots(bots);

    newBotName.value = '';
    newBotId.value = '';
    renderBotList();
  });

  async function deleteBot(index) {
    const bots = await getSavedBots();
    bots.splice(index, 1);
    await saveBots(bots);
    renderBotList();
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initial Load
  loadBotsIntoDropdown();
});
