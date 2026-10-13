const API = 'https://mock.shop/api';
const CART_KEY = 'northfold-cart';
const CURRENCY_KEY = 'northfold-currency';
const FALLBACK_HANDLE = 'hoodie-old';
const CURRENCY_PICKS = ['CAD', 'USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'ZAR', 'INR', 'AUD'];

const statusEl = document.getElementById('status');
const productEl = document.getElementById('product');
const titleEl = document.getElementById('title');
const priceEl = document.getElementById('price');
const descEl = document.getElementById('description');
const mainImage = document.getElementById('main-image');
const thumbsEl = document.getElementById('thumbs');
const variantEl = document.getElementById('variant');
const qtyEl = document.getElementById('qty');
const formEl = document.getElementById('buy-form');
const countEl = document.getElementById('cart-count');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const overlayEl = document.getElementById('overlay');
const drawerEl = document.getElementById('drawer');
const linesEl = document.getElementById('cart-lines');
const emptyEl = document.getElementById('cart-empty');
const subtotalEl = document.getElementById('cart-subtotal');
const currencyEl = document.getElementById('currency');

const query = `
query Product($handle: String!) {
  product(handle: $handle) {
    title
    description
    images(first: 6) {
      nodes { url altText }
    }
    variants(first: 20) {
      nodes {
        id
        title
        price { amount currencyCode }
        image { url altText }
      }
    }
  }
}`;

let current = null;
let rates = { CAD: 1 };
let displayCurrency = 'CAD';

function handleFromPage() {
  const params = new URLSearchParams(window.location.search);
  return params.get('handle') || FALLBACK_HANDLE;
}

function money(amount) {
  let n = Number(amount);
  if (displayCurrency !== 'CAD' && rates[displayCurrency]) {
    n = n * rates[displayCurrency];
  }
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: displayCurrency
    }).format(n);
  } catch (e) {
    return n.toFixed(2) + ' ' + displayCurrency;
  }
}

async function localCurrency() {
  const saved = localStorage.getItem(CURRENCY_KEY);
  if (saved) {
    return saved;
  }

  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    if (data.currency && data.currency.code) {
      return data.currency.code;
    }
  } catch (e) {}

  try {
    const loc = new Intl.Locale(navigator.language).maximize();
    const map = {
      NG: 'NGN', US: 'USD', GB: 'GBP', CA: 'CAD',
      GH: 'GHS', KE: 'KES', ZA: 'ZAR', IN: 'INR',
      AU: 'AUD', NZ: 'NZD', JP: 'JPY', EU: 'EUR',
      FR: 'EUR', DE: 'EUR', IE: 'EUR'
    };
    if (loc.region && map[loc.region]) {
      return map[loc.region];
    }
  } catch (e) {}

  return 'CAD';
}

async function loadRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/CAD');
    const data = await res.json();
    if (data.rates) {
      rates = data.rates;
      rates.CAD = 1;
    }
  } catch (e) {}
}

function fillCurrencySelect(code) {
  const list = CURRENCY_PICKS.slice();
  if (list.indexOf(code) === -1) {
    list.unshift(code);
  }

  currencyEl.innerHTML = '';
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item !== 'CAD' && !rates[item]) {
      continue;
    }
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    currencyEl.append(opt);
  }

  if (code === 'CAD' || rates[code]) {
    displayCurrency = code;
  } else {
    displayCurrency = 'CAD';
  }
  currencyEl.value = displayCurrency;
}

function refreshPrices() {
  if (current && variantEl.value) {
    showVariant(variantEl.value);
  }
  paintCart();
}

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  paintCart();
}

function cartQty(items) {
  let total = 0;
  for (const line of items) {
    total += line.qty;
  }
  return total;
}

function paintCart() {
  const items = readCart();
  countEl.textContent = String(cartQty(items));
  linesEl.innerHTML = '';

  if (items.length === 0) {
    emptyEl.hidden = false;
    subtotalEl.textContent = '';
    return;
  }

  emptyEl.hidden = true;
  let sum = 0;

  for (const line of items) {
    sum += Number(line.amount) * line.qty;

    const li = document.createElement('li');
    li.className = 'line';

    const img = document.createElement('img');
    img.src = line.image || '';
    img.alt = '';

    const meta = document.createElement('div');
    const name = document.createElement('p');
    name.textContent = line.product + ' — ' + line.variant;
    const detail = document.createElement('p');
    detail.className = 'muted';
    detail.textContent = line.qty + ' × ' + money(line.amount);

    meta.append(name, detail);
    li.append(img, meta);
    linesEl.append(li);
  }

  subtotalEl.textContent = 'Subtotal ' + money(sum);
}

function setMainImage(url, alt) {
  mainImage.src = url;
  mainImage.alt = alt || current.title;
}

function markThumb(url) {
  const buttons = thumbsEl.querySelectorAll('button');
  for (const btn of buttons) {
    btn.setAttribute('aria-pressed', btn.dataset.url === url ? 'true' : 'false');
  }
}

function showVariant(id) {
  const variants = current.variants.nodes;
  let picked = variants[0];
  for (const v of variants) {
    if (v.id === id) {
      picked = v;
      break;
    }
  }

  priceEl.textContent = money(picked.price.amount);

  if (picked.image && picked.image.url) {
    const alt = picked.image.altText || current.title + ', ' + picked.title;
    setMainImage(picked.image.url, alt);
    markThumb(picked.image.url);
  }
}

function renderGallery(images) {
  thumbsEl.innerHTML = '';
  if (!images.length) {
    return;
  }

  setMainImage(images[0].url, images[0].altText || current.title);

  images.forEach(function (img, i) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.url = img.url;
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.setAttribute('aria-label', img.altText || 'Photo ' + (i + 1));

    const thumb = document.createElement('img');
    thumb.src = img.url;
    thumb.alt = '';

    btn.append(thumb);
    btn.addEventListener('click', function () {
      setMainImage(img.url, img.altText || current.title);
      markThumb(img.url);
    });

    thumbsEl.append(btn);
  });
}

function renderProduct(product) {
  current = product;
  document.title = product.title + ' — Northfold';
  titleEl.textContent = product.title;
  descEl.textContent = product.description || '';

  const variants = product.variants.nodes;
  variantEl.innerHTML = '';
  variants.forEach(function (v) {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = v.title;
    variantEl.append(opt);
  });

  renderGallery(product.images.nodes);
  if (variants[0]) {
    showVariant(variants[0].id);
  }
}

async function loadProduct() {
  statusEl.hidden = false;
  statusEl.textContent = 'Loading product…';
  productEl.hidden = true;

  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { handle: handleFromPage() }
      })
    });

    if (!response.ok) {
      throw new Error('request failed');
    }

    const json = await response.json();
    const product = json.data && json.data.product;
    if (!product) {
      throw new Error('no product');
    }

    renderProduct(product);
    statusEl.hidden = true;
    productEl.hidden = false;
  } catch (e) {
    statusEl.textContent = 'Could not load this product. Refresh the page, or try another handle in the URL.';
  }
}

function openCart() {
  drawerEl.hidden = false;
  overlayEl.hidden = false;
  closeCartBtn.focus();
}

function closeCart() {
  drawerEl.hidden = true;
  overlayEl.hidden = true;
  openCartBtn.focus();
}

variantEl.addEventListener('change', function () {
  showVariant(variantEl.value);
});

currencyEl.addEventListener('change', function () {
  displayCurrency = currencyEl.value;
  localStorage.setItem(CURRENCY_KEY, displayCurrency);
  refreshPrices();
});

formEl.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!current) {
    return;
  }

  const variants = current.variants.nodes;
  let picked = variants[0];
  for (const v of variants) {
    if (v.id === variantEl.value) {
      picked = v;
      break;
    }
  }

  const qty = Number(qtyEl.value) || 1;
  const items = readCart();
  const existing = items.find(function (line) {
    return line.id === picked.id;
  });

  if (existing) {
    existing.qty += qty;
  } else {
    items.push({
      id: picked.id,
      product: current.title,
      variant: picked.title,
      amount: picked.price.amount,
      currency: picked.price.currencyCode,
      image: (picked.image && picked.image.url) || mainImage.src,
      qty: qty
    });
  }

  writeCart(items);
  openCart();
});

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlayEl.addEventListener('click', closeCart);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !drawerEl.hidden) {
    closeCart();
  }
});

async function start() {
  paintCart();
  const fx = Promise.all([localCurrency(), loadRates()]);
  await loadProduct();
  const pair = await fx;
  fillCurrencySelect(pair[0]);
  refreshPrices();
}

start();
