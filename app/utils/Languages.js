import axios from 'axios';
import {xml2js} from '../utils/Utilities';

const DASHBOARD_LANGUAGE_URL = `https://maps.greenpeace.org/fire_dashboard/?lang=`;
const DEFAULT_LANGUAGE_SHEET_ID = `1CNovIg4DNxSQ_XF3C7Y4BwGXSdrayiXOcq3hnzCHmZs`; // english
const LANGUAGES_LIST = `https://spreadsheets.google.com/feeds/list/1TfRNcbzhouso-xj1mxLBtGzkYDTppWlDbeugSQ12RWs/1/public/full?alt=json`;

class LanguageManager {
	constructor(props) {
		// dom elements
		this.block = document.getElementById('header_lang_block');
		this.select = document.getElementById('language_input');
		// events
		this.onLoad = props.onLoad;
		// axios 404 retry
		axios.interceptors.response.use(response => response, (error) => {
			const status = error.response ? error.response.status : null
			const originalRequest = error.config
			if (status === 404) {
				return axios(originalRequest)
			} else {
				return Promise.reject(error)
			}
		});
	}

	// check available languages
	langCheck() {
		this.lang = 'en';

		// retrieve from url
		const url = new URL(window.location.href);
		let param = url.searchParams.get('lang');
		if (param) {
			const matches = param.match(/^([a-z]{2})(?:\-([a-z]{2}))?/i);
			if (matches) {
				if (matches[1]) {
					this.lang = matches[1].toLowerCase();
				}
			}
		}
	
		// get the texts based on lang param
		let spreadsheetID = DEFAULT_LANGUAGE_SHEET_ID;
		axios.get(LANGUAGES_LIST).then(function(out) {
			let data = xml2js(out);
			// create dropdown
			this.createDropdown(data);
			// go over data and find the translation
			let entry = data.filter(el => (el.code == this.lang))[0];
			if (entry) { spreadsheetID = entry[`spreadsheet-id`]; }
			// retrieve by id
			this.retrieveTranslation(spreadsheetID);
		}.bind(this))
		.catch(function(err) {
			this.retrieveTranslation(spreadsheetID);
		}.bind(this));
	}

	// create language dropdown to switch between languages
	createDropdown(languages) {
		// populate the dropdown
		languages.forEach(function(lang) {
			if (lang.description) {
				var option = document.createElement('option');
					option.value = lang.code;
					option.innerHTML = lang.description;
				if (this.lang == lang.code) option.selected = 'selected';
				this.select.appendChild(option);
			}
		}.bind(this));
		
		// onchange event
		this.select.onchange = function(e) { window.open(`${DASHBOARD_LANGUAGE_URL}${e.target.value}`,'_self') };

		// init select2 lib
		$('#language_input').select2();
	}

	// retrieve translation from the google spreadsheet
	retrieveTranslation(spreadsheetID) {
		Promise.all([
			this.getSheetData(spreadsheetID, 1), // UI
			this.getSheetData(spreadsheetID, 2), // Countries
			this.getSheetData(spreadsheetID, 3), // Countries' subdivions
			this.getSheetData(spreadsheetID, 4), // Landcover
			this.getSheetData(spreadsheetID, 5) // Descriptions
		])
		.then(function(results) {
			let UI = xml2js(results[0]);
			let countries = xml2js(results[1]);
			let subdiv = xml2js(results[2]);
			let landcover = xml2js(results[3]);
			let descriptions = xml2js(results[4]);
			
			// rebuild the translation object
			UI = UI.reduce((acc, val) => {acc[val.param]=val.translation; return acc}, {});
			countries = countries.reduce((acc, val) => {acc[val.countryid]=val.countryname; return acc}, {});
			subdiv = subdiv.reduce((acc, val) => {acc[val.divid]=val.divname; return acc}, {});
			landcover = landcover.reduce((acc, val) => {acc[val.id]=val.desc; return acc}, {});

			// return data
			this.onLoad({
				ui: UI,
				countries: countries,
				subdiv: subdiv,
				landcover: landcover,
				descriptions: descriptions
			});
		}.bind(this))
		.catch(function (error) {
			console.log(error); // handle error
		});
	}

	// get data from google spreadsheet
	getSheetData(sheetID, sheetNumber) {
		return axios.get(this.getSpreadsheetURL(sheetID,sheetNumber));
	}

	// returns google spreadsheet url based on provided id and sheet num
	getSpreadsheetURL(id, num) {
		return `https://spreadsheets.google.com/feeds/list/${id}/${num}/public/full?alt=json`
	}
}

export default LanguageManager;