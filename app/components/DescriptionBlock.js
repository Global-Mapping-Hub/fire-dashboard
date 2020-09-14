import axios from 'axios';

import {topPlaceholder} from '../utils/Templates';
import {xml2js} from '../utils/Utilities';
import api from '../utils/API';

// description class
class Description {
	constructor() {
		this.block = document.getElementById('description_block');
		this.placeholder = document.getElementById('description_placeholder');
		this.placeholder.innerHTML = topPlaceholder;
		this.globalData = {};
		this.requestData();
		this.setCountry(1000); // default
	}
	requestData() {
		axios.get('https://spreadsheets.google.com/feeds/list/1dof4gGAkXROARgpI0ImbRV-YIo0v-1pm_us0CAgJg9c/1/public/full?alt=json')
		.then(function (out) {
			let data = xml2js(out);
			this.placeholder.style.display = 'none';
			// find default text and set it | at the same time build an object for later use
			data.forEach(function(entry) {
				this.globalData[entry.id] = entry.text;
				// find default text
				if (entry.id == 0) {
					this.block.innerHTML = entry.text;
				}
			}.bind(this));
		}.bind(this));
	}
	setCountry(cid) {
		this.cid = cid;
		api.get(`/gdesc/${this.cid}`).then(function(r) {
			var descriptionID = r.data.description;
			try {
				if (descriptionID || descriptionID == 0) {
					this.block.innerHTML = this.globalData[descriptionID];
				} else {
					// placeholder if no text specified
					this.block.innerHTML = this.globalData[1];
				}
			} catch {console.log('desc not yet ready');}
		}.bind(this))
	}
}

export default Description;