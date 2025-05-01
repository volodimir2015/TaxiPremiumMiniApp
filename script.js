let balance = 0;
let garage = [];

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".navbar button").forEach(button => {
    button.addEventListener("click", () => {
      const pageId = button.dataset.page;
      openPage(pageId);
    });
  });

  loadGarage();
  loadBalance();
  renderMarket();
  document.querySelector('[data-page="market"]').classList.add("active");
  openPage("market");
});

function openPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");

  document.querySelectorAll(".navbar button").forEach(b => b.classList.remove("active"));
  document.querySelector(`[data-page="${pageId}"]`).classList.add("active");

  if (pageId === "market") renderMarket();
  if (pageId === "garage") renderGarage();
  if (pageId === "play") {
    renderPlay();
    document.getElementById("playModal").style.display = "block";
  }
}

function closePlayModal() {
  document.getElementById("playModal").style.display = "none";
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}г ${m}хв ${s}с`;
}

function renderPlay() {
  const container = document.getElementById("cars-container");
  const statusListId = "car-status-list";
  const now = Date.now();

  container.innerHTML = "";
  const oldList = document.getElementById(statusListId);
  if (oldList) oldList.remove();

  const statusList = document.createElement("div");
  statusList.id = statusListId;

  garage.forEach(car => {
    if (car.status === 'working') {
      const carImg = document.createElement("img");
      carImg.src = car.image;
      carImg.classList.add("moving");
      carImg.style.top = `${Math.random() * 80 + 10}%`;
      carImg.style.left = `-${Math.random() * 100 + 50}px`;
      container.appendChild(carImg);
    }

    const entry = document.createElement("div");
    entry.className = "car-entry";
    let content = `<strong>${car.name}</strong>`;

    if (car.status === 'working') {
      const elapsed = now - new Date(car.startedAt).getTime();
      const remaining = 86400000 - elapsed;

      if (remaining <= 0) {
        content += ` — <button onclick="collectTXY(${car.id})">Зібрати TXY</button>`;
      } else {
        content += ` — Залишилось: ${formatTime(remaining)}`;
      }
    } else {
      content += ` — <button onclick="startWork(${car.id})">Таксувати</button>`;
    }

    entry.innerHTML = content;
    statusList.appendChild(entry);
  });

  document.getElementById("play").appendChild(statusList);
  setTimeout(renderPlay, 1000);
}

function startWork(carId) {
  const car = garage.find(c => c.id === carId);
  if (!car) return;
  car.status = 'working';
  car.startedAt = new Date().toISOString();
  saveGarage();
  renderPlay();
}

function collectTXY(carId) {
  const car = garage.find(c => c.id === carId);
  if (!car) return;
  balance += car.profit;
  car.status = 'idle';
  car.startedAt = null;
  saveGarage();
  saveBalance();
  renderPlay();
  alert(`✅ Ви отримали ${car.profit} TXY за ${car.name}`);
}

function renderGarage() {
  const container = document.getElementById("garage-cars");
  container.innerHTML = "";

  if (garage.length === 0) {
    container.innerHTML = '<p>У вас немає авто. Купіть або отримайте на ринку!</p>';
    return;
  }

  garage.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <img src="${car.image}" alt="${car.name}">
      <div class="car-name">${car.name}</div>
      <div class="car-description">${car.description}</div>
      <div class="car-stats">💵 Прибуток: ${car.profit} TXY/день</div>
      <div class="car-reliability">🛡️ Надійність: ${car.reliability}</div>
      <div class="car-status">Статус: ${car.status === 'working' ? 'Працює' : 'Очікує'}</div>
    `;
    container.appendChild(card);
  });
}

function renderMarket() {
  const container = document.getElementById("market-cars");
  container.innerHTML = "";
  marketData.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <img src="${car.image}" alt="${car.name}">
      <div class="car-details">
        <div class="car-name">${car.name}</div>
        <div class="car-description">${car.description}</div>
        <div class="car-stats">💵 Прибуток: ${car.profit} TXY/день</div>
        <div class="car-reliability">🛡️ Надійність: ${car.reliability}</div>
        <div class="car-price">${car.price === 0 ? 'Безкоштовно' : car.price + ' TXY'}</div>
        <button onclick="buyCar(${car.id})">${car.price === 0 ? 'Отримати' : 'Купити'}</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function buyCar(carId) {
  const car = marketData.find(c => c.id === carId);
  if (!car) return;
  if (car.price > balance) return alert("Недостатньо TXY!");
  const count = garage.filter(c => c.id === carId).length;
  if (car.limit && count >= car.limit) return alert("Досягнуто ліміт!");

  balance -= car.price;
  garage.push({ ...car, status: 'idle', startedAt: null });
  saveGarage();
  saveBalance();
  renderGarage();
}

function saveGarage() {
  localStorage.setItem('garage', JSON.stringify(garage));
}

function saveBalance() {
  localStorage.setItem('balance', balance);
  document.getElementById("balance").innerText = balance;
}

function loadGarage() {
  const data = localStorage.getItem('garage');
  if (data) garage = JSON.parse(data);
}

function loadBalance() {
  const data = localStorage.getItem('balance');
  if (data !== null) {
    balance = Number(data);
    document.getElementById("balance").innerText = balance;
  } else {
    balance = 0;
    saveBalance();
  }
}

// 💼 Повний список авто додавай тут — як ми вже робили в marketData
const marketData = [
  { id: 1, name: "Peugeot 508", price: 0, image: "images/peugeot508.png", description: "Просторий універсал", profit: 0.16, reliability: "93%", limit: 1 },
  { id: 2, name: "Kia Optima", price: 30, image: "images/kiaoptima.png", description: "Комфортний седан", profit: 0.4, reliability: "95%", limit: 15 },
  { id: 3, name: "Honda Accord", price: 35, image: "images/hondaaccord.png", description: "Бізнес-клас", profit: 0.46, reliability: "95%", limit: 15 }
  // Додай решту авто тут
];

