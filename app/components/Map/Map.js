import $ from 'jquery'
import 'bootstrap';
import Slider from 'bootstrap-slider';
import axios from 'axios';
import chroma from 'chroma-js';

import L from 'leaflet';
import 'leaflet-ajax';
import 'leaflet-mouse-position';
import 'leaflet.vectorgrid';
import 'leaflet-tilelayer-pixelfilter';
import 'leaflet-velocity';
import 'georaster';
import 'georaster-layer-for-leaflet';

import colorLegend from '../ColorLegend';
import Notification from './Notification';
import SidebarLegend from './SidebarLegend';
import {NASAGIBSLayer} from '../../utils/WMSLayers';
import {TreeCover} from '../../utils/TileLayers';

class Map {
	constructor(date, cid, divid, cb) {
		// init a new map
		this.map = new L.Map('map', {minZoom: 1});

		// panes
		this.map.createPane('basemaps');
		this.map.getPane('basemaps').style.zIndex = 240;
		this.map.createPane('gfs');
		this.map.getPane('gfs').style.zIndex = 245;
		this.map.createPane('hotspots');
		this.map.getPane('hotspots').style.zIndex = 405;
		this.map.createPane('borders');
		this.map.getPane('borders').style.zIndex = 410;
		this.map.createPane('labels');
		this.map.getPane('labels').style.zIndex = 415;

		// set default params
		this.date = date;
		this.cid = cid;
		this.divid = divid;
		this.pbfSource = 'https://maps.greenpeace.org/api/vtiles/rpc/dashboard.hotspots/{z}/{x}/{y}.pbf';
		this.blockCountryPicker = false;

		// gfs color legends
		this.temperatureLegend = new colorLegend('gfs_temp_legend', 'TEMP.', '°C');
		this.precipitationLegend = new colorLegend('gfs_precip_legend', 'PRECIP.', 'mm');

		// notification
		this.notification = new Notification();

		// GFS data related
		// calculate which gfs hour to show by default
		const currentUTCHour = new Date().getUTCHours();
		this.gfstime = currentUTCHour - (currentUTCHour % 3); // get the closest divisable integer that is less than or equal to
		this.cacheBypass = new Date().getTime();
		this.geotiffFolder = `/data/gfs`;

		// show mouse coordinates
		//L.control.mouseCoordinate({gps: true, gpsLong: false}).addTo(this.map);
		L.control.mousePosition({
			position: 'bottomright',
			separator: ', ',
			emptystring: ' '
		}).addTo(this.map);

		// add db hotspots and tile layers on map load
		this.map.on('load', function() {
			// init all map layers
			this.addHotspots();
			this.initControls();
			this.initTileLayers();
			this.initTileLayerInteractions();
			this.initGFSSettings();
			this.initDebug();

			// success callback
			cb();
		}.bind(this));

		// show map overview
		this.defaultMapView();

		/* 
		* Workaround for 1px lines appearing in some browsers due to fractional transforms
		* and resulting anti-aliasing.
		* https://github.com/Leaflet/Leaflet/issues/3575
		*/
		var originalInitTile = L.GridLayer.prototype._initTile
		L.GridLayer.include({
			_initTile: function (tile) {
				originalInitTile.call(this, tile);
				var tileSize = this.getTileSize();
				tile.style.width = tileSize.x + 1 + 'px';
				tile.style.height = tileSize.y + 1 + 'px';
			}
		});
	}
	defaultMapView() {
		//this.map.setView([51.73, 45.20], 1);
		this.map.fitWorld();
	}
	zoomToFeature(id) {
		this.world_borders.eachLayer(function(layer) {
			// find a country with the same id
			if (parseInt(id) === 1000) { // if world
				this.defaultMapView();
			} else if (parseInt(id) === layer.feature.properties.ID_0) {
				// fly to bounds
				this.map.flyToBounds(layer.getBounds());
			}
		}.bind(this));
	}


	// set component params
	setParams(date, cid, divid) {
		this.date = date;
		this.cid = cid;
		this.divid = divid;
		this.updateHotspots();
		this.updateTileLayers();
	}


	// init custom map buttons and other map controls
	initSwiper(firstTick) {
		// ===
		// bootstrap slider
		this.timelineWrapper = document.getElementById('timeline_wrapper');
		this.timelineSlider = new Slider('#timelineSlider', {
			//tooltip: 'hide',
			tooltip: 'always',
			tooltip_position: 'top',
			min: 0, // today 00 utc
			max: 15, // tomorrow 21 utc
			step: 1,
			value: firstTick,
			formatter: function(val) {
				let value = val*3;
				let tooltipText = `${(value <= 21) ? 'Today' : 'Tomorrow'}, ${(value <= 21) ? value : value-24}:00 UTC`;
				return tooltipText;
			},
		});
		// on value change
		this.timelineSlider.on('slideStop', function(val) {
			// set params and update raster
			this.gfstime = val*3;
			this.updateGFSLayers();
		}.bind(this));
	}

	// init control elements
	initControls() {
		// custom map buttons
		var layers_block = document.getElementById('layers_block');
		var layers_block_close = document.getElementById('layers_block_close');
			layers_block_close.onclick = function() {
				layers_block.style.display = 'none';
			}

		// init timeline slider
		this.initSwiper(this.gfstime/3);
		this.updateGFSLayers();

		// map buttons
		const settingsBtn = L.Control.extend({
			options: {
				position: 'topleft' 
			},
			onAdd: function() {
				var button = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-custom-button leaflet-settings');
				L.DomEvent.disableClickPropagation(button); // so you can't click through
				button.onclick = function() {
					if (getComputedStyle(layers_block).display == 'none') {
						layers_block.style.display = 'block';
					} else {
						layers_block.style.display = 'none';
					}
				}
				return button;
			}
		});
		this.map.addControl(new settingsBtn);


		// button to enlarge the map
		this.mapIsBigNow = false;
		const mapContainer = document.querySelector('.map_wrapper');
		const mapElement = document.getElementById('map');

		const enlargeMapBtn = L.Control.extend({
			options: {
				position: 'bottomright' 
			},
			onAdd: function() {
				var button = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-custom-button leaflet-size-control');
				L.DomEvent.disableClickPropagation(button); // so you can't click through
				button.onclick = function() {
					if (!this.mapIsBigNow) {
						button.classList.add('leaflet-size-control-big')
						mapContainer.classList.add('fullscreen')
						mapElement.style.height = '100%';
						this.mapIsBigNow = true;
						this.map.setView([27.99440, 17.55934], 2);
					} else {
						button.classList.remove('leaflet-size-control-big')
						mapContainer.classList.remove('fullscreen')
						mapElement.style.removeProperty('height');
						this.mapIsBigNow = false;
					}
					// invalidate the size no matter what
					this.map.invalidateSize();
				}.bind(this)
				return button;
			}.bind(this)
		});
		this.map.addControl(new enlargeMapBtn);


		//===============================//
		// show more/less layers routine //
		//===============================//
		this.moreLayersBoolean = false;
		this.morelessToggle = document.getElementById('more_layer_btn');
		this.moreLayers = document.getElementById('layers_more');
		this.morelessToggle.onclick = function() {
			if (this.moreLayersBoolean) {
				// hide
				this.moreLayers.style.display = 'none';
				this.morelessToggle.innerText = 'more layers >';
				this.moreLayersBoolean = false;
			} else {
				// show
				this.moreLayers.style.display = 'block';
				this.morelessToggle.innerText = '< less layers';
				this.moreLayersBoolean = true;
			}
		}.bind(this);


		//============================//
		// layer toggle controls here //
		// toggles
		//============================//
		// data
		this.hotspots_switch = document.getElementById('hotspots_switch');
		this.gfs_temp_switch = document.getElementById('gfs_temp_switch');
		this.gfs_precip_switch = document.getElementById('gfs_precip_switch');
		this.gfs_wind_switch = document.getElementById('gfs_wind_switch');
		this.lc_switch_full = document.getElementById('lc_switch_full');

		// basemaps
		this.medsat_switch = document.getElementById('medsat_switch');
		this.highsat_switch = document.getElementById('highsat_switch');
		this.osm_switch = document.getElementById('osm_switch');

		// more layers
		this.treecover_switch = document.getElementById('treecover_switch');
		this.treecoverloss_switch = document.getElementById('treecoverloss_switch');
		this.wdpa_switch = document.getElementById('wdpa_switch');


		// toggles - onchange
		// imagery and data
		// hotspots
		this.hotspots_switch.onchange = function(e) {
			(e.target.checked) ? this.hotspotsLayer.addTo(this.map) : this.hotspotsLayer.removeFrom(this.map);
		}.bind(this)

		// modis terra
		this.medsat_switch.onchange = function(e) {
			(e.target.checked) ? this.modis_terra.getLayer().addTo(this.map) : this.modis_terra.getLayer().removeFrom(this.map);
		}.bind(this)

		// esri imagery
		this.highsat_switch.onchange = function(e) {
			(e.target.checked) ? this.esriSatImg.addTo(this.map) : this.esriSatImg.removeFrom(this.map);
		}.bind(this)

		// osm scheme
		this.osm_switch.onchange = function(e) {
			(e.target.checked) ? this.osm.addTo(this.map) : this.osm.removeFrom(this.map);
		}.bind(this)

		// protected areas (wdpa)
		this.wdpa_switch.onchange = function(e) {
			(e.target.checked) ? this.wdpa.addTo(this.map) : this.wdpa.removeFrom(this.map);
		}.bind(this)

		// landcover
		this.landcoverLegend = new SidebarLegend();
		this.lc_switch_full.onchange = function(e) {
			if (e.target.checked) {
				this.landcover.addTo(this.map);
				this.landcoverLegend.add('title', {
					'Agriculture': 'rgb(210, 169, 101)',
					'Forest': 'rgb(21, 119, 100)',
					'Grassland': 'rgb(204, 219, 152)',
					'Shrubland': 'rgb(89, 107, 44)',
					'Sparse vegetation': 'rgb(213, 201, 152)',
					'Wetland': 'rgb(39, 137, 212)',
					'Settlement': 'rgb(233, 70, 43)',
					'Bare': ' rgb(246, 240, 234)',
					'Water': 'rgb(163, 220, 255)',
					'Permanent snow and ice': 'rgb(255, 255, 255)',
				});
			} else {
				this.landcover.removeFrom(this.map);
				this.landcoverLegend.remove();
			}
		}.bind(this)

		// gfs data
		// temperature
		this.gfs_temp_switch.onchange = function(e) {
			if (e.target.checked) {
				this.gfs_temp_switch.parentNode.parentNode.classList.add('disabled');
				this.addTMPLayer(function() {
					this.timelineVisibility();
					this.gfs_temp_switch.parentNode.parentNode.classList.remove('disabled');
				}.bind(this));
			} else {
				this.gfsTemperatureLayer.removeFrom(this.map);
				this.temperatureLegend.hide();
				this.timelineVisibility();
			}
		}.bind(this)
		// precipitation
		this.gfs_precip_switch.onchange = function(e) {
			if (e.target.checked) {
				this.gfs_precip_switch.parentNode.parentNode.classList.add('disabled');
				this.addPRATELayer(function() {
					this.timelineVisibility();
					this.gfs_precip_switch.parentNode.parentNode.classList.remove('disabled');
				}.bind(this));
			} else {
				this.gfsPrecipitationLayer.removeFrom(this.map);
				this.precipitationLegend.hide();
				this.timelineVisibility();
			}
		}.bind(this)
		// wind velocity only (leaflet)
		this.gfs_wind_switch.onchange = function(e) {
			if (e.target.checked) {
				this.gfs_wind_switch.parentNode.parentNode.classList.add('disabled');
				this.addVelocityLayer(function() {
					this.timelineVisibility();
					this.gfs_wind_switch.parentNode.parentNode.classList.remove('disabled');
				}.bind(this));
			} else {
				this.velocityLayer.removeFrom(this.map);
				this.timelineVisibility();
			}
		}.bind(this)


		// more layers
		// toggles
		// tree cover
		this.treecover_switch.onchange = function(e) {
			(e.target.checked) ? this.treeCover.getLayer().addTo(this.map) : this.treeCover.getLayer().removeFrom(this.map);
		}.bind(this)
		// tree cover loss
		this.treecoverloss_switch.onchange = function(e) {
			(e.target.checked) ? this.treeCoverLoss.addTo(this.map) : this.treeCoverLoss.removeFrom(this.map);
		}.bind(this)

		// percentage dropdown for tree cover
		this.treeCoverPercentage = document.getElementById('tree_cover_percentage');
		this.treeCoverPercentage.onchange = function(e) {
			console.log(e.target.value);
			this.treeCover.setPercentage(e.target.value);
		}.bind(this)
	}
	// check if all GFS layers are hidden, in which case proceed
	timelineVisibility() {
		// if any of the gfs are shown
		if (
			this.map.hasLayer(this.gfsTemperatureLayer) ||
			this.map.hasLayer(this.gfsPrecipitationLayer) ||
			this.map.hasLayer(this.velocityLayer)
		) {
			this.timelineWrapper.style.display = 'block';
			this.blockCountryPicker = true;
		} else {
			this.timelineWrapper.style.display = 'none';
			this.blockCountryPicker = false;
		}
	}


	//===========================//
	// vector layers from martin //
	//===========================//
	addHotspots() {
		// init vector layer
		this.hotspotsLayer = L.vectorGrid.protobuf(`${this.pbfSource}?date=${this.date}`, {
			rendererFactory: L.canvas.tile,
			attribution: '',
			vectorTileLayerStyles: {
				'dashboard.getTilesByDate': function(props, zoom) {
					return {
						fill: true,
						//fillColor: 'white',
						fillColor: 'orange',
						fillOpacity: 1,
						radius: (zoom < 7) ? 1.3 : 2,
						//color: 'white',
						color: 'orange',
						opacity: 1,
						weight: 1,
					}
				},
			},
			interactive: true,
			pane: 'hotspots',
			noWrap: true
		}).addTo(this.map);
	}
	updateHotspots() {
		this.hotspotsLayer.setUrl(`${this.pbfSource}?date=${this.date}`, false);
	}


	//============//
	// wms layers //
	//============//
	initTileLayers() {
		// default carto basemap
		this.cartoBasemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
			attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			noWrap: true
		}).addTo(this.map);

		// default carto labels
		this.cartoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png', {
			attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			noWrap: true,
			pane: 'labels'
		})//.addTo(this.map);
		this.stamenLabels = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
			subdomains: 'abcd',
			minZoom: 0,
			maxZoom: 20,
			pane: 'labels',
			ext: 'png'
		}).addTo(this.map);

		// add world borders
		this.world_borders = new L.GeoJSON.AJAX('./public/world.json', {
			pane: 'borders',
			//renderer: L.canvas(),
			style: {
				fillOpacity: 0,
				stroke: true,
				color: '#000',
				weight: 1,
				opacity: 0.3
			}
		}).addTo(this.map);

		// openstreetmaps
		this.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			pane: 'basemaps',
			maxZoom: 19,
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		});

		// esri high resolution imagery
		this.esriSatImg = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			pane: 'basemaps',
			attribution: '&copy; <a href="http://www.esri.com/">ESRI.com</a>',
		});

		// nasa modis terra true color imagery
		this.modis_terra = new NASAGIBSLayer('MODIS_Terra_CorrectedReflectance_TrueColor', this.date);

		// ESA landcover
		this.landcover = L.tileLayer.wms('https://maps.greenpeace.org/arcgis/services/wms/ESA_300m_LC/MapServer/WMSServer', {
			attribution: '© ESA Climate Change Initiative - Land Cover led by UCLouvain',
			pane: 'basemaps',
			layers: 0,
			transparent: true,
			noWrap: true,
			format: 'image/png'
		});

		// WDPA protected areas
		this.wdpa = L.vectorGrid.protobuf(`/api/vtiles/vector.wdpa_sep2020/{z}/{x}/{y}.pbf`, {
			rendererFactory: L.canvas.tile,
			attribution: '',
			vectorTileLayerStyles: {
				'vector.wdpa_sep2020': {
					fill: true,
					fillColor: 'white',
					fillOpacity: 0.2,
					color: 'white',
					opacity: 0.3,
					weight: 1,
				},
			},
			interactive: true,
			pane: 'basemaps'
		});


		// tree cover layers
		this.treeCover = new TreeCover();
		this.treeCoverLoss = L.tileLayer('https://storage.googleapis.com/earthenginepartners-hansen/tiles/gfc_v1.7/loss_alpha/{z}/{x}/{y}.png', {
			pane: 'basemaps',
			attribution: 'Hansen/UMD/Google/USGS/NASA',
		});
	}

	// tile layer interactivity
	initTileLayerInteractions() {
		this.world_borders.on('click', function(e) {
			if (!this.blockCountryPicker) {
				$('#country_input').val(e.layer.feature.properties.ID_0);
				$('#country_input').trigger('change');
			}
		}.bind(this));
	}

	// update layer urls on demand
	updateTileLayers() {
		this.modis_terra.setDate(this.date);
	}


	//====================//
	// gfs geotiff layers //
	//====================//
	initGFSSettings() {
		// color schemes
		this.tempScale = chroma.scale('Spectral').domain([1,0]).mode('lrgb');

		// show temperature on click if gfs layer is shown
		this.map.on('click', function(e) {
			this.map.closePopup(); // if old one is open
			let popup = L.popup().setLatLng([e.latlng.lat, e.latlng.lng]);
			let value = 0;
			let text = '';

			if (this.map.hasLayer(this.gfsTemperatureLayer)) {
				value = this.getValueAtLatLng(this.TMPRaster, e.latlng.lat, e.latlng.lng);
				value = Math.round(value*100)/100
				text = 'temperature';
				popup.setContent(`${text}: ${value} °C`).openOn(this.map);
			} else if (this.map.hasLayer(this.gfsPrecipitationLayer)) {
				value = this.getValueAtLatLng(this.PRATERaster, e.latlng.lat, e.latlng.lng);
				value = Math.round(value*8640*100)/100 // mutiply by 8640 to convert precipitation flux to mm
				text = 'precipitation';
				popup.setContent(`${text}: ${value} mm`).openOn(this.map);
			}
			
		}.bind(this));
	}


	// extract raster values | recalc lat/lng to raster coordinates
	getValueAtLatLng(raster, lat, lng) {
		var rasterBounds = L.latLngBounds([[raster.ymin, raster.xmin], [raster.ymax, raster.xmax]]);
		try {
			var x = Math.floor(raster.width * (lng - rasterBounds._southWest.lng) / (rasterBounds._northEast.lng - rasterBounds._southWest.lng));
			var y = raster.height - Math.ceil(raster.height * (lat - rasterBounds._southWest.lat) / (rasterBounds._northEast.lat - rasterBounds._southWest.lat)); // invalid indices
	
			if (x < 0 || x > raster.width || y < 0 || y > raster.height) return null;
			
			const i = y * raster.width + x;
			let value = raster.values[0][y][x];
			return value;
		} catch (err) {
			console.log(err)
		}
	}

	// add debug block on the map (GFS stats)
	initDebug() {
		let debugPanel = L.control({position: 'bottomleft'});
			debugPanel.onAdd = function () {
				var div = L.DomUtil.create('div', 'debug_panel');
					div.setAttribute('id','map_debug_wrapper');
					div.innerHTML = `<div id="next_gfs_update"></div><div id="last_gfs_update"></div>`;
				return div;
			};
			debugPanel.addTo(this.map);
	}

	// add temperature geotiff layer
	addTMPLayer(cb) {
		// fetch raster file
		fetch(`${this.geotiffFolder}/TMP/f${this.gfstime.toString().padStart(3, 0)}.tiff?ver=${this.cacheBypass}`)
			// to arrayBuffer
			.then(function(response) {return response.arrayBuffer()})
			.then(function(arrayBuffer) {
				// convert to georaster
				parseGeoraster(arrayBuffer).then(function(georaster) {
					this.TMPRaster = georaster;
					console.log("georaster:", this.TMPraster);
					
					// calc color scale values
					var max = georaster.maxs[0];
					var min = georaster.mins[0];
					var range = max - min;

					this.gfsTemperatureLayer = new GeoRasterLayer({
						pane: 'gfs',
						georaster: georaster,
						opacity: 0.7,
						pixelValuesToColorFn: function(values) {
							let colorValue = ((values[0] + Math.abs(min)))/range;
							return this.tempScale(colorValue)
						}.bind(this),
						resolution: 128
					});
					this.gfsTemperatureLayer.addTo(this.map);

					// once it's loaded, retrieve metadata
					this.gfsTemperatureLayer.once('load', function(e) {
						// success callback
						try { cb() } catch {}
						// add color legend
						this.temperatureLegend.gen(this.tempScale, [min, max]);
					}.bind(this));
				}.bind(this));
			}.bind(this));
	}

	// add precipitation geotiff layer
	addPRATELayer(cb) {
		// fetch raster file
		fetch(`${this.geotiffFolder}/PRATE/f${this.gfstime.toString().padStart(3, 0)}.tiff?ver=${this.cacheBypass}`)
			// to arrayBuffer
			.then(function(response) {return response.arrayBuffer()})
			.then(function(arrayBuffer) {
				// convert to georaster
				parseGeoraster(arrayBuffer).then(function(georaster) {
					this.PRATERaster = georaster;
					
					// calc color scale values
					var max = georaster.maxs[0]*8640; // mutiply by 8640 to convert precipitation flux to mm
					var min = georaster.mins[0]*8640; // mutiply by 8640 to convert precipitation flux to mm
					var range = max - min;

					this.gfsPrecipitationLayer = new GeoRasterLayer({
						pane: 'gfs',
						georaster: georaster,
						opacity: 0.7,
						pixelValuesToColorFn: function(values) {
							let colorValue = ((values[0]*8640 + Math.abs(min)))/range; // mutiply by 8640 to convert precipitation flux to mm
							if (colorValue == 0) return false; // dont show anything if 0
							return this.tempScale(colorValue)
						}.bind(this),
						resolution: 128
					});
					this.gfsPrecipitationLayer.addTo(this.map);

					// once it's loaded, retrieve metadata
					this.gfsPrecipitationLayer.once('load', function(e) {
						// success callback
						try { cb() } catch {}
						// add color legend
						this.precipitationLegend.gen(this.tempScale, [min, max]);
					}.bind(this));
				}.bind(this));
			}.bind(this));
	}
	
	// add wind vector layer
	addVelocityLayer(cb) {
		axios.get(`${this.geotiffFolder}/WND/${this.gfstime.toString().padStart(3, 0)}.json?ver=${this.cacheBypass}`)
		.then(function(res) {
			this.velocityLayer = L.velocityLayer({
				displayValues: true,
				displayOptions: {
					velocityType: "Wind",
					position: "bottomleft",
					emptyString: "No velocity data",
					displayPosition: "bottomleft",
					displayEmptyString: "No velocity data",
					speedUnit: "m/s"
				},
				data: res.data,
				paneName: "velocityPane",
				//velocityScale: 0.008, // modifier for particle animations, arbitrarily defaults to 0.005

				velocityScale: 0.01,
				particleMultiplier: 0.1,
				maxVelocity: 20,
				lineWidth: 0.9,
				colorScale: [
					"#0656C6",
					"#0A69AF",
					"#0D7B98",
					"#118E81",
					"#15A06A",
					"#19B353",
					"#1CC53C",
					"#20D825",
				],
			}).addTo(this.map);
			try { cb() } catch {} // success callback
		}.bind(this)
		).catch(function(err) {
			console.log(err);
		});
	}

	// re-add layers when time is changed
	updateGFSLayers() {
		// temperature raster
		if (this.map.hasLayer(this.gfsTemperatureLayer)) {
			this.gfsTemperatureLayer.removeFrom(this.map);
			this.addTMPLayer();
		}
		//precipitation raster
		if (this.map.hasLayer(this.gfsPrecipitationLayer)) {
			this.gfsPrecipitationLayer.removeFrom(this.map);
			this.addPRATELayer();
		}
		// wind velocity layer
		if (this.map.hasLayer(this.velocityLayer)) {
			this.velocityLayer.removeFrom(this.map);
			this.addVelocityLayer()
		}
	}
}

export default Map;