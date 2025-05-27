import './style.css'
// import * as olLocal from 'ol'
import TileLayer from 'ol/layer/Tile'
// import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'
import { transformExtent, fromLonLat, toLonLat } from 'ol/proj'
import Select from 'ol/interaction/Select'

// import addGeoJson from './src/addGeoJson'
// import addOverlay from './src/addOverlay'
import addFilter from './src/addFilter'
import highLight from './src/highLight'
import onClick from './src/onClick'
import selectInteraction from './src/selectInteraction'
import vector from './src/vector'
import clip from './src/clip'
import mask from './src/mask'
import popup from './src/popup'
import outline from './src/outline'

import mapJson from './src/xinjiang'

// import './src/clipMap'

// const { Map, View, Geoportail } = olLocal

let map = null

var xyz = new ol.layer.Tile({
	source: new ol.source.XYZ({
		// url: 'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
		url: 'http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6'
		// url: 'http://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}'
		// url: 'http://gac-geo.googlecnapps.cn/maps/vt?lyrs=t&x=x&y=y&z=z'
		// url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' // 示例URL，实际应用中可能需要API密钥和调整URL格式
	})
})
const osm = new ol.layer.Tile({
	source: new ol.source.OSM(),
	style: new ol.style.Style({
		fill: new ol.style.Fill({
			color: '#00C1AF' // 红色半透明填充
		}),
		stroke: new ol.style.Stroke({
			color: '#333', // 边框颜色
			width: 2 // 边框宽度
		})
	})
})
const mapCenter = [87.865021, 43.165363]
const projection = 'EPSG:4326'
const minZoom = 5
const maxZoom = 10

function initMap(props) {
	map = new ol.Map({
		target: 'map',
		layers: [xyz],
		view: new ol.View({
			projection: projection, //使用这个坐标系
			// center: fromLonLat([87.865021, 43.165363]),
			center: mapCenter,
			zoom: minZoom,
			maxZoom: maxZoom,
			minZoom: minZoom,
			showFullExtent: true,
			restrictedExtent: true
		})
	})
	// 隐藏控件
	map.controls.forEach((control) => (control.element.style.display = 'none'))
	// console.log('map', map)

	// const { vectorLayer, vectorSource } = vector()
	// map.addLayer(vectorLayer)
	// clip(vectorLayer)
	// map.getView().fit(vectorSource.getExtent(), { size: map.getSize() })
	mask({ xyz, mapJson })
	const { geojsonLayer, geojsonSource } = addFilter(map, xyz)

	popup(map)
	outline(map)
	// selectInteraction(map, geojsonLayer)

	highLight(map, geojsonLayer)
	// onClick(map, geojsonSource)
	// addOverlay(map)
}

initMap()

// 回到中心
document.querySelector('.backToCenter').addEventListener('click', () => {
	console.log('map', map)
	map.setView(
		new ol.View({
			center: mapCenter,
			projection: projection,
			zoom: minZoom,
			minZoom: minZoom,
			maxZoom: maxZoom
		})
	)
})
