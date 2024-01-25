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
const overlay = document.getElementById('overlay');
const addProductButton = document.getElementById('addProductButton');
const addProductModal = document.getElementById('addProductModal');

let isSidebarCollapsed = false;
let isModalOn = false;
let isEditing = false;
let isCreatingNewProduct = false;
let isUpdatingProduct = false;
let listSelected = 'inventario';
let productsSum = 0;
let productQuantityValor = 0;
let numberOfRows = 0;

getProducts();

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

addProductQuantity.addEventListener('click', event => {
	if (isEditing) {
		productQuantityValor = productQuantityLabel.value;
		productQuantityValor++;
		updateProductQuantity();
	}
});

subtractProductQuantity.addEventListener('click', event => {
	if (isEditing) {
		productQuantityValor = productQuantityLabel.value;
		if (productQuantityValor > 0) {
			productQuantityValor--;
			updateProductQuantity();
		} else {
			const mensagem = 'O valor não pode ser inferior a zero!';
			showPopUp(popUpBox, 'red', mensagem);
		}
	}
});

overlay.addEventListener('click', event => {
	closeModal();
});

addProductButton.onclick = () => {
	if (!isModalOn) {
		enableEdition();
		openModal();
	} else {
		closeModal();
	}
};

editModalButton.onclick = () => {
	if (isUpdatingProduct) {
		saveProductData();
	} else {
		if (isCreatingNewProduct) {
			saveProductData();
		} else {
			enableEdition();
			isUpdatingProduct = true;
		}
	}
};

deleteModalButton.onclick = () => {
	deleteProduct();
};

closeModalButton.onclick = () => {
	closeModal();
};

filterProductsButton.onclick = async () => {
	showPopUp(popUpBox, 'red');
};

updateTableButton.onclick = async () => {
	clearTable();
	getProducts();
};

async function getProducts() {
	productsSum = 0;
	const response = await fetch('http://localhost:3001/api/v1/products/');
	const data = await response.json();
	for (numberOfRows; numberOfRows < data.length; numberOfRows++) {
		createRow(
			data[numberOfRows]._id,
			numberOfRows,
			data[numberOfRows].name,
			data[numberOfRows].code,
			data[numberOfRows].description,
			data[numberOfRows].countInStock,
			data[numberOfRows].price,
			data[numberOfRows].category.name
		);
		productsSum +=
			data[numberOfRows].countInStock * data[numberOfRows].price;
	}
	updateProductSum();
}

function createRow(id, i, name, code, description, qty, price, category) {
	const productTableRow = document.createElement('tr');
	productTableRow.classList.add('product-table-row');
	productTableRow.setAttribute('id', `productItemRow${i + 1}`);

	// Number column
	const productNumberColumn = document.createElement('td');
	productNumberColumn.classList.add('product-item-number');
	productNumberColumn.setAttribute('id', `productItemNumber${i + 1}`);
	productNumberColumn.innerHTML = `${i + 1}`;

	// Details column
	const productDetailsColumn = document.createElement('td');
	productDetailsColumn.classList.add('product-item-details');
	productDetailsColumn.setAttribute('id', `productItemDetails${i + 1}`);
	productDetailsColumn.innerHTML = `<i class="fa-solid fa-circle-info"></i>`;
	productDetailsColumn.onclick = () => {
		openModal(name, code, description, qty, price, category);
	};

	// Delete column
	const productDeleteColumn = document.createElement('td');
	productDeleteColumn.classList.add('product-item-delete');
	productDeleteColumn.setAttribute('id', `productItemDelete${i + 1}`);
	productDeleteColumn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
	productDeleteColumn.onclick = () => {
		deleteProduct(id, productTableRow, qty, price);
	};

	// Name column
	const productNameColumn = document.createElement('td');
	productNameColumn.classList.add('product-item-name');
	productNameColumn.setAttribute('id', `productItemName${i + 1}`);
	productNameColumn.innerHTML = name;

	// Code column
	const productCodeColumn = document.createElement('td');
	productCodeColumn.classList.add('product-item-code');
	productCodeColumn.setAttribute('id', `productItemCode${i + 1}`);
	productCodeColumn.innerHTML = code;

	// Description column
	const productDescriptionColumn = document.createElement('td');
	productDescriptionColumn.classList.add('product-item-description');
	productDescriptionColumn.setAttribute(
		'id',
		`productItemDescription${i + 1}`
	);
	productDescriptionColumn.innerHTML = description;

	// Quantity column
	const productQuantityColumn = document.createElement('td');
	productQuantityColumn.classList.add('product-item-quantity');
	productQuantityColumn.setAttribute(
		'id',
		`productItemQuantity${i + 1}`
	);
	productQuantityColumn.innerHTML = qty;

	// Unitary Price column
	const productUnitPriceColumn = document.createElement('td');
	productUnitPriceColumn.classList.add('product-item-u-price');
	productUnitPriceColumn.setAttribute(
		'id',
		`productItemUnitPrice${i + 1}`
	);
	productUnitPriceColumn.innerHTML = price.toFixed(2);

	// Total Price column
	const productTotalPriceColumn = document.createElement('td');
	productTotalPriceColumn.classList.add('product-item-t-price');
	productTotalPriceColumn.setAttribute(
		'id',
		`productItemTotalPrice${i + 1}`
	);
	const totalPrice = qty * price;
	productTotalPriceColumn.innerHTML = totalPrice.toFixed(2);

	productTableRow.appendChild(productNumberColumn);
	productTableRow.appendChild(productDetailsColumn);
	productTableRow.appendChild(productDeleteColumn);
	productTableRow.appendChild(productNameColumn);
	productTableRow.appendChild(productCodeColumn);
	productTableRow.appendChild(productDescriptionColumn);
	productTableRow.appendChild(productQuantityColumn);
	productTableRow.appendChild(productUnitPriceColumn);
	productTableRow.appendChild(productTotalPriceColumn);
	productTable.appendChild(productTableRow);
}

function enableEdition() {
	if (!isEditing) {
		editModalButton.innerHTML = 'SALVAR';
		editModalButton.style.background = 'var(--green-color)';
		enableAddQuantityButton();
		enableSubtractQuantityButton();
		productNameLabel.removeAttribute('disabled');
		productNameLabel.focus();
		productPriceLabel.removeAttribute('disabled');
		productQuantityLabel.removeAttribute('disabled');
		productDescriptionLabel.removeAttribute('disabled');
		productCategoryLabel.removeAttribute('disabled');
		productCodeLabel.removeAttribute('disabled');
		disableDeleteButton();
		isEditing = true;
	}
}

function disableEdition() {
	if (isEditing) {
		editModalButton.innerHTML = 'EDITAR';
		editModalButton.style.background = 'var(--blue-color)';
		disableAddQuantityButton();
		disableSubtractQuantityButton();
		productNameLabel.setAttribute('disabled', true);
		productPriceLabel.setAttribute('disabled', true);
		productQuantityLabel.setAttribute('disabled', true);
		productDescriptionLabel.setAttribute('disabled', true);
		productCodeLabel.setAttribute('disabled', true);
		subtractProductQuantity.setAttribute('disabled', true);
		addProductQuantity.setAttribute('disabled', true);
		enableDeleteButton();
		isEditing = false;
	}
}

async function saveProductData() {
	if (isCreatingNewProduct) {
		if (
			!productNameLabel.value ||
			!productDescriptionLabel.value ||
			!productCodeLabel.value ||
			!productPriceLabel.value ||
			!productCategoryLabel.value
		) {
			const mensagem = 'Todos os campos devem ser preenchidos.';
			showPopUp(popUpBox, 'red', mensagem);
		} else {
			const name = productNameLabel.value;
			const description = productDescriptionLabel.value;
			const code = productCodeLabel.value;
			const price = productPriceLabel.value;
			const category = productCategoryLabel.value;
			const qty = productQuantityLabel.value;
			registerNewProduct(
				name,
				description,
				code,
				price,
				category,
				qty
			);
			closeModal();
		}
	} else {
		isUpdatingProduct = true;
	}
	if (isUpdatingProduct) {
		// updateProduct();
		console.log('ATUALIZANDO PRODUTO');
		isUpdatingProduct = false;
		closeModal();
	}
}

function deleteProduct(id, tableRow, qty, price) {
	productsSum -= qty * price;
	updateProductSum();
	fetch('http://localhost:3001/api/v1/products/' + id, {
		method : 'DELETE'
	});
	// clearTable();
	getProducts();
	numberOfRows--;
}

function openModal(name, code, description, qty, price, category) {
	if (name) {
		enableDeleteButton();
		productNameLabel.value = name;
		productPriceLabel.value = price;
		productQuantityValor = qty;
		updateProductQuantity();
		productDescriptionLabel.value = description;
		productCodeLabel.value = code;
		productCategoryLabel.value = category;
		disableEdition();
		isCreatingNewProduct = false;
	} else {
		disableDeleteButton();
		isCreatingNewProduct = true;
	}
	openOverlay();
	addProductModal.style.scale = '1';
	addProductModal.style.opacity = '1';
	isModalOn = true;
}

function clearModal() {
	productNameLabel.value = '';
	productPriceLabel.value = '';
	productQuantityValor = 0;
	updateProductQuantity();
	productDescriptionLabel.value = '';
	productCodeLabel.value = '';
	productCategoryLabel.value = '';
}

function closeModal() {
	closeOverlay();
	addProductModal.style.opacity = '0';
	setTimeout(() => {
		addProductModal.style.scale = '0';
		clearModal();
		disableEdition();
	}, 200);
	isModalOn = false;
}

function updateProductSum() {
	sumResult.innerHTML = productsSum.toFixed(2);
}

function clearTable() {
	for (numberOfRows; numberOfRows > 0; numberOfRows--) {
		const row = document.getElementById(
			`productItemRow${numberOfRows}`
		);
		row.remove();
	}
}

function openOverlay() {
	overlay.classList.add('active');
}

function closeOverlay() {
	overlay.classList.remove('active');
}

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

function updateProductQuantity() {
	productQuantityLabel.value = productQuantityValor;
}

function enableAddQuantityButton() {
	addProductQuantity.style.color = 'var(--black-color)';
	addProductQuantity.style.cursor = 'pointer';
}

function disableAddQuantityButton() {
	addProductQuantity.style.color = 'var(--modal-color)';
	addProductQuantity.style.cursor = 'auto';
}

function enableSubtractQuantityButton() {
	subtractProductQuantity.style.color = 'var(--black-color)';
	subtractProductQuantity.style.cursor = 'pointer';
}

function disableSubtractQuantityButton() {
	subtractProductQuantity.style.color = 'var(--modal-color)';
	subtractProductQuantity.style.cursor = 'auto';
}

function enableDeleteButton() {
	deleteModalButton.style.color = 'var(--white-color)';
	deleteModalButton.style.background = 'var(--red-color)';
	deleteModalButton.removeAttribute('disabled');
	deleteModalButton.style.cursor = 'pointer';
}

function disableDeleteButton() {
	deleteModalButton.style.color = 'var(--modal-color)';
	deleteModalButton.style.background = 'var(--inactive-button-color)';
	deleteModalButton.setAttribute('disabled', true);
	deleteModalButton.style.cursor = 'auto';
}

function registerNewProduct(
	name,
	description,
	code,
	price,
	category,
	qty
) {
	fetch('http://localhost:3001/api/v1/products', {
		method  : 'POST',
		headers : {
			'Content-Type' : 'application/json'
		},
		body    : JSON.stringify({
			name         : name,
			description  : description,
			code         : code,
			price        : price,
			category     : category,
			countInStock : qty
		})
	});
}

function updateProduct(id) {
	fetch('http://localhost:3001/api/v1/products' + id, {
		method  : 'PUT',
		headers : {
			'Content-Type' : 'application/json'
		},
		body    : JSON.stringify({
			name         : name,
			description  : description,
			code         : code,
			price        : price,
			category     : category,
			countInStock : qty
		})
	});
}

async function getProductByCode(code) {
	const response = await fetch(
		'http://localhost:3001/api/v1/products/search?code=' + code
	);
	const newProduct = await response.json();
	return newProduct;
}
