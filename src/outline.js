import { setTrans } from './tool'

export default ({ map, outline }) => {
	// 添加地图偏移层

	const baseLayer = setTrans({
		mapJson: outline,
		zIndex: 20,
		offset: false
	})

	const vectorLayer1 = setTrans({
		mapJson: outline,
		zIndex: 21,
		offset: 0.3
	})

	const vectorLayer2 = setTrans({
		mapJson: outline,
		zIndex: 22,
		offset: 0.4
	})
	map.addLayer(baseLayer)
	map.addLayer(vectorLayer1)
	map.addLayer(vectorLayer2)
}
