// ===== Cart rendering & Checkout =====
function renderCart() {
  const wrap = document.getElementById('cart-list');
  if (!wrap) return;
  const items = OrgCart.get();
  if (!items.length) {
    wrap.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Sub‑Total</th><th></th></tr></thead>
      <tbody>
        ${items.map(i => `
          <tr data-id="${i.productId}">
            <td>${i.name}</td>
            <td><input type="number" class="qty" min="1" value="${i.qty}" /></td>
            <td>₹${i.price}</td>
            <td>₹${i.price * i.qty}</td>
            <td><button class="rm">Remove</button></td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr><td colspan="3" style="text-align:right">Total:</td><td>₹${OrgCart.total()}</td><td></td></tr>
      </tfoot>
    </table>
  `;

  wrap.querySelectorAll('input.qty').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const tr = e.target.closest('tr');
      const id = tr.getAttribute('data-id');
      OrgCart.update(id, parseInt(e.target.value || '1', 10));
      renderCart();
    });
  });

  wrap.querySelectorAll('button.rm').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      const id = tr.getAttribute('data-id');
      OrgCart.remove(id);
      renderCart();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  document.addEventListener('cart:updated', renderCart);
});

async function handleCheckout(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const paymentMode = (document.querySelector('input[name="paymentMode"]:checked') || {}).value || 'ONLINE';

  const msg = document.getElementById('checkout-message');
  const items = OrgCart.get();

  if (!items.length) {
    msg.textContent = 'Cart is empty.';
    return;
  }

  try {
    // Create order on backend
    const orderResp = await OrgAPI.apiPost('/api/orders', {
      customerName: name, phone, email, address,
      items: items.map(i => ({ productId: i.productId, qty: i.qty })),
      paymentMode
    });

    if (paymentMode === 'COD') {
      msg.textContent = `Order placed (COD). Order ID: ${orderResp.orderId}`;
      OrgCart.clear();
      renderCart();
      return;
    }

    // ONLINE payment → create Razorpay order
    const rp = await OrgAPI.apiPost('/api/payments/create-order', { orderId: orderResp.orderId });
    const options = {
      key: rp.key,
      amount: rp.amount,
      currency: rp.currency || 'INR',
      name: 'OrganicHub',
      description: 'Mustard Oil Purchase',
      order_id: rp.orderId,
      prefill: { name, email, contact: phone },
      notes: { address },
      handler: function (response){
        // Razorpay will call webhook to mark Paid. Show success to user.
        msg.textContent = 'Payment successful! Thank you for your order.';
        OrgCart.clear();
        renderCart();
      },
      theme: {}
    };
    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    msg.textContent = 'Checkout failed. Please try again.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  if (form) form.addEventListener('submit', handleCheckout);
});
