class Notification {
	constructor() {
		this.block = document.getElementById('map_notification');
		this.close = document.getElementById('map_notification_close');
		this.close.onclick = function() {
			this.block.style.display = 'none';
		}.bind(this)
	}
}

export default Notification;