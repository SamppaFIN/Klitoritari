// UIPanels - lightweight modal/open handlers for Quest Log, Base, and User Settings
(function () {
    const qs = (sel) => document.querySelector(sel);

    function openModal(el) {
        if (!el) return;
        el.classList.remove('hidden');
        el.classList.add('open');
    }

    function closeModal(el) {
        if (!el) return;
        el.classList.add('hidden');
        el.classList.remove('open');
    }

    // Quest Log
    function openQuestLog() {
        // Prefer dedicated UI controller if present
        if (window.questLogUI?.open) {
            window.questLogUI.open();
            if (window.questLogUI.refresh) window.questLogUI.refresh();
            return;
        }
        const modal = qs('#quest-log-modal');
        openModal(modal);
        // Attempt refresh/population via known systems
        try {
            if (window.questLogUI?.refresh) window.questLogUI.refresh();
            else if (window.unifiedQuestSystem?.refreshQuestLogUI) window.unifiedQuestSystem.refreshQuestLogUI();
        } catch (e) {
            console.warn('Quest log refresh unavailable', e);
        }
    }

    // Base Management
    function openBaseManagement() {
        if (window.baseSystem?.showBaseManagementModal) {
            window.baseSystem.showBaseManagementModal();
            return;
        }
        const modal = qs('#base-management-modal');
        openModal(modal);
    }

    // User Settings (name, path color, symbol)
    function populateUserSettings() {
        const nameInput = qs('#player-name-input');
        const colorInput = qs('#path-color-input');
        const symbolGrid = qs('#symbol-options');
        const profile = window.sessionPersistence?.restoreProfile?.() || window.multiplayerManager?.playerProfile || {};

        if (nameInput && profile.name) nameInput.value = profile.name;
        if (colorInput) {
            const restoredColor = window.sessionPersistence?.restorePathColor?.();
            if (restoredColor) colorInput.value = restoredColor;
        }

        // Try to reuse tutorial symbol options generator
        try {
            if (symbolGrid) {
                if (window.tutorialSystem?.getSymbolOptionsHTML) {
                    symbolGrid.innerHTML = window.tutorialSystem.getSymbolOptionsHTML();
                } else {
                    // Minimal fallback
                    symbolGrid.innerHTML = [
                        'finnish','flower','triangle','hexagon','spiral','star','swedish','norwegian'
                    ].map(sym => `<div class="symbol-option" data-symbol="${sym}">${sym}</div>`).join('');
                }

                // Select previously chosen
                const selected = profile.symbol || 'finnish';
                const pre = symbolGrid.querySelector(`[data-symbol="${selected}"]`);
                if (pre) pre.classList.add('selected');

                // Delegated selection
                symbolGrid.addEventListener('click', (e) => {
                    const opt = e.target.closest('.symbol-option');
                    if (!opt) return;
                    symbolGrid.querySelectorAll('.symbol-option.selected').forEach(el => el.classList.remove('selected'));
                    opt.classList.add('selected');
                }, { once: false });
            }
        } catch (e) {
            console.warn('Symbol options unavailable', e);
        }
    }

    function openUserSettings() {
        const modal = qs('#user-settings-modal');
        populateUserSettings();
        openModal(modal);
    }

    function saveUserSettings() {
        const nameInput = qs('#player-name-input');
        const colorInput = qs('#path-color-input');
        const symbolGrid = qs('#symbol-options');
        const selectedEl = symbolGrid ? symbolGrid.querySelector('.symbol-option.selected') : null;
        const symbol = selectedEl ? selectedEl.getAttribute('data-symbol') : (window.multiplayerManager?.playerProfile?.symbol || 'finnish');
        const name = (nameInput?.value || '').trim() || (window.multiplayerManager?.playerProfile?.name || 'Explorer');
        const color = colorInput?.value || '#6c5ce7';

        try {
            window.sessionPersistence?.saveProfile?.({ name, symbol });
            window.sessionPersistence?.savePathColor?.(color);
        } catch (e) { console.warn('Failed to persist settings', e); }

        try {
            if (window.multiplayerManager?.updateLocalProfile) {
                window.multiplayerManager.updateLocalProfile({ name, symbol, pathColor: color });
            } else if (window.multiplayerManager) {
                window.multiplayerManager.playerProfile = { name, symbol, pathColor: color };
                window.multiplayerManager.broadcastSelf?.();
            }
        } catch (e) { console.warn('Multiplayer profile update failed', e); }

        try {
            if (window.mapEngine?.applyPathColor) window.mapEngine.applyPathColor(color);
            if (window.mapEngine?.pathLine) window.mapEngine.pathLine.setStyle?.({ color });
        } catch (e) { console.warn('Map path update failed', e); }

        closeModal(qs('#user-settings-modal'));
        try { window.gruesomeNotifications?.show?.('Settings saved', 'success'); } catch (_) {}
    }

    function wireButtons() {
        const questBtn = document.getElementById('quest-log-btn');
        const baseBtn = document.getElementById('establish-base-btn');
        const flagBtn = document.getElementById('flag-theme-btn');

        if (questBtn) questBtn.addEventListener('click', openQuestLog);
        if (baseBtn) baseBtn.addEventListener('click', openBaseManagement);
        if (flagBtn) flagBtn.addEventListener('click', openUserSettings);

        // Modal controls
        const closeQuest = qs('#close-quest-log');
        if (closeQuest) closeQuest.addEventListener('click', () => closeModal(qs('#quest-log-modal')));
        const closeUser = qs('#close-user-settings');
        if (closeUser) closeUser.addEventListener('click', () => closeModal(qs('#user-settings-modal')));
        const cancelUser = qs('#cancel-user-settings');
        if (cancelUser) cancelUser.addEventListener('click', () => closeModal(qs('#user-settings-modal')));
        const saveUser = qs('#save-user-settings');
        if (saveUser) saveUser.addEventListener('click', saveUserSettings);
    }

    // Init after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireButtons);
    } else {
        wireButtons();
    }

    // Expose minimal API
    window.UIPanels = {
        openQuestLog,
        openBaseManagement,
        openUserSettings,
        saveUserSettings
    };
})();


