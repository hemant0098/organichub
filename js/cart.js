// ===== Cart (localStorage) =====
const CART_KEY = 'organichub_cart_v1';

const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  },
  set(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(product, qty = 1) {
    const items = Cart.get();
    const idx = items.findIndex(i => i.productId === product._id);
    if (idx >= 0) { items[idx].qty += qty; }
    else {
      items.push({
        productId: product._id,
        name: `${product.name} – ${product.variant}`,
        price: product.price,
        slug: product.slug,
        image: product.image || '',
        qty
      });
    }
    Cart.set(items);
  },
  update(productId, qty) {
    const items = Cart.get().map(i => i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i);
    Cart.set(items);
  },
  remove(productId) {
    const items = Cart.get().filter(i => i.productId !== productId);
    Cart.set(items);
  },
  clear() { Cart.set([]); },
  total() { return Cart.get().reduce((s, i) => s + i.price * i.qty, 0); }
};

window.OrgCart = Cart;
