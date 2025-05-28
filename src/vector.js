import { Vector as VectorSource } from 'ol/source.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { Circle as CircleStyle, Style, Stroke, Fill, Icon } from 'ol/style.js'

import xinjiang from './mapJson'

export default (map) => {
	const vectorSource = new VectorSource({
		features: new GeoJSON().readFeatures(xinjiang)
	})
	const vectorLayer = new VectorLayer({
		name: '背景',
		source: vectorSource,
		renderMode: 'canvas',
		style: new Style({
			fill: new Fill({ color: 'rgba(255,255,255,0)' }),
			stroke: new Stroke({ color: 'rgba(255,255,255,1)', width: 5 })
		})
	})
	return {
		vectorSource,
		vectorLayer
	}
}
