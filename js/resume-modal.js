/**
 * Resume Modal Functionality
 * 
 * This file contains the JavaScript functionality for the resume modal.
 * It handles opening and closing the modal, and displaying the resume PDF.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Resume modal script loaded');

    // Check if navigation is already loaded
    if (document.querySelector('.menu-resume-button')) {
        console.log('Navigation already loaded, initializing modal');
        initResumeModal();
    } else {
        // If navigation is not loaded yet, wait for it
        console.log('Navigation not loaded yet, setting up observer');

        // Set up a MutationObserver to watch for when the navigation is loaded
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector('.menu-resume-button')) {
                console.log('Navigation loaded, initializing modal');
                initResumeModal();
                obs.disconnect(); // Stop observing once we've initialized
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document.body, { childList: true, subtree: true });

        // Also set a timeout as a fallback
        setTimeout(() => {
            console.log('Timeout reached, trying to initialize modal');
            initResumeModal();
        }, 2000);
    }
});

/**
 * Initializes the resume modal functionality
 * Creates the modal HTML structure and sets up event listeners
 */
function initResumeModal() {
    // Create modal container if it doesn't exist
    let modalContainer = document.querySelector('.resume-modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.className = 'resume-modal-container';

        // Determine the correct path to the PDF based on the current page
        const pdfFileName = "Suvrat Jain's Resume.pdf";
        const pdfPath = '/data/' + encodeURIComponent(pdfFileName);

        modalContainer.innerHTML = `
            <div class="resume-modal">
                <div class="resume-modal-header">
                    <h2 class="resume-modal-title">Suvrat Jain's Resume</h2>
                    <div class="resume-modal-actions">
                        <button class="resume-modal-close">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="resume-modal-content">
                    <iframe src="${pdfPath}" class="resume-iframe" title="Resume"></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);

        // Add event listener to close button
        const closeButton = modalContainer.querySelector('.resume-modal-close');
        closeButton.addEventListener('click', () => {
            closeResumeModal();
        });

        // Close modal when clicking outside content
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeResumeModal();
            }
        });

        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
                closeResumeModal();
            }
        });
    }

    // Add click event to all "View Resume" buttons
    const resumeButtons = document.querySelectorAll('.menu-resume-button');
    console.log('Found resume buttons:', resumeButtons.length);
    resumeButtons.forEach(button => {
        // Remove any existing href to prevent navigation
        button.removeAttribute('href');

        // Add click event to open modal
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openResumeModal();
        });
    });
}

/**
 * Opens the resume modal
 * Adds active classes to show the modal with animation
 */
function openResumeModal() {
    console.log('Opening resume modal');
    const modalContainer = document.querySelector('.resume-modal-container');
    if (!modalContainer) return;

    // Show modal with animation
    modalContainer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling

    // Animate modal content
    setTimeout(() => {
        modalContainer.querySelector('.resume-modal').classList.add('active');
    }, 10);
}

/**
 * Closes the resume modal
 * Removes active classes to hide the modal with animation
 */
function closeResumeModal() {
    const modalContainer = document.querySelector('.resume-modal-container');
    if (!modalContainer) return;

    const modal = modalContainer.querySelector('.resume-modal');
    modal.classList.remove('active');

    // Wait for animation to complete before hiding container
    setTimeout(() => {
        modalContainer.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }, 1);
}
