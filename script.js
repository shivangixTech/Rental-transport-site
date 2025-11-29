// script.js - Rental Transport Website

// Utility: fetch JSON with error handling
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Fetch error', err);
    return null;
  }
}

// Simple mobile menu toggle
document.addEventListener('click', (e) => {
  if (e.target && (e.target.id === 'mobileMenuBtn' || e.target.id === 'mobileMenuBtn2')) {
    const m = document.getElementById('mobileMenu');
    if (m) m.classList.toggle('hidden');
  }
});

/* HOME: show featured vehicles */
async function loadHomeVehicles() {
  const container = document.getElementById('homeVehicles');
  if (!container) return;
  
  const response = await fetchJSON('https://myfakeapi.com/api/cars/');
  if (!response || !response.cars) {
    container.innerHTML = '';
    return;
  }
  
  const carImages = [
    'https://placehold.co/200x150/3498db/ffffff?text=Car+1',
    'https://placehold.co/200x150/e74c3c/ffffff?text=Car+2',
    'https://placehold.co/200x150/2ecc71/ffffff?text=Car+3',
    'https://placehold.co/200x150/f39c12/ffffff?text=Car+4',
    'https://placehold.co/200x150/9b59b6/ffffff?text=Car+5',
    'https://placehold.co/200x150/1abc9c/ffffff?text=Car+6'
  ];
  
  const vehicles = response.cars.slice(0, 6).map((car, index) => ({
    id: car.id || index + 1,
    name: `${car.car} ${car.car_model}`,
    type: 'Car',
    color: car.car_color || 'Gray',
    price: car.price ? Math.round(parseFloat(car.price.replace(/[$,]/g, '')) / 10) : 2000,
    image: carImages[index]
  }));
  
  container.innerHTML = vehicles.map(v => `
    <article class="bg-white p-3 rounded shadow flex items-center gap-3">
      <img src="${v.image}" alt="${v.name}" class="w-20 h-14 object-cover rounded">
      <div>
        <h3 class="font-semibold">${v.name}</h3>
        <div class="text-sm text-gray-500">${v.type} • ₹${v.price}/day</div>
        <a href="details.html?id=${v.id}" class="text-indigo-600 text-sm">View</a>
      </div>
    </article>
  `).join('');
}

/* VEHICLE LIST: render grid with filters */
async function loadVehicleList() {
  const grid = document.getElementById('vehicleGrid');
  if (!grid) return;
  
  const response = await fetchJSON('https://myfakeapi.com/api/cars/');
  if (!response || !response.cars) {
    grid.innerHTML = '<p class="text-red-500">Failed to load vehicles from API.</p>';
    return;
  }
  
  const carImages = [
    'https://placehold.co/400x300/3498db/ffffff?text=Sedan',
    'https://placehold.co/400x300/e74c3c/ffffff?text=SUV',
    'https://placehold.co/400x300/2ecc71/ffffff?text=Luxury',
    'https://placehold.co/400x300/f39c12/ffffff?text=Sports',
    'https://placehold.co/400x300/9b59b6/ffffff?text=Convertible',
    'https://placehold.co/400x300/1abc9c/ffffff?text=Hatchback',
    'https://placehold.co/400x300/34495e/ffffff?text=Coupe',
    'https://placehold.co/400x300/e67e22/ffffff?text=Van',
    'https://placehold.co/400x300/95a5a6/ffffff?text=Truck',
    'https://placehold.co/400x300/c0392b/ffffff?text=Crossover',
    'https://placehold.co/400x300/16a085/ffffff?text=Compact',
    'https://placehold.co/400x300/27ae60/ffffff?text=Premium',
    'https://placehold.co/400x300/2980b9/ffffff?text=Electric',
    'https://placehold.co/400x300/8e44ad/ffffff?text=Hybrid',
    'https://placehold.co/400x300/d35400/ffffff?text=Family'
  ];
  
  let data = response.cars.slice(0, 30).map((car, index) => ({
    id: car.id || index + 1,
    name: `${car.car} ${car.car_model}`,
    type: 'Car',
    color: car.car_color || 'Gray',
    price: car.price ? parseFloat(car.price.replace(/[$,]/g, '')) / 10 : 2000,
    image: carImages[index % carImages.length]
  }));

  const colorSel = document.getElementById('filterColor');
  const sortSel = document.getElementById('sortBy');
  const searchInput = document.getElementById('searchInput');

  function render(list) {
    if (!list || list.length === 0) {
      grid.innerHTML = '<p class="col-span-full text-center text-gray-500">No vehicles found.</p>';
      return;
    }
    grid.innerHTML = list.map(({ id, name, type, color, price, image }) => `
      <article class="bg-white rounded shadow overflow-hidden">
        <img loading="lazy" src="${image}" alt="${name}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="font-semibold">${name}</h3>
          <p class="text-sm text-gray-500">${type}${color ? ' • ' + color : ''}</p>
          <p class="mt-2 font-bold">₹${Math.round(price)}/day</p>
          <div class="mt-4 flex gap-2">
            <a class="px-3 py-2 border rounded text-sm" href="details.html?id=${id}">Details</a>
            <a class="px-3 py-2 bg-indigo-600 text-white rounded text-sm" href="booking.html?vehicleId=${id}">Book</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  function applyFilters() {
    let filtered = [...data];
    
    if (colorSel && colorSel.value) {
      filtered = filtered.filter(d => d.color === colorSel.value);
    }
    
    if (searchInput && searchInput.value.trim()) {
      const searchTerm = searchInput.value.toLowerCase().trim();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchTerm) || 
        (d.type && d.type.toLowerCase().includes(searchTerm)) ||
        (d.color && d.color.toLowerCase().includes(searchTerm))
      );
    }
    
    if (sortSel && sortSel.value === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortSel && sortSel.value === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    render(filtered);
  }

  render(data);

  // Statistics
  const statsContainer = document.getElementById('vehicleStats');
  if (statsContainer && data.length) {
    const avgPrice = (data.reduce((sum, v) => sum + v.price, 0) / data.length).toFixed(2);
    const counts = {};
    for (const v of data) {
      counts[v.type] = (counts[v.type] || 0) + 1;
    }
    let statsHTML = '<h3 class="text-lg font-semibold mt-4 mb-2">Vehicle Statistics</h3>';
    statsHTML += `<p class="text-sm">Average daily price: ₹${avgPrice}</p>`;
    statsHTML += '<p class="text-sm mt-1">Vehicles by type:</p><ul class="list-disc ml-5">';
    Object.entries(counts).forEach(([type, count]) => {
      statsHTML += `<li>${type}: ${count}</li>`;
    });
    statsHTML += '</ul>';
    statsContainer.innerHTML = statsHTML;
  }

  colorSel && colorSel.addEventListener('change', applyFilters);
  sortSel && sortSel.addEventListener('change', applyFilters);
  searchInput && searchInput.addEventListener('input', applyFilters);
}

/* VEHICLE DETAILS */
async function loadVehicleDetails() {
  const el = document.getElementById('vehicleDetails');
  if (!el) return;
  
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || params.get('vehicleId');
  if (!id) {
    el.innerHTML = '<p class="text-red-500">No vehicle selected.</p>';
    return;
  }
  
  const response = await fetchJSON(`https://myfakeapi.com/api/cars/${id}`);
  if (!response || !response.Car) {
    el.innerHTML = '<p class="text-red-500">Vehicle not found.</p>';
    return;
  }
  
  const car = response.Car;
  const detailImages = [
    'https://placehold.co/800x600/3498db/ffffff?text=Car+Details',
    'https://placehold.co/800x600/e74c3c/ffffff?text=Car+Details',
    'https://placehold.co/800x600/2ecc71/ffffff?text=Car+Details',
    'https://placehold.co/800x600/f39c12/ffffff?text=Car+Details',
    'https://placehold.co/800x600/9b59b6/ffffff?text=Car+Details'
  ];
  
  const v = {
    id: car.id,
    name: `${car.car} ${car.car_model}`,
    type: 'Car',
    color: car.car_color || 'Gray',
    price: car.price ? Math.round(parseFloat(car.price.replace(/[$,]/g, '')) / 10) : 2000,
    image: detailImages[(car.id || 0) % detailImages.length],
    description: `${car.car_model_year} ${car.car} ${car.car_model}`,
    features: ['Air Conditioning', 'Power Steering', 'Bluetooth', 'GPS Navigation']
  };

  el.innerHTML = `
    <div class="md:flex gap-6">
      <div class="md:w-1/2">
        <img src="${v.image}" alt="${v.name}" class="w-full h-64 object-cover rounded">
      </div>
      <div class="md:w-1/2">
        <h2 class="text-2xl font-bold">${v.name}</h2>
        <p class="text-sm text-gray-500">${v.type} • ${v.color} • ₹${v.price}/day</p>
        <p class="mt-4 text-gray-700">${v.description}</p>
        <ul class="mt-4 list-disc ml-5 text-gray-600">
          ${v.features.map(f=>`<li>${f}</li>`).join('')}
        </ul>
        <div class="mt-6 flex gap-3">
          <a href="booking.html?vehicleId=${v.id}" class="px-4 py-2 bg-indigo-600 text-white rounded">Book Now</a>
          <a href="vehicals.html" class="px-4 py-2 border rounded">Back</a>
        </div>
      </div>
    </div>
  `;
}

/* BOOKING FORM */
function attachBookingHandler() {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    
    const pickupDate = form.pickupDate.value;
    const dropDate = form.dropDate.value;
    
    if (new Date(dropDate) <= new Date(pickupDate)) {
      document.getElementById('bookingResult').innerHTML = '<p class="text-red-500">Drop date must be after pickup date.</p>';
      return;
    }

    const bookingId = 'BK' + Date.now();
    document.getElementById('bookingResult').innerHTML = `<p class="text-green-600">Booking confirmed! ID: ${bookingId}</p>`;
    form.reset();
  });
}

/* CONTACT FORM */
function attachContactHandler() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    document.getElementById('contactResult').textContent = `Thanks ${name}! We received your message.`;
    form.reset();
  });
}

/* AUTH - localStorage */
function attachAuthHandlers() {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const pass = document.getElementById('signupPassword').value;
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === email)) {
        document.getElementById('signupMsg').textContent = 'Email already registered.';
        return;
      }
      users.push({name, email, pass});
      localStorage.setItem('users', JSON.stringify(users));
      document.getElementById('signupMsg').textContent = 'Account created! You can log in now.';
      signupForm.reset();
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const pass = document.getElementById('loginPassword').value;
      
      // Store email for display on home page
      localStorage.setItem('loggedInEmail', email);
      localStorage.setItem('currentUser', JSON.stringify({ email: email, name: email.split('@')[0] }));
      
      document.getElementById('loginMsg').textContent = 'Logged in! Redirecting...';
      document.getElementById('loginMsg').classList.remove('text-red-500');
      document.getElementById('loginMsg').classList.add('text-green-500');
      setTimeout(() => location.href = 'home.html', 800);
    });
  }
}

/* QUICK SEARCH */
function attachQuickSearch() {
  const form = document.getElementById('quickSearch');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pickup = form.pickup.value;
    const drop = form.drop.value;
    const params = new URLSearchParams({pickup, drop});
    location.href = `vehicles.html?${params.toString()}`;
  });
}

/* Initialize all functions on page load */
document.addEventListener('DOMContentLoaded', () => {
  loadHomeVehicles();
  loadVehicleList();
  loadVehicleDetails();
  attachBookingHandler();
  attachContactHandler();
  attachAuthHandlers();
  attachQuickSearch();
});
