// Variáveis para acompanhar o valor total e os valores unitários dos itens
let totalValue = 0;
const itemUnitValues = {};
const itemQuantities = {};



// Função para formatar como moeda
function formatCurrency(value) {
	return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Atualiza o valor total na interface
function updateTotalValue() {
	let total = 0;
	for (const item in itemUnitValues) {
		total += itemUnitValues[item] * itemQuantities[item];
	}
	totalValue = total;
	document.getElementById('total-value').textContent = `Valor Total: ${formatCurrency(totalValue)}`;
}

// JavaScript para adicionar, aumentar e reduzir quantidades de itens
const form = document.getElementById('inventory-form');
const itemList = document.getElementById('item-list');

form.addEventListener('submit', function(event) {
	event.preventDefault();
	const name = document.getElementById('item-name').value;
	const quantity = parseInt(document.getElementById('item-quantity').value);
	const valorUnitario = parseFloat(document.getElementById('item-valor').value.replace(',', '.'));

	if (name && !isNaN(quantity) && !isNaN(valorUnitario)) {
		const existingRow = Array.from(itemList.getElementsByTagName('tr')).find(row => row.cells[0].textContent === name);
		if (existingRow) {
			const currentQuantity = parseInt(existingRow.cells[1].textContent);
			const newQuantity = currentQuantity + quantity;
			existingRow.cells[1].textContent = newQuantity;
			const valorTotal = valorUnitario * newQuantity;
			existingRow.cells[3].textContent = formatCurrency(valorTotal);
		} else {
			const newRow = document.createElement('tr');
			newRow.innerHTML = `<td>${name}</td><td>${quantity}</td><td>${formatCurrency(valorUnitario)}</td><td>${formatCurrency(valorUnitario * quantity)}</td><td><button class="add-button">Adicionar</button><button class="remove-button">Remover</button><button class="save-button">Salvar</button></td>`;
			itemList.appendChild(newRow);
		}

		itemUnitValues[name] = valorUnitario;
		itemQuantities[name] = quantity;

		// Limpar os campos do formulário
		document.getElementById('item-name').value = '';
		document.getElementById('item-quantity').value = '';
		document.getElementById('item-valor').value = '';
	}
	updateTotalValue();
});

itemList.addEventListener('click', function(event) {
	if (event.target.classList.contains('add-button')) {
		const row = event.target.closest('tr');
		const name = row.cells[0].textContent;
		const quantity = itemQuantities[name] + 1;
		itemQuantities[name] = quantity;
		row.cells[1].textContent = quantity;
		const valorUnitario = itemUnitValues[name];
		const valorTotal = valorUnitario * quantity;
		row.cells[3].textContent = formatCurrency(valorTotal);
	} else if (event.target.classList.contains('remove-button')) {
		const row = event.target.closest('tr');
		const name = row.cells[0].textContent;
		const quantity = itemQuantities[name] - 1;
		if (quantity >= 0) {
			itemQuantities[name] = quantity;
			row.cells[1].textContent = quantity;
			const valorUnitario = itemUnitValues[name];
			const valorTotal = valorUnitario * quantity;
			row.cells[3].textContent = formatCurrency(valorTotal);
		}
	} else if (event.target.classList.contains('save-button')) {
		// A funcionalidade do botão "Salvar" permanece a mesma
	}

	updateTotalValue();
});

// Verifica se há dados no LocalStorage e carrega-os
function loadFromLocalStorage() {
    const savedItemUnitValues = localStorage.getItem('itemUnitValues');
    const savedItemQuantities = localStorage.getItem('itemQuantities');
    const savedTotalValue = localStorage.getItem('totalValue');

    if (savedItemUnitValues && savedItemQuantities && savedTotalValue) {
        itemUnitValues = JSON.parse(savedItemUnitValues);
        itemQuantities = JSON.parse(savedItemQuantities);
        totalValue = parseFloat(savedTotalValue);

        // Atualiza a interface com os dados carregados
        updateItemList();
        updateTotalValue();
    }
}

// Salva os dados no LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('itemUnitValues', JSON.stringify(itemUnitValues));
    localStorage.setItem('itemQuantities', JSON.stringify(itemQuantities));
    localStorage.setItem('totalValue', totalValue.toString());
}

// Carrega os dados salvos do LocalStorage ao iniciar a página
loadFromLocalStorage();

// ...

// Função para atualizar a lista de itens
function updateItemList() {
    // Limpa a lista de itens
    itemList.innerHTML = '';

    // Itera sobre os itens armazenados e os exibe na tabela
    for (const item in itemUnitValues) {
        // Cria as linhas da tabela
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${item}</td><td>${itemQuantities[item]}</td><td>${formatCurrency(itemUnitValues[item])}</td><td>${formatCurrency(itemUnitValues[item] * itemQuantities[item])}</td><td><button class="add-button">Adicionar</button><button class="remove-button">Remover</button><button class="save-button">Salvar</button></td>`;
        itemList.appendChild(newRow);
    }
}

// ...

// Adicione a chamada para salvar os dados quando houver mudanças nos dados
form.addEventListener('submit', function(event) {
    // ... (código existente)

    // Salva os dados no LocalStorage após a mudança
    saveToLocalStorage();
});

itemList.addEventListener('click', function(event) {
    // ... (código existente)

    // Salva os dados no LocalStorage após a mudança
    saveToLocalStorage();
});

// Adiciona um evento de escuta para o formulário de busca
const searchForm = document.getElementById('inventory-search');
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('item-name-search').value;
    
    // Chama a função de busca com o termo fornecido
    searchItems(searchTerm);
});

// Função para realizar a busca de itens
function searchItems(searchTerm) {
    // Limpa a lista de itens
    const searchResult = document.getElementById('searchResult'); // Alteração aqui
    searchResult.innerHTML = '';

    // Itera sobre os itens armazenados
    for (const item in itemUnitValues) {
        // Verifica se o termo de busca está presente no nome do item
        if (item.toLowerCase().includes(searchTerm.toLowerCase())) {
            // Cria as linhas da tabela apenas para os itens correspondentes
            const newRow = document.createElement('tr');
            newRow.innerHTML = `<td>${item}</td><td>${itemQuantities[item]}</td><td>${formatCurrency(itemUnitValues[item])}</td><td>${formatCurrency(itemUnitValues[item] * itemQuantities[item])}</td><td><button class="add-button">Adicionar</button><button class="remove-button">Remover</button><button class="save-button">Salvar</button></td>`;
            searchResult.appendChild(newRow);
        }
    }
}