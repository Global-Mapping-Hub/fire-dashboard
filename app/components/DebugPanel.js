import moment from 'moment';
import axios from 'axios';

import {tippyInit} from '../utils/Utilities';

class DebugPanel {
	constructor(props) {
		this.UI = props.translation.ui;
		// get dom elements
		this.wrapper = document.getElementById('debug_wrapper');
		this.hsMeta = document.getElementById('last_hs_update')
		this.gfsMetaLast = document.getElementById('last_gfs_update')
		this.gfsMetaNext = document.getElementById('next_gfs_update')

		// init vars
		this.geotiffFolder = `/data/gfs`;
		this.cacheBypass = new Date().getTime();

		// init default params
		this.initHSMeta();
		this.requestGFSMeta();
	}
	initHSMeta() {
		// update counter every minute
		var x = setInterval(function() {
			// get current minutes
			var timeLeft = 60 - new Date().getMinutes();
			this.hsMeta.innerHTML = `${this.UI.hotspots_next_update} <strong>${timeLeft}min</strong>`
		}.bind(this), 1000);
	}
	requestGFSMeta() {
		// extend date to add hours
		Date.prototype.addHours = function(h) {
			this.setTime(this.getTime() + (h*60*60*1000));
			return this;
		}

		// request
		axios.get(`${this.geotiffFolder}/meta.json?ver=${this.cacheBypass}`).then(function(res) {
			// last gfs data update
			var lastUpdate = new Date(Date.parse(res.data.last_update));
			this.gfsMetaLast.innerHTML = `${this.UI.map_gfs_update}:<br>${moment(lastUpdate).format('YYYY-MM-DD HH:mm')} UTC`;
			// init tooltips
			tippyInit();

			// get timezone offset | in minutes, so divide by 60, and multiply by -1 for easier use
			var offset = new Date().getTimezoneOffset()/-60;

			// next update is 4 hours after last (every 4 hours)
			var nextUpdate = lastUpdate.addHours(4);
			var nextUpdateFixed = nextUpdate.addHours(offset);

			// update counter every minute
			var x = setInterval(function() {
				// time calculations for hours and minutes
				var now = new Date(new Date().toUTCString()); // right now
				var delta = nextUpdateFixed - now; // how much time is left
				var hours = Math.floor((delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
				// insert data
				//this.gfsMetaNext.innerHTML = `Next GFS update in <strong>${(hours) ? `${hours}h` : ''} ${minutes}m</strong>`
			}.bind(this), 1000);
		}.bind(this)
		).catch(function(err) {
			console.log(err);
		});
	}
}

export default DebugPanel;