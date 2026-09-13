require('dotenv').config();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
async function run() {
  try {
    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Item' }, unit_amount: 1000 }, quantity: 1 }],
      mode: 'payment',
      success_url: 'http://localhost/success',
      cancel_url: 'http://localhost/cancel',
      managed_payments: { enabled: false },
    };
    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log(session.id);
  } catch (err) {
    console.error('Stripe Error:', err.message);
  }
}
run();
