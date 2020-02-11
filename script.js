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


const renderLocationTime = async function() {
	const data = await getLocationTime();
	let millisecs = new Date(data.datetime.slice(0, 19)).getTime();
	function displayLocationTime() {
		let date = new Date(millisecs);
		millisecs += 1000;

		document.querySelector('.current-time').innerHTML = 
			`In ${areaLocation.value}, today's date is ${date.toDateString()}
			 and the time is ${date.toLocaleTimeString()}
			`
	}

	setInterval(displayLocationTime, 1000)
}

areaLocation.addEventListener('change', renderLocationTime)