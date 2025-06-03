import { setTrans, addLayer } from './tool'

export default ({ map, outline, source }) => {
	// 添加地图偏移层

	const { vectorLayer, vectorSource } = setTrans({
		mapJson: outline,
		zIndex: 20,
		offset: false
	})
	map.addLayer(vectorLayer)

	const maskLayer = addLayer({ source: vectorSource, map })
	map.addLayer(maskLayer)
}
