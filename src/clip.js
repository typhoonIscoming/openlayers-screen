import { Vector as VectorSource } from 'ol/source.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { getVectorContext } from 'ol/render'
import { Circle as CircleStyle, Style, Stroke, Fill, Icon } from 'ol/style.js'
import xinjiang from './mapJson'

export default (layer, geoJson) => {
	const clipVectorSource = new VectorSource({
		features: new GeoJSON().readFeatures(xinjiang)
	})
	let features = clipVectorSource.getFeatures()
	let geometry = features[0].getGeometry()
	layer.on('prerender', (event) => {
		const ctx = event.context

		const vecCtx = getVectorContext(event)
		vecCtx.setStyle(
			new Style({
				fill: new Fill({ color: 'transparent' })
			})
		)
		ctx.save()

		vecCtx.drawGeometry(geometry)
		ctx.clip()
	})
	layer.on('postrender', (event) => {
		const ctx = event.context
		ctx.restore()
	})
}
