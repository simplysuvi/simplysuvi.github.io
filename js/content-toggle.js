/**
 * Content Toggle
 * Handles toggling between different content sections with Apple-like animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initContentToggle();
});

/**
 * Initialize the content toggle functionality
 */
function initContentToggle() {
    const toggleSwitch = document.getElementById('contentToggle');
    if (!toggleSwitch) return;

    const aboutLabel = document.getElementById('aboutLabel');
    const experienceLabel = document.getElementById('experienceLabel');
    const aboutSection = document.getElementById('aboutSection');
    const experienceSection = document.getElementById('experienceSection');

    // Set initial state
    updateToggleState(false); // false = no animation on initial load

    // Toggle event listener with ripple effect
    toggleSwitch.addEventListener('change', () => {
        // Add ripple effect
        const toggleSlider = document.querySelector('.toggle-slider');
        toggleSlider.classList.remove('ripple');
        
        // Trigger reflow to restart animation
        void toggleSlider.offsetWidth;
        
        // Add ripple class to start animation
        toggleSlider.classList.add('ripple');
        
        // Update toggle state
        updateToggleState(true);
    });

    // Click event listeners for labels with ripple effect
    aboutLabel.addEventListener('click', () => {
        if (toggleSwitch.checked) {
            // Add ripple effect
            const toggleSlider = document.querySelector('.toggle-slider');
            toggleSlider.classList.remove('ripple');
            void toggleSlider.offsetWidth;
            toggleSlider.classList.add('ripple');
            
            toggleSwitch.checked = false;
            updateToggleState(true);
        }
    });

    experienceLabel.addEventListener('click', () => {
        if (!toggleSwitch.checked) {
            // Add ripple effect
            const toggleSlider = document.querySelector('.toggle-slider');
            toggleSlider.classList.remove('ripple');
            void toggleSlider.offsetWidth;
            toggleSlider.classList.add('ripple');
            
            toggleSwitch.checked = true;
            updateToggleState(true);
        }
    });

    /**
     * Update the toggle state and visible content
     * @param {boolean} animate - Whether to animate the transition
     */
    function updateToggleState(animate = true) {
        const isExperienceActive = toggleSwitch.checked;

        // Update labels with a subtle animation
        aboutLabel.classList.toggle('active', !isExperienceActive);
        experienceLabel.classList.toggle('active', isExperienceActive);

        // --- Heading & Tagline Swap with Animation ---
        const sectionTitle = document.querySelector('.section-title');
        const sectionTagline = document.querySelector('.section-tagline');

        // Store original About values on first run
        if (!updateToggleState._aboutTitle) {
            updateToggleState._aboutTitle = sectionTitle ? sectionTitle.textContent : '';
            updateToggleState._aboutTagline = sectionTagline ? sectionTagline.textContent : '';
        }
        const experienceTitle = "Built through Experience.";
        const experienceTagline = "Every role, every project — all part of a story still unfolding.";

        // Determine new values
        const newTitle = isExperienceActive ? experienceTitle : updateToggleState._aboutTitle;
        const newTagline = isExperienceActive ? experienceTagline : updateToggleState._aboutTagline;

        // Animate heading/tagline transition
        if (sectionTitle && sectionTagline) {
            if (animate) {
                sectionTitle.style.transition = "opacity 0.4s";
                sectionTagline.style.transition = "opacity 0.4s";
                sectionTitle.style.opacity = "0";
                sectionTagline.style.opacity = "0";
                setTimeout(() => {
                    sectionTitle.textContent = newTitle;
                    sectionTagline.textContent = newTagline;
                    sectionTitle.style.opacity = "1";
                    sectionTagline.style.opacity = "1";
                }, 400);
            } else {
                sectionTitle.textContent = newTitle;
                sectionTagline.textContent = newTagline;
                sectionTitle.style.opacity = "1";
                sectionTagline.style.opacity = "1";
            }
        }
        // --- End Heading & Tagline Swap ---

        // Update content sections with enhanced animation
        if (animate) {
            // Get current active and next sections
            const currentSection = isExperienceActive ? aboutSection : experienceSection;
            const nextSection = isExperienceActive ? experienceSection : aboutSection;
            
            // Use requestAnimationFrame for smoother animations
            requestAnimationFrame(() => {
                // Add fade-out class for smoother exit animation
                currentSection.classList.add('fade-out');
                
                // Wait for fade-out transition to complete before showing new section
                setTimeout(() => {
                    // Remove active class from current section
                    currentSection.classList.remove('active');
                    
                    // Add active class to next section
                    nextSection.classList.add('active');
                    
                    // Remove fade-out class after transition completes
                    setTimeout(() => {
                        currentSection.classList.remove('fade-out');
                    }, 400); // Match the fade-out transition duration
                    
                }, 400); // Match the fade-out transition duration
            });
        } else {
            // No animation for initial load
            aboutSection.classList.toggle('active', !isExperienceActive);
            experienceSection.classList.toggle('active', isExperienceActive);
        }

        // Save preference to localStorage
        localStorage.setItem('showExperience', isExperienceActive);
    }

    // Check if user has a preference stored
    const showExperience = localStorage.getItem('showExperience') === 'true';
    if (showExperience) {
        toggleSwitch.checked = true;
        updateToggleState(false); // No animation for initial load
    }
}

/**
 * Load experience data from JSON file and render to the DOM
 */
async function loadAboutExperience() {
    try {
        const response = await fetch('../data/experience.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const experiences = await response.json();
        renderAboutExperience(experiences);
    } catch (error) {
        console.error('Error loading experience data:', error);
    }
}

/**
 * Renders experience data as cards in the about page
 * @param {Array} experiences - Array of experience objects
 */
function renderAboutExperience(experiences) {
    const cardsContainer = document.querySelector('.about-experience-cards');
    if (!cardsContainer) return;

    // Clear existing content
    cardsContainer.innerHTML = '';

    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Add each experience item with staggered animation
    experiences.forEach((experience, index) => {
        const card = document.createElement('div');
        card.className = 'experience-card';
        card.id = `about-${experience.id}`;
        
        // Set initial styles for animation - use transform and opacity for better performance
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) translateZ(0)';
        card.style.transition = `opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`;
        card.style.transitionDelay = `${index * 0.08}s`; // Slightly faster staggering
        card.style.willChange = 'transform, opacity';

        card.innerHTML = `
            <div class="experience-card-content">
                <div class="experience-card-company" style="color: ${experience.color}">${experience.company}</div>
                <div class="experience-card-role">${experience.title}</div>
                <div class="experience-card-date">
                    ${experience.startDate} - ${experience.endDate}
                    ${experience.location ? `<span class="experience-card-location"><i class="fas fa-location-dot"></i> ${experience.location}</span>` : ''}
                </div>
                ${experience.skills ? `
                <div class="experience-card-skills">
                    ${experience.skills.map(skill => `<span class="skill-pill">${skill}</span>`).join('')}
                </div>` : ''}
                <ul class="experience-card-responsibilities">
                    ${experience.responsibilities.map(responsibility => `<li>${responsibility}</li>`).join('')}
                </ul>
            </div>
        `;

        fragment.appendChild(card);
    });
    
    // Append all cards at once for better performance
    cardsContainer.appendChild(fragment);
    
    // Force a reflow before starting animations
    void cardsContainer.offsetWidth;
    
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
        const cards = cardsContainer.querySelectorAll('.experience-card');
        cards.forEach((card, index) => {
            // Stagger the animations slightly
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) translateZ(0)';
            }, 30 + index * 40);
        });
    });
}

// Load experience data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadAboutExperience();
});
