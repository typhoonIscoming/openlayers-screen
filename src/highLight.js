import { Style, Stroke, Fill, Icon } from 'ol/style.js'

import * as olLocal from 'ol'

const { Map, View, Overlay, Popup } = olLocal

import { initAreaStyle } from './tool'
import popupLayer from './popup'

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
		// 监听鼠标移动事件，鼠标移动到feature区域时变为手形
		const pixel = map.getEventPixel(event.originalEvent) // 获取事件像素位置
		var hit = map.hasFeatureAtPixel(pixel)
		map.getTargetElement().style.cursor = hit ? 'pointer' : ''

		map.forEachFeatureAtPixel(pixel, function (layer) {
			featureLayerForSelect = layer
			// 遍历所有在像素位置上的特征
			const name = layer.get('name')
			if (!name) {
				featureLayer
					.getSource()
					.getFeatures()
					.forEach(function (feature) {
						feature.setStyle(initAreaStyle(moveOut))
					})
				return
			}
			// console.log('layer', layer, layer.get('adcode'))
			layer.setStyle(
				initAreaStyle({
					fill: new Fill({
						color: 'rgba(112, 129, 52, 0.4)' // 高亮颜色
					}),
					stroke: new Stroke({
						color: 'rgba(194,148,53,0.7)', // 高亮边框颜色
						width: 2
					})
				})
			) // 设置高亮样式
		})
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
			callback(layer.get('adcode'))
			console.log('layer', layer)
			layer.once('click', (e) => {
				// 假设你已经有一个矢量图层（vectorLayer）和选中的特征（feature）
				var features = featureSource.getFeatures() // 示例：获取第一个特征
				// console.log('eee', featureSource, features)

				const feature = features.find((item) => {
					return item.get('name') === name
				})
				console.log('feature', feature, feature.get('center'))
				// 创建HTML内容
				var content =
					'<div>这是自定义内容<br>ID: ' +
					feature.get('name') +
					'</div>'

				// 创建Popup
				var container = document.getElementById('popup')
				var popup = new ol.Overlay.Popup({
					element: container,
					pixelOffset: [0, -30], // 弹出框位置偏移
					content: content, // 设置内容
					autoPan: true,
					stopEvent: true,
					autoPanAnimation: {
						duration: 250
					}
					// placement: ol.Overlay.Popup.placement.AT_CENTER // 定位方式
				})
				// const popup = new Popup()
				// popup.setHtml(content)

				// 将Popup添加到地图上，并定位到选中的特征
				map.getOverlays().clear()
				map.addOverlay(popup)
				// popup.setPosition(feature.get('center'))
				popup.show(feature.get('center'), content)
			})
			layer.dispatchEvent('click')
			layer.setStyle(
				initAreaStyle({
					fill: new Fill({
						color: 'rgba(112, 129, 52, 0.4)' // 高亮颜色
					}),
					stroke: new Stroke({
						color: 'rgba(194,148,53,0.7)', // 高亮边框颜色
						width: 2
					})
				})
			) // 设置高亮样式
		})
	})
}
