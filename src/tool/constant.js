import { Style, Stroke, Fill } from 'ol/style.js'

// 高亮区域的样式
const highlightStyle = {
	fill: new Fill({
		color: 'rgba(112, 129, 52, 0.4)' // 高亮颜色
	}),
	stroke: new Stroke({
		color: 'rgba(194,148,53,0.7)', // 高亮边框颜色
		width: 2
	})
}

export default {
	highlightStyle
}
