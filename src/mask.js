import { getCoordinates } from './tool'

export default ({ xyz, outline }) => {
	const multi = new ol.geom.MultiPolygon(getCoordinates(outline))
	var f = new ol.Feature(multi)
	var crop = new ol.filter.Crop({
		feature: f,
		wrapX: true,
		inner: false
	})
	xyz.addFilter(crop)

	var mask = new ol.filter.Mask({
		feature: f,
		wrapX: true,
		inner: false,
		// fill: new ol.style.Fill({ color: [255, 255, 255, 1] })
		fill: new ol.style.Fill({ color: [1, 32, 54, 1] })
	})
	xyz.addFilter(mask)
	crop.set('inner', false)
	crop.set('shadowWidth', 15)
	mask.set('inner', false)
	mask.set('shadowWidth', 15)
	// mask.setFillColor('rgba(3,32,53,0.98)')
	crop.set('active', false)
	mask.set('active', true)
}
