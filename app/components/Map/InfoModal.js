import {mapDescriptions} from '../../utils/Templates';

class InfoModal {
	constructor(props) {
		this.UI = props.ui;
		this.block = document.getElementById('map_info_wrapper');
		this.titleEl = document.getElementById('map_info_modal_title');
		this.contentEl = document.getElementById('map_info_modal_content');
		this.attributionEl = document.getElementById('map_info_modal_attribution');
		this.urlEl = document.getElementById('map_info_modal_url');

		this.initControls();
	}
	initControls() {
		this.infoButtonsList = document.getElementsByClassName('info_question_mark');
		this.infoModalClose = document.getElementById('map_info_modal_close');
		for (var i = 0; i < this.infoButtonsList.length; i++) {
			this.infoButtonsList[i].onclick = function(e) { this.show(e.target.dataset.content) }.bind(this)
		}
		// close map info modal
		this.infoModalClose.onclick = function() { this.hide() }.bind(this);
	}
	show(id) {
		this.titleEl.innerText = mapDescriptions(this.UI)[id].title;
		this.contentEl.innerHTML = mapDescriptions(this.UI)[id].content;
		this.attributionEl.innerHTML = `<strong>${this.UI.layers_info_attribution}:</strong> ${mapDescriptions(this.UI)[id].authors}`;
		this.urlEl.innerHTML = `<a href="${mapDescriptions(this.UI)[id].source}" target="_blank">${this.UI.layers_info_infodata}</a>`;
		this.block.style.display = 'block';
	}
	hide() {
		this.block.style.display = 'none';
	}
}

export default InfoModal;