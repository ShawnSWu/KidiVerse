document.addEventListener('DOMContentLoaded', function() {
  // Toggle mobile menu
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.modern-sidebar');
  const sidebarClose = document.querySelector('.sidebar-close');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      sidebar.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
  }
  
  if (sidebarClose) {
    sidebarClose.addEventListener('click', function() {
      sidebar.classList.remove('open');
      mobileMenuToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  }
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(event) {
    const isClickInside = sidebar.contains(event.target) || 
                         (mobileMenuToggle && mobileMenuToggle.contains(event.target));
    
    if (!isClickInside && window.innerWidth < 1024) {
      sidebar.classList.remove('open');
      if (mobileMenuToggle) {
        mobileMenuToggle.classList.remove('active');
      }
      document.body.classList.remove('menu-open');
    }
  });
  
  // Toggle theme
  const themeToggle = document.querySelector('.theme-toggle');
  const themeSwitch = document.querySelector('.theme-switch input');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved user preference, if any, on load and set theme
  const currentTheme = localStorage.getItem('theme');
  
  if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-theme');
    if (themeSwitch) themeSwitch.checked = true;
  }
  
  // Toggle theme when switch is clicked
  if (themeSwitch) {
    themeSwitch.addEventListener('change', function() {
      const isDark = this.checked;
      document.body.classList.toggle('dark-theme', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
  
  // Toggle theme when button is clicked
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const isDark = !document.body.classList.contains('dark-theme');
      document.body.classList.toggle('dark-theme', isDark);
      if (themeSwitch) themeSwitch.checked = isDark;
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
  
  // Handle folder toggles in sidebar with event delegation
  const initFolderToggles = (container = document) => {
    // Handle clicks on folder toggles
    const handleToggleClick = (e) => {
      const toggle = e.target.closest('.sidebar-folder-toggle');
      if (!toggle) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const folder = toggle.closest('.sidebar-folder');
      if (!folder) return;
      
      const content = folder.querySelector('.sidebar-folder-content');
      if (!content) return;
      
      const folderId = folder.getAttribute('data-folder-id');
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      
      // Toggle the expanded class and update state
      if (isExpanded) {
        // Collapse
        content.style.maxHeight = '0';
        content.classList.remove('expanded');
        toggle.setAttribute('aria-expanded', 'false');
        if (folderId) {
          localStorage.setItem(`folder-${folderId}`, 'false');
        }
      } else {
        // Expand
        // First, set to actual height for smooth transition
        content.style.maxHeight = (content.scrollHeight+100) + 'px';
        // Then add the expanded class which has a larger max-height
        setTimeout(() => {
          content.classList.add('expanded');
        }, 10);
        
        toggle.setAttribute('aria-expanded', 'true');
        if (folderId) {
          localStorage.setItem(`folder-${folderId}`, 'true');
        }
      }
    };
    
    // Initialize all folder toggles
    const folderToggles = container.querySelectorAll('.sidebar-folder');
    
    folderToggles.forEach(folder => {
      const toggle = folder.querySelector('.sidebar-folder-toggle');
      const content = folder.querySelector('.sidebar-folder-content');
      const folderId = folder.getAttribute('data-folder-id');
      
      if (!toggle || !content) return;
      
      // Set initial state from localStorage or default to closed
      const isOpen = folderId ? localStorage.getItem(`folder-${folderId}`) !== 'false' : false;
      
      if (isOpen) {
        // Set initial height to 0, then expand to content height
        content.style.maxHeight = '0';
        // Force reflow to ensure the transition works
        void content.offsetHeight;
        // Set to content height and add expanded class
        content.style.maxHeight = content.scrollHeight + 'px';
        content.classList.add('expanded');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        content.style.maxHeight = '0';
        content.classList.remove('expanded');
        toggle.setAttribute('aria-expanded', 'false');
      }
      
      // Add click event
      toggle.addEventListener('click', handleToggleClick);
    });
  };
  
  // Initialize all folder toggles on page load
  initFolderToggles();
  
  // Update max-height when window is resized
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      document.body.classList.remove('menu-open');
      if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
      if (sidebar) sidebar.classList.remove('open');
    }
    
    // Update all open folders' max-height
    document.querySelectorAll('.sidebar-folder[open] .sidebar-folder-content').forEach(content => {
      content.style.maxHeight = content.scrollHeight + 'px';
    });
  });
});
