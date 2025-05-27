import Map from 'ol/Map.js'
import View from 'ol/View.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import TileLayer from 'ol/layer/Tile.js'
import VectorLayer from 'ol/layer/Vector.js'
import { fromLonLat } from 'ol/proj.js'
import { getVectorContext } from 'ol/render.js'
import OSM from 'ol/source/OSM.js'
import StadiaMaps from 'ol/source/StadiaMaps.js'
import VectorSource from 'ol/source/Vector.js'
import Fill from 'ol/style/Fill.js'
import { Circle as CircleStyle, Style, Stroke, Icon } from 'ol/style.js'

import xinjiang from './mapJson'

//A distinct className is required to use another canvas for the background
const background = new TileLayer({
	className: 'toner',
	source: new StadiaMaps({
		layer: 'stamen_toner'
	})
})

var base = new TileLayer({
	source: new ol.source.XYZ({
		url: 'http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6'
	})
})
// const base = new TileLayer({
// 	source: new OSM()
// })

const clipLayer = new VectorLayer({
	style: new Style({
		stroke: new Stroke({
			color: 'rgba(0,105,169,0.2)', // 多边形边界颜色
			width: 2 // 多边形边界宽度
		}),
		fill: new Fill({
			color: 'rgba(0,105,169,0)' // 填充颜色
		})
	}),
	source: new VectorSource({
		url: 'https://geo.datav.aliyun.com/areas_v3/bound/650000_full.json',
		format: new GeoJSON()
	})
})

//Giving the clipped layer an extent is necessary to avoid rendering when the feature is outside the viewport
clipLayer.getSource().on('addfeature', function () {
	base.setExtent(clipLayer.getSource().getExtent())
})

const style = new Style({
	fill: new Fill({
		color: 'transparent'
	})
})

base.on('postrender', function (e) {
	const vectorContext = getVectorContext(e)
	e.context.globalCompositeOperation = 'destination-in'
	clipLayer.getSource().forEachFeature(function (feature) {
		vectorContext.drawFeature(feature, style)
	})
	e.context.globalCompositeOperation = 'source-over'
})

const map = new Map({
	layers: [background, base, clipLayer],
	target: 'map',
	view: new View({
		center: fromLonLat([87.865021, 43.165363]),
		zoom: 7
	})
})
