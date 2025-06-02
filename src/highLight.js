import { Style, Stroke, Fill, Icon } from 'ol/style.js'

import * as olLocal from 'ol'

const { Map, View, Overlay, Popup } = olLocal

import { initAreaStyle } from './tool'
import popupLayer from './popup'
import mousemove from './mousemove'

const selectedStyle = new Style({
	fill: new Fill({
		color: 'rgba(112, 129, 52, 0.4)' // 高亮颜色
	}),
	stroke: new Stroke({
		color: 'rgba(194,148,53,0.7)', // 高亮边框颜色
		width: 2
	})
})

const moveOut = {
	stroke: new Stroke({
		color: '#00C1AF', // 多边形边界颜色
		width: 2 // 多边形边界宽度
	}),
	fill: new Fill({
		color: 'rgba(0,105,169,0.3)' // 填充颜色
	})
}

export default ({ map, featureLayer, featureSource, callback = () => {} }) => {
	let featureLayerForSelect = null

	map.on('pointermove', (event) => {
		if (event.dragging) {
			// 忽略拖动事件的影响
			return
		}
		mousemove({ map, event, featureSource })
	})
	map.on('click', function (event) {
		if (event.dragging) {
			// 忽略拖动事件的影响
			return
		}
		const pixel = map.getEventPixel(event.originalEvent) // 获取事件像素位置
		const hit = map.hasFeatureAtPixel(pixel) // 检查是否有特征在像素位置上
		// 将所有feature设置成原来默认样式
		featureLayer
			.getSource()
			.getFeatures()
			.forEach(function (feature) {
				feature.setStyle(initAreaStyle(moveOut))
			})
		map.getOverlays().clear()
		map.forEachFeatureAtPixel(pixel, function (layer) {
			featureLayerForSelect = layer
			// 遍历所有在像素位置上的特征
			const name = layer.get('name')
			if (!name) {
				return
			}
			callback(layer)

			layer.setStyle(
				initAreaStyle({
					fill: new Fill({
						color: 'rgba(112, 129, 52, 0.7)' // 高亮颜色
					}),
					stroke: new Stroke({
						color: 'rgba(194,148,53,0.7)', // 高亮边框颜色
						width: 2
					})
				})
			) // 设置高亮样式
			layer.once('click', (e) => {
				// 显示弹窗
				popupLayer({ map, featureSource, selectedFeature: name })
			})
			layer.dispatchEvent('click')
		})
	})
}
