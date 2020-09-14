import Chart from 'chart.js';

import {top10_template, topPlaceholder, topChartOptions} from '../utils/Templates';
import api from '../utils/API';

class Top10Block {
	constructor(date, cid) {
		// init vars
		this.date = date;
		this.cid = cid;
		this.emptyMessage = `<div class="nodata">Either there are no hotposts or we can't see them because of clouds</div>`;

		// dom elements
		this.block = document.getElementById('top10_block');
		this.chartDom = document.getElementById('top10_chart');
		this.chartDom.style.display = 'none';
		this.chartPlaceholder = document.getElementById('top10_placeholder');
		this.chartPlaceholder.innerHTML = topPlaceholder;
		this.requestData();
	}
	setDate(date, cid, successCallback) {
		this.chartDom.style.display = 'none';
		this.chartPlaceholder.innerHTML = topPlaceholder;
		this.date = date;
		this.cid = cid;
		this.requestData(successCallback);
	}
	requestData(successCallback) {
		api.post(`/top10`, {
			date: this.date,
			cid: this.cid
		}).then(function(resp) {
			// default template
			this.block.innerHTML = top10_template();

			// if there is no data
			if (!resp.data.length) {
				//clear styling
				this.chartDom.style.display = 'none';
				this.chartPlaceholder.innerHTML = this.emptyMessage;
			} else {
				// go over data and send it do init the chart
				let dataArray = [];
				let categoriesArray = [];
				resp.data.forEach(function(el) {
					dataArray.push(parseInt(el.count));
					categoriesArray.push(el.name);
				});

				// check if graph exists
				if (!this.barChart) {
					// create a new graph
					this.chartPlaceholder.innerHTML = '';
					this.chartDom.style.display = 'block';

					this.barChart = new Chart(this.chartDom.getContext('2d'), topChartOptions(dataArray, categoriesArray));
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

export default Top10Block;