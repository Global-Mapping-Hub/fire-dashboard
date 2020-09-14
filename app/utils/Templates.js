//===========//
// templates //
//===========//
// template for top10
export function top10_template() {
	var html = '<div class="top10_title_style">Top burning areas</div>';
	return html;
}

// template for stats
export function landcover_template() {
	var html = '<div class="landcover_title_style" data-tippy-content="Type of land being burned">Landcover</div>';
	return html;
}

// modal map info obj
export const mapDescriptions = {
	'hotspots': {
		title: 'MODIS hotspots',
		content: 'Active fire detections and thermal anomalies (such as volcanoes and gas flares). Fires can be set naturally, such as by lightning, or by humans, whether intentionally or accidentally.',
		authors: 'LANCE FIRMS operated by the NASA/GSFC/Earth Science Data and Information System (ESDIS) with funding provided by NASA/HQ',
		source: 'https://earthdata.nasa.gov/earth-observation-data/near-real-time/firms/active-fire-data'
	},
	'gfstemp': {
		title: 'Temperature (48h)',
		content: 'Temperature 2m above the surface. Actual temperature is influenced by many factors like mountains, convective clouds and cities. The data is provided by GFS, which is a basic free model provided by National Oceanic and Atmospheric Administration (NOAA).',
		authors: 'National Oceanic and Atmospheric Administration (NOAA)',
		source: 'https://nomads.ncep.noaa.gov/'
	},
	'gfsprecip': {
		title: 'Precipitation (48h)',
		content: 'Rain/snow accumulation in the last 3 hours. The data is provided by GFS, which is a basic free model provided by National Oceanic and Atmospheric Administration (NOAA).',
		authors: 'National Oceanic and Atmospheric Administration (NOAA)',
		source: 'https://nomads.ncep.noaa.gov/'
	},
	'gfswind': {
		title: 'Wind (48h)',
		content: 'Wind 10 meters above the surface in the last 3 hours. Actual wind at the ground is influenced by so many factors like mountains, cities and thermal effects. The data is provided by GFS, which is a basic free model provided by National Oceanic and Atmospheric Administration (NOAA).',
		authors: 'National Oceanic and Atmospheric Administration (NOAA)',
		source: 'https://nomads.ncep.noaa.gov/'
	},
	'esaland': {
		title: 'Land Cover data',
		content: 'The most recent data products from the Climate Change Initiative Land Cover team, led by the Université catholique de Louvain. The purpose of the CCI Land Cover project is to make the best use of available satellite sensor data to provide an accurate land-cover classification that can serve the climate modelling community. This global land-cover map was created using data from the Envisat mission for the 2010 epoch (2008–12).',
		authors: 'ESA Climate Change Initiative - Land Cover led by UCLouvain (2017)',
		source: 'http://maps.elie.ucl.ac.be/CCI/viewer/download.php'
	},
	'osm': {
		title: 'OpenStreetMap',
		content: 'OpenStreetMap (OSM) is an open collaborative project to create a free editable map of the world. Volunteers gather location data using GPS, local knowledge, and other free sources of information and upload it. The resulting free map can be viewed and downloaded from the OpenStreetMap site: OpenStreetMap.org',
		authors: 'OpenStreetMap contributors',
		source: 'https://www.openstreetmap.org/'
	},
	'modissat': {
		title: 'Terra MODIS (Corrected Reflectance, True Color)',
		content: 'MODIS imagery from the Terra satellite with a resolution of 1km delivered daily. These images are called true-color or natural color because this combination of wavelengths is similar to what the human eye would see. The images are natural-looking images of land surface, oceanic and atmospheric features. The downside of this set of bands is that they tend to produce a hazy image.',
		authors: 'NASA EOSDIS GIBS',
		source: 'https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs'
	},
	'esrisat': {
		title: 'ESRI World Imagery',
		content: 'World Imagery provides one meter or better satellite and aerial imagery in many parts of the world and lower resolution satellite imagery worldwide. The map includes 15m TerraColor imagery at small and mid-scales and 2.5m SPOT Imagery for the world, and USGS 15m Landsat imagery for Antarctica. The map features 0.3m resolution imagery in the continental United States and 0.6m resolution imagery in parts of Western Europe from Digital Globe. In other parts of the world, 1 meter resolution imagery is available from GeoEye IKONOS, AeroGRID, and IGN Spain. Additionally, imagery at different resolutions has been contributed by the GIS User Community.',
		authors: 'Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
		source: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9'
	},
	'treecover': {
		title: 'Tree Cover (2000)',
		content: `This data set, a collaboration between the GLAD (Global Land Analysis & Discovery) lab at the University of Maryland, Google, USGS, and NASA, displays tree cover over all global land (except for Antarctica and a number of Arctic islands) for the year 2000 at 30 × 30 meter resolution. Data in this layer were generated using multispectral satellite imagery from the Landsat 7 thematic mapper plus (ETM+) sensor. The clear surface observations from over 600,000 images were analyzed using Google Earth Engine, a cloud platform for earth observation and data analysis, to determine per pixel tree cover using a supervised learning algorithm. The tree cover canopy density of the displayed data varies according to the selection.`,
		authors: 'Hansen/UMD/Google/USGS/NASA, accessed through Global Forest Watch',
		source: 'https://glad.umd.edu/dataset/global-2010-tree-cover-30-m'
	},
	'treecover_loss': {
		title: 'Tree Cover Loss (2000–2019)',
		content: `In this data set, "tree cover" is defined as all vegetation greater than 5 meters in height, and may take the form of natural forests or plantations across a range of canopy densities. "Loss" indicates the removal or mortality of tree cover and can be due to a variety of factors, including mechanical harvesting, fire, disease, or storm damage. As such, "loss" does not equate to deforestation. Due to variation in research methodology and date of content, tree cover, loss, and gain data sets cannot be compared accurately against each other. Accordingly, "net" loss cannot be calculated by subtracting figures for tree cover gain from tree cover loss, and current (post-2000) tree cover cannot be determined by subtracting figures for annual tree cover loss from year 2000 tree cover.`,
		authors: 'Hansen/UMD/Google/USGS/NASA, accessed through Global Forest Watch',
	},
	'wdpa': {
		title: 'Simplified World Database on Protected Areas',
		content: 'Simplified using Douglas–Peucker algorithm, 150 meter tolerance. The World Database on Protected Areas, which compiles protected area data from governments, NGOs, and international secretariats. Last update: September 2020',
		authors: 'IUCN and UNEP-WCMC (2016), The World Database on Protected Areas (WDPA) [On-line], Cambridge, UK: UNEP-WCMC. Available at: www.protectedplanet.net.',
		source: 'https://www.protectedplanet.net/'
	},
	'plantations': {
		title: '',
		content: 'This dataset is a compilation of planted trees data from a variety of countries and sources. As a result, there are definitional and temporal inconsistencies within the database, as well as an absence of a uniform accuracy assessment and incomplete spatial coverage, notably in Canada, Russia and countries in Africa.',
		authors: 'Harris, N., E. Goldman and S. Gibbes. 2018. “Spatial Database of Planted Trees (SDPT) Version 1.0.” Washington, DC: World Resources Institute.',
		source: 'http://data.globalforestwatch.org/datasets/planted-forests'
	},
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
export function linechartOptions(out, date) {
	const currentYear = parseInt(date.split('-')[0]);
	return {
		series: [{
			name: 'Hotspots',
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
			text: [`${currentYear} hotspots (10-day moving average) `, `vs.`, `Long-term averages (2001-${currentYear})`],
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
				text: 'hotspots count'
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
export function landcoverChartOptions(data, categories) {
	return {
		type: 'bar',
		data: {
			labels: categories,
			datasets: [{
				label: '# of hotspots',
				data: data,
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
export function topChartOptions(data, categories) {
	return {
		type: 'bar',
		data: {
			labels: categories,
			datasets: [{
				label: '# of hotspots',
				data: data,
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