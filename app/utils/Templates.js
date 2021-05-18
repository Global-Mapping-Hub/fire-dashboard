//===========//
// templates //
//===========//
// template for top10
export function top10_template(text) {
	return `<div class="top10_title_style">${text}</div>`;
}

// template for stats
export function landcover_template(info, text) {
	return `<div class="landcover_title_style" data-tippy-content="${info}">${text}</div>`;
}

// modal map info obj
export function mapDescriptions(ui) {
	return {
		'hotspots': {
			title: ui.layers_hotspots_info_header,
			content: ui.layers_hotspots_info_text,
			authors: ui.layers_hotspots_info_attr,
			source: 'https://earthdata.nasa.gov/earth-observation-data/near-real-time/firms/active-fire-data'
		},
		'gfstemp': {
			title: ui.layers_temperature_info_header,
			content: ui.layers_temperature_info_text,
			authors: ui.layers_temperature_info_attr,
			source: 'https://nomads.ncep.noaa.gov/'
		},
		'gfsprecip': {
			title: ui.layers_precipitation_info_header,
			content: ui.layers_precipitation_info_text,
			authors: ui.layers_precipitation_info_attr,
			source: 'https://nomads.ncep.noaa.gov/'
		},
		'gfswind': {
			title: ui.layers_wind_info_header,
			content: ui.layers_wind_info_text,
			authors: ui.layers_wind_info_attr,
			source: 'https://nomads.ncep.noaa.gov/'
		},
		'esaland': {
			title: ui.layers_landcover_info_header,
			content: ui.layers_landcover_info_text,
			authors: ui.layers_landcover_info_attr,
			source: 'http://maps.elie.ucl.ac.be/CCI/viewer/download.php'
		},
		'osm': {
			title: ui.layers_basemaps_scheme_info_header,
			content: ui.layers_basemaps_scheme_info_text,
			authors: ui.layers_basemaps_scheme_info_attr,
			source: 'https://www.openstreetmap.org/'
		},
		'modissat': {
			title: ui.layers_basemaps_lowrez_info_header,
			content: ui.layers_basemaps_lowrez_info_text,
			authors: ui.layers_basemaps_lowrez_info_attr,
			source: 'https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs'
		},
		'esrisat': {
			title: ui.layers_basemaps_highrez_info_header,
			content: ui.layers_basemaps_highrez_info_text,
			authors: ui.layers_basemaps_highrez_info_attr,
			source: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9'
		},
		'treecover': {
			title: ui.layers_treecover_info_header,
			content: ui.layers_treecover_info_text,
			authors: ui.layers_treecover_info_attr,
			source: 'https://glad.umd.edu/dataset/global-2010-tree-cover-30-m'
		},
		'treecover_loss': {
			title: ui.layers_treecover_loss_info_header,
			content: ui.layers_treecover_loss_info_text,
			authors: ui.layers_treecover_loss_info_attr,
		},
		'wdpa': {
			title: ui.layers_protected_areas_info_header,
			content: ui.layers_protected_areas_info_text,
			authors: ui.layers_protected_areas_info_attr,
			source: 'https://www.protectedplanet.net/'
		}
	}
}

//======================//
// loading placeholders //
//======================//
// quick stats
export const qsPlaceholder = `<div class="ph-item">
								<div class="ph-col-12">
									<div class="ph-row">
										<div class="ph-image"></div>
									</div>
								</div>
							</div>`;
// top10 block
export const topPlaceholder = `<div class="ph-item">
									<div class="ph-col-12">
										<div class="ph-row">
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
										</div>
									</div>
								</div>`;
// landcover block
export const LCPlaceholder = `<div class="ph-item">
									<div class="ph-col-12">
										<div class="ph-row">
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
											<div class="ph-col-12"></div><div class="ph-col-12"></div>
										</div>
									</div>
								</div>`;


//=================//
// charts' options //
//=================//
export function linechartOptions(out, date, ui) {
	const currentYear = parseInt(date.split('-')[0]);
	return {
		series: [{
			name: ui.linechart_legend_1,
			data: out
		}],
		chart: {
			id: 'linechart',
			theme: 'dark',
			type: 'area',
			stacked: false,
			height: 350,
			zoom: {
				type: 'x',
				enabled: true,
				autoScaleYaxis: true
			},
			toolbar: {
				autoSelected: 'zoom',
				show: false,
			}
		},
		dataLabels: {
			enabled: false
		},
		title: {
			text: [`${currentYear} ${ui.linechart_title_line1} `, `${ui.linechart_title_line2}`, `${ui.linechart_title_line3} (2001-${currentYear})`],
			align: 'center',
			offsetX: 0,
			offsetY: 10,
		},
		stroke: {
			width: 2,
		},
		colors: ['#F44336', '#f4a236'], // charts colours
		fill: {
			colors: ['#F44336', '#E91E63', '#9C27B0'],
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				inverseColors: false,
				opacityFrom: 0.5,
				opacityTo: 0,
				stops: [0, 90, 100]
			},
		},
		markers: {
			size: 0,
		},
		yaxis: {
			labels: {
				formatter: function (val) {
					return Math.round(val*100)/100; // round it up
				},
			},
			title: {
				text: ui.linechart_axis
			},
		},
		xaxis: {
			type: 'datetime',
		},
		tooltip: {
			theme: 'dark',
			shared: false,
			y: {
				formatter: function (val) {
					return (val)
				}
			}
		},
		legend: {
			offsetY: 5,
			fontSize: '14px',
		}
	}
};


//====================//
// landcover barchart //
//====================//
export function landcoverChartOptions(_data, categories, _label) {
	return {
		type: 'bar',
		data: {
			labels: categories,
			datasets: [{
				label: _label,
				data: _data,
				backgroundColor: '#ffbe41',
				borderColor: '#ffbe41',
				borderWidth: 1
			}]
		},
		options: {
			legend: {
				display: false
			},
			//responsive: true,
			scales: {
				xAxes: [{
					barPercentage: 0.4,
					ticks: {
						fontColor: "white",
						maxRotation: 90,
						minRotation: 80
					}
				}],
				yAxes: [{
					display: false,
					ticks: {
						fontColor: "white",
						beginAtZero: true
					}
				}]
			}
		}
	}
}


//==========================//
// top10 barcharts defaults //
//==========================//
export function topChartOptions(_data, categories, _label) {
	return {
		type: 'bar',
		data: {
			labels: categories,
			datasets: [{
				label: _label,
				data: _data,
				backgroundColor: '#ffbe41',
				borderColor: '#ffbe41',
				borderWidth: 1
			}]
		},
		options: {
			legend: {
				display: false
			},
			//responsive: true,
			scales: {
				xAxes: [{
					barPercentage: 0.4,
					ticks: {
						fontColor: "white",
						maxRotation: 90,
						minRotation: 80
					}
				}],
				yAxes: [{
					display: false,
					ticks: {
						fontColor: "white",
						beginAtZero: true
					}
				}]
			}
		}
	}
}