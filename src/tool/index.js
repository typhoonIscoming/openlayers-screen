import { Vector as VectorSource } from 'ol/source.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { Circle as CircleStyle, Style, Stroke, Fill, Icon } from 'ol/style.js'

export const mapLayer = ({ url, style = {} }) => {
	const geojsonSource = new VectorSource({
		format: new GeoJSON(),
		url
	})
	const layer = new VectorLayer({
		name: '新疆',
		source: geojsonSource,
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

export const setTrans = (transJson) => {
	var vectorSource = new ol.source.Vector({
		features: [
			new ol.Feature(new ol.geom.MultiPolygon(getCoordinates(transJson)))
		]
	})
	// 创建矢量图层，并设置样式（可选）
	var vectorLayer = new ol.layer.Vector({
		source: vectorSource,
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(0,105,169,0.3)' // 设置填充颜色和透明度
			}),
			stroke: new ol.style.Stroke({
				color: '#0069A9', // 设置边框颜色
				width: 2 // 设置边框宽度
			})
		})
	})
	return vectorLayer
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
				const aValue = a.minus(0.2)
				const b = Big(arr[1].toString())
				const bValue = b.minus(0.2)
				return [aValue, bValue]
			})
		]
	]
}
