const main = document.querySelector('main');
const form = document.querySelector('form');

const insurance = 495;
const vat = 0.25;
const carRentalPrice = 100;

let cars = [];

fetch('data/cars.json')
  .then((data) => data.json())
  .then((dataJson) => {
    cars = dataJson;
  })

function calcRentalDays(pickUpDate, handInDate) {
  const t2 = new Date(pickUpDate).getTime();
  const t1 = new Date(handInDate).getTime();

  return Math.floor((t1-t2)/(24*3600*1000)) + 1;
}

function calcRentalCost(car, days) {
  return ((insurance + (days * carRentalPrice) + (days * car.supplementPerDay)) * (1 + vat)).toFixed(2)
}

function validateDates(pickUpDate, handInDate) {
  return pickUpDate < handInDate;
}

function renderCars(carsArr, pickUpDate, handInDate) {
  const days = calcRentalDays(pickUpDate, handInDate)

  for(const car of carsArr) {
    // const carRentPrice = calcRentalCost(car, days);

    const carBody = `
    <section class="car1" id="${car.category}">
    <img src="${car.picture}">
    <h1>${car.model}</h1>
    <p> Category: ${car.category}<br/> Persons:${car.seats} <br> suitcases:${car.luggage} </p>
    <div>
        <h3>${car.price}</h3>
        <a href="accesory.html" class="book-car">Book now</button>
    </div>
    </section>
    `

    main.insertAdjacentHTML('beforeend', carBody);

    car.carRentPrice = car.price;

    const dates = {
      pickUpDate,
      handInDate,
      days
    }

    document.querySelector(`#${car.category} .book-car`).addEventListener('click', bookCarEvent.bind(null, car, dates), false);
  }
}

function bookCarEvent(car, dates , e) {
  localStorage.setItem('car', JSON.stringify(car));
  localStorage.setItem('pickUpDate', new Date(dates.pickUpDate).toLocaleDateString())
  localStorage.setItem('handInDate', new Date(dates.handInDate).toLocaleDateString())
  localStorage.setItem('days', dates.days)
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const pickUpDate = document.getElementById('pickup-time').value;
  const handInDate = document.getElementById('handin-time').value;

  const persons = document.getElementById('number-of-people').value;
  const bags = document.getElementById('number-of-suitcases').value;


  if(!validateDates(pickUpDate, handInDate)) {
    alert('Hand in date is before pickup date')
    return;
  }

  const filteredCars = cars.filter((car) => car.seats >= persons && car.luggage >= bags);

  main.innerHTML = '';

  renderCars(filteredCars, pickUpDate, handInDate);
})

