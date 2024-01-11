// DASHBOARD PAGE
let sidebar = document.getElementById('dashboard-sidebar');
let sidebarIcon = document.getElementById('dashboard-sidebar-icon');
let isSidebarCollapsed = false;
let userInfo = document.getElementById('user-info');
let userName = document.getElementById('user-name');
let dashboardLogo = document.getElementById('dashboard-logo');
let dashboardList = document.getElementById('dashboard-menu-list');

userName.innerHTML = sessionStorage.getItem('loggedUser');

dashboardToggleBtn.addEventListener('click', event => {
	event.preventDefault();

	if (!isSidebarCollapsed) {
		// Hide elements
		dashboardLogo.style.opacity = '0';
		userInfo.style.opacity = '0';
		userName.style.margin = '0';
		dashboardList.style.opacity = '0';

		// Collapse sidebar
		sidebar.style.minWidth = '0';
		sidebar.style.width = '0';

		// Change sidebar icon
		sidebarIcon.style.borderRadius = '4px';
		sidebarIcon.style.padding = '4px 6px';

		// Change boolean
		isSidebarCollapsed = true;
	} else {
		// Hide elements
		dashboardLogo.style.opacity = '1';
		userInfo.style.opacity = '1';
		userName.style.margin = '0 12px';
		dashboardList.style.opacity = '1';

		// Collapse sidebar
		sidebar.style.minWidth = '320px';
		sidebar.style.width = '20%';

		// Change sidebar icon
		sidebarIcon.style.borderRadius = '0 4px 4px 0';
		sidebarIcon.style.padding = '4px 6px 4px 0';

		// Change boolean
		isSidebarCollapsed = false;
	}
});
