const currentTime = document.querySelector('.current-time');
const hour = document.querySelector('.hours')
const minute = document.querySelector('.minutes')
const second = document.querySelector('.seconds')

// const renderAreaLocations = async function() {
// 	const data = await getAreaLocations();
// 	if(timeInterval) clearInterval(timeInterval);
// 	currentTime.innerHTML = '';
// 	displayAreaLocations(data);
// 	areaLocationLabel.style.display = 'block';
// 	searchButton.disabled = false;
// }


//import json data into cityData variable
const cityData = data

function findMatches(wordToMatch, cityData) {
	//filter out city objects matching search term
	return cityData.filter(place => {
		const regex = new RegExp(wordToMatch, 'gi');
		return place.city.match(regex) || place.country.match(regex)
	})
}

function displayMatches() {
	//remove suggestions list when input is blank
	if (this.value === '') {
		suggestions.style.display = 'none';
		return
	}

	//add markup of suggestions list to page
	const matchArray = findMatches(this.value, cityData)
	let markup = matchArray.map(place => {
		return `
			<li class="location">
				<span class="name">${place.city}, ${place.country}</span>
				<span class="flag">${place.flag}</span>
			</li>
		`
	}).join('');
	suggestions.style.display = 'block'
	suggestions.innerHTML = markup; 
	locations = document.querySelectorAll('.location')

	//add event listener on each list item for rendering their time
	locations.forEach(location => {
		cityName = location.querySelector('.name').textContent
		commaIndex = cityName.indexOf(',')
		cityName = cityName.slice(0, commaIndex)
		location.addEventListener('click', function() {
			arr = findMatches(cityName, cityData)
			renderLocationTime(arr[0])
		})
	})
}

const searchInput = document.querySelector('.search')
const suggestions = document.querySelector('.suggestions')
searchInput.addEventListener('change', displayMatches)
searchInput.addEventListener('keyup', displayMatches)



function getLocationTime(endpoint) {
	return fetch(`${endpoint}`)
			.then(res => res.json())
			.catch(err => console.log(err));
}

let timeInterval;
const renderLocationTime = async function(location) {
	const data = await getLocationTime(location.apiEndpoint);
	let millisecs = new Date(data.datetime.slice(0, 19)).getTime();
	clockTime(new Date(millisecs))

	millisecs += 1000; //account for delay caused by setInterval function

	setUpMinuteHands()
	function displayLocationTime() {
		let date = new Date(millisecs);
		millisecs += 1000;

		// currentTime.innerHTML = 
		// 	`In ${location.city}, today's date is ${date.toDateString()}
		// 	 and the time is ${date.toLocaleTimeString()}
		// 	`
		markup += `${date.toLocaleTimeString()}`
		//to keep rotating the seconds hand
		const container = document.querySelector('.seconds-container');
		if (container.angle === undefined) container.angle = 6;
		else container.angle += 6;
		container.style.transform = `rotateZ(${container.angle}deg)`
		
		//add delay when moving
		let randomOffset = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
		container.style.transitionDelay = '0.0'+ randomOffset +'s';
	}

	timeInterval = setInterval(displayLocationTime, 1000)
}

function clockTime(date) {
	//to set initial positions of the hands
	let seconds = date.getSeconds();
	let minutes = date.getMinutes();
	let hours = date.getHours();
	let hands = [
		{
			hand: hour,
			angle: (hours * 30) + (minutes / 2)
		},
		{
			hand: minute,
			angle: (minutes * 6)
		},
		{
			hand: second,
			angle: (seconds * 6)
		}
	]

	for (let i = 0; i < hands.length; i++) {
		hands[i].hand.style.webkitTransform = `rotateZ(${hands[i].angle}deg)`
		hands[i].hand.style.transform = `rotateZ(${hands[i].angle}deg)`
	}
	hands[1].hand.parentNode.setAttribute('data-second-angle', hands[2].angle)
}

function setUpMinuteHands() {
	const container = document.querySelector('.minutes-container');
	let secondAngle = container.getAttribute('data-second-angle')
	if (secondAngle > 0) {
		let delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
		setTimeout(function() {
			moveMinuteHourHands(container);
		}, delay)
	}
}

function moveMinuteHourHands(container) {
	const hourContainer = document.querySelector('.hours-container');
	container.style.transform = 'rotateZ(6deg)';
	hourContainer.style.transform = 'rotateZ(0.5deg)';

	setInterval(function() {
		if (container.angle === undefined) container.angle = 12;
		else container.angle += 6;

		if (hourContainer.angle === undefined) hourContainer.angle = 1;
		else hourContainer.angle += 0.5;

		container.style.transform = `rotateZ(${container.angle}deg)`
		hourContainer.style.transform = `rotateZ(${hourContainer.angle}deg)`
	}, 60000);
}

//create and fill array of cities displayed on homepage 
let homeCities = []
cityData.forEach(city => {
	if(city.city === 'Lagos' || city.city === 'New_York' ||
		city.city === 'Havana' || city.city === 'Berlin' || city.city === 'Madrid') {
		homeCities.push(city)
	}
})

const detailsDiv = document.querySelector('.main-display')
for (let i = 0; i < 5; i++) {
	detailsDiv.insertAdjacentHTML(`beforeend`, `
			<article class="clock">
				<div class="hours-container">
					<div class="hours"></div>
				</div>
						
				<div class="minutes-container">
					<div class="minutes"></div>
				</div>
						
				<div class="seconds-container">
					<div class="seconds"></div>
				</div>

				<div class="country-details"></div>
			</article>	
		`)
}

const countryDetails = document.querySelectorAll('.country-details')
for (let i = 0; i < homeCities.length; i++) {
	let markup = '';
	renderLocationTime(homeCities[i]);
	countryDetails[i].innerHTML = `
		<p class="country-name">${homeCities[i].city}, ${homeCities[i].country} ${homeCities[i].flag}</p>
		<p class="time">${markup} ${homeCities[i].timezone}</p>
	`
}