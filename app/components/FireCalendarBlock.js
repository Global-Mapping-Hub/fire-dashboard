import {topPlaceholder} from '../utils/Templates';

// immutables
const colours = {
	'1': '#FCE0AD', // low
	'2': '#F69421', // medium
	'3': '#D55A00', // high
	'4': '#D51B00', // extremely high
};
const calendarUrl = 'https://maps.greenpeace.org/projects/firecal/?';

// description class
class Calendar {
	constructor(props) {
		this.UI = props.translation.ui;
		this.worldData = {};
		this.worldData[this.UI.firecal_january] = 2;
		this.worldData[this.UI.firecal_february] = 1;
		this.worldData[this.UI.firecal_march] = 1;
		this.worldData[this.UI.firecal_april] = 1;
		this.worldData[this.UI.firecal_may] = 1;
		this.worldData[this.UI.firecal_june] = 1;
		this.worldData[this.UI.firecal_july] = 3;
		this.worldData[this.UI.firecal_august] = 4;
		this.worldData[this.UI.firecal_september] = 4;
		this.worldData[this.UI.firecal_october] = 2;
		this.worldData[this.UI.firecal_november] = 1;
		this.worldData[this.UI.firecal_december] = 2;

		this.block = document.getElementById('calendar_block');
		this.title = document.getElementById('calendar_title');
		this.title.innerText = this.UI.header_calendar
		this.titleUrl = document.getElementById('calendar_url');
		this.titleUrl.href = calendarUrl;

		this.placeholder = document.getElementById('calendar_placeholder');
		this.placeholder.innerHTML = topPlaceholder;

		this.showDefaultData();
	}
	showDefaultData() {
		this.placeholder.style.display = 'none';
		for (const [key, value] of Object.entries(this.worldData)) {
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