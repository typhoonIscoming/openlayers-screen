import { Style, Stroke, Fill, Icon } from 'ol/style.js'

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

export default (map, featureLayer) => {
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
	map.on('pointermove', function (event) {
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
		map.forEachFeatureAtPixel(pixel, function (feature) {
			featureLayerForSelect = feature
			// 遍历所有在像素位置上的特征
			feature.setStyle(
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
