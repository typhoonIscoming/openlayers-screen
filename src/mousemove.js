import { Style, Stroke, Fill, Icon } from 'ol/style.js'
import popupLayer from './popup'
import { initAreaStyle } from './tool'

let featureLayerForSelect = null

export default ({ map, event, featureSource }) => {
	if (event.dragging) {
		// 忽略拖动事件的影响
		return
	}
	// 监听鼠标移动事件，鼠标移动到feature区域时变为手形
	const pixel = map.getEventPixel(event.originalEvent) // 获取事件像素位置
	var hit = map.hasFeatureAtPixel(pixel)
	map.getTargetElement().style.cursor = hit ? 'pointer' : ''
	document.querySelector('body').classList = hit ? ['map-hover'] : []

	map.forEachFeatureAtPixel(pixel, function (layer) {
		// 遍历所有在像素位置上的特征
		const name = layer.get('name')

		if (!name) {
			featureLayerForSelect = null
			return
		}

		if (
			featureLayerForSelect &&
			layer.get('adcode') === featureLayerForSelect.get('adcode')
		) {
			return
		}
		featureLayerForSelect = layer
		layer.on('click', (e) => {
			// 显示弹窗
			popupLayer({ map, featureSource, selectedFeature: name })
		})
		layer.dispatchEvent('click')
		layer.setStyle(
			initAreaStyle({
				fill: new ol.style.Fill({
					color: 'rgba(112, 129, 52, 0.4)' // 高亮颜色
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(194,148,53,0.7)', // 高亮边框颜色
					width: 2
				})
			})
		) // 设置高亮样式
	})
}
