import {mapDescriptions} from '../../utils/Templates';

class InfoModal {
	constructor() {
		this.block = document.getElementById('map_info_wrapper');
		this.titleEl = document.getElementById('map_info_modal_title');
		this.contentEl = document.getElementById('map_info_modal_content');
		this.attributionEl = document.getElementById('map_info_modal_attribution');
		this.urlEl = document.getElementById('map_info_modal_url');
	}
	show(id) {
		this.titleEl.innerText = mapDescriptions[id].title;
		this.contentEl.innerHTML = mapDescriptions[id].content;
		this.attributionEl.innerHTML = `<strong>Attribution:</strong> ${mapDescriptions[id].authors}`;
		this.urlEl.innerHTML = `<a href="${mapDescriptions[id].source}" target="_blank">Information / Data</a>`;
		this.block.style.display = 'block';
	}
	hide() {
		this.block.style.display = 'none';
	}
}

export default InfoModal;