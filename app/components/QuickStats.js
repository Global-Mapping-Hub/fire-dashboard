import axios from 'axios';

import api from '../utils/API';
import {qsPlaceholder} from '../utils/Templates';
import {tippyInit} from '../utils/Utilities';

class QuickStats {
	constructor(date, cid, divid) {
		// init vars
		this.date = date;
		this.cid = cid;
		this.divid = divid;

		// init call handler to be able to cancel this slow request
		this.call;

		//init country list
		this.block = document.getElementById('quick_stats');
		this.block.innerHTML = qsPlaceholder;
		this.requestCountry();
	}

	setParams(date, cid, divid, successCallback) {
		// init vars
		this.date = date;
		this.cid = cid;
		this.divid = divid;
		this.requestCountry(successCallback);
	}

	requestCountry(successCallback) {
		// change to placeholder
		this.block.innerHTML = qsPlaceholder;

		// do the request
		this.getStats = this.requestCountryHandler(successCallback);
		this.getStats('/quickstats');
	}
	requestCountryHandler(successCallback) {
		// quick stats on an actual number hotspots vs average
		return function(url) {
			// call shenanigans
			if (this.call) this.call.cancel("Only one request allowed at a time.");
			this.call = axios.CancelToken.source();

			// init vars
			var year = this.date.split('-')[0],
				month = this.date.split('-')[1],
				day = this.date.split('-')[2];

			// do a post request
			return api.post(url, {
				year: year,
				month: month,
				day: day,
				cid: this.cid,
				divid: this.divid
			}, {cancelToken: this.call.token}).then(function(res) {
				// get today's value
				var todayNum = 0;
				res.data.annual.forEach(function(entry) {
					if (entry.year === year) {
						todayNum = parseInt(entry.count);
					}
				});
				// get average 
				const avgNum = parseInt(res.data.avgsum);
	
				// insert html result
				this.block.innerHTML = `
					<div id="quick_stats_main" class="${(todayNum > avgNum) ? 'high' : 'low'}">${todayNum}</div>
					<div id="quick_stats_avg" data-tippy-content="average on this day">${avgNum}</div>
				`;
				// init tooltips
				tippyInit();

				if(successCallback)successCallback();
			}.bind(this)).catch(function(err) {
				console.log(err);
			});
		}.bind(this);
	}
}

export default QuickStats;