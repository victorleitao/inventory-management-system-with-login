// DASHBOARD PAGE
import showPopUp from './modules/alert.js';
const popUpBox = document.getElementById('popUpBox');
const sidebar = document.getElementById('dashboard-sidebar');
const sidebarIcon = document.getElementById('dashboard-sidebar-icon');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const dashboardLogo = document.getElementById('dashboard-logo');
const dashboardList = document.getElementById('dashboard-menu-list');
const dashboardContent = document.getElementById('dashboardContent');
const inventarioLi = document.getElementById('inventarioList');
const graficosLi = document.getElementById('graficosList');
const configuracoesLi = document.getElementById('configuracoesList');

let isSidebarCollapsed = false;
let listSelected = 'inventario';

userName.innerHTML = sessionStorage.getItem('loggedUser');

inventario.addEventListener('click', event => {
	event.preventDefault();
	selectInventario();
});

graficos.addEventListener('click', event => {
	event.preventDefault();
	selectGraficos();
});

configuracoes.addEventListener('click', event => {
	event.preventDefault();
	selectConfiguracoes();
});

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

		// Change dashboard
		dashboardContent.style.left = '8px';

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

		// Change sidebar icon
		sidebarIcon.style.borderRadius = '0 4px 4px 0';
		sidebarIcon.style.padding = '4px 6px 4px 0';

		// Change dashboard
		dashboardContent.style.left = '336px';

		// Change boolean
		isSidebarCollapsed = false;
	}
});

function selectInventario() {
	switch (listSelected) {
		case 'inventario':
			break;
		case 'graficos':
			inventarioLi.classList.add('menuActive');
			graficosLi.classList.remove('menuActive');
			configuracoesLi.classList.remove('menuActive');
			break;
		case 'configuracoes':
			inventarioLi.classList.add('menuActive');
			graficosLi.classList.remove('menuActive');
			configuracoesLi.classList.remove('menuActive');
			break;
		default:
	}
	listSelected = 'inventario';
}

function selectGraficos() {
	switch (listSelected) {
		case 'inventario':
			graficosLi.classList.add('menuActive');
			inventarioLi.classList.remove('menuActive');
			configuracoesLi.classList.remove('menuActive');
			showPopUp(popUpBox, 'red');
			break;
		case 'graficos':
			break;
		case 'configuracoes':
			graficosLi.classList.add('menuActive');
			inventarioLi.classList.remove('menuActive');
			configuracoesLi.classList.remove('menuActive');
			showPopUp(popUpBox, 'red');
			break;
		default:
	}
	listSelected = 'graficos';
}

function selectConfiguracoes() {
	switch (listSelected) {
		case 'inventario':
			configuracoesLi.classList.add('menuActive');
			inventarioLi.classList.remove('menuActive');
			graficosLi.classList.remove('menuActive');
			showPopUp(popUpBox, 'red');
			break;
		case 'graficos':
			configuracoesLi.classList.add('menuActive');
			inventarioLi.classList.remove('menuActive');
			graficosLi.classList.remove('menuActive');
			showPopUp(popUpBox, 'red');
			break;
		case 'configuracoes':
			break;
		default:
	}
	listSelected = 'configuracoes';
}
