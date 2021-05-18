import axios from 'axios';

class FeedbackModal {
	constructor(props) {
		// props
		this.UI = props.ui;

		// dom
		this.block = document.getElementById('global_feedback_wrapper');
		this.close = document.getElementById('global_feedback_close');
		this.form = document.getElementById('feedback_form');
		this.header = document.getElementById('feedback_header');
		this.inputName = document.getElementById('feedback_name');
		this.inputEmail = document.getElementById('feedback_email');
		this.inputTextarea = document.getElementById('feedback_textarea');
		this.submit = document.getElementById('feedback_submit');
		this.initControls();
		this.setText();
	}
	initControls() {
		// close btn
		this.close.onclick = function() { this.hide() }.bind(this);
		//submit btn
		this.submit.onclick = function(e) {
			e.preventDefault();
			let data = new FormData(this.form);
			this.sendData(data);
		}.bind(this);
	}
	sendData(data) {
		axios.post('mailtemp/check', data)
		.then(function(response) {
			let output = response.data;
			if (output.success) this.form.reset();
			
			alert((output.success) ? output.posted : output.errors.name);
			grecaptcha.reset();
		}.bind(this))
		.catch(function(error) {
			alert(error);
			grecaptcha.reset();
		});
	}
	setText() {
		this.header.innerText = `${this.UI.feedback_header}`;

		this.inputName.setAttribute('placeholder', `${this.UI.feedback_name}*`);
		this.inputEmail.setAttribute('placeholder', `${this.UI.feedback_email}*`);
		this.inputTextarea.setAttribute('placeholder', `${this.UI.feedback_comments}*`);

		this.submit.value = this.UI.feedback_submit;
	}
	hide() {
		this.block.style.display = 'none';
	}
	show() {
		this.block.style.display = 'block';
	}
}

export default FeedbackModal;