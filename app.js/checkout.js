import { supabase } from "./supabase.js";

// Get cart from localStorage
const cartItems = JSON.parse(localStorage.getItem('hotel_cart')) || [];

console.log('restaurant_id:', localStorage.getItem('restaurant_id'));
console.log('cartItems:', cartItems);
// Place order handler
const handlePlaceOrder = async () => {

  const customerForm = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone-number').value,
    orderType: document.getElementById('order-type').value
  };

  const specialInstructions = document.getElementById('special-instructions').value;

  if (!customerForm.name || !customerForm.phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  if (cartItems.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Insert order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      'restaurant-id': localStorage.getItem('restaurant_id'),
      'customer-name': customerForm.name,
      'customer-phone': customerForm.phone,
      'total amount': total,
      'status': 'pending'
    })
    .select()
    .single();

  if (orderError) {
    console.error('Order failed:', orderError.message);
    alert('Could not place order. Please try again.');
    return;
  }

  // Insert order items
  const orderItems = cartItems.map(item => ({
    'order-id': orderData.id,
    'menu-item-id': item.id,
    'dish_name': item.name,
    'quantity': item.quantity,
    'unit_price': item.price,
    'sub-total': item.quantity * item.price,
    'special_instructions': specialInstructions
  }));

  const { error: itemsError } = await supabase
    .from('order items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Order items failed:', itemsError.message);
    alert('Order partially failed. Contact support.');
    return;
  }

  // Success
  localStorage.removeItem('checkout_order_summary');
  alert('Order placed successfully!');
  window.location.href = 'order-tracking.html';
};

// Wire up button
document.getElementById('place-order-btn').addEventListener('click', handlePlaceOrder);

 