const tg = window.Telegram.WebApp;
tg.ready();

let balance = 1000;
let garage = [];

const marketData = [
    { id: 1, name: "Peugeot 508", price: 0, image: "images/peugeot508.png", description: "Просторий універсал, 225 к.с., 6.5 л/100 км, передній привід", profit: "0.16 TXY/день", reliability: "93%", limit: 1 },
    { id: 2, name: "Kia Optima", price: 30, image: "images/kiaoptima.png", description: "Комфортний седан, 188 к.с., 8 л/100 км, передній привід", profit: "0.4 TXY/день", reliability: "95%", limit: 15 },
    { id: 3, name: "Honda Accord", price: 35, image: "images/hondaaccord.png", description: "Бізнес-седан, 252 к.с., 7.5 л/100 км", profit: "0.46 TXY/день", reliability: "95%", limit: 15 },
    { id: 4, name: "Kia Sorento", price: 45, image: "images/kiasorento.png", description: "Сімейний кросовер, 281 к.с., 9 л/100 км, повний привід", profit: "0.6 TXY/день", reliability: "95%", limit: 15 },
    { id: 5, name: "Honda CR-V", price: 40, image: "images/hondacrv.png", description: "Компактний кросовер, 193 к.с., 7.8 л/100 км", profit: "0.5 TXY/день", reliability: "95%", limit: 15 },
    { id: 6, name: "Audi A7", price: 85, image: "images/audia7.png", description: "Спортивний фастбек, 340 к.с., 8.5 л/100 км, повний привід", profit: "1.13 TXY/день", reliability: "97%", limit: 100 },
    { id: 7, name: "Audi Q7", price: 90, image: "images/audiq7.png", description: "Преміальний позашляховик, 340 к.с., 9.2 л/100 км, Quattro", profit: "1.2 TXY/день", reliability: "97%", limit: 100 },
    { id: 8, name: "Range Rover Velar", price: 95, image: "images/velar.png", description: "Стильний SUV, 400 к.с., 9.8 л/100 км", profit: "1.26 TXY/день", reliability: "97%", limit: 100 },
    { id: 9, name: "BMW X7", price: 135, image: "images/bmwx7.png", description: "Люксовий позашляховик, 340 к.с., 10 л/100 км", profit: "1.8 TXY/день", reliability: "97%", limit: 100 },
    { id: 10, name: "Porsche Cayenne", price: 140, image: "images/cayenne.png", description: "Потужний кросовер, 550 к.с., 10.5 л/100 км", profit: "1.86 TXY/день", reliability: "97%", limit: 100 },
    { id: 11, name: "Porsche Panamera", price: 150, image: "images/panamera.png", description: "Спортивний седан, 630 к.с., 9.5 л/100 км", profit: "2 TXY/день", reliability: "97%", limit: 100 },
    { id: 12, name: "BMW M8", price: 160, image: "images/bmwm8.png", description: "Ультраспорт купе, 625 к.с., 12 л/100 км", profit: "2.13 TXY/день", reliability: "98%", limit: null },
    { id: 13, name: "Tesla Model S", price: 170, image: "images/teslamodels.png", description: "Електроседан, 1020 к.с., запас ходу 637 км", profit: "2.26 TXY/день", reliability: "98%", limit: null },
    { id: 14, name: "Mercedes-Benz V-Class", price: 175, image: "images/vclass.png", description: "Мінівен, 237 к.с., 8.5 л/100 км", profit: "2.33 TXY/день", reliability: "98%", limit: null },
    { id: 15, name: "Mercedes-Maybach GLS 600", price: 265, image: "images/maybachgls.png", description: "Люксовий SUV, 557 к.с., 12 л/100 км", profit: "3.53 TXY/день", reliability: "99%", limit: null },
    { id: 16, name: "Bentley Bentayga", price: 280, image: "images/bentayga.png", description: "Елітний SUV, 635 к.с., 13 л/100 км", profit: "3.73 TXY/день", reliability: "99%", limit: null },
    { id: 17, name: "Mercedes-Maybach S680", price: 300, image: "images/maybachs680.png", description: "Люксовий седан, 630 к.с., 12.5 л/100 км", profit: "4 TXY/день", reliability: "99%", limit: null },
    { id: 18, name: "Bentley Continental GT Speed", price: 500, image: "images/continentalgt.png", description: "Потужне купе, 659 к.с., 14 л/100 км", profit: "6.66 TXY/день", reliability: "99%", limit: null }
    // Можеш додавати інші авто тут
];

const navButtons = document.querySelectorAll(".navbar button");
const pages = document.querySelectorAll(".page");

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        const targetPage = button.getAttribute("data-page");
        pages.forEach(page => page.classList.add("hidden"));
        navButtons.forEach(btn => btn.classList.remove("active"));

        document.getElementById(targetPage).classList.remove("hidden");
        button.classList.add("active");

        if (targetPage === 'market') renderMarket();
        if (targetPage === 'garage') renderGarage();
    });
});

function renderMarket() {
    const marketContainer = document.getElementById('market-cars');
    marketContainer.innerHTML = '';

    marketData.forEach(car => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <img src="${car.image}" alt="${car.name}">
            <div class="car-details">
                <div class="car-name">${car.name}</div>
                <div class="car-description">${car.description}</div>
                <div class="car-stats">💵 Прибуток: ${car.profit}</div>
                <div class="car-reliability">🛡️ Надійність: ${car.reliability}</div>
                <div class="car-stats">💰 ${car.price === 0 ? 'Безкоштовно' : car.price + ' TXY'}</div>
            </div>
        `;
        card.onclick = () => openModal(car);
        marketContainer.appendChild(card);
    });
}

function filterMarket(type) {
    let filtered = [];
    if (type === 'cheap') {
        filtered = marketData.filter(car => car.price <= 100);
    } else if (type === 'expensive') {
        filtered = marketData.filter(car => car.price > 100);
    } else {
        filtered = marketData;
    }

    const marketContainer = document.getElementById('market-cars');
    marketContainer.innerHTML = '';
    filtered.forEach(car => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <img src="${car.image}" alt="${car.name}">
            <div class="car-details">
                <div class="car-name">${car.name}</div>
                <div class="car-description">${car.description}</div>
                <div class="car-stats">💵 Прибуток: ${car.profit}</div>
                <div class="car-reliability">🛡️ Надійність: ${car.reliability}</div>
                <div class="car-stats">💰 ${car.price === 0 ? 'Безкоштовно' : car.price + ' TXY'}</div>
            </div>
        `;
        card.onclick = () => openModal(car);
        marketContainer.appendChild(card);
    });
}
function openModal(car) {
    const modal = document.getElementById('carModal');
    document.getElementById('modalCarImage').src = car.image;
    document.getElementById('modalCarName').innerText = car.name;
    document.getElementById('modalCarDescription').innerText = `Опис: ${car.description}`;
    document.getElementById('modalCarProfit').innerText = `Прибуток: ${car.profit}`;
    document.getElementById('modalCarReliability').innerText = `Надійність: ${car.reliability}`;
    document.getElementById('modalCarPrice').innerText = car.price === 0 ? "Отримати безкоштовно" : `Ціна: ${car.price} TXY`;

    document.getElementById('modalBuyButton').onclick = () => {
        buyCar(car.id);
        closeModal();
    };

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('carModal').classList.add('hidden');
}

document.getElementById('closeModal').addEventListener('click', closeModal);

function buyCar(carId) {
    const car = marketData.find(c => c.id === carId);
    if (!car) return;

    if (car.price > balance) {
        alert("Недостатньо TXY для покупки!");
        return;
    }

    if (car.limit !== null) {
        const count = garage.filter(c => c.id === carId).length;
        if (count >= car.limit) {
            alert("Досягнуто ліміт покупки цієї машини!");
            return;
        }
    }

    balance -= car.price;
    document.getElementById('balance').innerText = balance;
    garage.push(car);

    saveGarage();
    saveBalance();
    renderGarage();

    alert(`Ви отримали ${car.name}! 🚗`);
}

function renderGarage() {
    const garageContainer = document.getElementById('garage-cars');
    garageContainer.innerHTML = '';

    if (garage.length === 0) {
        garageContainer.innerHTML = "<p>У вас немає машин. Купіть авто на ринку!</p>";
    } else {
        garage.forEach(car => {
            const item = document.createElement('div');
            item.className = 'car-card';
            item.innerHTML = `
                <img src="${car.image}" alt="${car.name}">
                <div class="car-details">
                    <div class="car-name">${car.name}</div>
                    <div class="car-description">${car.description}</div>
                    <div class="car-stats">💵 Прибуток: ${car.profit}</div>
                    <div class="car-reliability">🛡️ Надійність: ${car.reliability}</div>
                </div>
            `;
            garageContainer.appendChild(item);
        });
    }
}

// LocalStorage
function saveGarage() {
    localStorage.setItem('garage', JSON.stringify(garage));
}

function loadGarage() {
    const data = localStorage.getItem('garage');
    if (data) garage = JSON.parse(data);
}

function saveBalance() {
    localStorage.setItem('balance', balance);
}

function loadBalance() {
    const data = localStorage.getItem('balance');
    if (data !== null) {
        balance = Number(data);
        document.getElementById('balance').innerText = balance;
    }
}

// Ініціалізація
loadGarage();
loadBalance();
renderMarket();
renderGarage();
document.getElementById('market').classList.add('active');
