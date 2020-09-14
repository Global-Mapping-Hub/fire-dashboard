import Pikaday from 'pikaday';
import moment from 'moment';
import * as Sentry from '@sentry/browser';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css';
import 'select2/dist/css/select2.min.css';
import 'pikaday/css/pikaday.css';
import 'tippy.js/dist/tippy.css';
import 'apexcharts/dist/apexcharts.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-velocity/dist/leaflet-velocity.min.css';
import '../lib/style.css'

import Map from './components/Map/Map';
import InfoModal from './components/Map/InfoModal';
import Calendar from './components/FireCalendarBlock';
import Description from './components/DescriptionBlock';
import Top10Block from './components/Top10';
import ControlPanel from './components/ControlPanel';
import ChartsData from './components/ChartsData';
import QuickStats from './components/QuickStats';
import DebugPanel from './components/DebugPanel';
import LandcoverStats from './components/LandcoverStats';
import {tippyInit} from './utils/Utilities';

class App {
	constructor() {
		// global date vars
		this.today = new Date();

		// stats vars
		this.date = moment(this.today).format('YYYY-MM-DD');
		this.cid = 1000; // country id - world
		this.divid = 0; // division id
	}
	// dashboard blocks
	initElements() {
		// load debug after map load
		this.map = new Map(this.date, this.cid, this.divid, function() {
			this.debug = new DebugPanel(); // on successful map init
		}.bind(this));

		this.ctrlPanel = new ControlPanel();
		this.top10 = new Top10Block(this.date, this.cid);
		this.qstats = new QuickStats(this.date, this.cid, this.divid);
		this.lcstats = new LandcoverStats(this.date, this.cid, this.divid);
		this.description = new Description();
		this.mapModal = new InfoModal();
		this.fireCalendera = new Calendar();
		this.allCharts = new ChartsData();
	}

	// do all of this on country change
	countryChangeHandler(e) {
		// set values
		this.cid = parseInt(e);
		this.divid = 0;

		// zoom to map
		this.map.zoomToFeature(e);

		// update country divisions
		this.ctrlPanel.requestCountryDivisions(this.cid);
		// update description
		this.description.setCountry(this.cid);
		// update charts
		this.allCharts.setParams(this.date, this.cid, this.divid);
		// update the rest
		this.componentDidUpdate();
	}

	// init control elements
	initControls() {
		// init pikaday | datetime picker
		this.datepickerDOM = document.getElementById('datepicker');
		this.datepickerDOM.value = moment().format('YYYY-MM-DD');
		this.picker = new Pikaday({
			field: this.datepickerDOM,
			maxDate: this.today,
			firstDay: 1, // monday
			onSelect: function(date) {
				this.date = moment(date).format('YYYY-MM-DD');
				this.componentDidUpdate();
			}.bind(this)
		});

		// init country dropdown
		this.countryList = document.getElementById('country_input');
		this.countryList.onchange = function(e) {
			this.countryChangeHandler(e.target.value);
		}.bind(this)

		// divisions dropdown list
		this.divisionsList = document.getElementById('divisions_input');
		this.divisionsList.onchange = function(e) {
			//set values
			this.divid = parseInt(e.target.value);
			// default to 0, if 'world'
			if (this.cid == 1000) { this.divid = 0; }
			// update charts
			this.allCharts.setParams(this.date, this.cid, this.divid);
			// update the rest
			this.componentDidUpdate();
		}.bind(this)

		// init tippy tooltips
		tippyInit();


		// modal info window for the map
		this.infoButtonsList = document.getElementsByClassName('info_question_mark');
		this.infoModalClose = document.getElementById('map_info_modal_close');
		for (var i = 0; i < this.infoButtonsList.length; i++) {
			this.infoButtonsList[i].onclick = function(e) {
				this.mapModal.show(e.target.dataset.content);
			}.bind(this)
		}
		// close map info modal
		this.infoModalClose.onclick = function() {
			this.mapModal.hide()
		}.bind(this);


		// global modal with dashboard info
		this.globalModal = document.getElementById('global_modal_wrapper');
		this.globalModalBtn = document.getElementById('global_info_btn');
		this.globalModalBtn.onclick = function() {
			this.globalModal.style.display = 'block';
		}.bind(this);

		// close info modal
		this.globalModalClose = document.getElementById('global_modal_close');
		this.globalModalClose.onclick = function() {
			this.globalModal.style.display = 'none';
		}.bind(this);
	}

	// if anything in control panel changes, then do this monstrosity
	componentDidUpdate() {
		this.map.setParams(this.date, this.cid, this.divid);
		this.top10.setDate(this.date, this.cid, function() {
			console.log('top10 loaded');
			this.lcstats.setParams(this.date, this.cid, this.divid, function() {
				console.log('landcover loaded');
				this.qstats.setParams(this.date, this.cid, this.divid, function() {
					console.log('quickstats loaded');
				}.bind(this));
			}.bind(this));
		}.bind(this));
		
		// re-init tippy in case new elements appeared
		tippyInit();
	}
}

// init Sentry SDK
Sentry.init({ dsn: 'https://55c10f285c824401b073da5b9a57fc6b@o384079.ingest.sentry.io/5253655' });

// app init
var app = new App();
	app.initElements();
	app.initControls();

// personal attribution
console.log({author:"fixxy", conrtib:{code:"99%", design:"95%"}, contacts:""});