class GlobalModal {
	constructor(props) {
		this.UI = props.translation.ui;

		// global modal with dashboard info
		this.globalModal = document.getElementById('global_modal_wrapper');
		this.globalModalBtn = document.getElementById('global_info_btn');

		// close button
		this.globalModalClose = document.getElementById('global_modal_close');

		// init
		this.initControls();
		this.setText();
	}

	initControls() {
		this.globalModalBtn.onclick = function() {
			this.globalModal.style.display = 'block';
		}.bind(this);

		this.globalModalClose.onclick = function() {
			this.globalModal.style.display = 'none';
		}.bind(this);
	}

	setText() {
		document.getElementById('info_about').innerHTML = this.UI.info_about;
		document.getElementById('info_text_1').innerHTML = this.UI.info_text_1;
		document.getElementById('info_howto').innerHTML = this.UI.info_howto;
		document.getElementById('info_text2').innerHTML = this.UI.info_text2;
		document.getElementById('info_authors').innerHTML = this.UI.info_authors;
		document.getElementById('info_text3').innerHTML = this.UI.info_text3;
	}
}

export default GlobalModal;