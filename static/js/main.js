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
  
  // Handle folder toggles in sidebar
  const folderToggles = document.querySelectorAll('.sidebar-folder-toggle');
  
  folderToggles.forEach(toggle => {
    const folder = toggle.closest('.sidebar-folder');
    if (!folder) return;
    
    const folderId = folder.getAttribute('data-folder-id') || Math.random().toString(36).substr(2, 9);
    const content = folder.querySelector('.sidebar-folder-content');
    
    if (!content) return;
    
    // Restore saved state or default to open
    const isOpen = localStorage.getItem(`folder-${folderId}`) !== 'false';
    
    // Set initial state
    if (isOpen) {
      content.style.maxHeight = content.scrollHeight + 'px';
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      content.style.maxHeight = '0';
      toggle.setAttribute('aria-expanded', 'false');
    }
    
    // Toggle on click
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        content.style.maxHeight = '0';
        toggle.setAttribute('aria-expanded', 'false');
        localStorage.setItem(`folder-${folderId}`, 'false');
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        toggle.setAttribute('aria-expanded', 'true');
        localStorage.setItem(`folder-${folderId}`, 'true');
      }
    });
  });
  
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
