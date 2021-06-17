import moment from 'moment';
import ApexCharts from 'apexcharts';
import axios from 'axios';

import api from '../utils/API';
import {linechartOptions} from '../utils/Templates';

class ChartsData {
	constructor(props) {
		// props
		this.UI = props.translation.ui;

		// dom elements
		this.chartDom = document.getElementById('chart_line');
		this.placeholder = document.getElementById('chart_placeholder');
		this.placeholderText = document.getElementById('chart_placeholder_text');
		this.placeholderText.innerText = this.UI.linechart_loading;
		
		this.chartDescription = document.getElementById('chart_description');
		this.chartDescription.innerText = this.UI.linechart_description;

		// call handlers to be able to cancel
		this.call, this.call2;

		// reset graph
		this.reset();
	}
	setParams(date, cid, divid) {
		if (cid != 1000) {
			// get vars
			this.date = date;
			this.cid = cid;
			this.divid = divid;
			
			// show placeholder and hide chart block
			this.placeholder.style.display = 'block';
			this.chartDom.style.display = 'none';

			// get the data
			this.requestData();
		} else {
			this.reset();
		}
	}
	reset() {
		this.hideInfo();
		try {this.lineChart.destroy()} catch {}
		this.lineChart = null;
		this.placeholder.style.display = 'none';
		this.chartDom.style.removeProperty('min-height'); // in case there was a chart here previously
		this.chartDom.innerHTML =	`<div class="country_placeholder_block">
										<div class="country_placeholder_text">${this.UI.linechart_placeholder}</div>
										<div class="country_placeholder_background"></div>
									</div>`;
	}
	requestData() {
		this.requestDataHandler('/mainstats', function() {
			this.requestAveragesHandler('/allavgstats');
		}.bind(this));
	}

	// request main data handler, cancels previous request
	requestDataHandler(url, successCallback) {
		if (this.call) this.call.cancel("Only one request allowed at a time.");
		this.call = axios.CancelToken.source();
		return api.post(url, { date: this.date, cid: this.cid, divid: this.divid }, {cancelToken: this.call.token}).then(function(res) {
			let data = this.removeUnnecessaryData(res.data);

			// check if graph exists
			if (!this.lineChart) {
				// create a new graph
				this.lineChart = new ApexCharts(this.chartDom, linechartOptions(data, this.date, this.UI));
				this.lineChart.render();
			} else {
				// update existing graph
				ApexCharts.exec('linechart', 'updateSeries', [{
					data: data
				}], true);
			}
			if(successCallback)successCallback();
		}.bind(this)).catch(function(err) {
			console.log(err);
		});
	};

	// remove everything after today
	removeUnnecessaryData(data) {
		// new object
		let newData = [];
		// foreach data entry for this year | x-date, y-count
		data.forEach(function(entry) {
			var today = moment();
			var entryDate = moment(entry.x);
			if (entryDate <= today) {
				newData.push({x: entry.x, y: entry.y});
			}
		})

		return newData;
	}
	
	// request avg data handler, cancels previous request
	requestAveragesHandler(url) {
		if (this.call2) this.call2.cancel("Only one request allowed at a time.");
		this.call2 = axios.CancelToken.source();
		return api.post(url, { cid: this.cid, divid: this.divid }, {cancelToken: this.call2.token}).then(function(res) {
			this.calcAvgData(res.data, function(data) {
				//console.log(data);
				let currentYear = new Date().getFullYear();
				this.lineChart.appendSeries({
					name: `${this.UI.linechart_legend_2} (2001-${currentYear})`,
					data: data
				});
				// hide placeholder and show chart block
				this.placeholder.style.display = 'none';
				this.chartDom.style.display = 'block';
				// also show description
				this.showInfo();
			}.bind(this))
		}.bind(this)).catch(function(err) {
			console.log(err);
		});
	}

	// go over dates and calculate how many hotspots and records in general there were
	calcAvgData(data, cb) {
		var outObject = {};
		var outArray = [];

		// divider, because we just sum all the values
		var divider = data.length;
		
		// foreach year
		data.forEach(function(el) {
			// foreach data entry for this year | x-date, y-count
			el.data.forEach(function(entry) {
				var entryDate = new Date(Date.parse(entry.x));
				var entryMonth = entryDate.getMonth() + 1;
				var entryDay = entryDate.getDate();
				var date = `${entryMonth.toString().padStart(2,'0')}${entryDay.toString().padStart(2,'0')}`;
				outObject[date] = ((outObject[date]) ? outObject[date] : 0) + entry.y/divider;
			});
		});

		// convert object to array
		Object.entries(outObject).forEach(function(obj, index) {
			var y = parseInt(this.date.split('-')[0]);
			var m = obj[0].substring(0, 2);
			var d = obj[0].substring(2, 4);
			// round up the average a little bit
			const roundedValue = Math.round(parseFloat(obj[1])*100)/100;
			outArray.push({'x':`${y}-${m}-${d}`, 'y':roundedValue});
		}.bind(this));

		// first thing's first, sort the array by date (monthday)
		outArray.sort(function(a, b) {
			var dateA = new Date(a.x);
			var dateB = new Date(b.x);
			return dateA - dateB;
		});
		
		// return the newly create array
		cb(outArray);
	}

	// show/hide the description
	showInfo() { this.chartDescription.style.display = 'block' }
	hideInfo() { this.chartDescription.style.display = 'none' }
}

export default ChartsData;