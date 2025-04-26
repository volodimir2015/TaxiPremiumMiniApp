async function loadGarage() {
    const response = await fetch("garage.json");
    const cars = await response.json();
  
    const map = document.getElementById("map");
  
    cars.forEach((car, index) => {
      const carImg = document.createElement("img");
      carImg.src = "images/" + car.image;
      carImg.alt = car.name;
      carImg.className = "car";
      carImg.style.top = `${50 + index * 70}px`;
      carImg.style.left = `-${60 * index}px`; // Плавний виїзд
      map.appendChild(carImg);
    });
  }
  
  loadGarage();
  