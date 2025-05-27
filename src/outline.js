import { setTrans, getCoordinates, mapLayer } from './tool'

import xinjiangTrans1 from './assets/xinjiangTrans1'
import xinjiangTrans2 from './assets/xinjiangTrans2'

export default (map) => {
	// 添加地图偏移层

	const vectorLayer1 = setTrans(xinjiangTrans1)

	const vectorLayer2 = setTrans(xinjiangTrans2)

	map.addLayer(vectorLayer1)
	map.addLayer(vectorLayer2)
}
