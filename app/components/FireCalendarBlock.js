import {topPlaceholder} from '../utils/Templates';

// immutables
const colours = {
	'1': '#FCE0AD', // low
	'2': '#F69421', // medium
	'3': '#D55A00', // high
	'4': '#D51B00', // extremely high
};
const worldData = {
	'Jan': 2, 'Feb': 1, 'Mar': 1, 'Apr': 1, 'May': 1, 'Jun': 1,
	'Jul': 3, 'Aug': 4, 'Sep': 4, 'Oct': 2, 'Nov': 1, 'Dec': 2,
}
const calendarUrl = 'https://maps.greenpeace.org/projects/firecal/?';

// description class
class Calendar {
	constructor() {
		this.block = document.getElementById('calendar_block');
		this.titleUrl = document.getElementById('calendar_url');
		this.titleUrl.href = calendarUrl;

		this.placeholder = document.getElementById('calendar_placeholder');
		this.placeholder.innerHTML = topPlaceholder;

		this.showDefaultData();
	}
	showDefaultData() {
		this.placeholder.style.display = 'none';
		for (const [key, value] of Object.entries(worldData)) {
			// create a new block with a circle and a text
			let el = document.createElement('a');
				el.className = 'circle_block';
				el.href = calendarUrl;
				el.target = '_blank';
			// circle
			let dot = document.createElement('span');
				dot.className = 'circle';
				dot.style = `background: ${colours[value]}`;
			el.append(dot);

			//text
			let text = document.createElement('span');
				text.className = 'circle_text';
				text.innerText = key;
			el.append(text);

			// append to the main block
			this.block.append(el);
		}
	}
}

export default Calendar;