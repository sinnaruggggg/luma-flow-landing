const products = [
  { id: "p01", name: "캔버스 데일리 토트백", category: "패션", price: 42000, stock: 18, row: 0, col: 0, tags: ["가방", "토트"] },
  { id: "p02", name: "세이지 린넨 셔츠", category: "패션", price: 59000, stock: 12, row: 0, col: 1, tags: ["셔츠", "린넨"] },
  { id: "p03", name: "라이트 데님 재킷", category: "패션", price: 89000, stock: 9, row: 0, col: 2, tags: ["재킷", "데님"] },
  { id: "p04", name: "오프화이트 코트 스니커즈", category: "패션", price: 76000, stock: 15, row: 0, col: 3, tags: ["신발", "스니커즈"] },
  { id: "p05", name: "스톤웨어 세라믹 머그", category: "키친", price: 18000, stock: 26, row: 0, col: 4, tags: ["컵", "머그"] },
  { id: "p06", name: "무광 세이지 데스크 램프", category: "오피스", price: 68000, stock: 8, row: 1, col: 0, tags: ["조명", "램프"] },
  { id: "p07", name: "클린핏 무선 이어버드", category: "오피스", price: 99000, stock: 10, row: 1, col: 1, tags: ["이어폰", "디지털"] },
  { id: "p08", name: "무드 노트 3종 세트", category: "오피스", price: 22000, stock: 31, row: 1, col: 2, tags: ["노트", "문구"] },
  { id: "p09", name: "우드 베이스 아로마 디퓨저", category: "리빙", price: 54000, stock: 13, row: 1, col: 3, tags: ["디퓨저", "향"] },
  { id: "p10", name: "텍스처 쿠션 커버", category: "리빙", price: 24000, stock: 22, row: 1, col: 4, tags: ["쿠션", "소품"] },
  { id: "p11", name: "원목 라운드 벽시계", category: "리빙", price: 47000, stock: 7, row: 2, col: 0, tags: ["시계", "벽시계"] },
  { id: "p12", name: "호텔 코튼 바스타월", category: "리빙", price: 29000, stock: 28, row: 2, col: 1, tags: ["타월", "욕실"] },
  { id: "p13", name: "보온 스테인리스 보틀", category: "아웃도어", price: 34000, stock: 19, row: 2, col: 2, tags: ["텀블러", "보틀"] },
  { id: "p14", name: "슬림 디지털 주방저울", category: "키친", price: 39000, stock: 11, row: 2, col: 3, tags: ["저울", "주방"] },
  { id: "p15", name: "월넛 커팅 보드", category: "키친", price: 32000, stock: 17, row: 2, col: 4, tags: ["도마", "원목"] },
  { id: "p16", name: "테이블 그린 플랜터", category: "리빙", price: 26000, stock: 16, row: 3, col: 0, tags: ["화분", "식물"] },
  { id: "p17", name: "시어 핸드 크림", category: "뷰티", price: 16000, stock: 30, row: 3, col: 1, tags: ["핸드크림", "케어"] },
  { id: "p18", name: "소이 왁스 미니 캔들", category: "리빙", price: 21000, stock: 24, row: 3, col: 2, tags: ["캔들", "향"] },
  { id: "p19", name: "글라스 라운드 사이드 테이블", category: "리빙", price: 128000, stock: 5, row: 3, col: 3, tags: ["테이블", "가구"] },
  { id: "p20", name: "소프트 니트 스로우 블랭킷", category: "리빙", price: 62000, stock: 10, row: 3, col: 4, tags: ["담요", "블랭킷"] },
  { id: "p21", name: "데일리 라운드 백팩", category: "패션", price: 83000, stock: 12, row: 4, col: 0, tags: ["백팩", "가방"] },
  { id: "p22", name: "미니멀 폰 스탠드", category: "오피스", price: 19000, stock: 35, row: 4, col: 1, tags: ["거치대", "폰"] },
  { id: "p23", name: "논슬립 요가 매트", category: "아웃도어", price: 45000, stock: 14, row: 4, col: 2, tags: ["요가", "운동"] },
  { id: "p24", name: "오벌 세라믹 트레이", category: "키친", price: 27000, stock: 20, row: 4, col: 3, tags: ["트레이", "접시"] },
  { id: "p25", name: "브라스 테이블 미러", category: "뷰티", price: 52000, stock: 8, row: 4, col: 4, tags: ["거울", "화장대"] },
  { id: "p26", name: "패브릭 수납 박스", category: "리빙", price: 25000, stock: 18, row: 5, col: 0, tags: ["수납", "박스"] },
  { id: "p27", name: "차콜 수면 아이마스크", category: "뷰티", price: 14000, stock: 33, row: 5, col: 1, tags: ["수면", "마스크"] },
  { id: "p28", name: "세라믹 티팟 세트", category: "키친", price: 74000, stock: 6, row: 5, col: 2, tags: ["티팟", "찻잔"] },
  { id: "p29", name: "세이지 트래블 파우치", category: "아웃도어", price: 23000, stock: 25, row: 5, col: 3, tags: ["파우치", "여행"] },
  { id: "p30", name: "데스크 오거나이저", category: "오피스", price: 36000, stock: 21, row: 5, col: 4, tags: ["정리함", "데스크"] },
];

const state = {
  category: "전체",
  search: "",
  sort: "featured",
  cart: loadCart(),
};

const elements = {
  categoryList: document.querySelector("[data-category-list]"),
  productGrid: document.querySelector("[data-product-grid]"),
  resultSummary: document.querySelector("[data-result-summary]"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  cartDrawer: document.querySelector("[data-cart-drawer]"),
  cartItems: document.querySelector("[data-cart-items]"),
  cartCount: document.querySelector("[data-cart-count]"),
  subtotal: document.querySelector("[data-subtotal]"),
  shipping: document.querySelector("[data-shipping]"),
  total: document.querySelector("[data-total]"),
  checkoutForm: document.querySelector("[data-checkout-form]"),
  formMessage: document.querySelector("[data-form-message]"),
  orderPreview: document.querySelector("[data-order-preview]"),
};

const categories = ["전체", ...new Set(products.map((product) => product.category))];
const currency = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 });

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("sereneMarketCart")) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem("sereneMarketCart", JSON.stringify(state.cart));
}

function formatWon(value) {
  return currency.format(value);
}

function spritePosition(product) {
  const x = product.col === 0 ? "0%" : `${(product.col / 4) * 100}%`;
  const y = product.row === 0 ? "0%" : `${(product.row / 5) * 100}%`;
  return `--sprite-x: ${x}; --sprite-y: ${y};`;
}

function getFilteredProducts() {
  const keyword = state.search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const categoryMatch = state.category === "전체" || product.category === state.category;
    const keywordMatch =
      !keyword ||
      product.name.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword) ||
      product.tags.some((tag) => tag.toLowerCase().includes(keyword));
    return categoryMatch && keywordMatch;
  });

  return filtered.sort((a, b) => {
    if (state.sort === "priceAsc") return a.price - b.price;
    if (state.sort === "priceDesc") return b.price - a.price;
    if (state.sort === "nameAsc") return a.name.localeCompare(b.name, "ko");
    return products.indexOf(a) - products.indexOf(b);
  });
}

function renderCategories() {
  elements.categoryList.innerHTML = categories
    .map(
      (category) => `
        <button class="category-button ${state.category === category ? "is-active" : ""}" type="button" data-category="${category}">
          ${category}
        </button>
      `,
    )
    .join("");
}

function renderProducts() {
  const filtered = getFilteredProducts();
  elements.resultSummary.textContent = `${filtered.length}개 상품 표시 중`;

  if (filtered.length === 0) {
    elements.productGrid.innerHTML = `<p class="empty-state">조건에 맞는 상품이 없습니다.</p>`;
    return;
  }

  elements.productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image" style="${spritePosition(product)}" role="img" aria-label="${product.name} 상품 이미지"></div>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>재고 ${product.stock}</span>
            </div>
            <h3>${product.name}</h3>
            <div class="product-bottom">
              <span class="price">${formatWon(product.price)}</span>
              <button class="add-button" type="button" data-add="${product.id}">담기</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function getCartLines() {
  return Object.entries(state.cart)
    .map(([id, qty]) => {
      const product = products.find((item) => item.id === id);
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean);
}

function getTotals() {
  const subtotal = getCartLines().reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 50000 ? 0 : 3000;
  return { subtotal, shipping, total: subtotal + shipping };
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const nextQty = (state.cart[id] || 0) + 1;
  state.cart[id] = Math.min(nextQty, product.stock);
  saveCart();
  renderCart();
  openCart();
}

function changeQuantity(id, delta) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const nextQty = (state.cart[id] || 0) + delta;
  if (nextQty <= 0) {
    delete state.cart[id];
  } else {
    state.cart[id] = Math.min(nextQty, product.stock);
  }
  saveCart();
  renderCart();
}

function renderCart() {
  const lines = getCartLines();
  const itemCount = lines.reduce((sum, item) => sum + item.qty, 0);
  const totals = getTotals();

  elements.cartCount.textContent = itemCount;
  elements.subtotal.textContent = formatWon(totals.subtotal);
  elements.shipping.textContent = totals.shipping === 0 ? "무료" : formatWon(totals.shipping);
  elements.total.textContent = formatWon(totals.total);

  if (lines.length === 0) {
    elements.cartItems.innerHTML = `<div class="empty-state">장바구니가 비어 있습니다.</div>`;
    elements.checkoutForm.querySelector("button[type='submit']").disabled = true;
    elements.orderPreview.hidden = true;
    return;
  }

  elements.checkoutForm.querySelector("button[type='submit']").disabled = false;
  elements.cartItems.innerHTML = lines
    .map(
      (item) => `
        <article class="cart-line">
          <div class="cart-thumb" style="${spritePosition(item)}" role="img" aria-label="${item.name} 썸네일"></div>
          <div>
            <h3>${item.name}</h3>
            <p>${formatWon(item.price)} · ${item.category}</p>
            <div class="quantity-row">
              <div class="stepper" aria-label="${item.name} 수량 조절">
                <button type="button" data-qty-minus="${item.id}" aria-label="수량 줄이기">−</button>
                <span>${item.qty}</span>
                <button type="button" data-qty-plus="${item.id}" aria-label="수량 늘리기">+</button>
              </div>
              <button class="remove-button" type="button" data-remove="${item.id}">삭제</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function openCart() {
  elements.cartDrawer.classList.add("is-open");
  elements.cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  elements.cartDrawer.classList.remove("is-open");
  elements.cartDrawer.setAttribute("aria-hidden", "true");
}

function makeOrderNumber() {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(2, 14);
  const random = Math.floor(Math.random() * 900 + 100);
  return `SM-${stamp}-${random}`;
}

function validateCheckout(formData) {
  if (getCartLines().length === 0) return "장바구니에 상품을 먼저 담아주세요.";
  if (!formData.get("customerName")?.trim()) return "주문자 이름을 입력해주세요.";
  if (!formData.get("phone")?.trim()) return "연락처를 입력해주세요.";
  if (!formData.get("postalCode")?.trim()) return "우편번호를 입력해주세요.";
  if (!formData.get("address")?.trim()) return "주소를 입력해주세요.";
  if (!formData.get("terms")) return "주문 확인 동의가 필요합니다.";
  return "";
}

function renderOrderPreview(formData) {
  const lines = getCartLines();
  const totals = getTotals();
  const paymentLabel = {
    card: "카드 결제",
    bank: "가상계좌",
    easy: "간편 결제",
  }[formData.get("paymentMethod")];

  elements.orderPreview.hidden = false;
  elements.orderPreview.innerHTML = `
    <h3>주문 확인 완료</h3>
    <p class="notice">주문번호 ${makeOrderNumber()} · 실제 결제창 호출 직전 상태입니다.</p>
    <p>${formData.get("customerName")} / ${formData.get("phone")}</p>
    <p>${formData.get("postalCode")} ${formData.get("address")}</p>
    <ul>
      ${lines.map((item) => `<li>${item.name} ${item.qty}개 · ${formatWon(item.price * item.qty)}</li>`).join("")}
    </ul>
    <p>선택 결제수단: ${paymentLabel}</p>
    <p><strong>최종 결제 예정 금액: ${formatWon(totals.total)}</strong></p>
    <p>이 데모는 결제 API나 PG사로 정보를 전송하지 않습니다.</p>
  `;
}

function bindEvents() {
  elements.categoryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderCategories();
    renderProducts();
  });

  elements.productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(button.dataset.add);
  });

  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderProducts();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProducts();
  });

  document.querySelectorAll("[data-open-cart]").forEach((button) => {
    button.addEventListener("click", openCart);
  });

  document.querySelectorAll("[data-close-cart]").forEach((button) => {
    button.addEventListener("click", closeCart);
  });

  elements.cartItems.addEventListener("click", (event) => {
    const plus = event.target.closest("[data-qty-plus]");
    const minus = event.target.closest("[data-qty-minus]");
    const remove = event.target.closest("[data-remove]");
    if (plus) changeQuantity(plus.dataset.qtyPlus, 1);
    if (minus) changeQuantity(minus.dataset.qtyMinus, -1);
    if (remove) {
      delete state.cart[remove.dataset.remove];
      saveCart();
      renderCart();
    }
  });

  elements.checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.checkoutForm);
    const message = validateCheckout(formData);
    elements.formMessage.textContent = message;
    if (message) {
      elements.orderPreview.hidden = true;
      return;
    }
    renderOrderPreview(formData);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCart();
  });
}

function init() {
  renderCategories();
  renderProducts();
  renderCart();
  bindEvents();
}

init();
