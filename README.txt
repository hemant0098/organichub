OrganicHub – Frontend integration (vanilla JS)
=============================================

What this gives you
- Fetch products from backend and render them on your current GitHub Pages site.
- Local cart (localStorage) with add/remove/update.
- Checkout form: creates order on your backend, then launches Razorpay for online payment OR marks order as COD.
- Minimal HTML snippets you can paste into your existing index.html.

How to use (quick)
------------------
1) Put the `js/` folder into your `organichub` site (same level as your index.html).
2) Open `js/api.js` and set BACKEND_BASE to your deployed backend URL.
3) In your HTML, add the following right before `</body>`:

    <!-- Razorpay checkout -->
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <!-- OrganicHub ecom scripts -->
    <script src="./js/api.js"></script>
    <script src="./js/cart.js"></script>
    <script src="./js/shop.js"></script>
    <script src="./js/checkout.js"></script>

4) Add these containers where you want content to appear:
    <!-- Products list (shop) -->
    <section id="shop">
      <h2>Shop Organic Mustard Oil</h2>
      <div id="product-list"></div>
    </section>

    <!-- Cart + Checkout -->
    <section id="cart">
      <h2>Your Cart</h2>
      <div id="cart-list"></div>

      <h3>Checkout</h3>
      <form id="checkout-form">
        <input type="text" id="name" placeholder="Full Name" required />
        <input type="tel" id="phone" placeholder="Phone" required />
        <input type="email" id="email" placeholder="Email (optional)" />
        <textarea id="address" placeholder="Full Address" required></textarea>

        <label><input type="radio" name="paymentMode" value="ONLINE" checked /> Pay Online (UPI/Card)</label>
        <label><input type="radio" name="paymentMode" value="COD" /> Cash on Delivery</label>

        <button type="submit">Place Order</button>
      </form>

      <div id="checkout-message"></div>
    </section>

5) Confirm your backend CORS allows your GitHub Pages origin (already configured in the scaffold).

6) Open your site and test:
   - Products should appear.
   - Add to cart.
   - Place order (COD or Online).

Notes
-----
- Online payment success uses Razorpay's handler and your backend webhook (`/api/payments/webhook`) to flip `paymentStatus = Paid`.
- For local dev, set BACKEND_BASE to your localhost URL and add `http://localhost:xxxx` to CORS if needed.
- Product cards assume each product has: _id, name, slug, variant, price, image.
