// DASHBOARD PAGE
let sidebar = document.getElementById('dashboard-sidebar');
let sidebarIcon = document.getElementById('dashboard-sidebar-icon');
let isSidebarHidden = false;

dashboardToggleBtn.addEventListener('click', event => {
	event.preventDefault();

	if (!isSidebarHidden) {
		sidebar.style.minWidth = '0';
		sidebar.style.width = '0';
		sidebarIcon.style.borderRadius = '4px';
		sidebarIcon.style.padding = '4px 6px';
		isSidebarHidden = true;
	} else {
		sidebar.style.minWidth = '320px';
		sidebar.style.width = '20%';
		sidebarIcon.style.borderRadius = '0 4px 4px 0';
		sidebarIcon.style.padding = '4px 6px 4px 0';
		isSidebarHidden = false;
	}
});
