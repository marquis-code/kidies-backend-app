/**
 * JasmarKids API end-to-end test.
 *
 * Usage:
 *   API_URL=http://localhost:3005 node test/e2e-api.mjs
 *
 * Credentials can be overridden with ADMIN_EMAIL / ADMIN_PASSWORD and
 * CUSTOMER_EMAIL / CUSTOMER_PASSWORD environment variables.
 */

import zlib from 'node:zlib';

const BASE = process.env.API_URL || 'http://localhost:3005';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@jasmarkids.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';
const CUSTOMER_EMAIL = process.env.CUSTOMER_EMAIL || 'demo@jasmarkids.com';
const CUSTOMER_PASSWORD = process.env.CUSTOMER_PASSWORD || 'Demo1234!';
const suffix = Date.now().toString().slice(-6);

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`PASS  ${name}${detail ? ` (${detail})` : ''}`);
  } else {
    failed++;
    failures.push(name);
    console.log(`FAIL  ${name}${detail ? ` (${detail})` : ''}`);
  }
}

async function api(path, options = {}) {
  const { method = 'GET', token, body, form, headers = {} } = options;
  const requestHeaders = { ...headers };
  if (token) requestHeaders.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(`${BASE}${path}`, { method, headers: requestHeaders, body: payload });
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      // Atlas occasionally drops a connection; retry transient 503 responses.
      if (response.status === 503 && attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
        continue;
      }
      return { status: response.status, data, ok: response.ok };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
    }
  }
  throw lastError;
}

const cleanup = { products: [], categories: [], policies: [], promotions: [], coupons: [] };

function pngBuffer() {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(1, 0);
  ihdr.writeUInt32BE(1, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(Buffer.from([0, 255, 0, 0]))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

async function main() {
  console.log(`\nJasmarKids API E2E — ${BASE}\n`);

  // ---------------- health ----------------
  const health = await api('/health');
  check('Health endpoint', health.status === 200 && health.data?.database === 'connected', health.data?.database);

  // ---------------- auth ----------------
  const adminLogin = await api('/auth/admin/login', {
    method: 'POST',
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  check('Admin login', adminLogin.ok && adminLogin.data?.user?.role === 'admin');
  const adminToken = adminLogin.data?.accessToken;
  const adminRefresh = adminLogin.data?.refreshToken;

  const wrongPortal = await api('/auth/admin/login', {
    method: 'POST',
    body: { email: CUSTOMER_EMAIL, password: CUSTOMER_PASSWORD },
  });
  check('Customer blocked from admin portal', wrongPortal.status === 403);

  const refreshed = await api('/auth/refresh', { method: 'POST', body: { refreshToken: adminRefresh } });
  check('Token refresh', refreshed.ok && !!refreshed.data?.accessToken);

  const adminProfile = await api('/auth/admin/profile', { token: adminToken });
  check('Admin profile', adminProfile.ok && adminProfile.data?.role === 'admin');
  check('Admin profile hides password hash', adminProfile.data?.passwordHash === undefined);

  const adminUsers = await api('/auth/users', { token: adminToken });
  check('Admin customer list', adminUsers.ok && Array.isArray(adminUsers.data));
  check('Customer list hides password hashes', !JSON.stringify(adminUsers.data).includes('passwordHash'));

  const adminStats = await api('/auth/admin/stats', { token: adminToken });
  check('Admin user stats', adminStats.ok && typeof adminStats.data?.total === 'number');

  const customerLogin = await api('/auth/login', {
    method: 'POST',
    body: { email: CUSTOMER_EMAIL, password: CUSTOMER_PASSWORD },
  });
  check('Customer login', customerLogin.ok && !!customerLogin.data?.accessToken);
  const customerToken = customerLogin.data?.accessToken;

  const logout = await api('/auth/logout', { method: 'POST', token: adminToken });
  check('Logout endpoint', logout.ok);

  // unauthorized checks
  check('Orders list requires auth', (await api('/orders')).status === 401);
  check('Customer cannot list all orders', (await api('/orders', { token: customerToken })).status === 403);
  check('Admin endpoints reject customers', (await api('/auth/users', { token: customerToken })).status === 403);
  check('Upload requires auth', (await api('/upload', { method: 'POST' })).status === 401);

  // ---------------- products ----------------
  const products = await api('/products?limit=5');
  check('Products list', products.ok && Array.isArray(products.data?.products) && products.data.total > 0, `total ${products.data?.total}`);
  const sample = products.data.products[0];
  check('Products include category', !!sample?.categoryId?.name);

  const detail = await api(`/products/${sample._id}`);
  check('Product detail', detail.ok && detail.data?._id === sample._id);

  const related = await api(`/products/${sample._id}/related`);
  check('Related products', related.ok && Array.isArray(related.data));

  const search = await api('/products?search=jacket');
  check('Product search', search.ok && search.data.total >= 0);

  const filtered = await api('/products?gender=girl&limit=100');
  check('Product gender filter', filtered.ok && filtered.data.products.every((p) => ['girl', 'unisex'].includes(p.gender)));

  const categoryFilter = await api('/products?category=toddler&limit=100');
  check('Product category filter', categoryFilter.ok && categoryFilter.data.products.length > 0);

  const priceSort = await api('/products?sort=price_asc&limit=5');
  const prices = priceSort.data.products.map((p) => p.basePrice);
  check('Product price sort', priceSort.ok && prices.every((p, i) => i === 0 || prices[i - 1] <= p));

  const publicDrafts = await api('/products?status=all&limit=100');
  const draftVisible = (publicDrafts.data?.products || []).some((p) => p.status !== 'active');
  check('Public listing hides drafts without admin token', !draftVisible);

  const adminProducts = await api('/products?includeInactive=true&limit=200', { token: adminToken });
  check('Admin sees inactive products', adminProducts.ok && (adminProducts.data?.products?.length || 0) >= products.data.total);

  const stats = await api('/products/admin/stats', { token: adminToken });
  check('Product stats', stats.ok && typeof stats.data?.total === 'number');

  const newProductName = `E2E Product ${suffix}`;
  const createdProduct = await api('/products', {
    method: 'POST',
    token: adminToken,
    body: {
      name: newProductName,
      description: 'Created by the automated API test.',
      basePrice: 21.5,
      status: 'active',
      gender: 'unisex',
      productType: 'tops',
      variants: [{ size: 'M', color: 'Blue', sku: `E2E-${suffix}-M`, stockQuantity: 4 }],
      imageUrls: { thumbnail: 'https://example.com/t.jpg', medium: 'https://example.com/t.jpg' },
    },
  });
  check('Product create (auto SKU)', createdProduct.status === 201 && !!createdProduct.data?.sku, createdProduct.data?.sku);
  if (createdProduct.data?._id) cleanup.products.push(createdProduct.data._id);

  const updatedProduct = await api(`/products/${createdProduct.data._id}`, {
    method: 'PUT',
    token: adminToken,
    body: { basePrice: 23.75 },
  });
  check('Product update', updatedProduct.ok && Number(updatedProduct.data?.basePrice) === 23.75);

  const deletedProduct = await api(`/products/${createdProduct.data._id}`, { method: 'DELETE', token: adminToken });
  check('Product delete', deletedProduct.ok);
  cleanup.products = cleanup.products.filter((id) => id !== createdProduct.data._id);

  // ---------------- categories ----------------
  const catName = `E2E Category ${suffix}`;
  const cat = await api('/categories', { method: 'POST', token: adminToken, body: { name: catName, description: 'test' } });
  check('Category create', cat.status === 201);
  if (cat.data?._id) cleanup.categories.push(cat.data._id);
  const cats = await api('/categories');
  check('Category list', cats.ok && cats.data.some((c) => c._id === cat.data._id));
  const catUpdate = await api(`/categories/${cat.data._id}`, { method: 'PATCH', token: adminToken, body: { description: 'updated' } });
  check('Category update', catUpdate.ok && catUpdate.data?.description === 'updated');
  check('Category delete', (await api(`/categories/${cat.data._id}`, { method: 'DELETE', token: adminToken })).ok);
  cleanup.categories = [];

  // ---------------- policies ----------------
  const policy = await api('/product-policies', {
    method: 'POST',
    token: adminToken,
    body: { name: `E2E Policy ${suffix}`, productDetails: 'Cotton', shippingAndReturns: '30 days' },
  });
  check('Policy create', policy.status === 201);
  if (policy.data?._id) cleanup.policies.push(policy.data._id);
  check('Policy list', (await api('/product-policies')).ok);
  check('Policy update', (await api(`/product-policies/${policy.data._id}`, {
    method: 'PATCH', token: adminToken, body: { productDetails: 'Organic cotton' },
  })).ok);
  check('Policy delete', (await api(`/product-policies/${policy.data._id}`, { method: 'DELETE', token: adminToken })).ok);
  cleanup.policies = [];

  // ---------------- coupons ----------------
  const couponCode = `E2E${suffix}`;
  const coupon = await api('/coupons', {
    method: 'POST',
    token: adminToken,
    body: { code: couponCode, discountType: 'percentage', discountValue: 10, minPurchaseAmount: 20, isActive: true },
  });
  check('Coupon create', coupon.status === 201, coupon.data?._id);
  if (coupon.data?._id) cleanup.coupons.push(coupon.data._id);

  const validation = await api('/coupons/validate', { method: 'POST', body: { code: couponCode, subtotal: 100 } });
  check('Coupon validation computes discount', validation.ok && validation.data?.discountAmount === 10, validation.data?.discountAmount);

  const belowMin = await api('/coupons/validate', { method: 'POST', body: { code: couponCode, subtotal: 5 } });
  check('Coupon minimum purchase enforced', belowMin.status === 400);

  const badCoupon = await api('/coupons/validate', { method: 'POST', body: { code: 'NOT-A-COUPON' } });
  check('Invalid coupon rejected', badCoupon.status === 404);

  check('Coupon update', (await api(`/coupons/${coupon.data._id}`, {
    method: 'PATCH', token: adminToken, body: { discountValue: 15 },
  })).ok);
  check('Coupon list', (await api('/coupons', { token: adminToken })).ok);

  // ---------------- promotions ----------------
  const promo = await api('/promotions', {
    method: 'POST',
    token: adminToken,
    body: { title: `E2E Promo ${suffix}`, type: 'banner', imageUrl: 'https://example.com/b.jpg', isActive: true },
  });
  check('Promotion create', promo.status === 201);
  if (promo.data?._id) cleanup.promotions.push(promo.data._id);
  check('Promotion public list', (await api('/promotions?isActive=true')).ok);
  check('Promotion update', (await api(`/promotions/${promo.data._id}`, {
    method: 'PUT', token: adminToken, body: { isActive: false },
  })).ok);

  // ---------------- settings ----------------
  const general = await api('/settings/general');
  check('General settings', general.ok && !!general.data?.currency);
  const originalStoreName = general.data.storeName;
  const updatedGeneral = await api('/settings/general', {
    method: 'PUT', token: adminToken, body: { ...general.data, storeName: 'JasmarKids E2E' },
  });
  check('General settings update', updatedGeneral.ok && updatedGeneral.data?.storeName === 'JasmarKids E2E');
  await api('/settings/general', { method: 'PUT', token: adminToken, body: { ...general.data, storeName: originalStoreName } });

  const storefront = await api('/settings/storefront');
  check('Storefront settings', storefront.ok && Array.isArray(storefront.data?.heroCarousel));
  const savedStorefront = await api('/settings/storefront', { method: 'PUT', token: adminToken, body: storefront.data });
  check('Storefront settings update', savedStorefront.ok);
  check('Settings update blocked for customers', (await api('/settings/general', { method: 'PUT', token: customerToken, body: {} })).status === 403);

  // ---------------- orders ----------------
  const orderProduct = detail.data;
  const orderPayload = {
    customer: {
      firstName: 'E2E',
      lastName: 'Tester',
      email: CUSTOMER_EMAIL,
      address: '12 Test Street',
      city: 'Brooklyn',
      state: 'NY',
      country: 'United States',
      zipCode: '11201',
    },
    paymentMethod: 'cash_on_delivery',
    items: [{ productId: orderProduct._id, name: 'Ignored client name', price: 0.01, quantity: 1, size: orderProduct.variants?.[0]?.size }],
    totalAmount: 0.01,
  };
  const order = await api('/orders', { method: 'POST', body: orderPayload });
  check('Order create', order.status === 201 && !!order.data?.order?.orderNumber, order.data?.order?.orderNumber);
  const createdOrder = order.data.order;
  check('Server recomputes order total', createdOrder.totalAmount > 1 && createdOrder.subtotal === orderProduct.basePrice);
  check('Order defaults to processing/unpaid', createdOrder.status === 'Processing' && createdOrder.paymentStatus === 'Unpaid');

  const tracked = await api('/orders/track', {
    method: 'POST',
    body: { email: CUSTOMER_EMAIL.toUpperCase(), orderNumber: createdOrder.orderNumber },
  });
  check('Order tracking is case-insensitive', tracked.ok && tracked.data?.orderNumber === createdOrder.orderNumber);

  const lookup = await api(`/orders/lookup/${createdOrder.orderNumber}?email=${encodeURIComponent(CUSTOMER_EMAIL)}`);
  check('Order lookup by number', lookup.ok && lookup.data?.orderNumber === createdOrder.orderNumber);

  const myOrders = await api('/orders/my-orders', { token: customerToken });
  check('My orders', myOrders.ok && myOrders.data.some((o) => o.orderNumber === createdOrder.orderNumber));

  const orderDetail = await api(`/orders/${createdOrder._id}`, { token: customerToken });
  check('Customer can read own order', orderDetail.ok);

  const adminOrders = await api('/orders?limit=10', { token: adminToken });
  check('Admin order list', adminOrders.ok && Array.isArray(adminOrders.data?.orders));
  check('Admin order search', (await api(`/orders?search=${createdOrder.orderNumber}`, { token: adminToken })).data.orders.length >= 1);

  const analytics = await api('/orders/analytics', { token: adminToken });
  check('Order analytics', analytics.ok && typeof analytics.data?.totalOrders === 'number');

  const statusUpdate = await api(`/orders/${createdOrder._id}/status`, {
    method: 'PATCH', token: adminToken, body: { status: 'Shipped' },
  });
  check('Order status update', statusUpdate.ok && statusUpdate.data?.status === 'Shipped');

  const paymentUpdate = await api(`/orders/${createdOrder._id}/payment`, {
    method: 'PATCH', token: adminToken, body: { paymentStatus: 'Paid' },
  });
  check('Order payment update', paymentUpdate.ok && paymentUpdate.data?.paymentStatus === 'Paid');

  const invalidStatus = await api(`/orders/${createdOrder._id}/status`, {
    method: 'PATCH', token: adminToken, body: { status: 'Teleported' },
  });
  check('Invalid order status rejected', invalidStatus.status === 400);

  const invalidOrder = await api('/orders', {
    method: 'POST',
    body: { ...orderPayload, items: [] },
  });
  check('Empty order rejected', invalidOrder.status === 400);

  const badEmailOrder = await api('/orders', {
    method: 'POST',
    body: { ...orderPayload, customer: { ...orderPayload.customer, email: 'not-an-email' } },
  });
  check('Invalid customer email rejected', badEmailOrder.status === 400);

  // customer cancel (second order)
  const cancelOrder = await api('/orders', { method: 'POST', body: orderPayload });
  const cancelId = cancelOrder.data.order._id;
  const cancelled = await api(`/orders/${cancelId}/cancel`, { method: 'PATCH', token: customerToken });
  check('Customer can cancel pending order', cancelled.ok && cancelled.data?.status === 'Cancelled');

  // mock payment verification
  const mockOrder = await api('/orders', {
    method: 'POST',
    body: { ...orderPayload, paymentMethod: 'paystack' },
  });
  check('Paystack checkout returns authorization URL', order.ok && !!mockOrder.data?.paystack?.authorization_url);
  const verified = await api('/orders/verify-payment', {
    method: 'POST',
    body: { orderNumber: mockOrder.data.order.orderNumber, reference: mockOrder.data.paystack?.reference },
  });
  check('Mock payment verification marks order paid', verified.ok && verified.data?.paymentStatus === 'Paid');

  // ---------------- reviews ----------------
  const review = await api('/reviews', {
    method: 'POST', token: customerToken,
    body: { productId: orderProduct._id, rating: 5, comment: `Automated review ${suffix}` },
  });
  check('Review create', review.status === 201 && review.data?._id);
  const reviewId = review.data?._id;
  const productReviews = await api(`/reviews/product/${orderProduct._id}`);
  check('Product reviews list', productReviews.ok && productReviews.data.some((r) => r._id === reviewId));
  check('Duplicate review updates instead of duplicating', (await api('/reviews', {
    method: 'POST', token: customerToken,
    body: { productId: orderProduct._id, rating: 4, comment: 'Updated review' },
  })).ok);
  check('Admin review list', (await api('/reviews', { token: adminToken })).ok);
  check('Review delete', (await api(`/reviews/${reviewId}`, { method: 'DELETE', token: adminToken })).ok);

  // ---------------- contact / subscribers ----------------
  const contact = await api('/contact', {
    method: 'POST',
    body: { firstName: 'E2E', lastName: 'Contact', email: CUSTOMER_EMAIL, message: 'Automated test message' },
  });
  check('Contact form submit', contact.status === 201);
  check('Admin contact list', (await api('/contact', { token: adminToken })).ok);

  const subscriber = await api('/subscribers', { method: 'POST', body: { email: `e2e-sub-${suffix}@example.com` } });
  check('Newsletter subscribe', subscriber.status === 201);
  check('Admin subscriber list', (await api('/subscribers', { token: adminToken })).ok);

  // ---------------- audit & chat ----------------
  check('Audit log list', (await api('/audit-logs', { token: adminToken })).ok);
  check('Forged audit log protected', (await api('/audit-logs')).status === 401);

  const chatSession = `sess_e2e_${suffix}`;
  const chatHistory = await api(`/chat/session/${chatSession}`);
  check('Public chat history', chatHistory.ok && Array.isArray(chatHistory.data));
  check('Chat sessions require admin', (await api('/chat/sessions')).status === 401);
  check('Chat analytics (admin)', (await api('/chat/analytics', { token: adminToken })).ok);

  // ---------------- upload ----------------
  const form = new FormData();
  form.append('file', new Blob([pngBuffer()], { type: 'image/png' }), 'test.png');
  const upload = await api('/upload', { method: 'POST', token: adminToken, form });
  check('Image upload', upload.ok && !!upload.data?.url, upload.data?.url?.slice(0, 40));

  // ---------------- health of expired token ----------------
  const expiredish = await api('/auth/profile', { token: 'invalid.token.value' });
  check('Invalid token rejected', expiredish.status === 401);

  // ---------------- cleanup ----------------
  for (const id of cleanup.coupons) await api(`/coupons/${id}`, { method: 'DELETE', token: adminToken });
  for (const id of cleanup.promotions) await api(`/promotions/${id}`, { method: 'DELETE', token: adminToken });
  for (const id of cleanup.categories) await api(`/categories/${id}`, { method: 'DELETE', token: adminToken });
  for (const id of cleanup.policies) await api(`/product-policies/${id}`, { method: 'DELETE', token: adminToken });
  for (const id of cleanup.products) await api(`/products/${id}`, { method: 'DELETE', token: adminToken });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failures.length) {
    console.log('Failed checks:');
    failures.forEach((name) => console.log(' - ' + name));
  }
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error('FATAL', error);
  process.exit(1);
});
