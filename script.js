const products = [
  { name: 'Bolsa Horizonte', brand: 'Aroeira', type: 'Acessórios', color: 'Natural', price: 189, tone: 'tone-sand', icon: 'bi-bag-heart', code: '01 / 08' },
  { name: 'Copo Brisa', brand: 'Lume', type: 'Casa', color: 'Azul', price: 78, tone: 'tone-blue', icon: 'bi-cup-hot', code: '02 / 08' },
  { name: 'Camisa Margem', brand: 'Fio Norte', type: 'Moda', color: 'Terracota', price: 249, tone: 'tone-pink', icon: 'bi-person-standing', code: '03 / 08' },
  { name: 'Vela Intervalo', brand: 'Orla', type: 'Casa', color: 'Natural', price: 96, tone: 'tone-green', icon: 'bi-circle', code: '04 / 08' },
  { name: 'Carteira Linha', brand: 'Aroeira', type: 'Acessórios', color: 'Preto', price: 125, tone: 'tone-blue', icon: 'bi-wallet2', code: '05 / 08' },
  { name: 'Calça Baixa', brand: 'Fio Norte', type: 'Moda', color: 'Natural', price: 329, tone: 'tone-sand', icon: 'bi-person-standing-dress', code: '06 / 08' },
  { name: 'Jarra Sol', brand: 'Lume', type: 'Casa', color: 'Terracota', price: 154, tone: 'tone-pink', icon: 'bi-droplet', code: '07 / 08' },
  { name: 'Óculos Ponto', brand: 'Orla', type: 'Acessórios', color: 'Preto', price: 279, tone: 'tone-green', icon: 'bi-eyeglasses', code: '08 / 08' }
];

const formatPrice = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;
const productGrid = document.querySelector('#productGrid');
const emptyState = document.querySelector('#emptyState');
const productCount = document.querySelector('#productCount');
const favoriteProducts = new Set();
const bagItems = new Map();
let currentRole = 'guest';
let supporterName = '';

function enterCatalog(role) {
  currentRole = role;
  document.querySelector('#welcomeScreen').classList.add('d-none');
  document.querySelector('#catalogScreen').classList.remove('d-none');
  const badge = document.querySelector('#userBadge');
  const roleDetails = role === 'client' ? ['bi-person-check', ' cliente'] : role === 'supporter' ? ['bi-building-check', ` ${supporterName}`] : ['bi-incognito', ' visitante'];
  badge.innerHTML = `<i class="bi ${roleDetails[0]} me-1"></i>${roleDetails[1]}`;
  document.querySelector('#publishButton').classList.toggle('d-none', role !== 'supporter');
  window.scrollTo(0, 0);
}

function productCard(product) {
  const isFavorite = favoriteProducts.has(product.name);
  return `<article class="col-12 col-sm-6 col-lg-3"><div class="product-card"><div class="product-image ${product.tone}" data-code="${product.code}"><i class="bi ${product.icon}"></i></div><div class="product-info"><div class="d-flex justify-content-between align-items-start"><div><div class="product-brand">${product.brand}</div><h2 class="product-name">${product.name}</h2><div class="product-price">${formatPrice(product.price)}</div></div><button class="heart-button ${isFavorite ? 'is-favorite' : ''}" data-product="${product.name}" aria-label="${isFavorite ? 'Remover' : 'Adicionar'} ${product.name} ${isFavorite ? 'dos' : 'aos'} favoritos"><i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i></button></div><button class="add-bag-button" data-bag-product="${product.name}"><i class="bi bi-bag-plus me-2"></i>Adicionar à sacola</button></div></div></article>`;
}

function getFilteredProducts() {
  const term = document.querySelector('#searchInput').value.toLowerCase().trim();
  const brand = document.querySelector('#brandFilter').value;
  const type = document.querySelector('#typeFilter').value;
  const color = document.querySelector('#colorFilter').value;
  const price = document.querySelector('#priceFilter').value;
  const filtered = products.filter((product) => {
    const matchesTerm = [product.name, product.brand, product.type, product.color].join(' ').toLowerCase().includes(term);
    const matchesPrice = !price || (product.price >= Number(price.split('-')[0]) && product.price <= Number(price.split('-')[1]));
    return matchesTerm && (!brand || product.brand === brand) && (!type || product.type === type) && (!color || product.color === color) && matchesPrice;
  });

  return filtered;
}

function renderProducts() {
  const filtered = getFilteredProducts();
  productGrid.innerHTML = filtered.map(productCard).join('');
  productCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'achado' : 'achados'}`;
  emptyState.classList.toggle('d-none', filtered.length !== 0);
}

function renderFavorites() {
  const favorites = products.filter((product) => favoriteProducts.has(product.name));
  document.querySelector('#favoritesGrid').innerHTML = favorites.map(productCard).join('');
  document.querySelector('#favoritesMessage').textContent = currentRole === 'client' ? `${favorites.length} ${favorites.length === 1 ? 'item salvo' : 'itens salvos'} para consultar depois.` : 'Entre como cliente para criar uma curadoria de produtos.';
  document.querySelector('#favoritesGrid').classList.toggle('d-none', favorites.length === 0);
}

function renderBag() {
  const entries = [...bagItems.entries()];
  const bagEmpty = document.querySelector('#bagEmpty');
  const bagContent = document.querySelector('#bagContent');
  bagEmpty.classList.toggle('d-none', entries.length !== 0);
  bagContent.classList.toggle('d-none', entries.length === 0);
  document.querySelector('#bagItems').innerHTML = entries.map(([name, quantity]) => { const product = products.find((item) => item.name === name); return `<div class="bag-item"><div class="bag-item-image ${product.tone}"><i class="bi ${product.icon}"></i></div><div class="bag-item-details"><div class="product-brand">${product.brand}</div><h2>${product.name}</h2><span>${formatPrice(product.price)}</span></div><div class="bag-quantity"><button data-bag-action="decrease" data-bag-product="${name}" aria-label="Diminuir quantidade"><i class="bi bi-dash"></i></button><strong>${quantity}</strong><button data-bag-action="increase" data-bag-product="${name}" aria-label="Aumentar quantidade"><i class="bi bi-plus"></i></button></div><button class="bag-remove" data-bag-action="remove" data-bag-product="${name}" aria-label="Remover ${name} da sacola"><i class="bi bi-x-lg"></i></button></div>`; }).join('');
  const total = entries.reduce((sum, [name, quantity]) => sum + (products.find((product) => product.name === name).price * quantity), 0);
  document.querySelector('#bagSubtotal').textContent = formatPrice(total);
  document.querySelector('#bagTotal').textContent = formatPrice(total);
  updateBagBadge();
}

function updateBagBadge() {
  const count = [...bagItems.values()].reduce((sum, quantity) => sum + quantity, 0);
  const button = document.querySelector('#bagButton');
  button.innerHTML = `<i class="bi bi-bag"></i>${count ? `<span class="bag-count">${count}</span>` : ''}`;
}

function addToBag(productName) {
  bagItems.set(productName, (bagItems.get(productName) || 0) + 1);
  updateBagBadge();
}

function renderBrands() {
  const brands = [...new Set(products.map((product) => product.brand))];
  document.querySelector('#brandGrid').innerHTML = brands.map((brand, index) => `<article class="col-12 col-md-6"><div class="brand-card"><span class="brand-number">0${index + 1}</span><div><h2>${brand}</h2><p>${products.filter((product) => product.brand === brand).length} produtos na seleção</p></div><button class="icon-button brand-link" data-brand="${brand}" data-view="discover" aria-label="Ver produtos da marca ${brand}"><i class="bi bi-arrow-up-right"></i></button></div></article>`).join('');
}

function showView(view) {
  const viewMap = { discover: '.discover-view', brands: '#marcasView', inspiration: '#inspiracoesView', favorites: '#favoritosView', bag: '#sacolaView' };
  document.querySelectorAll('.site-view').forEach((element) => element.classList.add('d-none'));
  document.querySelectorAll(viewMap[view]).forEach((element) => element.classList.remove('d-none'));
  document.querySelectorAll('[data-view]').forEach((link) => link.classList.toggle('active', link.dataset.view === view && link.classList.contains('nav-link')));
  if (view === 'favorites') renderFavorites();
  if (view === 'brands') renderBrands();
  if (view === 'discover') renderProducts();
  if (view === 'bag') renderBag();
  window.scrollTo(0, 0);
}

document.querySelectorAll('#searchInput, #brandFilter, #typeFilter, #colorFilter, #priceFilter').forEach((control) => { control.addEventListener('input', renderProducts); control.addEventListener('change', renderProducts); });
document.querySelector('#clearFilters').addEventListener('click', () => { document.querySelector('#searchInput').value = ''; document.querySelectorAll('.filters-row select').forEach((select) => { select.value = ''; }); renderProducts(); });

document.querySelector('#continueGuest').addEventListener('click', () => enterCatalog('guest'));
document.querySelector('#clientLoginForm').addEventListener('submit', (event) => { event.preventDefault(); bootstrap.Modal.getInstance(document.querySelector('#loginModal')).hide(); enterCatalog('client'); });
document.querySelector('#supporterLoginForm').addEventListener('submit', (event) => { event.preventDefault(); supporterName = document.querySelector('#companyName').value.trim(); bootstrap.Modal.getInstance(document.querySelector('#loginModal')).hide(); enterCatalog('supporter'); bootstrap.Modal.getOrCreateInstance(document.querySelector('#publishModal')).show(); });
document.querySelector('#publishForm').addEventListener('submit', (event) => { event.preventDefault(); const itemName = document.querySelector('#itemName').value.trim(); products.push({ name: itemName, brand: supporterName, type: document.querySelector('#itemType').value, color: document.querySelector('#itemColor').value, price: Number(document.querySelector('#itemPrice').value), tone: 'tone-green', icon: 'bi-box-seam', code: `${String(products.length + 1).padStart(2, '0')} / ${String(products.length + 1).padStart(2, '0')}` }); renderProducts(); event.target.reset(); bootstrap.Modal.getInstance(document.querySelector('#publishModal')).hide(); });
productGrid.addEventListener('click', (event) => { const bagButton = event.target.closest('.add-bag-button'); if (bagButton) { addToBag(bagButton.dataset.bagProduct); bagButton.innerHTML = '<i class="bi bi-check2 me-2"></i>Adicionado'; setTimeout(() => { bagButton.innerHTML = '<i class="bi bi-bag-plus me-2"></i>Adicionar à sacola'; }, 1400); return; } const button = event.target.closest('.heart-button'); if (!button) return; if (currentRole !== 'client') { bootstrap.Modal.getOrCreateInstance(document.querySelector('#loginModal')).show(); return; } const productName = button.dataset.product; favoriteProducts.has(productName) ? favoriteProducts.delete(productName) : favoriteProducts.add(productName); renderProducts(); });
document.querySelector('#favoritesGrid').addEventListener('click', (event) => { const bagButton = event.target.closest('.add-bag-button'); if (bagButton) { addToBag(bagButton.dataset.bagProduct); bagButton.innerHTML = '<i class="bi bi-check2 me-2"></i>Adicionado'; return; } const button = event.target.closest('.heart-button'); if (!button) return; favoriteProducts.delete(button.dataset.product); renderFavorites(); });
document.querySelector('#favoritesButton').addEventListener('click', () => { if (currentRole !== 'client') bootstrap.Modal.getOrCreateInstance(document.querySelector('#loginModal')).show(); });
document.querySelector('#bagItems').addEventListener('click', (event) => { const button = event.target.closest('[data-bag-action]'); if (!button) return; const name = button.dataset.bagProduct; const action = button.dataset.bagAction; const currentQuantity = bagItems.get(name) || 0; if (action === 'increase') bagItems.set(name, currentQuantity + 1); if (action === 'decrease' && currentQuantity > 1) bagItems.set(name, currentQuantity - 1); if (action === 'remove' || (action === 'decrease' && currentQuantity === 1)) bagItems.delete(name); renderBag(); });
document.querySelector('#checkoutButton').addEventListener('click', () => { document.querySelector('#checkoutMessage').textContent = 'Pedido fictício recebido. Obrigado por escolher o Nexo!'; });
document.addEventListener('click', (event) => { const link = event.target.closest('[data-view]'); if (!link) return; const view = link.dataset.view; if (link.dataset.brand) document.querySelector('#brandFilter').value = link.dataset.brand; if (view === 'favorites' && currentRole !== 'client') { event.preventDefault(); bootstrap.Modal.getOrCreateInstance(document.querySelector('#loginModal')).show(); return; } event.preventDefault(); showView(view); });
document.querySelector('#themeToggle').addEventListener('click', () => { document.body.classList.toggle('dark-theme'); const dark = document.body.classList.contains('dark-theme'); document.querySelector('#themeToggle').innerHTML = `<i class="bi bi-${dark ? 'sun' : 'moon-stars'}"></i>`; document.querySelector('#themeToggle').setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro'); });
document.querySelector('#newsletterButton').addEventListener('click', () => { const email = document.querySelector('#newsletterEmail'); if (!email.value || !email.checkValidity()) { email.focus(); return; } email.value = ''; email.placeholder = 'Cadastro realizado'; });
renderProducts();