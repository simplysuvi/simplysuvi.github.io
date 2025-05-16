/**
 * Component Loader
 * Utility to dynamically load HTML components into pages
 */

class ComponentLoader {
    /**
     * Load a component into a target element
     * @param {string} componentPath - Path to the component HTML file
     * @param {string} targetSelector - CSS selector for the target element
     * @param {Function} callback - Optional callback function to run after component is loaded
     */
    static async loadComponent(componentPath, targetSelector, callback = null) {
        try {
            // Fetch the component HTML
            const response = await fetch(componentPath);
            
            if (!response.ok) {
                throw new Error(`Failed to load component from ${componentPath}: ${response.status} ${response.statusText}`);
            }
            
            const html = await response.text();
            
            // Find the target element
            const targetElement = document.querySelector(targetSelector);
            
            if (!targetElement) {
                throw new Error(`Target element not found: ${targetSelector}`);
            }
            
            // Insert the component HTML
            targetElement.innerHTML = html;
            
            // Execute callback if provided
            if (callback && typeof callback === 'function') {
                callback();
            }
            
            return true;
        } catch (error) {
            console.error('Error loading component:', error);
            return false;
        }
    }
    
    /**
     * Initialize components on the page
     * @param {Object} config - Configuration object with component mappings
     * @param {Function} callback - Optional callback function to run after all components are loaded
     */
    static async initComponents(config, callback = null) {
        try {
            const loadPromises = [];
            
            // Process each component in the configuration
            for (const [componentPath, targetSelector] of Object.entries(config)) {
                loadPromises.push(this.loadComponent(componentPath, targetSelector));
            }
            
            // Wait for all components to load
            await Promise.all(loadPromises);
            
            // Execute callback if provided
            if (callback && typeof callback === 'function') {
                callback();
            }
            
            return true;
        } catch (error) {
            console.error('Error initializing components:', error);
            return false;
        }
    }
}

// Export the ComponentLoader class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentLoader;
}
