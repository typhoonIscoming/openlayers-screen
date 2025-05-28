import { Style, Stroke, Fill, Icon } from 'ol/style.js'

import * as olLocal from 'ol'

const { Map, View, Overlay, Popup } = olLocal

import { initAreaStyle } from './tool'

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

	featureLayer.on('mouseover', function (f) {
		// console.log('featureLayer', f)
		featureLayer.setStyle(
			new Style({
				fill: new Fill({
					color: 'rgba(255, 0, 0, 0.5)' // 鼠标悬停时的填充颜色，例如红色
				})
			})
		)
	})
	// map.on('pointermove', (event) => {
	// 	if (event.dragging) {
	// 		// 忽略拖动事件的影响
	// 		return
	// 	}
	// 	const pixel = map.getEventPixel(event.originalEvent) // 获取事件像素位置

	// 	map.forEachFeatureAtPixel(pixel, function (layer) {
	// 		featureLayerForSelect = layer
	// 		// 遍历所有在像素位置上的特征
	// 		const name = layer.get('name')
	// 		if (!name) {
	// 			featureLayer
	// 				.getSource()
	// 				.getFeatures()
	// 				.forEach(function (feature) {
	// 					feature.setStyle(initAreaStyle(moveOut))
	// 				})
	// 			return
	// 		}
	// 		console.log('layer', layer, layer.get('adcode'))
	// 		layer.setStyle(
	// 			initAreaStyle({
	// 				fill: new Fill({
	// 					color: 'rgba(112, 129, 52, 0.4)' // 高亮颜色
	// 				}),
	// 				stroke: new Stroke({
	// 					color: 'rgba(194,148,53,0.7)', // 高亮边框颜色
	// 					width: 2
	// 				})
	// 			})
	// 		) // 设置高亮样式
	// 	})
	// })
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
				var popup = new ol.Overlay.Popup({
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

	// var select = new ol.interaction.Select()
	// map.addInteraction(select)

	// select.on('select', function (e) {
	// 	var features = e.target.getFeatures()
	// 	console.log(features)
	// 	featureLayer
	// 		.getSource()
	// 		.getFeatures()
	// 		.forEach(function (feature) {
	// 			feature.setStyle(moveOut)
	// 		})
	// 	featureLayerForSelect.setStyle(selectedStyle)
	// 	if (features.getLength() > 0) {
	// 		features.forEach(function (feature) {
	// 			feature.setStyle(selectedStyle) // 高亮显示选中的特征
	// 		})
	// 	} else {
	// 		// 如果没有选中任何特征，可以恢复所有特征的原始样式
	// 		vectorLayer
	// 			.getSource()
	// 			.getFeatures()
	// 			.forEach(function (feature) {
	// 				feature.setStyle(undefined) // 或者设置为原来的样式
	// 			})
	// 	}
	// })
}
