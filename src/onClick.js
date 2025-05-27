import DragPan from 'ol/interaction/DragPan'
import Kinetic from 'ol/Kinetic'
import { easeOut } from 'ol/easing'
import location from './assets/location.png'

var dragPan = new DragPan({
	condition: function (mapBrowserEvent) {
		// 这里可以添加额外的逻辑来决定是否允许拖动，例如基于当前视图位置和边界。
		console.log('mapBrowserEvent', mapBrowserEvent)
		return true // 或者根据条件返回 false 来禁止拖动。
	},
	kinetic: new Kinetic({
		easing: easeOut
	})
})
// map.addInteraction(dragPan)
// 监听地图的拖动事件
// map.on('pointerdrag', function (e) {
// 	console.log('地图正在被拖动', e)
// })

export default (map, geojsonLayer) => {
	map.on('click', (evt) => {
		const feature = new ol.Feature({
			geometry: new ol.geom.Point(evt.coordinate)
		})
		feature.setStyle(
			new ol.style.Style({
				text: new ol.style.Text({
					text:
						evt.coordinate[0].toFixed(4) +
						',' +
						evt.coordinate[1].toFixed(4),
					offsetY: 30,
					font: '12px Calibri,sans-serif',
					fill: new ol.style.Fill({
						color: '#000'
					}),
					stroke: new ol.style.Stroke({
						color: '#f00',
						width: 3
					})
				}),
				image: new ol.style.Icon({
					src: location,
					scale: 0.5,
					anchor: [0.5, 0.5],
					rotateWithView: true,
					rotation: 0,
					opacity: 0.5,
					color: '#0000ff'
				})
			})
		)
		geojsonLayer.addFeature(feature)
	})
}
