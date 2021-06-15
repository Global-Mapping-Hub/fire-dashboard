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

import GlobalModal from './components/GlobalModal';
import Map from './components/Map/Map';
import Calendar from './components/FireCalendarBlock';
import Description from './components/DescriptionBlock';
import Top10Block from './components/Top10';
import ControlPanel from './components/ControlPanel';
import ChartsData from './components/ChartsData';
import QuickStats from './components/QuickStats';
import DebugPanel from './components/DebugPanel';
import LandcoverStats from './components/LandcoverStats';
import {tippyInit} from './utils/Utilities';
import LanguageManager from './utils/Languages';

class App {
	constructor() {
		// global date vars
		this.today = new Date();

		// stats vars
		this.date = moment(this.today).format('YYYY-MM-DD');
		this.cid = 1000; // country id - world
		this.divid = 0; // division id
	}
	//
	loadLanguages(props) {
		// get translations
		let language = new LanguageManager({
			onLoad: props.onLoad
		});
		language.langCheck();
	}
	// dashboard blocks
	initElements(translation) {
		this.ctrlPanel = new ControlPanel({translation: translation});
		this.map = new Map({
			translation: translation,
			date: this.date,
			cid: this.cid,
			divid: this.divid,
			onInit: function() { new DebugPanel({translation: translation}) }
		});
		this.top10 = new Top10Block({
			translation: translation,
			date: this.date,
			cid: this.cid
		});
		this.qstats = new QuickStats({
			translation: translation,
			date: this.date,
			cid: this.cid,
			divid: this.divid
		});
		this.lcstats = new LandcoverStats({
			translation: translation,
			date: this.date,
			cid: this.cid,
			divid: this.divid
		});

		this.description = new Description({translation: translation}); // REWORK
		this.globalModal = new GlobalModal({translation: translation});
		this.fireCalendar = new Calendar({translation: translation});
		this.allCharts = new ChartsData({translation: translation});
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
		this.mapDatepickerDOM = document.getElementById('map_datepicker');
		this.mapDatepickerDOM.value = moment().format('YYYY-MM-DD');

		// main datepicker on the left-hand side
		new Pikaday({
			field: this.datepickerDOM,
			maxDate: this.today,
			firstDay: 1, // monday
			onSelect: function(date) {
				this.date = moment(date).format('YYYY-MM-DD');
				this.mapDatepickerDOM.value = this.date; // set date on the map date changer
				this.componentDidUpdate();
			}.bind(this)
		});

		// secondary datepicker which sits on the map and which is only visible in the fullscreen mode
		new Pikaday({
			field: this.mapDatepickerDOM,
			maxDate: this.today,
			firstDay: 1,
			onSelect: function(date) {
				let formattedDate = moment(date).format('YYYY-MM-DD');
				this.datepickerDOM.value = formattedDate;
				this.datepickerDOM.dispatchEvent(new Event('change'));
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
	}

	// if anything in control panel changes, then do this monstrosity
	componentDidUpdate() {
		this.map.setParams(this.date, this.cid, this.divid);
		this.top10.setDate(this.date, this.cid)
		.then(function() { return this.lcstats.setParams(this.date, this.cid, this.divid)}.bind(this))
		.then(function() { this.qstats.setParams(this.date, this.cid, this.divid) }.bind(this))
		
		// re-init tippy in case new elements appeared
		tippyInit();
	}
}

// init Sentry SDK
Sentry.init({ dsn: 'https://55c10f285c824401b073da5b9a57fc6b@o384079.ingest.sentry.io/5253655' });

// app init
let app = new App();
	app.loadLanguages({
		onLoad: function(translation) {
			app.initElements(translation);
			app.initControls();
		}
	})

// personal attribution
console.log({author:"fixxy", conrtib:{code:"99%", design:"95%"}, contacts:""});