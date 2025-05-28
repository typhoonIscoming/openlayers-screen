import { Vector as VectorSource } from 'ol/source.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import { Circle as CircleStyle, Style, Stroke, Fill, Icon } from 'ol/style.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import Polygon from 'ol/geom/Polygon.js'
import { transformExtent, fromLonLat, toLonLat } from 'ol/proj'

import addOutlineShadow from './addOutlineShadow'
import { setTrans, getCoordinates, mapLayer, initAreaStyle } from './tool'

import bgjpg from './assets/bg.jpg'

export default ({ map, mapJson, url }) => {
	// 边界的轮廓
	// const { layer: bounderLayer, source: bounderSource } = mapLayer({
	// 	url: 'https://geo.datav.aliyun.com/areas_v3/bound/650000.json'
	// })
	const { layer: areaLayer, source: areaSource } = mapLayer({
		url,
		mapJson,
		zIndex: 100,
		style: initAreaStyle()
	})
	areaLayer.on('singleclick', (e) => {
		evt.stopPropagation() // 阻止事件继续传播
	})
	// map.addLayer(bounderLayer)
	map.addLayer(areaLayer)

	return {
		geojsonSource: areaSource,
		geojsonLayer: areaLayer
	}
}
