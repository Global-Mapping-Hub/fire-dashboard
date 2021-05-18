import api from '../utils/API';
import 'select2';

class ControlPanel {
	constructor(props) {
		// props
		this.UICountries = props.translation.countries;
		this.UISubDiv = props.translation.subdiv;

		// init country list
		this.countryInput = document.getElementById('country_input');
		this.requestCountryList();

		// init country divisions list
		this.divisionsInput = document.getElementById('divisions_input');
	}

	// get a full list of countries from the db
	requestCountryList() {
		api.get(`/gcountry`).then(function(resp) {
			resp.data.forEach(function(el) {
				var countryId = parseInt(el.country_id);
				var countryName = this.UICountries[countryId];
				var option = document.createElement('option');
					option.value = countryId;
					option.innerHTML = countryName;
				this.countryInput.appendChild(option);
			}.bind(this));

			//init searchable dropdown
			$('#country_input').select2();

		}.bind(this)).catch(function(err) {
			console.log(err);
		});
	}

	// get countries' subdivisions
	requestCountryDivisions(cid) {
		// remove old values
		this.divisionsInput.innerHTML = '';

		// if not global, show divisions
		if (parseInt(cid) !== 1000) {
			api.get(`/gdivs/${cid}`).then(function(resp) {
				resp.data.forEach(function(el) {
					var divId = parseInt(el.id);
					var divName = (divId) ? this.UISubDiv[divId] : el.name;

					var option = document.createElement('option');
						option.value = divId;
						option.innerHTML = divName;
					this.divisionsInput.appendChild(option);
				}.bind(this));

				//init searchable dropdown
				$('#divisions_input').select2();
			}.bind(this)).catch(function(err) {
				console.log(err);
			});

			// show divisions
			this.divisionsInput.style.display = 'block'
		} else {
			// hide divisions
			this.divisionsInput.style.display = 'none'
		}
	}
}

export default ControlPanel;