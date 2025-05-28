import { Vector as VectorSource } from 'ol/source.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { Circle as CircleStyle, Style, Stroke, Fill, Icon } from 'ol/style.js'
import { flattenDepth } from 'lodash'
import Big from 'big.js'

export const mapLayer = ({ url, style = {}, zIndex = 90, mapJson }) => {
	const geojsonSource = new ol.source.Vector({
		format: new GeoJSON(),
		url
	})
	// var geojsonSource = new ol.source.Vector({
	// 	features: [mapJson],
	// 	format: new GeoJSON()
	// })
	const layer = new ol.layer.Vector({
		name: '新疆',
		source: geojsonSource,
		zIndex,
		// 样式-不写样式就是范围线
		style:
			typeof style === 'function'
				? (feature) => style(feature)
				: new Style({
						stroke: new Stroke({
							color: 'rgba(0,105,169,0.2)', // 多边形边界颜色
							width: 2 // 多边形边界宽度
						}),
						fill: new Fill({
							color: 'rgba(0,105,169,0)' // 填充颜色
						}),
						...style
				  })
	})
	return { layer, source: geojsonSource }
}

export const getCoordinates = (jsonData, offset) => {
	const { features = [] } = jsonData
	const feature = features[0]
	const { geometry } = feature
	const { coordinates } = geometry
	if (!offset) return coordinates
	const flatCoord = flattenDepth(coordinates, 2)
	// console.log(flatCoord)
	return [
		[
			flatCoord.map((arr) => {
				const a = Big(arr[0].toString())
				const aValue = a.plus(0.1)
				const b = Big(arr[1].toString())
				const bValue = b.plus(0.1)
				return [aValue.toString(), bValue.toString()]
			})
		]
	]
}
export const setTrans = ({ mapJson, zIndex, offset }) => {
	const feature = getCoordinates(mapJson, offset)
	// console.log('feature', feature)
	var vectorSource = new ol.source.Vector({
		features: [new ol.Feature(new ol.geom.MultiPolygon(feature))]
	})
	// 创建矢量图层，并设置样式（可选）
	var vectorLayer = new ol.layer.Vector({
		source: vectorSource,
		style: [
			new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(0,105,169,0.3)' // 设置填充颜色和透明度
				}),
				stroke: new ol.style.Stroke({
					color: '#0069A9', // 设置边框颜色
					width: 2 // 设置边框宽度
				})
			})
		],
		zIndex
	})
	// 创建一个新的变换函数，将所有点的坐标偏移
	// var originalTransform = vectorLayer
	// 	.getSource()
	// 	.getFormat()
	// 	.readFeatures.bind(vectorLayer.getSource().getFormat())
	// console.log('vectorLayer.getSource()', vectorLayer.getSource())
	// vectorLayer.getSource().setFormat(
	// 	new ol.format.GeoJSON({
	// 		readFeatures: function (json) {
	// 			console.log('json', json)
	// 			// var features = originalTransform(json)
	// 			json.forEach(function (feature) {
	// 				var geometry = feature.getGeometry()
	// 				if (geometry) {
	// 					geometry.applyTransform(function (x, y) {
	// 						return [x + 10, y + 10] // 例如，向右下方偏移10像素
	// 					})
	// 				}
	// 			})
	// 			return features
	// 		}
	// 	})
	// )
	return vectorLayer
}

export const initAreaStyle = (config = {}) => (f) => {
	return new ol.style.Style({
		image: new ol.style.RegularShape({
			radius: 5,
			radius2: 0,
			points: 4,
			stroke: new ol.style.Stroke({ color: '#000', width: 1 })
		}),
		text: new ol.style.Text({
			text: f.get('name'),
			font: 'bold 13px sans-serif',
			stroke: new Stroke({
				color: 'rgba(0,105,169,0.8)', // 多边形边界颜色
				width: 1 // 多边形边界宽度
			}),
			fill: new Fill({
				color: 'rgba(136,236,241,1)' // 填充颜色
			})
		}),
		stroke: new Stroke({
			color: 'rgba(0,105,169,0.2)', // 多边形边界颜色
			width: 1 // 多边形边界宽度
		}),
		fill: new Fill({
			color: 'rgba(0,105,169,0.1)' // 填充颜色
		}),
		...config
	})
}

