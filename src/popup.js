export default ({ map, featureSource, selectedFeature }) => {
	// Select  interaction
	// var select = new ol.interaction.Select({
	// 	hitTolerance: 5,
	// 	multi: true,
	// 	condition: ol.events.condition.click
	// })
	// map.addInteraction(select)

	// 假设你已经有一个矢量图层（vectorLayer）和选中的特征（feature）
	var features = featureSource.getFeatures() // 示例：获取第一个特征
	// console.log('eee', featureSource, features)

	const feature = features.find((item) => {
		return item.get('name') === selectedFeature
	})
	console.log('feature', feature, feature.get('center'))
	// 创建HTML内容
	var content = '<div>这是自定义内容<br>ID: ' + feature.get('name') + '</div>'

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
	const popupLayers = map.getOverlays()
	// console.log('popupLayers', popupLayers)
	popupLayers.forEach((l) => {
		map.removeOverlay(l)
	})
	// map.getOverlays().clear()
	map.addOverlay(popup)
	// popup.setPosition(feature.get('center'))
	popup.show(feature.get('center'), content)

	map.addOverlay(popup)
	popup.show()
}
