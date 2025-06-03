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
		zoom: 9,
		zIndex,
		// 样式-不写样式就是范围线
		style:
			typeof style === 'function'
				? (feature) => style(feature)
				: new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: 'rgba(0,105,169,0.2)', // 多边形边界颜色
							width: 2 // 多边形边界宽度
						}),
						fill: new ol.style.Fill({
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
	return { vectorLayer, vectorSource }
}

export const initAreaStyle =
	(config = {}) =>
	(f) => {
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
				stroke: new ol.style.Stroke({
					color: 'rgba(0,105,169,0.8)', // 多边形边界颜色
					width: 1 // 多边形边界宽度
				}),
				fill: new ol.style.Fill({
					color: 'rgba(136,236,241,1)' // 填充颜色
				})
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(0,105,169,0.2)', // 多边形边界颜色
				width: 1 // 多边形边界宽度
			}),
			fill: new ol.style.Fill({
				color: 'rgba(0,105,169,0.1)' // 填充颜色
			}),
			...config
		})
	}

/**
 * 辅助函数：将多边形几何体绘制到 Canvas 上下文作为路径
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
 * @param {ol.geom.Geometry} geometry - Polygon 或 MultiPolygon 几何体
 * @param {Array<number>} mapToPixelTransform - 地图坐标到像素的转换矩阵
 */
function drawPolygonOnContext(ctx, geometry, mapToPixelTransform, map) {
	const type = geometry.getType()
	if (type === 'MultiPolygon') {
		geometry.getPolygons().forEach((polygon) => {
			drawSinglePolygon(ctx, polygon, mapToPixelTransform, map)
		})
	} else if (type === 'Polygon') {
		drawSinglePolygon(ctx, geometry, mapToPixelTransform, map)
	}
}

function drawSinglePolygon(ctx, polygonGeom, mapToPixelTransform, map) {
	polygonGeom.getCoordinates().forEach((ring, i) => {
		// 遍历外环和内环（洞）
		ring.forEach((coords, j) => {
			// 将地图坐标（EPSG:3857）转换为 Canvas 像素坐标
			var pixelMap = map.getPixelFromCoordinate(coords)
			// console.log('pixelMap', pixelMap)
			const pixel = ol.transform.apply(mapToPixelTransform, coords)
			if (j === 0) {
				ctx.moveTo(pixelMap[0], pixelMap[1])
			} else {
				ctx.lineTo(pixelMap[0], pixelMap[1])
			}
		})
		ctx.closePath() // 闭合路径
	})
}

// 添加立体效果的图层
export const addLayer = ({
	map,
	source,
	opacity = 0.5,
	zIndex = 30,
	shadowX = 0,
	shadowY = 0,
	maskFillColor = '#094874',
	maskStrokeColor = '#1c6ba7'
}) => {
	const layer = new ol.layer.Vector({
		source: source, // 共享同一数据源，绘制所有行政区划
		style: null, // 自定义渲染
		opacity: opacity, // 初始化透明度
		zIndex: zIndex, // 初始化Z-index
		data: 'tse'
	})
	layer.on('postrender', (event) => {
		const ctx = event.context
		const mapToPixelTransform = event.frameState.coordinateToPixelTransform
		const pixelRatio = event.frameState.pixelRatio
		console.log('与渲染', pixelRatio)

		ctx.save()

		// 应用整体偏移，像素比乘算以适应屏幕DPI
		// ctx.translate(shadowX * pixelRatio, shadowY * pixelRatio)

		// 设置蒙版样式
		ctx.fillStyle = maskFillColor
		ctx.strokeStyle = maskStrokeColor
		ctx.lineWidth = 2 * pixelRatio // 蒙版线条宽度
		ctx.lineJoin = 'round'
		ctx.lineCap = 'round'
		ctx.shadowColor = 'rgba(0,0,0,0.4)' // 蒙版自身阴影
		ctx.shadowBlur = 5 * pixelRatio
		ctx.shadowOffsetX = 0
		ctx.shadowOffsetY = 0

		// 遍历并绘制所有行政区划特征
		source.getFeatures().forEach((feature) => {
			// 在这里不排除 '新疆维吾尔自治区' 这个特征，因为我们希望影子也绘制所有行政区划
			ctx.beginPath() // 每个特征开始新路径
			drawPolygonOnContext(ctx, feature.getGeometry(), mapToPixelTransform, map)
			ctx.fill() // 填充蒙版
			ctx.stroke() // 描边蒙版
		})

		ctx.restore() // 恢复 Canvas 状态
	})
	return layer
}

