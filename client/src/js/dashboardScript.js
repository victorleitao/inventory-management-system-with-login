// DASHBOARD PAGE
const dataBaseURL = 'https://inventory-server-silk.vercel.app/api/v1/';
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
const addProductButton = document.getElementById('addProductButton');
const addProductModal = document.getElementById('addProductModal');
const productsIDs = [];
const categoriesIDs = [];
const categoriesNames = [];

let isSidebarCollapsed = false;
let isCategoryColored = true;
let isModalOn = false;
let isEditing = false;
let isCreatingNewProduct = false;
let isCreatingNewCategory = false;
let isUpdatingProduct = false;
let isSearchingCategories = false;
let listSelected = 'inventario';
let productsSum = 0;
let productQuantityValor = 0;
let numberOfRows = productsIDs.length;
let activeProductID = '';
let activeProductName;
let activeProductDescription;
let activeProductCode;
let activeProductPrice;
let activeProductCategory;
let activeProductQty;
let activeCategoryID = '';
let activeCategoryName;
let activeCategoryCode;
let activeCategoryColor;

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
		hideSidebar();
	} else {
		showSidebar();
	}
});

createCategoryModalButton.addEventListener('click', event => {
	event.preventDefault();
	if (isCreatingNewCategory) {
		if (validateCategory()) {
			registerNewCategory();
			closeCategoryModal();
		} else {
			showPopUp(
				popUpBox,
				'red',
				'Todos os campos devem ser devidamente preenchidos.'
			);
		}
	} else {
		if (validateCategory()) {
			updateCategory();
			closeCategoryModal();
			closeCategorySearch();
		} else {
			showPopUp(
				popUpBox,
				'red',
				'Todos os campos devem ser devidamente preenchidos.'
			);
		}
	}
});

exitCategoryModalButton.addEventListener('click', event => {
	event.preventDefault();
	closeCategoryModal();
});

addProductQuantity.addEventListener('click', () => {
	if (isEditing) {
		productQuantityValor = productQuantityLabel.value;
		productQuantityValor++;
		updateProductQuantity();
	}
});

subtractProductQuantity.addEventListener('click', () => {
	if (isEditing) {
		productQuantityValor = productQuantityLabel.value;
		if (productQuantityValor > 0) {
			productQuantityValor--;
			updateProductQuantity();
		} else {
			showPopUp(
				popUpBox,
				'red',
				'O valor não deve ser<br>inferior a 0 (zero)!',
				3000
			);
		}
	}
});

selectCategoryArrow.addEventListener('click', () => {
	if (!isSearchingCategories) {
		openCategorySearch();
	} else {
		closeCategorySearch();
		closeCategoryModal();
	}
});

overlay.addEventListener('click', () => {
	closeModal();
});

categoryOverlay.addEventListener('click', () => {
	closeCategoryModal();
});

productHeaderDetails.onclick = () => {
	changeCategoryColors(isCategoryColored);
};

addProductButton.onclick = () => {
	if (!isModalOn) {
		enableEdition();
		openModal();
	} else {
		closeModal();
	}
};

editModalButton.onclick = () => {
	event.preventDefault();
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
	event.preventDefault();
	deleteProduct(activeProductID, activeProductQty, activeProductPrice);
};

closeModalButton.onclick = () => {
	event.preventDefault();
	closeModal();
};

filterProductsButton.onclick = () => {
	showPopUp(popUpBox, 'red');
};

updateTableButton.onclick = () => {
	updateTable();
};

createCategoryButton.onclick = () => {
	if (!isCreatingNewCategory) {
		closeCategorySearch();
		openCategoryModal();
		isCreatingNewCategory = true;
	} else {
		closeCategoryModal();
	}
};

async function getCategories() {
	const response = await fetch(dataBaseURL + 'categories/');
	const categoryList = await response.json();
	for (let i = 0; i < categoryList.length; i++) {
		createCategoryItem(
			categoryList[i]._id,
			categoryList[i].name,
			categoryList[i].code,
			categoryList[i].color
		);
	}
}

async function registerNewCategory() {
	const name = categoryNameLabel.value.toUpperCase();
	const code = categoryCodeLabel.value;
	const color = categoryColorLabel.value.toUpperCase();
	const response = await fetch(dataBaseURL + 'categories', {
		method  : 'POST',
		headers : {
			'Content-Type' : 'application/json'
		},
		body    : JSON.stringify({
			name  : name,
			code  : code,
			color : color
		})
	});
	productCategoryLabel.value = name;
	const newCategory = await response.json();
	const id = newCategory.id;
	createCategoryItem(id, name, code, color);
	showPopUp(
		popUpBox,
		'green',
		'A categoria foi criada<br>com sucesso.',
		3500
	);
}

async function updateCategory() {
	const name = categoryNameLabel.value.toUpperCase();
	const code = categoryCodeLabel.value;
	const color = categoryColorLabel.value.toUpperCase();
	if (
		activeCategoryName === name &&
		activeCategoryCode === code &&
		activeCategoryColor === color
	) {
		showPopUp(
			popUpBox,
			'yellow',
			'Nenhuma alteração foi feita.',
			3000
		);
	} else {
		await fetch(dataBaseURL + 'categories/' + activeCategoryID, {
			method  : 'PUT',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify({
				name  : name,
				code  : code,
				color : color
			})
		});
		showPopUp(
			popUpBox,
			'green',
			'Categoria atualizada<br>com sucesso.',
			3500
		);
		deleteCategoryItemLi(activeCategoryID, name);
		createCategoryItem(activeCategoryID, name, code, color);
		productCategoryLabel.value = name;
	}
}

function createCategoryItem(id, name, code, color) {
	categoriesIDs.push(id);
	categoriesNames.push(name);
	const categoryItem = document.createElement('li');
	categoryItem.innerHTML = name;
	categoryItem.classList.add(`category-color-${color}`);
	categoryItem.classList.add(`code-${code}`);
	categoryItem.setAttribute('id', id);
	const categoryItemIcons = document.createElement('div');
	const categoryItemEditIcon = document.createElement('i');
	categoryItemEditIcon.setAttribute('class', 'fa-solid fa-pen');
	const categoryItemDeleteIcon = document.createElement('i');
	categoryItemDeleteIcon.setAttribute('class', 'fa-solid fa-xmark');
	categoryItemIcons.appendChild(categoryItemEditIcon);
	categoryItemIcons.appendChild(categoryItemDeleteIcon);
	categoryItem.appendChild(categoryItemIcons);
	categoriesList.appendChild(categoryItem);
	categoryItem.onclick = () => {
		if (categoryItemIcons.matches(':hover')) {
			if (categoryItemEditIcon.matches(':hover')) {
				openCategoryModal(id, name, code, color);
			} else if (categoryItemDeleteIcon.matches(':hover')) {
				deleteCategoryItem(id, name);
			}
		} else {
			productCategoryLabel.value = name;
			closeCategorySearch();
		}
	};
}

async function deleteCategoryItem(id, name) {
	showConfirmationPopup(
		'Essa categoria será deletada.\nDeseja prosseguir?',
		async result => {
			if (result) {
				const response = await fetch(
					dataBaseURL + 'categories/' + id,
					{
						method : 'DELETE'
					}
				);
				const status = await response.json();
				if (status.success) {
					deleteCategoryItemLi(id, name);
					showPopUp(
						popUpBox,
						'red',
						'Categoria deletada<br>com sucesso.',
						3500
					);
				} else {
					const productsList = status.productsList;
					let mensagem =
						'Essa categoria está registrada nos seguintes produtos:<p>';
					let duration = 5000;
					if (productsList.length > 1) {
						for (let i = 0; i < productsList.length; i++) {
							if (i === 0) {
								mensagem += `${i + 1}. ${productsList[i]
									.name}`;
								duration += 1000;
							} else {
								mensagem += `<br>${i + 1}. ${productsList[
									i
								].name}`;
								duration += 1000;
							}
						}
						mensagem +=
							'</p>Atualize-os para<br>permitir a exclusão.';
					} else {
						mensagem = `O produto ${productsList[0]
							.name} pertence a esta categoria.<br><br>Atualize-o para<br>permitir a exclusão.`;
						duration += 1000;
					}
					showPopUp(popUpBox, 'yellow', mensagem, duration);
				}
			} else {
			}
		}
	);
}

function deleteCategoryItemLi(id, name) {
	document.getElementById(id).remove();
	if (name === productCategoryLabel.value.toUpperCase()) {
		productCategoryLabel.value = '';
	}
	const idIndex = categoriesIDs.indexOf(id);
	categoriesIDs.splice(idIndex, 1);
	const nameIndex = categoriesNames.indexOf(name);
	categoriesNames.splice(nameIndex, 1);
}

async function getProducts() {
	productsSum = 0;
	const response = await fetch(dataBaseURL + 'products/');
	const productList = await response.json();
	for (let i = 0; i < productList.length; i++) {
		createRow(
			productList[i]._id,
			productList[i].name,
			productList[i].code,
			productList[i].description,
			productList[i].countInStock,
			productList[i].price,
			productList[i].category
		);
		productsSum += productList[i].countInStock * productList[i].price;
	}
	updateProductSum();
}

function saveProductData() {
	if (isCreatingNewProduct) {
		if (validateProduct()) {
			registerNewProduct();
			closeModal();
		}
	} else {
		isUpdatingProduct = true;
	}
	if (isUpdatingProduct) {
		if (isTheSameProduct()) {
			showPopUp(
				popUpBox,
				'yellow',
				'Nenhuma alteração foi feita.',
				3000
			);
		} else {
			if (validateProduct()) {
				updateProduct(
					activeProductID,
					productNameLabel.value.toUpperCase(),
					productDescriptionLabel.value.toUpperCase(),
					productCodeLabel.value,
					parseFloat(productPriceLabel.value).toFixed(2),
					productCategoryLabel.value.toUpperCase(),
					productQuantityLabel.value
				);
			}
		}
		closeModal();
	}
}

function createRow(id, name, code, description, qty, price, category) {
	productsIDs.push(id);
	numberOfRows++;
	const productTableRow = document.createElement('tr');
	productTableRow.classList.add('product-table-row');
	productTableRow.setAttribute('id', `productItemRow${id}`);

	// Number column
	const productNumberColumn = document.createElement('td');
	productNumberColumn.classList.add('product-item-number');
	productNumberColumn.setAttribute(
		'id',
		`productItemNumber${numberOfRows}`
	);
	productNumberColumn.innerHTML = `${numberOfRows}`;

	// Details column
	const productDetailsColumn = document.createElement('td');
	productDetailsColumn.classList.add('product-item-details');
	productDetailsColumn.classList.add(category.color);
	productDetailsColumn.setAttribute('id', `${id}`);
	productDetailsColumn.innerHTML =
		'<i class="fa-solid fa-circle-info"></i>';
	productDetailsColumn.firstChild.style.color = category.color;
	productDetailsColumn.onclick = () => {
		openModal(id, name, code, description, qty, price, category.name);
	};

	// Delete column
	const productDeleteColumn = document.createElement('td');
	productDeleteColumn.classList.add('product-item-delete');
	productDeleteColumn.setAttribute('id', `productItemDelete${id}`);
	productDeleteColumn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
	productDeleteColumn.onclick = () => {
		deleteProduct(id, qty, price);
	};

	// Name column
	const productNameColumn = document.createElement('td');
	productNameColumn.classList.add('product-item-name');
	productNameColumn.setAttribute('id', `productItemName${id}`);
	productNameColumn.innerHTML = name;

	// Code column
	const productCodeColumn = document.createElement('td');
	productCodeColumn.classList.add('product-item-code');
	productCodeColumn.setAttribute('id', `productItemCode${id}`);
	productCodeColumn.innerHTML = addLeadingZeros(code);

	// Description column
	const productDescriptionColumn = document.createElement('td');
	productDescriptionColumn.classList.add('product-item-description');
	productDescriptionColumn.setAttribute(
		'id',
		`productItemDescription${id}`
	);
	productDescriptionColumn.innerHTML = description;

	// Quantity column
	const productQuantityColumn = document.createElement('td');
	productQuantityColumn.classList.add('product-item-quantity');
	productQuantityColumn.setAttribute('id', `productItemQuantity${id}`);
	productQuantityColumn.innerHTML = qty;

	// Unitary Price column
	const productUnitPriceColumn = document.createElement('td');
	productUnitPriceColumn.classList.add('product-item-u-price');
	productUnitPriceColumn.setAttribute('id', `productItemUnitPrice${id}`);
	const parsedPrice = parseFloat(price).toFixed(2);
	productUnitPriceColumn.innerHTML = replaceDot(parsedPrice);

	// Total Price column
	const productTotalPriceColumn = document.createElement('td');
	productTotalPriceColumn.classList.add('product-item-t-price');
	productTotalPriceColumn.setAttribute(
		'id',
		`productItemTotalPrice${id}`
	);
	const totalPrice = qty * price;
	const parsedTotalPrice = parseFloat(totalPrice).toFixed(2);
	productTotalPriceColumn.innerHTML = replaceDot(parsedTotalPrice);

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

async function registerNewProduct() {
	const name = productNameLabel.value.toUpperCase();
	const description = productDescriptionLabel.value.toUpperCase();
	const code = productCodeLabel.value;
	const price = parseFloat(productPriceLabel.value).toFixed(2);
	const category = productCategoryLabel.value.toUpperCase();
	const qty = productQuantityLabel.value;
	const response = await fetch(dataBaseURL + 'products', {
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
	const newProduct = await response.json();
	const id = newProduct.id;
	const priceNumber = Number(price);
	const categoryObject = newProduct.category;
	createRow(
		id,
		name,
		code,
		description,
		qty,
		priceNumber,
		categoryObject
	);
	showPopUp(
		popUpBox,
		'green',
		'O produto foi criado<br>com sucesso.',
		3000
	);
	productsSum += qty * price;
	updateProductSum();
}

async function updateProduct(
	id,
	name,
	description,
	code,
	price,
	category,
	qty
) {
	await fetch(dataBaseURL + 'products/' + id, {
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
	updateTable();
	showPopUp(popUpBox, 'green', 'Produto alterado<br>com sucesso.', 3000);
}

function deleteProduct(id, qty, price) {
	showConfirmationPopup(
		'Esse produto será deletado.\nDeseja prosseguir?',
		result => {
			if (result) {
				productsSum -= qty * price;
				updateProductSum();
				fetch(dataBaseURL + 'products/' + id, {
					method : 'DELETE'
				});
				deleteProductRow(id);
				closeModal();
			} else {
			}
		}
	);
}

function deleteProductRow(id) {
	const row = document.getElementById(id);
	row.parentElement.remove();
	const index = productsIDs.indexOf(id);
	productsIDs.splice(index, 1);
	numberOfRows--;
}

function updateProductQuantity() {
	productQuantityLabel.value = productQuantityValor;
}

function openModal(id, name, code, description, qty, price, category) {
	getCategories();
	if (id) {
		populateActiveProductVariables(
			name,
			code,
			description,
			qty,
			price,
			category
		);
		activeProductID = id;
		enableDeleteButton();
		productNameLabel.value = name;
		productPriceLabel.value = price.toFixed(2);
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

function closeModal() {
	closeCategorySearch();
	clearCategorySearch();
	closeCategoryModal();
	closeOverlay();
	addProductModal.style.opacity = '0';
	setTimeout(() => {
		addProductModal.style.scale = '0';
		clearModal();
		disableEdition();
	}, 200);
	isModalOn = false;
	activeProductID = '';
	isUpdatingProduct = false;
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

function openCategoryModal(
	id = '',
	name = '',
	code = '',
	color = '#eaeaea'
) {
	disableCategoryEdition();
	addCategoryModal.style.display = 'grid';
	addCategoryModal.style.opacity = '1';
	categoryNameLabel.focus();
	openCategoryOverlay();
	if (id) {
		enableCategoryEdition();
		populateUnchangedCategoryVariables(name, code, color);
		activeCategoryID = id;
		categoryNameLabel.value = name;
		categoryCodeLabel.value = code;
		categoryColorLabel.value = color;
	}
}

function closeCategoryModal() {
	closeCategoryOverlay();
	productCategoryLabel.focus();
	addCategoryModal.style.opacity = '0';
	isCreatingNewCategory = false;
	setTimeout(() => {
		addCategoryModal.style.display = 'none';
		clearCategoryModal();
	}, 200);
}

function clearCategoryModal() {
	categoryNameLabel.value = '';
	categoryCodeLabel.value = '';
	categoryColorLabel.value = '#eaeaea';
}

function populateActiveProductVariables(
	name,
	code,
	description,
	qty,
	price,
	category
) {
	activeProductName = name;
	activeProductDescription = description;
	activeProductCode = code.toString();
	activeProductPrice = price.toString();
	activeProductCategory = category;
	activeProductQty = qty.toString();
}

function populateUnchangedCategoryVariables(name, code, color) {
	activeCategoryName = name;
	activeCategoryCode = code.toString();
	activeCategoryColor = color;
}

function enableEdition() {
	if (!isEditing) {
		editModalButton.innerHTML = 'SALVAR';
		editModalButton.style.background = 'var(--green-color)';
		enableAddQuantityButton();
		enableSubtractQuantityButton();
		enableCreateCategoryButton();
		enableSearchCategoryButton();
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
		disableCreateCategoryButton();
		disableSearchCategoryButton();
		productNameLabel.setAttribute('disabled', true);
		productPriceLabel.setAttribute('disabled', true);
		productQuantityLabel.setAttribute('disabled', true);
		productDescriptionLabel.setAttribute('disabled', true);
		productCategoryLabel.setAttribute('disabled', true);
		productCodeLabel.setAttribute('disabled', true);
		enableDeleteButton();
		isEditing = false;
	}
}

function enableCategoryEdition() {
	createCategoryModalButton.innerHTML = 'ATUALIZAR';
	createCategoryModalButton.classList.add('active');
}

function disableCategoryEdition() {
	createCategoryModalButton.innerHTML = 'CADASTRAR';
	createCategoryModalButton.classList.remove('active');
}

function enableCreateCategoryButton() {
	createCategoryButton.style.display = 'inline-block';
}

function disableCreateCategoryButton() {
	createCategoryButton.style.display = 'none';
}

function enableSearchCategoryButton() {
	selectCategoryArrow.style.display = 'block';
}

function disableSearchCategoryButton() {
	selectCategoryArrow.style.display = 'none';
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

function openOverlay() {
	overlay.classList.add('active');
}

function closeOverlay() {
	overlay.classList.remove('active');
}

function openCategoryOverlay() {
	categoryOverlay.classList.add('active');
}

function closeCategoryOverlay() {
	categoryOverlay.classList.remove('active');
}

function updateProductSum() {
	const sumString = parseFloat(productsSum).toFixed(2);
	sumResult.innerHTML = replaceDot(sumString);
}

function addLeadingZeros(num) {
	num = num.toString();
	while (num.length < 6) num = '0' + num;
	return num;
}

function replaceDot(priceString) {
	priceString = priceString.replace(/\./, ',');
	priceString = priceString.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
	return priceString;
}

function validateProduct() {
	const name = productNameLabel.value.toUpperCase();
	const description = productDescriptionLabel.value.toUpperCase();
	const code = productCodeLabel.value;
	const price = productPriceLabel.value;
	const category = productCategoryLabel.value.toUpperCase();
	const qty = productQuantityLabel.value;
	if (
		name === '' &&
		description === '' &&
		(code === '' || code === '0') &&
		(price === '' || price === '0') &&
		category === '' &&
		(qty === '' || qty === '0')
	) {
		showPopUp(
			popUpBox,
			'red',
			'Todos os campos devem ser devidamente preenchidos.'
		);
		return false;
	}
	if (name === '') {
		showPopUp(popUpBox, 'red', 'Informe o nome do produto.', 3000);
	} else if (price === '' || price === '0') {
		showPopUp(
			popUpBox,
			'red',
			'O preço do produto deve<br>ser diferente de 0 (zero).',
			4500
		);
	} else if (qty === '' || qty === '0') {
		showPopUp(
			popUpBox,
			'red',
			'A quantidade do produto deve<br>ser diferente de 0 (zero).',
			4500
		);
	} else if (description === '') {
		showPopUp(
			popUpBox,
			'red',
			'Informe a descrição<br>do produto.',
			3000
		);
	} else if (category === '') {
		showPopUp(
			popUpBox,
			'red',
			'Informe a categoria<br>do produto.',
			3000
		);
	} else if (!categoriesNames.includes(category)) {
		showPopUp(
			popUpBox,
			'red',
			'A categoria informada<br>não existe.',
			3000
		);
	} else if (code === '' || code === '0' || code.length > 6) {
		showPopUp(
			popUpBox,
			'red',
			'O código do produto deve ser diferente de 0 (zero) e possuir no máximo 6 (seis) dígitos.',
			5000
		);
	} else {
		return true;
	}
}

function isTheSameProduct() {
	if (
		activeProductName === productNameLabel.value.toUpperCase() &&
		activeProductDescription ===
			productDescriptionLabel.value.toUpperCase() &&
		activeProductCode === productCodeLabel.value &&
		activeProductPrice === productPriceLabel.value &&
		activeProductCategory ===
			productCategoryLabel.value.toUpperCase() &&
		activeProductQty === productQuantityLabel.value
	) {
		return true;
	} else {
		return false;
	}
}

function validateCategory() {
	const name = categoryNameLabel.value.toUpperCase();
	const code = categoryCodeLabel.value;
	const color = categoryColorLabel.value.toUpperCase();
	if (name === '' && (code === '' || code === '0') && color === '') {
		return false;
	}
	if (name === '') {
		showPopUp(popUpBox, 'red', 'Informe o nome da categoria.', 3000);
	} else if (code === '' || code === '0') {
		showPopUp(
			popUpBox,
			'red',
			'O código da categoria deve<br>ser diferente de 0 (zero).',
			4500
		);
	} else if (color === '') {
		showPopUp(
			popUpBox,
			'red',
			'Escolha a cor desejada para representar a categoria.'
		);
	} else {
		return true;
	}
}

function selectInventario() {
	switch (listSelected) {
		case 'inventario':
			break;
		case 'graficos':
			hideGraphics();
			showTable();
			inventarioLi.classList.add('menuActive');
			graficosLi.classList.remove('menuActive');
			configuracoesLi.classList.remove('menuActive');
			break;
		case 'configuracoes':
			hideSettings();
			showTable();
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
			hideTable();
			showGraphics();
			graficosLi.classList.add('menuActive');
			inventarioLi.classList.remove('menuActive');
			configuracoesLi.classList.remove('menuActive');
			showPopUp(popUpBox, 'red');
			break;
		case 'graficos':
			break;
		case 'configuracoes':
			hideSettings();
			showGraphics();
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
			hideTable();
			showSettings();
			configuracoesLi.classList.add('menuActive');
			inventarioLi.classList.remove('menuActive');
			graficosLi.classList.remove('menuActive');
			showPopUp(popUpBox, 'red');
			break;
		case 'graficos':
			hideGraphics();
			showSettings();
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

function hideGraphics() {
	dashboardContentGraphics.style.scale = '0';
}

function showGraphics() {
	dashboardContentGraphics.style.scale = '1';
}

function hideSettings() {
	dashboardContentSettings.style.scale = '0';
}

function showSettings() {
	dashboardContentSettings.style.scale = '1';
}

function hideSidebar() {
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
}

function showSidebar() {
	// Show elements
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

function hideTable() {
	dashboardContentInventory.style.scale = '0';
}

function showTable() {
	dashboardContentInventory.style.scale = '1';
}

function updateTable() {
	clearTable();
	getProducts();
}

function clearTable() {
	for (let i = 0; i < productsIDs.length; i++) {
		const row = document.getElementById(productsIDs[i]);
		row.parentElement.remove();
	}
	productsIDs.length = 0;
	numberOfRows = 0;
}

function changeCategoryColors(categoryColorState) {
	if (categoryColorState) {
		for (let i = 0; i < productsIDs.length; i++) {
			const detailIcon = document.getElementById(productsIDs[i]);
			detailIcon.firstChild.style.color = '#111111';
		}
		isCategoryColored = false;
	} else {
		for (let i = 0; i < productsIDs.length; i++) {
			const detailIcon = document.getElementById(productsIDs[i]);
			const originalColor =
				detailIcon.classList[detailIcon.classList.length - 1];
			detailIcon.firstChild.style.color = originalColor;
		}
		isCategoryColored = true;
	}
}

function openCategorySearch() {
	categorySearchContainer.style.display = 'block';
	isSearchingCategories = true;
}

function closeCategorySearch() {
	categorySearchContainer.style.display = 'none';
	isSearchingCategories = false;
}

function clearCategorySearch() {
	for (let i = 0; i < categoriesIDs.length; i++) {
		document.getElementById(categoriesIDs[i]).remove();
	}
	categoriesIDs.length = 0;
	categoriesNames.length = 0;
}
