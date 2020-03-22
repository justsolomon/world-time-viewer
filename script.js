const timezone = document.querySelector('#timezone-select');
const areaLocation = document.querySelector('#location-select');
const currentTime = document.querySelector('.current-time');
const searchButton = document.querySelector('.search-button');
const areaLocationLabel = document.querySelector('.locations-label');
const hour = document.querySelector('.hours')
const minute = document.querySelector('.minutes')
const second = document.querySelector('.seconds')

areaLocationLabel.style.display = 'none';
searchButton.disabled = true;

function getAreaLocations() {
	let area = timezone.value;
	return fetch(`http://worldtimeapi.org/api/timezone/${area}`)
			.then(res => res.json())
			.catch(err => console.log(err));
}

function displayAreaLocations(locations) {
	let area = timezone.value;
	let markup = ``;
	locations.forEach(location => {
		let locationValue = location.slice(area.length + 1);
		markup += `
			<option value=${locationValue}>${locationValue}</option>
		`
	})
	areaLocation.innerHTML = markup;
}

const renderAreaLocations = async function() {
	const data = await getAreaLocations();
	if(timeInterval) clearInterval(timeInterval);
	currentTime.innerHTML = '';
	displayAreaLocations(data);
	areaLocationLabel.style.display = 'block';
	searchButton.disabled = false;
}

timezone.addEventListener('change', renderAreaLocations)

function getLocationTime() {
	let area = timezone.value;
	let location = areaLocation.value;
	return fetch(`http://worldtimeapi.org/api/timezone/${area}/${location}`)
			.then(res => res.json())
			.catch(err => console.log(err));
}

let timeInterval;
const renderLocationTime = async function() {
	const data = await getLocationTime();
	let millisecs = new Date(data.datetime.slice(0, 19)).getTime();
	clockTime(new Date(millisecs))

	millisecs += 1000; //account for delay caused by setInterval function

	setUpMinuteHands()
	function displayLocationTime() {
		let date = new Date(millisecs);
		millisecs += 1000;

		currentTime.innerHTML = 
			`In ${areaLocation.value}, today's date is ${date.toDateString()}
			 and the time is ${date.toLocaleTimeString()}
			`

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

searchButton.addEventListener('click', renderLocationTime)


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