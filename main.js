import './style.css'
// import * as olLocal from 'ol'
import TileLayer from 'ol/layer/Tile'
// import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'
import { transformExtent, fromLonLat, toLonLat } from 'ol/proj'
import Select from 'ol/interaction/Select'
import ImageLayer from 'ol/layer/Image'
import ImageStatic from 'ol/source/ImageStatic'

import addFilter from './src/addFilter'
import highLight from './src/highLight'
import clip from './src/clip'
import mask from './src/mask'
import outlineLayer from './src/outline'

// import './src/clipMap'

// const { Map, View, Geoportail } = olLocal

// var extent = ol.extent.boundingExtent([
// 	[lon1, lat1], // 左上角坐标
// 	[lon2, lat2] // 右下角坐标
// ])
// 创建图片图层
const imageLayer = new ol.layer.Image({
	source: new ol.source.ImageStatic({
		url: './src/assets/mountain.webp', // 图片URL
		imageSize: [100, 100],
		imageExtent: [40, 10, 120, 60] // 图片的经纬度范围，例如左上角和右下角的坐标
	}),
	zIndex: 20
})

let map = null

const projection = 'EPSG:4326'
const minZoom = 5
const maxZoom = 10

const getUrl = (name) =>
	`https://geo.datav.aliyun.com/areas_v3/bound/${name}.json`

async function getData(code) {
	const fullUrl = getUrl(`${code}_full`)
	const mapJson = await fetch(fullUrl).then((res) => res.json())
	const outline = await fetch(getUrl(code)).then((res) => res.json())
	initMap({ mapJson, outline, fullUrl })
}
async function initMap({ mapJson, outline, fullUrl }) {
	var xyz = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url: './src/assets/mountain.webp'
			// url: 'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
			// url: 'http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6'
			// url: 'http://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}'
			// url: 'http://gac-geo.googlecnapps.cn/maps/vt?lyrs=t&x=x&y=y&z=z'
			// url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' // 示例URL，实际应用中可能需要API密钥和调整URL格式
		}),
		zIndex: 9
	})

	const { features = [] } = mapJson
	const feature = features[0] || {}
	const { properties = {} } = feature
	const { center = [] } = properties

	map = new ol.Map({
		target: 'map',
		layers: [imageLayer],
		view: new ol.View({
			projection: projection, //使用这个坐标系
			// center: fromLonLat([87.865021, 43.165363]),
			center,
			zoom: minZoom,
			maxZoom: maxZoom,
			minZoom: minZoom,
			showFullExtent: true,
			restrictedExtent: true
		})
	})
	map.renderSync()
	clip(imageLayer, outline)
	// 隐藏控件
	map.controls.forEach((control) => (control.element.style.display = 'none'))

	mask({ xyz, outline })
	outlineLayer({ map, outline })
	const { geojsonLayer, geojsonSource } = addFilter({
		map,
		xyz,
		url: fullUrl
	})

	highLight({
		map,
		featureLayer: geojsonLayer,
		featureSource: geojsonSource,
		callback: (code) => {
			console.log('name main', code)
			// 假设你有一个名为 vectorLayer 的矢量图层
			// geojsonLayer.getSource().clear() // 清空当前数据
			getData(code)
		}
	})
	// addOverlay(map)
}

getData(650000)


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
