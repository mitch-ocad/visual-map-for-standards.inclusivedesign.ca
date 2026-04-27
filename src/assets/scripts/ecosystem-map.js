(function () {
    'use strict';

    // Strip the "Actions" heading and trailing paragraph from process sidebar why-content.
    // The process templateContent renders "## Actions\n\nExplore actions for..." as the last
    // two elements — we hide them via CSS, but also remove them from the DOM for cleanliness.
    function cleanWhySections() {
        document.querySelectorAll('.process-sidebar__why').forEach(function (why) {
            const headings = why.querySelectorAll('h2');
            headings.forEach(function (h2) {
                if (h2.textContent.trim().toLowerCase() === 'actions') {
                    const next = h2.nextElementSibling;
                    if (next && next.tagName === 'P') {
                        next.remove();
                    }
                    h2.remove();
                }
            });
        });
    }

    // Close any currently open dialog.
    function closeAll() {
        document.querySelectorAll('dialog[open]').forEach(function (d) {
            d.close();
        });
    }

    // Open a dialog by id and move focus inside it.
    function openDialog(id) {
        const dialog = document.getElementById(id);
        if (!dialog) return;
        dialog.showModal();
        // Move focus to first focusable element or the dialog itself.
        const focusTarget = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusTarget) focusTarget.focus();
    }

    // Wire stage buttons on the visual map canvas and the mobile fallback list.
    document.querySelectorAll('.ecosystem-map__stage, .ecosystem-map__fallback-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const modalId = btn.dataset.modal;
            if (modalId) openDialog(modalId);
        });
    });

    // Wire process buttons inside stage modals.
    document.querySelectorAll('.stage-modal__process-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const stageModalId = btn.dataset.stageModal;
            const sidebarId = btn.dataset.sidebar;
            if (stageModalId) {
                const stageModal = document.getElementById(stageModalId);
                if (stageModal) stageModal.close();
            }
            if (sidebarId) openDialog(sidebarId);
        });
    });

    // Wire close buttons on stage modals.
    document.querySelectorAll('.stage-modal__close').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const dialog = btn.closest('dialog');
            if (dialog) dialog.close();
        });
    });

    // Wire close buttons on process sidebars.
    document.querySelectorAll('.process-sidebar__close').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const dialog = btn.closest('dialog');
            if (dialog) dialog.close();
        });
    });

    // Wire back buttons on process sidebars — close sidebar, reopen stage modal.
    document.querySelectorAll('.process-sidebar__back').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const dialog = btn.closest('dialog');
            const stageModalId = btn.dataset.stageModal;
            if (dialog) dialog.close();
            if (stageModalId) openDialog(stageModalId);
        });
    });

    // Close any dialog when clicking on the ::backdrop.
    document.querySelectorAll('dialog').forEach(function (dialog) {
        dialog.addEventListener('click', function (e) {
            // The backdrop click registers with the dialog as the target.
            // Check if the click is outside the inner content element.
            const inner = dialog.querySelector('.stage-modal__inner, .process-sidebar__inner');
            if (inner && !inner.contains(e.target)) {
                dialog.close();
            }
        });
    });

    // Clean up process "why" sections on load.
    cleanWhySections();
}());
