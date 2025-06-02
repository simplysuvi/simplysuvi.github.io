/**
 * Smooth page load: add .preload to body on initial load, remove after window load
 */
(function () {
    if (!document.body.classList.contains('preload')) {
        document.body.classList.add('preload');
    }
    window.addEventListener('load', function () {
        document.body.classList.remove('preload');
    });
})();

// ======================================================================
// INITIALIZATION
// ======================================================================

/**
 * Main initialization function that runs when the DOM is fully loaded
 * Loads components and initializes all functionality
 */
/**
 * Animates card elements with a staggered entrance effect.
 * @param {string} selector - CSS selector for card elements.
 */
function animateCards(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, idx) => {
        setTimeout(() => {
            card.classList.add('card-animate');
        }, idx * 120);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Load dynamic components first
    loadComponents().then(() => {
        // Initialize all components after dynamic components are loaded
        initNavigation();
        initScrollEffects();
        updateClock();
        initDarkMode();
        initSkillsProgress();
        loadProjects();
        loadExperience();
        loadTestimonials();
        initSongsCarousel();
        initBooksCarousel();

        // Animate static cards (e.g., .site-card) on initial load
        animateCards('.site-card');

        // Initialize resume modal if the function exists
        if (typeof initResumeModal === 'function') {
            console.log('Initializing resume modal from script.js');
            initResumeModal();
        }

        // Update clock every second
        setInterval(updateClock, 1000);

        // Control module click animations (moved here to ensure modules exist)
        document.querySelectorAll('.control-module').forEach(module => {
            module.addEventListener('click', () => {
                module.classList.add('active');
                setTimeout(() => {
                    module.classList.remove('active');
                }, 300);
            });
        });

        // Hero animation: fade in hero elements in sequence
        const heroAnimatedEls = document.querySelectorAll('.hero .animate-on-load');
        heroAnimatedEls.forEach((el, idx) => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    el.classList.add('fade-in-up');
                }, idx * 150); // 150ms stagger for better flow
            });
        });
    });
});

// ======================================================================
// COMPONENT LOADING
// ======================================================================

/**
 * Loads dynamic HTML components from external files
 * @returns {Promise<boolean>} True if components loaded successfully, false otherwise
 */
async function loadComponents() {
    try {
        // Define components to load
        const components = {
            '/components/navigation.html': '#navigation-container',
            '/components/footer.html': '#footer-container'
        };

        // Load all components
        await ComponentLoader.initComponents(components);

        console.log('All components loaded successfully.');
        return true;
    } catch (error) {
        console.error('Error loading components:', error);
        return false;
    }
}

// ======================================================================
// THEME MANAGEMENT
// ======================================================================

/**
 * Initializes dark mode functionality with toggle buttons and preference storage
 * Creates a notification when theme is changed
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const mobileSunIcon = document.querySelector('.mobile-sun-icon');
    const mobileMoonIcon = document.querySelector('.mobile-moon-icon');

    // Helper to set logo based on theme
    function setLogoForTheme() {
        const navLogo = document.getElementById('navLogo');
        const mobileNavLogo = document.getElementById('mobileNavLogo');
        const isDark = document.body.classList.contains('dark-mode');
        if (navLogo) {
            navLogo.src = isDark ? '../assets/my-face-transparent.png' : '../assets/my-face-transparent.png';
        }
        if (mobileNavLogo) {
            mobileNavLogo.src = isDark ? '../assets/my-face-transparent.png' : '../assets/my-face-transparent.png';
        }
    }

    // Check if user has a preference stored
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Set initial state
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        // Desktop icons
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        // Mobile icons
        mobileSunIcon.style.display = 'none';
        mobileMoonIcon.style.display = 'block';
    }
    // Set logo on initial load
    setLogoForTheme();

    /**
     * Toggles between light and dark mode
     * Updates UI elements and saves preference to localStorage
     */
    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');

        // Toggle desktop icons
        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';

        // Toggle mobile icons
        mobileSunIcon.style.display = isDark ? 'none' : 'block';
        mobileMoonIcon.style.display = isDark ? 'block' : 'none';

        // Update logo
        setLogoForTheme();

        // Save preference
        localStorage.setItem('darkMode', isDark);

        // Create a notification
        const notification = document.createElement('div');
        notification.classList.add('site-notification');
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${isDark ? moonIcon.outerHTML : sunIcon.outerHTML}
                </div>
                <div class="notification-text">
                    <div class="notification-title">${isDark ? 'Dark Mode' : 'Light Mode'} Enabled</div>
                    <div class="notification-message">Display settings updated</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove after animation
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    };

    // Toggle dark mode on desktop button click
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Toggle dark mode on mobile button click
    mobileDarkModeToggle.addEventListener('click', toggleDarkMode);
}

// ======================================================================
// NAVIGATION & SCROLLING
// ======================================================================

/**
 * Updates the active state of navigation items based on current page
 */
function updateActiveNavItems() {
    // Get the current path segment (e.g., "skills" for "/skills/")
    let path = window.location.pathname;
    if (path === "/" || path === "/index.html") {
        path = "/";
    } else {
        // Remove leading and trailing slashes, then get the first segment
        path = path.replace(/^\/|\/$/g, "").split("/")[0];
    }

    // Desktop menu items
    document.querySelectorAll('.menu-items span a').forEach(link => {
        let linkPath = link.getAttribute('href');
        if (linkPath === "index.html" || linkPath === "/") {
            linkPath = "/";
        } else {
            linkPath = linkPath.replace(/^\/|\/$/g, "").split("/")[0];
        }
        const parentSpan = link.parentElement;

        if (linkPath === path) {
            parentSpan.classList.add('active');
        } else {
            parentSpan.classList.remove('active');
        }
    });

    // Mobile nav items
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        let linkPath = item.getAttribute('href');
        if (linkPath === "index.html" || linkPath === "/") {
            linkPath = "/";
        } else {
            linkPath = linkPath.replace(/^\/|\/$/g, "").split("/")[0];
        }

        if (linkPath === path) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Initializes page animations and effects
 * Uses Intersection Observer for performance
 */
function initScrollEffects() {
    // Add animations using Intersection Observer
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate children with staggered delay
                const animatedElements = entry.target.querySelectorAll('.animate-on-scroll');
                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 100); // 100ms staggered delay
                });
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    sections.forEach(section => {
        observer.observe(section);

        // Add animation classes to elements
        const animatableElements = section.querySelectorAll('.site-app, .control-module, .site-card, .interest-item');
        animatableElements.forEach(el => {
            el.classList.add('animate-on-scroll');
        });
    });

    // Add scroll styles to the menu bar
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const menuBar = document.querySelector('.menu-bar');
                if (!menuBar) return;

                if (window.scrollY > 20) {
                    menuBar.classList.add('scrolled');
                } else {
                    menuBar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Updates the clock display in the menu bar
 */
function updateClock() {
    const timeElement = document.querySelector('.time');
    if (!timeElement) return;

    const now = new Date();

    // Get date components
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();

    // Get time components
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be displayed as 12

    // Format the date and time i menu bar: "Apr 9, 2025 2:05 PM"
    const dateTimeString = `${month} ${date}, ${year} ${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    timeElement.textContent = dateTimeString;
}

/**
 * Utility function for debouncing events
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Initializes navigation functionality
 * Sets up active state tracking
 */
function initNavigation() {
    // Set active navigation item based on current page
    updateActiveNavItems();
}

// ======================================================================
// SKILLS & INTERACTIONS
// ======================================================================

/**
 * Initializes skill progress animations
 * Uses Intersection Observer to trigger animations when skills come into view
 */
function initSkillsProgress() {
    const skillItems = document.querySelectorAll('.skill-item');

    // Create an intersection observer to animate skills when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;

                // Add animation class
                skillItem.classList.add('visible');

                // Remove the observer once animation is triggered
                observer.unobserve(skillItem);
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the element is visible
    });

    // Observe all skill items
    skillItems.forEach(item => {
        observer.observe(item);
    });
}

/**
 * Initialize control module interactions
 * Adds click animations to control modules
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.control-module').forEach(module => {
        module.addEventListener('click', () => {
            module.classList.add('active');

            setTimeout(() => {
                module.classList.remove('active');
            }, 300);
        });
    });
});

// ======================================================================
// PROJECTS
// ======================================================================

/**
 * Load projects data and initialize project cards
 */
// (Removed redundant DOMContentLoaded for loadProjects; now handled in main init)

/**
 * Fetches project data from JSON file and initializes project cards
 */
async function loadProjects() {
    try {
        const response = await fetch('../data/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();
        renderProjects(projects);
        initProjectCards();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

/**
 * Renders project cards to the DOM based on JSON data
 * @param {Array} projects - Array of project objects
 */
function renderProjects(projects) {
    const projectsContainer = document.querySelector('.project-cards');
    if (!projectsContainer) return;

    // Clear existing content
    projectsContainer.innerHTML = '';

    // Add each project
    projects.forEach(project => {
        const cardStyles = [];
        if (project.backgroundColor) {
            cardStyles.push(`background-color: ${project.backgroundColor}`);
        }
        if (project.textColor) {
            cardStyles.push(`color: ${project.textColor}`);
        }

        const notificationAttr = project.notification
            ? `data-notification="${project.notification}"`
            : '';

        const card = document.createElement('div');
        card.className = 'project-card';
        card.id = project.id;
        card.setAttribute('style', cardStyles.join(';'));

        // Define text color styles for inner elements if textColor is specified
        const textColorStyle = project.textColor ? `style="color: ${project.textColor}"` : '';

        card.innerHTML = `
            <div class="card-label" ${textColorStyle}>${project.title}</div>
            <button class="project-expand-button">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
                </svg>
            </button>
            <div class="card-content" ${notificationAttr}>
                <div class="card-text">
                    <h3 ${textColorStyle}>${project.headline}</h3>
                    <p ${textColorStyle}>${project.description}</p>
                </div>
                <div class="project-tech" style="display: none;">
                    ${project.tech.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-features" style="display: none;">
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                ${project.links ? `
                <div class="project-links" style="display: none;">
                    ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" class="project-link demo">Demo</a>` : ''}
                    ${project.links.github ? `<a href="${project.links.github}" target="_blank" class="project-link github">GitHub</a>` : ''}
                </div>
                ` : ''}
            </div>
        `;

        projectsContainer.appendChild(card);
    });

    // Animate project cards after rendering
    animateCards('.project-card');
}

/**
 * Initializes project cards with modal functionality
 * Sets up event listeners and modal interactions
 */
function initProjectCards() {
    // Get all project cards
    const projectCards = document.querySelectorAll('.project-card');

    // Create modal container if it doesn't exist
    let modalContainer = document.querySelector('.project-modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.className = 'project-modal-container';
        modalContainer.innerHTML = `
            <div class="project-modal">
                <div class="project-modal-content">
                    <button class="project-modal-close">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                        </svg>
                    </button>
                    <div class="project-modal-body"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);

        // Add event listener to close button
        const closeButton = modalContainer.querySelector('.project-modal-close');
        closeButton.addEventListener('click', () => {
            closeProjectModal();
        });

        // Close modal when clicking outside content
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeProjectModal();
            }
        });

        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
                closeProjectModal();
            }
        });
    }

    // Add click event to each project card - only the expand button is clickable
    projectCards.forEach(card => {
        const expandButton = card.querySelector('.project-expand-button');

        // Remove click event from the card itself
        card.style.cursor = 'default';

        // Prevent the card from being clickable
        card.addEventListener('click', (e) => {
            // Only allow clicks on the expand button
            if (e.target !== expandButton && !expandButton.contains(e.target)) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }, true);

        // Add click event only to the expand button
        expandButton.addEventListener('click', (e) => {
            e.stopPropagation();
            openProjectModal(card);
        });
    });

    /**
     * Opens the project modal with content from the selected card
     * @param {HTMLElement} card - The project card element to display in modal
     */
    function openProjectModal(card) {
        const modalBody = document.querySelector('.project-modal-body');
        const cardLabel = card.querySelector('.card-label').textContent;
        const cardTitle = card.querySelector('.card-text h3').textContent;

        // Get description if it exists, otherwise use a default description
        let cardDescription = "A data science project showcasing advanced analytics and machine learning techniques.";
        const descriptionElement = card.querySelector('.card-text p');
        if (descriptionElement) {
            cardDescription = descriptionElement.textContent;
        }

        // Get project tech tags
        let techTagsHTML = '';
        const techTags = card.querySelector('.project-tech');

        if (techTags) {
            // Clone existing tech tags
            const clonedTags = techTags.cloneNode(true);
            // Make sure the cloned tags are visible
            clonedTags.style.display = 'flex';

            techTagsHTML = `
                <div class="project-tech-container">
                    ${clonedTags.outerHTML}
                </div>
            `;
        }

        // Get project features if they exist
        let featuresHTML = '';
        const featuresElement = card.querySelector('.project-features');
        if (featuresElement) {
            // Clone existing features
            const clonedFeatures = featuresElement.cloneNode(true);
            // Make sure the cloned features are visible
            clonedFeatures.style.display = 'block';

            featuresHTML = `
                <div class="project-features-container">
                    <h4>Key Features</h4>
                    ${clonedFeatures.innerHTML}
                </div>
            `;
        }

        // Get project links if they exist
        let linksHTML = '';
        const linksElement = card.querySelector('.project-links');
        if (linksElement) {
            // Clone existing links
            const clonedLinks = linksElement.cloneNode(true);
            // Make sure the cloned links are visible
            clonedLinks.style.display = 'flex';

            linksHTML = `
                <div class="project-links-container">
                    ${clonedLinks.innerHTML}
                </div>
            `;
        }

        // Prepare modal content
        const modalContent = `
            <div class="project-modal-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
                    <rect width="24" height="24" rx="6" fill="#007AFF" opacity="0.2"/>
                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="#007AFF"/>
                </svg>
            </div>
            <h2 class="project-modal-title">${cardLabel}</h2>
            <div class="project-modal-description">
                <p>${cardDescription}</p>
                ${techTagsHTML}
                ${featuresHTML}
            </div>
            <div class="project-modal-setup">
                ${linksHTML || '<button class="project-modal-action-button">View Project</button>'}
            </div>
        `;

        // Clear previous content and add new content
        modalBody.innerHTML = modalContent;

        // Show modal with animation
        modalContainer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Animate modal content
        setTimeout(() => {
            modalContainer.querySelector('.project-modal').classList.add('active');
        }, 10);
    }

    /**
     * Closes the project modal with animation
     */
    function closeProjectModal() {
        const modal = document.querySelector('.project-modal');
        modal.classList.remove('active');

        // Wait for animation to complete before hiding container
        setTimeout(() => {
            document.querySelector('.project-modal-container').classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    }
}

// ======================================================================
// DYNAMIC STYLES
// ======================================================================

/**
 * Add dynamic CSS styles to the document
 * These styles are for elements created via JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .site-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 14px;
            padding: 12px 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            min-width: 300px;
            max-width: 400px;
            z-index: 2000;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .site-notification.show {
            transform: translateX(-50%) translateY(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            width: 100%;
        }
        
        .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background-color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .notification-icon svg {
            width: 24px;
            height: 24px;
        }
        
        .notification-text {
            flex: 1;
        }
        
        .notification-title {
            font-weight: 600;
            font-size: 15px;
            margin-bottom: 2px;
        }
        
        .notification-message {
            font-size: 13px;
            color: #666;
        }
        
        /* Dark mode styles for notifications */
        body.dark-mode .site-notification {
            background-color: rgba(44, 44, 46, 0.8);
        }
        
        body.dark-mode .notification-icon {
            background-color: #2C2C2E;
        }
        
        body.dark-mode .notification-title {
            color: #FFFFFF;
        }
        
        body.dark-mode .notification-message {
            color: #AEAEB2;
        }
        
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .control-module.active {
            transform: scale(0.98);
        }
        
        .menu-bar.scrolled {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
    `;

    document.head.appendChild(style);
});

// ======================================================================
// SONGS CAROUSEL
// ======================================================================

/**
 * Initializes the songs carousel with data from songs.md
 * Creates a rotating carousel with navigation controls
 */
function initSongsCarousel() {
    // Song data from songs.md
    const songsData = [
        {
            title: "Khwahish",
            year: "2023",
            image: "https://i.scdn.co/image/ab67616d0000b2731a1d9759eaefb2b53c0a9b02",
            spotifyUrl: "https://open.spotify.com/track/6B1nNVfJHObKAiIyC6Rlw0"
        },
        {
            title: "Scientist (Unplugged)",
            year: "2022",
            image: "https://i.scdn.co/image/ab67616d0000b273e18fe158bfea496b18f9a97a",
            spotifyUrl: "https://open.spotify.com/track/0IbnOzTgJP8x6xbujmvVLr"
        },
        {
            title: "Bayaan",
            year: "2021",
            image: "https://i.scdn.co/image/ab67616d0000b273a704d80a685e9059a8770411",
            spotifyUrl: "https://open.spotify.com/track/2AAjVpzQBmbnrpcHdHohrf"
        }
    ];

    const carouselContainer = document.querySelector('.songs-carousel-container');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');

    if (!carouselContainer || !indicatorsContainer || !prevButton || !nextButton) {
        console.error('Songs carousel elements not found');
        return;
    }

    // Create song cards
    songsData.forEach((song, index) => {
        // Create song card
        const songCard = document.createElement('div');
        songCard.className = `song-card ${index === 0 ? 'active' : index === 1 ? 'next' : 'prev'}`;

        // Create song image
        const songImage = document.createElement('div');
        songImage.className = 'song-image';
        songImage.style.backgroundImage = `url(${song.image})`;

        // Create song info
        const songInfo = document.createElement('div');
        songInfo.className = 'song-info';
        songInfo.innerHTML = `
            <div class="song-title">${song.title} <a class="spotify-listen-button" href="${song.spotifyUrl}" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-spotify"></i>
            </a></div>
            <div class="song-year">${song.year}</div>
        `;

        // Append elements
        songCard.appendChild(songImage);
        songCard.appendChild(songInfo);
        carouselContainer.appendChild(songCard);

        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicatorsContainer.appendChild(indicator);
    });

    /**
     * Sets carousel height based on width to maintain aspect ratio
     */
    function setCarouselHeight() {
        const width = carouselContainer.offsetWidth;
        carouselContainer.style.height = `${width}px`;
    }

    // Call once on init
    setCarouselHeight();

    // Update on window resize
    window.addEventListener('resize', setCarouselHeight);

    // Carousel navigation
    let currentIndex = 0;
    const totalSlides = songsData.length;

    /**
     * Updates the carousel to display the specified slide
     * @param {number} newIndex - The index of the slide to display
     */
    function updateCarousel(newIndex) {
        // Handle index wrapping
        if (newIndex < 0) newIndex = totalSlides - 1;
        if (newIndex >= totalSlides) newIndex = 0;

        // Get all cards and indicators
        const cards = carouselContainer.querySelectorAll('.song-card');
        const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');

        // Remove all classes
        cards.forEach(card => {
            card.classList.remove('active', 'prev', 'next');
        });

        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // Set active card
        cards[newIndex].classList.add('active');
        indicators[newIndex].classList.add('active');

        // Set prev card
        const prevIndex = (newIndex - 1 + totalSlides) % totalSlides;
        cards[prevIndex].classList.add('prev');

        // Set next card
        const nextIndex = (newIndex + 1) % totalSlides;
        cards[nextIndex].classList.add('next');

        // Update current index
        currentIndex = newIndex;
    }

    // Event listeners for controls
    prevButton.addEventListener('click', () => {
        updateCarousel(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        updateCarousel(currentIndex + 1);
    });

    // Click on indicators
    indicatorsContainer.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    // Auto-rotate carousel every 8 seconds
    setInterval(() => {
        updateCarousel(currentIndex + 1);
    }, 8000);
}

// ======================================================================
// TESTIMONIALS
// ======================================================================

/**
 * Loads testimonials data from JSON file and renders to the DOM
 */
async function loadTestimonials() {
    try {
        const response = await fetch('../data/testimonials.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const testimonials = await response.json();
        renderTestimonials(testimonials);
    } catch (error) {
        console.error('Error loading testimonials data:', error);
    }
}

/**
 * Renders testimonials to the DOM in a masonry layout
 * @param {Array} testimonials - Array of testimonial objects
 */
function renderTestimonials(testimonials) {
    const testimonialsContainer = document.querySelector('.testimonials-container');
    if (!testimonialsContainer) return;

    // Clear existing content
    testimonialsContainer.innerHTML = '';

    // Create masonry layout container
    const masonryContainer = document.createElement('div');
    masonryContainer.className = 'testimonials-masonry';
    testimonialsContainer.appendChild(masonryContainer);

    // Add each testimonial
    testimonials.forEach((testimonial) => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        testimonialCard.id = testimonial.id;

        // Calculate text length for sizing
        const textLength = testimonial.text.length;
        testimonialCard.setAttribute('data-length', textLength);

        testimonialCard.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-quote">
                    <svg class="quote-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10z"
                            fill="currentColor" />
                    </svg>
                </div>
                <p class="testimonial-text">${testimonial.text}</p>
                <div class="testimonial-author">
                    <div class="author-info">
                        <h4>${testimonial.author.name}</h4>
                        <p>${testimonial.author.position}</p><br>
                        <p>${testimonial.author.company}</p>
                    </div>
                </div>
            </div>
        `;

        masonryContainer.appendChild(testimonialCard);
    });

    // After all cards are added, set grid spans based on text length
    const cards = masonryContainer.querySelectorAll('.testimonial-card');
    cards.forEach(card => {
        const len = parseInt(card.getAttribute('data-length'), 10);
        // Short: 0-180 chars, Medium: 181-320, Long: 321+
        if (len > 320) {
            card.style.gridColumn = 'span 2';
            card.style.gridRow = 'span 2';
        } else if (len > 180) {
            card.style.gridColumn = 'span 2';
            card.style.gridRow = 'span 1';
        } else {
            card.style.gridColumn = 'span 1';
            card.style.gridRow = 'span 1';
        }
    });

    // Animate testimonial cards after rendering
    animateCards('.testimonial-card');
}

// Remove the carousel initialization function since we're using a masonry layout

// ======================================================================
// BOOKS SECTION
// ======================================================================

/**
 * Initializes the books section with book data
 * Creates a horizontally scrolling display of books
 */
function initBooksCarousel() {
    // Book data based on user's favorites
    const booksData = [
        {
            title: "Convenience Store Woman",
            author: "Sayaka Murata",
            image: "https://is5-ssl.mzstatic.com/image/thumb/Publication128/v4/d1/01/8f/d1018fec-c74f-5df1-e3ff-1f6155cdc7a9/9780802165800.jpg/100000x100000-999.jpg",
        },
        {
            title: "Steve Jobs",
            author: "Walter Isaacson",
            image: "https://m.media-amazon.com/images/I/41n1edvVlLL._SY445_SX342_.jpg",
        },
        {
            title: "I Came Upon a Lighthouse",
            author: "Shantanu Naidu",
            image: "https://is5-ssl.mzstatic.com/image/thumb/Publication114/v4/4f/2b/f8/4f2bf8bc-d40e-a2ec-d313-4827c96bd215/9789390327539.jpg/100000x100000-999.jpg",
        },
        {
            title: "Days at the Morisaki Bookshop",
            author: "Satoshi Yagisawa",
            image: "https://is5-ssl.mzstatic.com/image/thumb/Publication112/v4/46/fb/28/46fb28d7-2103-19ad-9b2c-3b9743b366e0/9780063278684.jpg/100000x100000-999.jpg",
        },
        {
            title: "Mr. Penumbra's 24-Hour Bookstore",
            author: "Robin Sloan",
            image: "https://is5-ssl.mzstatic.com/image/thumb/Publication122/v4/91/a6/d1/91a6d168-ded9-d108-a77a-41d93c5f80d5/9780374708832.jpg/100000x100000-999.jpg",
        },
        {
            title: "Friends, Lovers, and the Big Terrible Thing",
            author: "Matthew Perry",
            image: "https://is1-ssl.mzstatic.com/image/thumb/Publication122/v4/62/73/a9/6273a90b-f106-c826-5145-33a8d6f5d5f4/9781250866462.jpg/600x600bb.jpg",
        },
        {
            title: "Shoe Dog: A Memoir by the Creator of Nike",
            author: "Phil Knight",
            image: "https://is1-ssl.mzstatic.com/image/thumb/Publication115/v4/46/d1/4c/46d14cc4-205b-ed79-5630-9a851d231f5e/9781501135934.jpg/600x600bb.jpg",
        }
    ];

    const booksContainer = document.querySelector('.books-scroll');
    if (!booksContainer) {
        console.error('Books container not found');
        return;
    }

    // Create book items
    booksData.forEach(book => {
        // Create book item
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';

        // Create book cover
        const bookCover = document.createElement('div');
        bookCover.className = 'book-cover';
        bookCover.style.backgroundImage = `url(${book.image})`;

        // Create book info
        const bookInfo = document.createElement('div');
        bookInfo.className = 'book-info';
        bookInfo.innerHTML = `
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
        `;

        // Append elements
        bookCover.appendChild(bookInfo);
        bookItem.appendChild(bookCover);
        booksContainer.appendChild(bookItem);
    });

    // Create duplicate books for infinite scroll effect
    const bookItems = booksContainer.querySelectorAll('.book-item');
    bookItems.forEach(item => {
        const clone = item.cloneNode(true);
        booksContainer.appendChild(clone);
    });
}

// ======================================================================
// EXPERIENCE TIMELINE
// ======================================================================

/**
 * Loads experience data from JSON file and renders to the DOM
 */
async function loadExperience() {
    try {
        const response = await fetch('../data/experience.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const experiences = await response.json();
        renderExperience(experiences);
    } catch (error) {
        console.error('Error loading experience data:', error);
    }
}

/**
 * Renders experience data as cards
 * @param {Array} experiences - Array of experience objects
 */
function renderExperience(experiences) {
    const cardsContainer = document.querySelector('.experience-cards');
    if (!cardsContainer) return;

    // Clear existing content
    cardsContainer.innerHTML = '';

    // Add each experience item
    experiences.forEach(experience => {
        const card = document.createElement('div');
        card.className = 'experience-card';
        card.id = experience.id;

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

        cardsContainer.appendChild(card);
    });

    // Animate experience cards after rendering
    animateCards('.experience-card');
}
