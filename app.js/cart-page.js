// 1. Fetch the active choices saved in browser storage memory
let cart = JSON.parse(localStorage.getItem('hotel_cart')) || [];

// 2. Main builder function to loop and draw items matching your design
function renderCartPage() {
  const itemsContainer = document.getElementById('cart-items-list');

  const totalCountElement = document.getElementById('summary-item-count');
  const grandTotalElement = document.getElementById('summary-grand-total');

  if (!itemsContainer) return;
  itemsContainer.innerHTML = ""; // Clear out older text properties

  let totalAmount = 0;
  let totalItemsCount = 0;

  // Loop through items in cart memory
  cart.forEach(item => {
    const calculatedSubtotal = item.price * item.quantity;
    totalAmount += calculatedSubtotal;
    totalItemsCount += item.quantity;
    
    // Injecting your EXACT HTML format block dynamically
    itemsContainer.innerHTML += `
      <div class="cart-item">
        <div class="dish-info">
          <p class="cart-item-name">${item.name}</p>
          <h3 class="cart-item-price">Dzd ${item.price}</h3>
        </div>
        <div class="info-right">
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="adjustItemQuantity('${item.id}', -1)">-</button>
            <span class="quantity-num">${item.quantity}</span>
            <button class="quantity-btn" onclick="adjustItemQuantity('${item.id}', 1)">+</button>
          </div>
          <h4 class="sub-total">Sub Total: Dzd ${calculatedSubtotal}</h4>
        </div>
      </div>
    `;
  });

  // 3. Update the summary widget details down below
 
  if (totalCountElement !== null) {
    totalCountElement.innerText = totalItemsCount;
  } 
  
  if (grandTotalElement !== null) {
    grandTotalElement.innerText = `Dzd ${totalAmount}`;
  } 
}

// 4. Global access function to mutate the array quantities via button clicks
window.adjustItemQuantity = function(id, direction) {
  const selectedProduct = cart.find(item => item.id === id);
  if (!selectedProduct) return;

  selectedProduct.quantity += direction;

  // Drop item completely if quantity is 0 or less
  if (selectedProduct.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  // Update browser persistent storage record string
  localStorage.setItem('hotel_cart', JSON.stringify(cart));
  alert("Item added to cart successfully!")

  // Rerender layout items instantl
  renderCartPage();
};

function proceedToCheckout() {
  if (cart.length === 0) {
    alert ("Please add items to your cart before proceeding.");
    return;
  }
  localStorage.setItem('checkout_order_summary', JSON.stringify(cart));
  window.location.href = 'checkout.html';
}
// 5. Initialize listeners when the browser viewport completely resolves
document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
  // Bind your Proceed to Checkout button behavior
  const checkoutBtn = document.getElementById('checkout-btn'); // Make sure your button has this ID!
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', proceedToCheckout);
  }
});