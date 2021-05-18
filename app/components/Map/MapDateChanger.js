class MapDateChanger {
	constructor() {
		this.block = document.getElementById('map_datepicker_block');
	}
	show() {
		this.block.style.display = 'block';
	}
	hide() {
		this.block.style.display = 'none';
	}
}
export default MapDateChanger;