import Chart from 'chart.js';

import {landcover_template, LCPlaceholder, landcoverChartOptions} from '../utils/Templates';
import api from '../utils/API';

class LandcoverStats {
	constructor(props) {
		// init vars
		this.UI = props.translation.ui;
		this.UILandcover = props.translation.landcover;
		this.date = props.date;
		this.cid = props.cid;
		this.divid = props.divid;
		this.emptyMessage = `<div class="nodata">${this.UI.landcover_nodata}</div>`;

		// dom elements
		this.block = document.getElementById('landcover_stats');
		this.chartDom = document.getElementById('landcover_chart');
		this.chartDom.style.display = 'none';
		this.chartPlaceholder = document.getElementById('landcover_placeholder');
		this.chartPlaceholder.innerHTML = LCPlaceholder;
		this.requestData();
	}
	setParams(date, cid, divid, successCallback) {
		this.chartDom.style.display = 'none';
		this.chartPlaceholder.innerHTML = LCPlaceholder;
		this.date = date;
		this.cid = cid;
		this.divid = divid;
		this.requestData(successCallback);
	}
	requestData(successCallback) {
		api.post(`/landcover`, {
			date: this.date,
			cid: this.cid,
			divid: this.divid
		}).then(function(resp) {
			// default template
			this.block.innerHTML = landcover_template(this.UI.landcover_hover, this.UI.header_landcover);

			// if there is no data
			if (!resp.data.length) {
				// set msg and hide chart
				this.chartDom.style.display = 'none';
				this.chartPlaceholder.innerHTML = this.emptyMessage;
			} else {
				// go over data and send it do init the chart
				let dataArray = [];
				let categoriesArray = [];
				resp.data.forEach(function(el) {
					dataArray.push(parseInt(el.count));
					let id = parseInt(el.id);
					let retrievedName = this.UILandcover[id];
					categoriesArray.push(retrievedName);
				}.bind(this));

				// check if graph exists
				if (!this.barChart) {
					// create a new graph
					this.chartPlaceholder.innerHTML = '';
					this.chartDom.style.display = 'block';

					this.barChart = new Chart(this.chartDom.getContext('2d'), landcoverChartOptions(dataArray, categoriesArray, this.UI.barchart_hover));
				} else {
					// update existing graph
					this.chartPlaceholder.innerHTML = '';
					this.chartDom.style.display = 'block';
					
					// update data
					this.barChart.data.labels = categoriesArray;
					this.barChart.config.data.datasets[0].data = dataArray;
					this.barChart.update();
				}
			}

			if(successCallback)successCallback();
		}.bind(this)).catch(function(err) {
			console.log(err);
		});
	}
}

export default LandcoverStats;