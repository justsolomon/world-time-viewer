const timezone = document.querySelector('#timezone-select');
const areaLocation = document.querySelector('#location-select');
const currentTime = document.querySelector('.current-time');
const searchButton = document.querySelector('.search-button');
const areaLocationLabel = document.querySelector('.locations-label');

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
	console.log(data);
	displayAreaLocations(data);
}

timezone.addEventListener('change', renderAreaLocations)

function getLocationTime() {
	let area = timezone.value;
	let location = areaLocation.value;
	return fetch(`http://worldtimeapi.org/api/timezone/${area}/${location}`)
			.then(res => res.json())
			.catch(err => console.log(err));
}


const renderLocationTime = async function() {
	const data = await getLocationTime();
	let millisecs = new Date(data.datetime.slice(0, 19)).getTime();
	function displayLocationTime() {
		let date = new Date(millisecs);
		millisecs += 1000;

		currentTime.innerHTML = '';
		currentTime.innerHTML = 
			`In ${areaLocation.value}, today's date is ${date.toDateString()}
			 and the time is ${date.toLocaleTimeString()}
			`
	}

	setInterval(displayLocationTime, 1000)
}