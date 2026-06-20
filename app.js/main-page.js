import { supabase } from './supabase.js';
async function loadRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*');

  if (error) {
    console.error('Error fetching restaurants:', error);
    return;
  }

  const container = document.getElementById('restaurants-container');

  data.forEach(restaurant => {
    container.innerHTML += `
      <div class="restaurant-header">
        <img src="${restaurant['logo-url']}" alt="Restaurant Logo">
        <div class="restaurant-info">
            <h1>${restaurant.name}</h1>
            <p>${restaurant['is-open'] ? '🟡 Open Now' : '🔴 Closed'}</p>
            <p class="address">${restaurant.address}</p>
            <button class="view-menu-btn" onclick="goToMenu('${restaurant.id}')">
            View Menu
            </button>
        </div>        
      </div>
    `;      
  });
}
loadRestaurants();

// go to menu
window.goToMenu = function goToMenu (restaurantId) {
    localStorage.setItem('restaurant_id', restaurantId);
    window.location.href = 'menu.html';

}
