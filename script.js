/**
 * RIYASAT — Luxury Drop & Streetwear Interactivity
 * Complete client-side implementation matching PRD requirements:
 * 1. Eight-piece product catalogue with fits, colors, sizes, and INR prices.
 * 2. Category filtering & price sorting (Low-High / High-Low).
 * 3. Dynamic Order Form: Auto-updates colour & size dropdowns based on chosen piece.
 * 4. Real-time subtotal and free shipping indicator (> Rs. 3,000).
 * 5. Strict inline field validation (10-digit phone, 6-digit pin, @ on Instagram handle).
 * 6. Interactive extras: Drop countdown timer, quick view modal, wishlist drawer, theme toggle, custom cursor.
 */

// Full Collection Database from PRD
const RIYASAT_COLLECTION = [
  {
    id: "heavy-tee",
    name: "Riyasat Heavy Tee",
    category: "T-shirt",
    fit: "Oversized",
    colours: ["Bone", "Black", "Maroon"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    price: 2499,
    soldOut: false,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    desc: "Heavyweight 240 GSM combed cotton. Drop-shoulder cut with subtle high-density tonal embroidery on the nape."
  },
  {
    id: "paranda-hoodie",
    name: "Paranda Hoodie",
    category: "Hoodie",
    fit: "Oversized",
    colours: ["Black", "Ash", "Royal Blue"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    price: 5499,
    soldOut: false,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    desc: "450 GSM brushed fleece with double-layered structured hood and custom braided paranda tassel pull-strings."
  },
  {
    id: "phulkari-overshirt",
    name: "Phulkari Panel Overshirt",
    category: "Overshirt",
    fit: "Regular",
    colours: ["Ecru", "Olive", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    price: 5999,
    soldOut: false,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    desc: "Heavy woven cotton duck fabric featuring artisanal geometric Phulkari panels stitched by local Patiala craftswomen."
  },
  {
    id: "nawab-jacket",
    name: "Nawab Jacket Bomber",
    category: "Jacket",
    fit: "Boxy",
    colours: ["Black", "Maroon"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    price: 8999,
    soldOut: true, // "Sold Out" badge extra as requested in PRD
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    desc: "Structured boxy bomber cut in washed heavyweight denim with antique brass zip hardware and royal silk lining."
  },
  {
    id: "zari-track-jacket",
    name: "Zari Track Jacket",
    category: "Jacket",
    fit: "Regular",
    colours: ["Black with gold", "Ivory with maroon"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    price: 6999,
    soldOut: false,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    desc: "Recycled technical nylon with authentic metallic gold zari braiding along the raglan sleeves. Lightweight yet windproof."
  },
  {
    id: "baggy-cargo",
    name: "Baggy Cargo Pants",
    category: "Trousers",
    fit: "Baggy",
    colours: ["Khaki", "Black", "Stone"],
    sizes: ["28", "30", "32", "34", "36"],
    price: 4999,
    soldOut: false,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    desc: "Heavyweight ripstop twill with 6 articulated pockets, deep knee pleats, and ankle toggle cinch strings."
  },
  {
    id: "patiala-pleat-pants",
    name: "Patiala Pleat Pants",
    category: "Trousers",
    fit: "Relaxed",
    colours: ["Black", "Sand", "Charcoal"],
    sizes: ["28", "30", "32", "34", "36"],
    price: 5299,
    soldOut: false,
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80",
    desc: "Fluid suiting fabric tailored with deep front pleats paying homage to royal Patiala drapes in a modern silhouette."
  },
  {
    id: "royal-crest-cap",
    name: "Royal Crest Cap",
    category: "Accessory",
    fit: "One size",
    colours: ["Black", "Bone", "Maroon"],
    sizes: ["One size"],
    price: 1799,
    soldOut: false,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    desc: "Unstructured 6-panel dad cap in heavy washed cotton with raised 3D bullion crown embroidery and antique strap closure."
  }
];

// Wishlist state persisted in localStorage
let wishlist = JSON.parse(localStorage.getItem("riyasat-wishlist") || "[]");

document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  initTheme();
  initCountdown();
  initShop();
  initOrderForm();
  initWishlist();
  initMobileNav();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* -------------------------------------------------------------
   1. Interactive Custom Cursor
------------------------------------------------------------- */
function initCursor() {
  const cursor = document.getElementById("customCursor");
  const follower = document.getElementById("cursorFollower");
  if (!cursor || !follower || window.matchMedia("(pointer: coarse)").matches) return;

  document.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  document.querySelectorAll("a, button, select, input, .product-card").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      follower.style.width = "54px";
      follower.style.height = "54px";
      follower.style.borderColor = "var(--accent-gold)";
    });
    el.addEventListener("mouseleave", () => {
      follower.style.width = "32px";
      follower.style.height = "32px";
      follower.style.borderColor = "rgba(212, 175, 55, 0.5)";
    });
  });
}

/* -------------------------------------------------------------
   2. Theme Toggle (Dark & Light)
------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("riyasat-theme") || "dark";
  document.body.setAttribute("data-theme", saved);

  toggleBtn?.addEventListener("click", () => {
    const cur = document.body.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("riyasat-theme", next);
  });
}

/* -------------------------------------------------------------
   3. Drop Countdown Timer
------------------------------------------------------------- */
function initCountdown() {
  let seconds = (48 * 3600) + (19 * 60) + 42;
  const hoursEl = document.getElementById("cdHours");
  const minsEl = document.getElementById("cdMins");
  const secsEl = document.getElementById("cdSecs");

  setInterval(() => {
    if (seconds > 0) seconds--;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
    if (minsEl) minsEl.textContent = String(m).padStart(2, "0");
    if (secsEl) secsEl.textContent = String(s).padStart(2, "0");
  }, 1000);
}

/* -------------------------------------------------------------
   4. Shop / Products Filtering & Rendering
------------------------------------------------------------- */
function initShop() {
  const grid = document.getElementById("productsGrid");
  const tabs = document.querySelectorAll(".cat-pill");
  const sortSelect = document.getElementById("priceSort");

  let activeCat = "all";
  let activeSort = "default";

  function render() {
    if (!grid) return;

    let items = RIYASAT_COLLECTION.filter(item => {
      return activeCat === "all" || item.category === activeCat;
    });

    if (activeSort === "price-asc") {
      items.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price-desc") {
      items.sort((a, b) => b.price - a.price);
    }

    grid.innerHTML = items.map(p => {
      const isFav = wishlist.includes(p.id);
      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-media">
            ${p.soldOut ? '<span class="product-badge-soldout">Sold Out Batch</span>' : ''}
            <img src="${p.image}" alt="${escapeHtml(p.name)}" class="product-img" loading="lazy">
            <div class="product-actions-overlay">
              <button type="button" class="action-quickview" onclick="openQuickView('${p.id}')">Quick View</button>
              <button type="button" class="action-wishlist ${isFav ? 'active' : ''}" onclick="toggleWishlist('${p.id}')" aria-label="Wishlist">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="${isFav ? 'currentColor' : 'none'}" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="product-body">
            <div>
              <div class="product-meta-row">
                <span class="product-cat">${escapeHtml(p.category)}</span>
                <span class="product-fit-badge">${escapeHtml(p.fit)} Fit</span>
              </div>
              <h3 class="product-title">${escapeHtml(p.name)}</h3>
              <p class="product-colours">Colours: ${p.colours.join(", ")}</p>
              <p class="product-sizes-pill">Sizes: ${p.sizes[0]} &ndash; ${p.sizes[p.sizes.length - 1]}</p>
            </div>
            <div class="product-footer">
              <span class="product-price">&#8377;${p.price.toLocaleString("en-IN")}</span>
              <button type="button" class="product-select-btn" onclick="selectPieceForOrder('${p.id}')">
                Select Piece &darr;
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeCat = tab.getAttribute("data-category") || "all";
      render();
    });
  });

  sortSelect?.addEventListener("change", (e) => {
    activeSort = e.target.value;
    render();
  });

  render();
}

/* -------------------------------------------------------------
   5. Dynamic Order Form & Strict Validation
------------------------------------------------------------- */
function initOrderForm() {
  const pieceSelect = document.getElementById("pieceSelect");
  const colourSelect = document.getElementById("colourSelect");
  const sizeSelect = document.getElementById("sizeSelect");
  const qtyInput = document.getElementById("quantity");
  const form = document.getElementById("orderForm");
  const confirmCard = document.getElementById("orderConfirmation");
  const newOrderBtn = document.getElementById("newOrderBtn");

  const displayUnitPrice = document.getElementById("displayUnitPrice");
  const displayShipping = document.getElementById("displayShipping");
  const displayTotal = document.getElementById("displayTotal");

  // Populate pieces in order form dropdown
  if (pieceSelect) {
    pieceSelect.innerHTML = RIYASAT_COLLECTION.map(p => `
      <option value="${p.id}" ${p.soldOut ? 'disabled' : ''}>
        ${p.name} (${p.fit} Fit) &mdash; &#8377;${p.price.toLocaleString("en-IN")} ${p.soldOut ? '[SOLD OUT]' : ''}
      </option>
    `).join("");
  }

  // Synchronize colour and size options based on chosen piece
  function updatePieceOptions() {
    const selectedId = pieceSelect.value;
    const item = RIYASAT_COLLECTION.find(p => p.id === selectedId) || RIYASAT_COLLECTION[0];

    // Colours
    colourSelect.innerHTML = item.colours.map(c => `
      <option value="${c}">${c}</option>
    `).join("");

    // Sizes
    sizeSelect.innerHTML = item.sizes.map(s => `
      <option value="${s}">${s}</option>
    `).join("");

    updatePriceCalculations();
  }

  function updatePriceCalculations() {
    const selectedId = pieceSelect.value;
    const item = RIYASAT_COLLECTION.find(p => p.id === selectedId) || RIYASAT_COLLECTION[0];
    const qty = parseInt(qtyInput.value, 10) || 1;

    const unitPrice = item.price;
    const subtotal = unitPrice * qty;

    // Free shipping above 3,000 INR rule
    const isFreeShipping = subtotal >= 3000;
    const shippingFee = isFreeShipping ? 0 : 250;
    const grandTotal = subtotal + shippingFee;

    displayUnitPrice.textContent = `₹${unitPrice.toLocaleString("en-IN")}`;
    if (isFreeShipping) {
      displayShipping.textContent = "FREE (Orders > ₹3,000)";
      displayShipping.className = "shipping-free";
    } else {
      displayShipping.textContent = "+₹250 (Free over ₹3,000)";
      displayShipping.className = "shipping-paid";
    }
    displayTotal.textContent = `₹${grandTotal.toLocaleString("en-IN")}`;
  }

  pieceSelect?.addEventListener("change", updatePieceOptions);
  qtyInput?.addEventListener("input", updatePriceCalculations);

  updatePieceOptions(); // Initialize on load

  // Validation
  function clearErrors() {
    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
    document.querySelectorAll(".form-group, .check-container").forEach(el => el.classList.remove("has-error"));
  }

  function setError(fieldId, msg) {
    const errEl = document.getElementById(`err-${fieldId}`);
    const grpEl = document.getElementById(`grp-${fieldId}`);
    if (errEl) errEl.textContent = msg;
    if (grpEl) grpEl.classList.add("has-error");
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // 1. Full name
    const fullname = document.getElementById("fullname").value.trim();
    if (!fullname) {
      setError("fullname", "Please enter your full name.");
      isValid = false;
    }

    // 2. Phone number (strictly 10 digits)
    const phone = document.getElementById("phone").value.trim().replace(/\D/g, "");
    if (phone.length !== 10) {
      setError("phone", "Must be a valid 10-digit phone number.");
      isValid = false;
    }

    // 3. Email
    const email = document.getElementById("email").value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Please enter a valid email address.");
      isValid = false;
    }

    // 4. Instagram handle (optional, but must start with @ if given)
    const insta = document.getElementById("instagram").value.trim();
    if (insta && !insta.startsWith("@")) {
      setError("instagram", "Instagram handle must start with @ (e.g. @yourhandle).");
      isValid = false;
    }

    // 5. Quantity (1 to 5)
    const qty = parseInt(qtyInput.value, 10);
    if (isNaN(qty) || qty < 1 || qty > 5) {
      setError("quantity", "Quantity must be between 1 and 5.");
      isValid = false;
    }

    // 6. Address
    const address = document.getElementById("address").value.trim();
    if (!address) {
      setError("address", "Delivery address is required.");
      isValid = false;
    }

    // 7. City
    const city = document.getElementById("city").value.trim();
    if (!city) {
      setError("city", "Please enter your city.");
      isValid = false;
    }

    // 8. Pincode (strictly 6 digits)
    const pincode = document.getElementById("pincode").value.trim().replace(/\D/g, "");
    if (pincode.length !== 6) {
      setError("pincode", "Pincode must be exactly 6 digits.");
      isValid = false;
    }

    // 9. Payment preference
    const payment = document.querySelector('input[name="payment"]:checked')?.value;
    if (!payment) {
      setError("payment", "Please choose a payment method.");
      isValid = false;
    }

    // 10. Consent
    const consent = document.getElementById("consent").checked;
    if (!consent) {
      setError("consent", "Consent to receive order updates via WhatsApp/call is required.");
      isValid = false;
    }

    if (!isValid) return;

    // Successful Submission: Show Order Summary Card
    const selectedPieceId = pieceSelect.value;
    const pieceObj = RIYASAT_COLLECTION.find(p => p.id === selectedPieceId);

    document.getElementById("confPiece").textContent = pieceObj ? pieceObj.name : "Custom Piece";
    document.getElementById("confColour").textContent = `${colourSelect.value} (${pieceObj?.fit} Fit)`;
    document.getElementById("confSize").textContent = sizeSelect.value;
    document.getElementById("confQty").textContent = `${qty} piece${qty > 1 ? 's' : ''}`;
    document.getElementById("confCity").textContent = `${city} (${pincode})`;
    document.getElementById("confPayment").textContent = payment;
    document.getElementById("confTotal").textContent = displayTotal.textContent;

    form.style.display = "none";
    confirmCard.style.display = "block";
    confirmCard.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  newOrderBtn?.addEventListener("click", () => {
    form.reset();
    clearErrors();
    updatePieceOptions();
    form.style.display = "flex";
    confirmCard.style.display = "none";
  });
}

// Window-scoped helper to jump directly from shop card into order form
window.selectPieceForOrder = function(pieceId) {
  const pieceSelect = document.getElementById("pieceSelect");
  if (pieceSelect) {
    pieceSelect.value = pieceId;
    pieceSelect.dispatchEvent(new Event("change"));
  }
  const orderSection = document.getElementById("order");
  orderSection?.scrollIntoView({ behavior: "smooth" });
};

/* -------------------------------------------------------------
   6. Quick View Modal & Color Switcher
------------------------------------------------------------- */
window.openQuickView = function(pieceId) {
  const item = RIYASAT_COLLECTION.find(p => p.id === pieceId);
  if (!item) return;

  const modal = document.getElementById("quickViewModal");
  const img = document.getElementById("modalImg");
  const cat = document.getElementById("modalCategory");
  const title = document.getElementById("modalName");
  const price = document.getElementById("modalPrice");
  const desc = document.getElementById("modalDesc");
  const fit = document.getElementById("modalFit");
  const sizes = document.getElementById("modalSizes");
  const swatches = document.getElementById("modalSwatches");

  img.src = item.image;
  cat.textContent = `${item.category.toUpperCase()} • ${item.fit.toUpperCase()} FIT`;
  title.textContent = item.name;
  price.innerHTML = `&#8377;${item.price.toLocaleString("en-IN")}`;
  desc.textContent = item.desc;
  fit.textContent = `${item.fit} Fit`;
  sizes.textContent = item.sizes.join(", ");

  // Interactive Colour Switcher within Modal
  swatches.innerHTML = item.colours.map(col => `
    <button type="button" class="color-swatch-btn" onclick="switchModalColor('${col}', '${item.id}')">${col}</button>
  `).join("");

  document.getElementById("modalOrderNowBtn").onclick = () => {
    modal.classList.remove("active");
    selectPieceForOrder(item.id);
  };

  modal.classList.add("active");
};

window.switchModalColor = function(colorName, pieceId) {
  // Visual feedback: brief opacity pulse to reflect color change
  const img = document.getElementById("modalImg");
  if (img) {
    img.style.opacity = "0.5";
    setTimeout(() => { img.style.opacity = "1"; }, 150);
  }
};

document.getElementById("modalCloseBtn")?.addEventListener("click", () => {
  document.getElementById("quickViewModal")?.classList.remove("active");
});

document.getElementById("quickViewModal")?.addEventListener("click", (e) => {
  if (e.target.id === "quickViewModal") {
    e.target.classList.remove("active");
  }
});

/* -------------------------------------------------------------
   7. Wishlist Drawer Interaction
------------------------------------------------------------- */
function initWishlist() {
  const trigger = document.getElementById("wishlistTrigger");
  const drawer = document.getElementById("wishlistDrawer");
  const closeBtn = document.getElementById("drawerCloseBtn");

  trigger?.addEventListener("click", () => {
    updateWishlistDrawer();
    drawer.classList.add("open");
  });

  closeBtn?.addEventListener("click", () => {
    drawer.classList.remove("open");
  });

  updateWishlistBadges();
}

window.toggleWishlist = function(pieceId) {
  if (wishlist.includes(pieceId)) {
    wishlist = wishlist.filter(id => id !== pieceId);
  } else {
    wishlist.push(pieceId);
  }
  localStorage.setItem("riyasat-wishlist", JSON.stringify(wishlist));
  updateWishlistBadges();
  updateWishlistDrawer();
  
  // Re-render buttons in grid
  document.querySelectorAll(`.product-card[data-id="${pieceId}"] .action-wishlist`).forEach(btn => {
    btn.classList.toggle("active", wishlist.includes(pieceId));
  });
};

function updateWishlistBadges() {
  const count = wishlist.length;
  document.getElementById("wishlistCount").textContent = count;
  document.getElementById("drawerCount").textContent = count;
}

function updateWishlistDrawer() {
  const drawerBody = document.getElementById("drawerBody");
  if (!drawerBody) return;

  if (wishlist.length === 0) {
    drawerBody.innerHTML = '<p class="empty-msg" style="color: var(--text-muted); text-align: center; margin-top: 3rem;">No pieces saved to your wishlist yet.</p>';
    return;
  }

  drawerBody.innerHTML = wishlist.map(id => {
    const item = RIYASAT_COLLECTION.find(p => p.id === id);
    if (!item) return "";
    return `
      <div class="drawer-item">
        <img src="${item.image}" alt="${escapeHtml(item.name)}">
        <div style="flex: 1;">
          <h4 style="font-size: 0.95rem; margin-bottom: 2px;">${escapeHtml(item.name)}</h4>
          <span style="font-size: 0.78rem; color: var(--accent-gold);">&#8377;${item.price.toLocaleString("en-IN")}</span>
          <div style="margin-top: 6px;">
            <button type="button" class="btn btn-outline btn-sm" onclick="selectPieceForOrder('${item.id}'); document.getElementById('wishlistDrawer').classList.remove('open');">Order &rarr;</button>
          </div>
        </div>
        <button type="button" onclick="toggleWishlist('${item.id}')" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.2rem;">&times;</button>
      </div>
    `;
  }).join("");
}

/* -------------------------------------------------------------
   8. Mobile Navigation Toggle
------------------------------------------------------------- */
function initMobileNav() {
  const btn = document.getElementById("mobileMenuBtn");
  const nav = document.getElementById("navLinks");

  btn?.addEventListener("click", () => {
    nav?.classList.toggle("open");
  });

  document.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", () => nav?.classList.remove("open"));
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
