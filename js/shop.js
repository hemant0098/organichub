// ===== Render products on the shop =====
async function renderProducts() {
  const list = document.getElementById('product-list');
  if (!list) return;
  list.innerHTML = 'Loading products...';
  try {
    const products = await OrgAPI.apiGet('/api/products');
    if (!products.length) {
      list.innerHTML = '<p>No products available yet.</p>';
      return;
    }
    list.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.image || ''}" alt="${p.name}" />
        <h4>${p.name}</h4>
        <p>${p.variant}</p>
        <div class="price">₹${p.price}</div>
        <button data-id="${p._id}" class="btn-add">Add to Cart</button>
      </div>
    `).join('');

    list.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const product = products.find(p => p._id === id);
        if (product) {
          OrgCart.add(product, 1);
          alert('Added to cart');
        }
      });
    });
  } catch (err) {
    list.innerHTML = '<p>Error loading products.</p>';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', renderProducts);
