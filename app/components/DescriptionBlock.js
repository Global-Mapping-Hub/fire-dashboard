import axios from 'axios';

import {topPlaceholder} from '../utils/Templates';
import {xml2js} from '../utils/Utilities';
import api from '../utils/API';

// description class
class Description {
	constructor(props) {
		// props
		this.UI = props.translation.ui;
		this.UI_Descriptions = props.translation.descriptions;

		// dom
		this.block = document.getElementById('description_block');
		this.title = document.getElementById('description_title');
		this.title.innerText = this.UI.header_description;

		this.placeholder = document.getElementById('description_placeholder');
		this.placeholder.innerHTML = topPlaceholder;
		
		this.globalData = {};
		this.requestData();
		this.setCountry(1000); // defaults to world
	}
	requestData() {
		this.placeholder.style.display = 'none';
		// find default text and set it | at the same time build an object for later use
		this.UI_Descriptions.forEach(function(entry) {
			this.globalData[entry.id] = entry.text;
			// find default text
			if (entry.id == 0) {
				this.block.innerHTML = entry.text;
			}
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