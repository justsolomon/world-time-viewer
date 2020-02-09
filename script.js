const timezone = document.querySelector('#timezone-select');
const areaLocation = document.querySelector('#location-select');

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
	renderLocationTime();
}

timezone.addEventListener('change', renderAreaLocations)
renderAreaLocations();

function getLocationTime() {
	let area = timezone.value;
	let location = areaLocation.value;
	return fetch(`http://worldtimeapi.org/api/timezone/${area}/${location}`)
			.then(res => res.json())
			.catch(err => console.log(err));
}

function displayLocationTime(data) {
	let date = new Date(data.datetime);
	document.querySelector('.current-time').innerHTML = 
		`In ${areaLocation.value}, today's date is ${date.toDateString()}
		 and the time is ${date.toLocaleTimeString()}
		`
}

const renderLocationTime = async function() {
	const data = await getLocationTime();
	console.log(data);
	displayLocationTime(data);
}

areaLocation.addEventListener('change', renderLocationTime)