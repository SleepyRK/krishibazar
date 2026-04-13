// ============================================================
//  Banglar Krishi Bazar — script.js
//  Shared across index.html and farmers.html
//  Pure JavaScript: no frameworks, no backend, no payments
// ============================================================
//
//  ★ EASY EDITS — Ctrl+F the label to jump straight there:
//
//  ► Add / edit products        → search: "PRODUCT DATA"
//  ► Change button labels       → search: "BUTTON LABELS"
//  ► Freshness logic            → search: "FRESHNESS LABEL"
//  ► Cart behaviour             → search: "CART —"
//  ► Farmer modal content       → search: "FARMER MODAL"
// ============================================================

// ============================================================
// PRODUCT DATA — edit this array to add/change products
// ============================================================
const products = [
  {
    id: 1,
    name: "Red Tomatoes",
    icon: "🍅",
    price: 40,
    marketPrice: 60,
    freshness: "Harvested 6 hours ago",
    season: true,
    sponsored: true,
    farmer: {
      name: "Rahim Uddin",
      phone: "01711-234567",
      village: "Char Rashidpur",
      district: "Dhaka",
      description: "I grow organic tomatoes without pesticides on my 2-acre family farm.",
      experience: "12 years"
    }
  },
  {
    id: 2,
    name: "Sweet Potatoes",
    icon: "🍠",
    price: 30,
    marketPrice: 50,
    freshness: "Harvested 2 days ago",
    season: true,
    sponsored: false,
    farmer: {
      name: "Karim Sheikh",
      phone: "01812-345678",
      village: "Gopalganj Sadar",
      district: "Gopalganj",
      description: "Sweet potatoes grown in alluvial soil with natural fertilizers.",
      experience: "8 years"
    }
  },
  {
    id: 3,
    name: "Fresh Spinach",
    icon: "🥬",
    price: 20,
    marketPrice: 35,
    freshness: "Harvested this morning",
    season: true,
    sponsored: false,
    farmer: {
      name: "Nasrin Begum",
      phone: "01911-456789",
      village: "Shibpur",
      district: "Narsingdi",
      description: "Fresh leafy vegetables from my kitchen garden, grown with love.",
      experience: "5 years"
    }
  },
  {
    id: 4,
    name: "Hilsa Fish (Ilish)",
    icon: "🐟",
    price: 800,
    marketPrice: 1200,
    freshness: "Caught last night",
    season: false,
    sponsored: true,
    farmer: {
      name: "Abdul Matin",
      phone: "01611-567890",
      village: "Chandpur Sadar",
      district: "Chandpur",
      description: "Fresh Hilsa straight from the Meghna river. Caught last night.",
      experience: "20 years"
    }
  },
  {
    id: 5,
    name: "Bottle Gourd (Lau)",
    icon: "🥒",
    price: 25,
    marketPrice: 40,
    freshness: "Harvested yesterday",
    season: false,
    sponsored: false,
    farmer: {
      name: "Jahanara Khatun",
      phone: "01711-678901",
      village: "Sylhet Sadar",
      district: "Sylhet",
      description: "Large, fresh bottle gourds from my home garden.",
      experience: "7 years"
    }
  },
  {
    id: 6,
    name: "Deshi Eggs (12 pcs)",
    icon: "🥚",
    price: 120,
    marketPrice: 150,
    freshness: "Collected this morning",
    season: false,
    sponsored: true,
    farmer: {
      name: "Hafizur Rahman",
      phone: "01815-789012",
      village: "Bogura Sadar",
      district: "Bogura",
      description: "Free-range deshi hens, no artificial feed, natural eggs.",
      experience: "15 years"
    }
  },
  {
    id: 7,
    name: "Green Chilli",
    icon: "🌶️",
    price: 60,
    marketPrice: 90,
    freshness: "Harvested 12 hours ago",
    season: true,
    sponsored: false,
    farmer: {
      name: "Sumon Ali",
      phone: "01912-890123",
      village: "Barisal Sadar",
      district: "Barisal",
      description: "Hot green chillies grown without chemicals.",
      experience: "6 years"
    }
  },
  {
    id: 8,
    name: "Aromatic Rice (Chinigura)",
    icon: "🌾",
    price: 90,
    marketPrice: 120,
    freshness: "Harvested last season",
    season: false,
    sponsored: false,
    farmer: {
      name: "Delwar Hossain",
      phone: "01715-901234",
      village: "Dinajpur Sadar",
      district: "Dinajpur",
      description: "Famous Chinigura aromatic rice from Dinajpur — perfect for special occasions.",
      experience: "25 years"
    }
  }
];

// ============================================================
// FRESHNESS LABEL — returns color class and label text
// Green  = very fresh (same day / few hours)
// Yellow = moderate (1-2 days old)
// Red    = older stock
// ============================================================
function getFreshnessInfo(freshness) {
  const f = freshness.toLowerCase();
  if (
    f.includes("this morning") ||
    f.includes("hours ago") ||
    f.includes("collected") ||
    f.includes("tonight")
  ) {
    return { cls: "fresh-green", label: "Very Fresh" };
  } else if (
    f.includes("yesterday") ||
    f.includes("last night") ||
    f.includes("2 days") ||
    f.includes("caught")
  ) {
    return { cls: "fresh-yellow", label: "Fresh" };
  } else {
    return { cls: "fresh-red", label: "Older Stock" };
  }
}

// ============================================================
// CART — stored in localStorage (shared across pages)
// ============================================================
const CART_KEY = "bkb-cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = loadCart();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  showToast(`"${product.name}" added to cart!`);
}

function removeFromCart(productId) {
  let cart = loadCart().filter(item => item.id !== productId);
  saveCart(cart);
  updateCartCount();
  if (document.getElementById("cart-items")) renderCartModal();
}

function changeQty(productId, delta) {
  const cart = loadCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) { removeFromCart(productId); return; }
  saveCart(cart);
  updateCartCount();
  if (document.getElementById("cart-items")) renderCartModal();
}

function clearCart() {
  saveCart([]);
  updateCartCount();
  if (document.getElementById("cart-items")) renderCartModal();
  showToast("Cart cleared.");
}

function updateCartCount() {
  const total = loadCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => { el.textContent = total; });
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

// ============================================================
// SAVINGS PERCENTAGE HELPER
// ============================================================
function savings(p) {
  return Math.round(((p.marketPrice - p.price) / p.marketPrice) * 100);
}

// ============================================================
// BUTTON LABELS — change card button text here
// ============================================================
const LABEL_ADD_TO_CART    = "+ Add to Cart";
const LABEL_CONTACT_FARMER = "Contact Farmer";

// ============================================================
// PRODUCT CARD HTML BUILDER (reusable)
// ============================================================
function buildProductCard(p, showSponsoredBadge = false) {
  const fi = getFreshnessInfo(p.freshness);
  return `
    <div class="product-card ${p.sponsored ? 'is-sponsored' : ''}" data-testid="card-product-${p.id}">
      <div class="card-top">
        <div class="card-icon">${p.icon}</div>
        <span class="savings-badge">Save ${savings(p)}%</span>
        ${p.sponsored ? '<span class="sponsored-tag"><span class="sponsored-star">&#11088;</span> Sponsored</span>' : ''}
      </div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-price-row">
          <span class="card-price">৳${p.price}</span>
          <span class="card-market-price">৳${p.marketPrice}</span>
        </div>
        <span class="freshness-label ${fi.cls}">&#9679; ${fi.label} — ${p.freshness}</span>
        <div class="card-farmer">
          <a href="farmers.html#farmer-${p.id}" class="farmer-name-link" data-testid="link-farmer-${p.id}">
            <strong>${p.farmer.name}</strong>
          </a>
          <span> · ${p.farmer.village}, ${p.farmer.district}</span>
        </div>
      </div>
      <div class="card-actions">
        <button
          class="btn btn-primary btn-sm"
          onclick="addToCart(${p.id})"
          data-testid="button-add-cart-${p.id}"
        >${LABEL_ADD_TO_CART}</button>
        <button
          class="btn btn-outline btn-sm"
          onclick="openFarmerModal(${p.id})"
          data-testid="button-contact-farmer-${p.id}"
        >${LABEL_CONTACT_FARMER}</button>
      </div>
    </div>
  `;
}


// ============================================================
// RENDER SEASONAL SECTION (clickable — opens farmer modal)
// ============================================================
function renderSeasonal() {
  const grid = document.getElementById("seasonal-grid");
  if (!grid) return;
  const seasonal = products.filter(p => p.season);
  const fi_map = {};
  seasonal.forEach(p => { fi_map[p.id] = getFreshnessInfo(p.freshness); });

  grid.innerHTML = seasonal.map(p => `
    <div
      class="seasonal-card"
      onclick="openFarmerModal(${p.id})"
      title="Click to see farmer details"
      style="cursor:pointer"
      data-testid="seasonal-card-${p.id}"
    >
      <div class="seasonal-badge">In Season</div>
      <div style="font-size:2.5rem">${p.icon}</div>
      <div class="s-name">${p.name}</div>
      <div class="s-price">৳${p.price} <span style="font-size:0.8rem;color:#b0b0b0;font-weight:400;text-decoration:line-through">৳${p.marketPrice}</span></div>
      <span class="freshness-label ${fi_map[p.id].cls}" style="font-size:0.75rem;margin:6px 0">&#9679; ${fi_map[p.id].label}</span>
      <div class="s-farmer">
        <a href="farmers.html#farmer-${p.id}" class="farmer-name-link" onclick="event.stopPropagation()" data-testid="seasonal-farmer-link-${p.id}">${p.farmer.name}</a>
        · ${p.farmer.district}
      </div>
      <div class="seasonal-hint">Click to contact farmer</div>
    </div>
  `).join("");
}

// ============================================================
// RENDER FILTER PILLS
// ============================================================
function renderFilterPills() {
  const pillsContainer = document.getElementById("filter-pills");
  if (!pillsContainer) return;
  const districts = ["all", ...new Set(products.map(p => p.farmer.district))];

  pillsContainer.innerHTML = districts.map(d => `
    <button
      class="pill ${d === "all" ? "active" : ""}"
      data-district="${d}"
      data-testid="pill-${d.toLowerCase().replace(/\s/g, "-")}"
    >${d === "all" ? "All Districts" : d}</button>
  `).join("");

  pillsContainer.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      pillsContainer.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderProducts(pill.dataset.district);
    });
  });
}

// ============================================================
// RENDER PRODUCT CARDS (main grid)
// Sponsored products always float to the top, like Amazon/Daraz
// ============================================================
function renderProducts(districtFilter = "all") {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const filtered = districtFilter === "all"
    ? [...products]
    : products.filter(p => p.farmer.district === districtFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:#b0b0b0;text-align:center;grid-column:1/-1;padding:40px">No products found for this district.</p>`;
    return;
  }

  // Sponsored products bubble to the top
  const sorted = [
    ...filtered.filter(p => p.sponsored),
    ...filtered.filter(p => !p.sponsored)
  ];

  grid.innerHTML = sorted.map(p => buildProductCard(p)).join("");
}

// ============================================================
// CART MODAL
// ============================================================
function openCartModal() {
  renderCartModal();
  document.getElementById("cart-overlay").classList.add("open");
}

function closeCartModal() {
  document.getElementById("cart-overlay").classList.remove("open");
}

function renderCartModal() {
  const cart = loadCart();
  const itemsEl = document.getElementById("cart-items");
  const footerEl = document.getElementById("cart-footer");
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="empty-cart">Your cart is empty.<br>Browse products and add items!</div>`;
    footerEl.innerHTML = "";
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-testid="cart-item-${item.id}">
      <span style="font-size:1.5rem">${item.icon}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">৳${item.price} × ${item.quantity} = ৳${item.price * item.quantity}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)" data-testid="button-qty-minus-${item.id}">−</button>
        <span class="qty-num">${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)" data-testid="button-qty-plus-${item.id}">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})" data-testid="button-remove-${item.id}" title="Remove">✕</button>
    </div>
  `).join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  footerEl.innerHTML = `
    <div class="cart-subtotal">
      <span>Subtotal</span>
      <span>৳${subtotal}</span>
    </div>
    <div class="cart-actions">
      <button class="btn btn-accent" onclick="openMultiFarmerModal()" data-testid="button-contact-all-farmers">
        Contact Farmers for These Items
      </button>
      <button class="btn btn-danger" onclick="clearCart()" data-testid="button-clear-cart">
        Clear Cart
      </button>
    </div>
  `;
}

// ============================================================
// FARMER MODAL (single product)
// ============================================================
function openFarmerModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const f = product.farmer;
  const initials = f.name.split(" ").map(w => w[0]).join("").toUpperCase();

  document.getElementById("farmer-details").innerHTML = `
    <div class="farmer-card">
      <div class="farmer-avatar">${initials}</div>
      <div class="farmer-name">${f.name}</div>
      <div class="farmer-info-row"><span>📍</span><div><strong>${f.village}</strong>, ${f.district}</div></div>
      <div class="farmer-info-row"><span>📞</span><div class="farmer-phone">${f.phone}</div></div>
      <div class="farmer-info-row"><span>🌿</span><div>${f.description}</div></div>
      <div class="farmer-info-row"><span>⏳</span><div>Farming experience: <strong>${f.experience}</strong></div></div>
      <hr class="farmer-separator" />
      <p style="font-size:0.85rem;color:#a5c8a0;text-align:center">
        Call or message the farmer to purchase directly.<br>
        <a href="farmers.html#farmer-${product.id}" style="color:var(--primary-color);font-weight:600">View full profile &rarr;</a>
      </p>
    </div>
  `;
  document.getElementById("farmer-overlay").classList.add("open");
}

function closeFarmerModal() {
  document.getElementById("farmer-overlay").classList.remove("open");
}

// ============================================================
// MULTI-FARMER MODAL (from cart)
// ============================================================
function openMultiFarmerModal() {
  const cart = loadCart();
  if (cart.length === 0) { showToast("Your cart is empty!"); return; }

  const details = document.getElementById("multi-farmer-details");
  details.innerHTML = cart.map(item => {
    const f = item.farmer;
    const initials = f.name.split(" ").map(w => w[0]).join("").toUpperCase();
    return `
      <div class="farmer-card" style="border-bottom:1px solid #1e4020">
        <div class="farmer-avatar" style="width:50px;height:50px;font-size:1.3rem">${initials}</div>
        <div class="farmer-name" style="font-size:1.1rem">${f.name}</div>
        <p style="text-align:center;font-size:0.88rem;color:#a5c8a0;margin-bottom:10px">for: <strong>${item.name}</strong></p>
        <div class="farmer-info-row"><span>📍</span><div>${f.village}, ${f.district}</div></div>
        <div class="farmer-info-row"><span>📞</span><div class="farmer-phone">${f.phone}</div></div>
      </div>
    `;
  }).join("");

  document.getElementById("multi-farmer-overlay").classList.add("open");
}

function closeMultiFarmerModal() {
  document.getElementById("multi-farmer-overlay").classList.remove("open");
}

// ============================================================
// JOIN AS FARMER FORM (only on index.html)
// ============================================================
const farmerForm = document.getElementById("farmer-form");
if (farmerForm) {
  farmerForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const district = document.getElementById("district").value.trim();
    const productName = document.getElementById("productName").value.trim();
    const price = document.getElementById("price").value.trim();
    if (!fullName || !phone || !district || !productName || !price) {
      showToast("Please fill in all required fields.");
      return;
    }
    showToast("Your request has been submitted. We will contact you soon.");
    this.reset();
  });
}

// ============================================================
// HAMBURGER MENU (MOBILE)
// ============================================================
const hamburger = document.getElementById("hamburger");
if (hamburger) {
  hamburger.addEventListener("click", function() {
    document.getElementById("nav-links").classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    const navLinks = document.getElementById("nav-links");
    if (navLinks) navLinks.classList.remove("open");
  });
});

// ============================================================
// MODAL CONTROLS (only on index.html)
// ============================================================
const cartNavBtn = document.getElementById("cart-nav-btn");
if (cartNavBtn) {
  cartNavBtn.addEventListener("click", (e) => { e.preventDefault(); openCartModal(); });
}

const closeCart = document.getElementById("close-cart");
if (closeCart) closeCart.addEventListener("click", closeCartModal);

const closeFarmer = document.getElementById("close-farmer");
if (closeFarmer) closeFarmer.addEventListener("click", closeFarmerModal);

const closeMultiFarmer = document.getElementById("close-multi-farmer");
if (closeMultiFarmer) closeMultiFarmer.addEventListener("click", closeMultiFarmerModal);

const cartOverlay = document.getElementById("cart-overlay");
if (cartOverlay) cartOverlay.addEventListener("click", function(e) { if (e.target === this) closeCartModal(); });

const farmerOverlay = document.getElementById("farmer-overlay");
if (farmerOverlay) farmerOverlay.addEventListener("click", function(e) { if (e.target === this) closeFarmerModal(); });

const multiFarmerOverlay = document.getElementById("multi-farmer-overlay");
if (multiFarmerOverlay) multiFarmerOverlay.addEventListener("click", function(e) { if (e.target === this) closeMultiFarmerModal(); });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCartModal();
    closeFarmerModal();
    closeMultiFarmerModal();
  }
});

// ============================================================
// INITIALIZE ON PAGE LOAD
// ============================================================
renderSeasonal();
renderFilterPills();
renderProducts();
updateCartCount();
