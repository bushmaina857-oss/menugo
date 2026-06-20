import { supabase } from './supabase.js';

let fetchedMenuItems = [];

async function fetchAndRenderMenu() {
  const restaurantId = localStorage.getItem('restaurant_id');
  const {data: menuItems, error} = await supabase.from('menu items').select('*').eq('restaurant-id', restaurantId).eq('available',true);
    
    if (error) {
        console.error("Database connection failed:", error.message);
        return;
    }
    fetchedMenuItems = menuItems;

    const menuContainer = document.querySelector('.menu-list');
    if (!menuContainer) return;

    menuContainer.innerHTML = '';

    fetchedMenuItems.forEach(item => {
        const dishCard = document.createElement('div');
        dishCard.className = 'dish-card';
        
        dishCard.innerHTML= `
        <img src="${item.image_url}" alt="${item['dish name']}"/>
        <h3>${item['dish name']} </h3>
        <p>${item.description || ''}</p>
        <b>${item.price} DZD</b>
        <button class="add-to-cart-btn"
            data-id='${item.id}',
            data-name='${item['dish name']}',
            data-price="${item.price}">Add to Cart</button>
        <button class="remove-from-cart-btn"
            data-id='${item.id}'>Remove from Cart</button>
        `;
        menuContainer.appendChild(dishCard);        
    });    
}
function updateCartCount(){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum,item) => sum + item.quantity, 0);

    const cartBtn = document.querySelector('.cart-button button');
    console.log('Buttom found:', cartBtn);
    if (cartBtn) cartBtn.textContent = `Cart (${total})`;
}
function removeFromCart(id){
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existing = cart.find(i => i.id == id);
    if (!existing) return;

    if (existing.quantity > 1) {
        existing.quantity -= 1;
    } else{
        cart = cart.filter (i => i.id !=id);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
function addToCart(productId){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!databaseItem) {
        console.error("Product data not found in current database records.");
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem){
        existingItem.quantity += 1;
    } else {

        const newItem = {
            id: databaseItem.id,
            name: databaseItem['dish name'] || databaseItem.name,
            price: parseFloat(databaseItem.price),
            quantity: 1
        }
        cart.push(newItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert(`${databaseItem['dish name'] || databaseItem.name} added to cart!`);
    
}
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderMenu();
    updateCartCount();
});



// 2. GLOBAL APP STATE (Keep This!)
// ==========================================
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Holds the selected dishes in memory

// ==========================================
// 3. CORE CART ENGINE FUNCTIONS (Keep This!)
// ==========================================
function addItemToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  updateCounterUI();
}

function removeItemFromCart(id) {
  const existingItem = cart.find(item => item.id === id);
  if (!existingItem) return;
  existingItem.quantity -= 1;
  if (existingItem.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }
  updateCounterUI();
}

function updateCounterUI() {
  const viewCartBtn = document.getElementById('main-cart-counter-btn');
  if (!viewCartBtn) return;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  viewCartBtn.innerText = `Cart (${totalQuantity})`;
}

// ==========================================
// 4. NEW RELATIONAL CHECKOUT CODE 
// ==========================================
async function checkoutEntireCart() {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some dishes first.");
    return;
  }

  //1. Savethe active cart array staight to browser storage memory
  localStorage.setItem('hotel_cart', JSON.stringify(cart));

  //2. Redirect the customer directly to your cart page layout
  window.location.href = 'cart.html';
}

 
// ==========================================
// 5. DIAGNOSTIC EVENT INITIALIZER
// ==========================================
function initCartSystem() {
  // Setup the main checkout button listener
  const viewCartBtn = document.getElementById('main-cart-counter-btn');
  if (viewCartBtn) {
    viewCartBtn.addEventListener('click', checkoutEntireCart);
    console.log("Checkout button bound successfully.");
  }

  // Monitor every single click on the webpage
  document.body.addEventListener('click', (e) => {
    // 1. Log the exact class of whatever item you just clicked
    console.log("You clicked an element with classes:", e.target.className);

    // 2. Modified check: works if the class name contains your text string
    if (e.target.className && e.target.className.includes('add-to-cart-btn')) {
      const id = e.target.getAttribute('data-id');
      const name = e.target.getAttribute('data-name');
      const price = parseFloat(e.target.getAttribute('data-price'));
      
      console.log(`📦 Success! Adding: ${name} (${id})`);
      addItemToCart(id, name, price);
      return; // Stop checking
    }

    if (e.target.className && e.target.className.includes('remove-from-cart-btn')) {
      const id = e.target.getAttribute('data-id');
      console.log(`🗑️ Success! Removing ID: ${id}`);
      removeItemFromCart(id);
      return; // Stop checking
    }
  });
}

// Start up trigger logic
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCartSystem);
} else {
  initCartSystem();
}

