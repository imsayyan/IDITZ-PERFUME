import assert from 'assert';
import { paymentService } from './src/services/paymentService.js';

const API_BASE = 'http://localhost:5000/api';

async function testPaymentGatewayFlow() {
  console.log('====================================================');
  console.log('🛡️ TESTING PAYMENT GATEWAY ARCHITECTURE & ORDER FLOW');
  console.log('====================================================\n');

  // 1. Check Public Payment Config
  const configRes = await fetch(`${API_BASE}/payment/config`);
  const configData = await configRes.json();
  assert(configData.config && configData.config.brand_name === 'IDITZ PERFUME', 'Public payment config fetched');
  assert(!configData.config.keySecret && !configData.config.key_secret, 'No secret credentials leaked in public config');
  console.log('✅ PASS 1: Public payment configuration is secure and provides provider metadata');

  // 2. Fetch products to get a test item
  const prodRes = await fetch(`${API_BASE}/products`);
  const prodData = await prodRes.json();
  const testProduct = prodData.products[0];
  const initialStock = testProduct.stock_quantity;
  console.log(`ℹ️ Test product: "${testProduct.name}" (Initial stock: ${initialStock})`);

  // 3. Test Cash on Delivery (COD) Order
  const codPayload = {
    customer_name: 'Vikramaditya Test',
    customer_email: 'vikram.test@iditzperfume.com',
    customer_phone: '9988776655',
    shipping_address: 'Palace Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    payment_method: 'COD',
    items: [{ product_id: testProduct.id, quantity: 1, size: '100ml' }]
  };

  const codRes = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(codPayload)
  });
  const codData = await codRes.json();
  assert(codRes.status === 201, 'COD order created with HTTP 201');
  assert(codData.order.payment_method === 'COD', 'COD payment method set');
  assert(codData.order.order_status === 'Pending', 'COD order status is Pending');
  assert(codData.order.payment_status === 'pending', 'COD payment status is pending');

  // Check that COD stock decremented immediately
  const afterCodProdRes = await fetch(`${API_BASE}/products/${testProduct.slug}`);
  const afterCodProd = (await afterCodProdRes.json()).product;
  assert(afterCodProd.stock_quantity === initialStock - 1, 'COD immediately decrements stock');
  console.log(`✅ PASS 2: COD order placed successfully & stock decremented: ${initialStock} -> ${afterCodProd.stock_quantity}`);

  const currentStock = afterCodProd.stock_quantity;

  // 4. Test Online Payment Order (Initiation)
  const onlinePayload = {
    customer_name: 'Maharani Gayatri Test',
    customer_email: 'gayatri.test@iditzperfume.com',
    customer_phone: '9876543210',
    shipping_address: 'Rambagh Palace',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302005',
    payment_method: 'ONLINE',
    items: [{ product_id: testProduct.id, quantity: 1, size: '100ml' }]
  };

  const onlineRes = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(onlinePayload)
  });
  const onlineData = await onlineRes.json();
  assert(onlineRes.status === 201, 'Online order created with HTTP 201');
  assert(onlineData.order.payment_method === 'ONLINE', 'Payment method is ONLINE');
  assert(onlineData.order.order_status === 'Payment Pending', 'Order status is "Payment Pending"');
  assert(onlineData.order.payment_status === 'pending_payment', 'Payment status is "pending_payment" (NOT paid)');
  assert(onlineData.gatewaySession && onlineData.gatewaySession.gateway_order_id, 'Gateway session generated');

  const onlineOrderId = onlineData.order.id;
  const gatewayOrderId = onlineData.gatewaySession.gateway_order_id;

  // CRITICAL: Verify stock has NOT been decremented yet!
  const duringOnlineProdRes = await fetch(`${API_BASE}/products/${testProduct.slug}`);
  const duringOnlineProd = (await duringOnlineProdRes.json()).product;
  assert(duringOnlineProd.stock_quantity === currentStock, `Stock must NOT decrement before payment! Expected ${currentStock}, got ${duringOnlineProd.stock_quantity}`);
  console.log('✅ PASS 3: Online order created in "pending_payment" status & stock is PRESERVED (NOT decremented)');

  // 5. Test Fraudulent / Tampered Payment Verification Attempt
  const fakeVerifyRes = await fetch(`${API_BASE}/orders/${onlineOrderId}/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gateway_order_id: gatewayOrderId,
      gateway_payment_id: 'pay_fraud_12345',
      gateway_signature: 'fake_tampered_signature_abcd',
      payment_gateway: 'razorpay'
    })
  });
  assert(fakeVerifyRes.status === 400, 'Tampered signature rejected with HTTP 400');
  const fakeVerifyData = await fakeVerifyRes.json();
  assert(fakeVerifyData.error.includes('verification failed'), 'Error message warns of verification failure');

  // Verify stock still NOT decremented and order NOT marked paid
  const recheckFakeProd = (await (await fetch(`${API_BASE}/products/${testProduct.slug}`)).json()).product;
  assert(recheckFakeProd.stock_quantity === currentStock, 'Stock remains intact after failed verification');
  console.log('✅ PASS 4: Tampered/forged payment signature rejected with 400; order is NOT marked paid and stock is unchanged');

  // 6. Test Valid Cryptographic Verification
  const validPaymentId = `pay_${Date.now()}_998877`;
  const validSignature = paymentService.generateTestSignature(gatewayOrderId, validPaymentId);

  const validVerifyRes = await fetch(`${API_BASE}/orders/${onlineOrderId}/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gateway_order_id: gatewayOrderId,
      gateway_payment_id: validPaymentId,
      gateway_signature: validSignature,
      payment_gateway: 'razorpay'
    })
  });
  assert(validVerifyRes.status === 200, 'Valid verification responded with HTTP 200');
  const validVerifyData = await validVerifyRes.json();
  assert(validVerifyData.success === true, 'Verification success reported');
  assert(validVerifyData.order.payment_status === 'paid', 'Order marked as PAID');
  assert(validVerifyData.order.order_status === 'Confirmed', 'Order status updated to Confirmed');
  assert(validVerifyData.order.gateway_payment_id === validPaymentId, 'Gateway payment ID recorded in order');

  // Verify stock is now decremented
  const afterVerifyProd = (await (await fetch(`${API_BASE}/products/${testProduct.slug}`)).json()).product;
  assert(afterVerifyProd.stock_quantity === currentStock - 1, `Stock decremented after verification: ${currentStock} -> ${afterVerifyProd.stock_quantity}`);
  console.log(`✅ PASS 5: Valid cryptographic verification confirmed! Order marked as PAID & stock decremented: ${currentStock} -> ${afterVerifyProd.stock_quantity}`);

  // 7. Test Payment Failure / Cancellation
  const cancelPayload = { ...onlinePayload, customer_name: 'Cancelled Order Test' };
  const cancelRes = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cancelPayload)
  });
  const cancelData = await cancelRes.json();
  const cancelOrderId = cancelData.order.id;

  const failRes = await fetch(`${API_BASE}/orders/${cancelOrderId}/payment-failed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason: 'Customer closed payment gateway modal' })
  });
  assert(failRes.status === 200, 'Payment failure recorded');
  const cancelOrderCheck = (await (await fetch(`${API_BASE}/orders/${cancelOrderId}`)).json()).order;
  assert(cancelOrderCheck.payment_status === 'failed', 'Payment status is failed');
  assert(cancelOrderCheck.order_status === 'Payment Failed', 'Order status is Payment Failed');

  // Verify stock not decremented for failed order
  const finalProd = (await (await fetch(`${API_BASE}/products/${testProduct.slug}`)).json()).product;
  assert(finalProd.stock_quantity === afterVerifyProd.stock_quantity, 'Stock NOT decremented for cancelled/failed payment');
  console.log('✅ PASS 6: Payment cancellation recorded; order marked failed; inventory NOT decremented');

  console.log('\n====================================================');
  console.log('🎉 ALL PAYMENT GATEWAY SECURITY & INVENTORY TESTS PASSED!');
  console.log('====================================================');
}

testPaymentGatewayFlow().catch(err => {
  console.error('❌ PAYMENT TEST FAILED:', err);
  process.exit(1);
});
