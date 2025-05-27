export default (map, areaLayer) => {
	// 添加交互层来监听特征点击事件
	var selectInteraction = new ol.interaction.Select()
	map.addInteraction(selectInteraction)
	// 监听特征选择事件
	selectInteraction.on('select', function (e) {
		var features = e.target.getFeatures()

		console.log('feature', e)
		features.forEach(function (feature) {
			// 更改特征样式以高亮显示
			feature.setStyle(
				new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 0, 0, 0.4)' // 红色填充
					}),
					stroke: new ol.style.Stroke({
						color: '#ff0000', // 红色边框
						width: 2
					})
				})
			)
			areaLayer.addFeature(feature)
		})
	})
}
