// Use absolute paths from root
function getPagesPath(filename) {
  return `/src/pages/${filename}`;
}

export class AppFooter extends HTMLElement {
  constructor() {
    super();

    // Create shadow DOM to isolate internal styles
    const shadow = this.attachShadow({ mode: "open" });
    // Create link tag to load external CSS
    const styleLink = document.createElement("link");
    styleLink.setAttribute("rel", "stylesheet");
    
    // Check if we're in production build by looking for assets scripts
    const hasAssetsScript = document.querySelector('script[src*="assets/"]') || 
                           document.querySelector('link[href*="assets/"]');
    let cssPath;
    if (hasAssetsScript) {
      // Find the correct CSS file dynamically
      const cssLink = document.querySelector('link[href*="assets/"][href$=".css"]');
      cssPath = cssLink ? cssLink.href : '/assets/components-_ANuRjC4.css';
    } else {
      cssPath = '/src/components/styles/footer.css';
    }
    styleLink.setAttribute("href", cssPath);

    // Define HTML template with icons
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
         <footer class="foot">
             <div class="foot-nav">
               <a href="#" class="nav-item" data-route="search">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                   <circle cx="12" cy="10" r="3"></circle>
                 </svg>
                 <span>Map</span>
               </a>
               <a href="#" class="nav-item" data-route="favorites">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                 </svg>
                 <span>Favorites</span>
               </a>
               <a href="#" class="nav-item" data-route="traffic">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <path d="M9 10h6a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3z"></path>
                   <path d="M5 12h14M3 18h2M19 18h2"></path>
                   <path d="M7 20v2M17 20v2"></path>
                 </svg>
                 <span>Traffic</span>
               </a>
               <a href="#" class="nav-item" data-route="settings">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <circle cx="12" cy="12" r="3"></circle>
                   <path d="M12 1v6M12 17v6M5.64 5.64l4.24 4.24M14.12 14.12l4.24 4.24M1 12h6M17 12h6M5.64 18.36l4.24-4.24M14.12 9.88l4.24-4.24"></path>
                 </svg>
                 <span>Settings</span>
               </a>
             </div>
         </footer>
    `;
    // Add styles and content
    shadow.appendChild(styleLink);
    shadow.appendChild(wrapper);

    // Add click handlers for navigation
    this.setupNavigation(shadow);
    
    // Update active state on page load
    this.updateActiveState();
  }

  setupNavigation(shadow) {
    const navItems = shadow.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const route = item.getAttribute('data-route');
        this.handleNavigation(route, shadow);
      });
    });
  }

  updateActiveState() {
    const currentPath = window.location.pathname;
    
    // Determine active route based on current page
    let activeRoute = '';
    if (currentPath.includes('favorateList.html')) {
      activeRoute = 'favorites';
    } else if (currentPath.includes('main.html')) {
      activeRoute = 'search';
    } else if (currentPath.includes('search.html')) {
      activeRoute = 'search';
    } else if (currentPath.includes('trafficComments.html')) {
      activeRoute = 'traffic';
    }
    
    // Update active state
    this.shadowRoot.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-route') === activeRoute) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  handleNavigation(route, shadow) {
    // Emit custom event for route navigation
    const navEvent = new CustomEvent('navigate', {
      detail: { route },
      bubbles: true
    });
    this.dispatchEvent(navEvent);
    
    // Update active state
    shadow.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-route') === route) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Direct navigation based on route
    if (route === 'favorites') {
      window.location.href = getPagesPath('favorateList.html');
    } else if (route === 'search') {
      window.location.href = getPagesPath('main.html');
    } else if (route === 'traffic') {
      window.location.href = getPagesPath('trafficComments.html');
    } else if (route === 'settings') {
      window.location.href = getPagesPath('settings.html');
    }
  }
}

// Component is already exported in class declaration
