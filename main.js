import './style.css'
// import * as olLocal from 'ol'
import TileLayer from 'ol/layer/Tile'
// import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'
import { transformExtent, fromLonLat, toLonLat } from 'ol/proj'
import Select from 'ol/interaction/Select'
import ImageLayer from 'ol/layer/Image'
import ImageStatic from 'ol/source/ImageStatic'

import addFilter from './src/addFilter'
import highLight from './src/highLight'
import clip from './src/clip'
import mask from './src/mask'
import outlineLayer from './src/outline'
import uuid from './src/tool/uuid'
import mountain from './src/assets/mountain.webp'
import hospital from './src/assets/hospital.png'
import location from './src/assets/location.png'

// import './src/clipMap'

// const { Map, View, Geoportail } = olLocal

// var extent = ol.extent.boundingExtent([
// 	[lon1, lat1], // 左上角坐标
// 	[lon2, lat2] // 右下角坐标
// ])



let map = null

const projection = 'EPSG:4326'
const district = 'district'

const levelList = ['province', 'city', 'district']

const zoomMapping = {
	province: {
		minZoom: 3,
		maxZoom: 7
	},
	city: {
		minZoom: 3,
		maxZoom: 8
	},
	district: {
		minZoom: 3,
		maxZoom: 9
	}
}

// 初始化地图及加载必要的元素
/**
 * 前面加;是防止跟其他js压缩时报错
 * @param {container} HTMLElement 地图渲染的容日
 */
class initMap {
	constructor(container) {
		this.target = null
		this.map = null
		this.mapId = null
		this.container = container
		this.currentLevel = 'province'
		this.parentId = 100000
		this.mapCenter = []
		this.#init()
	}
	#init() {
		let target =
			this.container instanceof HTMLElement
				? this.container
				: document.querySelector(this.container)
		if (!target) return
		// 如果目标元素下有元素了，就清空
		const children = target.children
		if (children.length > 0) {
			Array.from(children).forEach((el) => target.removeChild(el))
		}
		this.target = target
		this.#createTitle()
		this.#createMap()
		this.#createBack()
		this.#getData({
			areaCode: '650000',
			level: 'province',
			hasChild: true
		})
	}
	#getUrl(name) {
		return `https://geo.datav.aliyun.com/areas_v3/bound/${name}.json`
	}
	// 创建标题元素
	#createTitle() {
		// 创建title元素
		const title = document.createElement('div')
		const img = document.createElement('img')
		const span = document.createElement('span')
		img.classList = ['image-icon']
		img.src = hospital
		span.setAttribute('id', 'current-level-name')
		title.classList = ['openlayers-title']
		span.textContent = '新疆维吾尔自治区'
		title.appendChild(img)
		title.appendChild(span)
		this.target.appendChild(title)
		this.target.style.positon = 'relative'
		this.title = title
		title.addEventListener('click', () => {
			if (this.parentId && this.currentLevel !== 'province') {
				const index = levelList.findIndex(
					(item) => item === this.currentLevel
				)
				const level = levelList[index - 1]
				this.#clearMap()
				this.#createMap()
				this.#getData({
					areaCode: this.parentId,
					level,
					hasChild: true,
					getParentLevel: true
				})
			}
		})
	}
	// 创建地图元素
	#createMap() {
		this.mapId = uuid()
		// 创建地图元素
		const mapEl = document.createElement('div')
		mapEl.setAttribute('id', this.mapId)
		mapEl.style.height = '100%'
		mapEl.style.width = '100%'
		this.target.appendChild(mapEl)
		this.target.style.positon = 'relative'
	}
	// 创建定位元素
	#createBack() {
		const back = document.createElement('div')
		const img = document.createElement('img')
		img.src = location
		back.classList = ['back-to-center']
		back.appendChild(img)
		this.target.appendChild(back)
		// 回到中心
		back.addEventListener('click', () => {
			const { minZoom, maxZoom } = zoomMapping[this.currentLevel] || {}
			this.map.setView(
				new ol.View({
					center: this.mapCenter,
					projection: projection,
					zoom: maxZoom - 2,
					minZoom: minZoom,
					maxZoom: maxZoom
				})
			)
		})
	}
	async #getData({ areaCode, level, hasChild, getParentLevel }) {
		let detailJson = {}
		let url = this.#getUrl(`${areaCode}`)

		const outline = await fetch(url).then((res) => res.json())
		if (level !== district && hasChild > 0) {
			const mapJson = await fetch(this.#getUrl(`${areaCode}_full`)).then(
				(res) => res.json()
			)
			detailJson = mapJson
			url = this.#getUrl(`${areaCode}_full`)
		}
		this.currentLevel = level
		const { features = [] } = outline
		const feature = features[0] || {}
		const { properties = {} } = feature
		const { parent = {}, level: dataLevel, name } = properties
		// 获取当前点击层级
		if (dataLevel !== levelList[0]) {
			this.parentId = parent.adcode
		}
		if (getParentLevel) {
			this.title.querySelector('#current-level-name').textContent = name
		}
		this.#loadMap({
			mapJson: level !== district ? detailJson : outline,
			outline,
			fullUrl: url
		})
	}
	async #loadMap({ mapJson, outline, fullUrl }) {
		var xyz = new ol.layer.Tile({
			source: new ol.source.XYZ({
				// url: './src/assets/mountain.webp'
				// url: 'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
				url: 'http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6'
				// url: 'http://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}'
				// url: 'http://gac-geo.googlecnapps.cn/maps/vt?lyrs=t&x=x&y=y&z=z'
				// url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' // 示例URL，实际应用中可能需要API密钥和调整URL格式
			}),
			zIndex: 9
		})

		const { features = [] } = mapJson
		const feature = features[0] || {}
		const { properties = {} } = feature
		const { center = [], name } = properties

		this.mapCenter = center
		const { minZoom, maxZoom } = zoomMapping[this.currentLevel] || {}
		// 创建图片图层
		const extent = [15, 15, 120, 100]
		const imageProjection = new ol.proj.Projection({
			code: 'world-iamge',
			units: 'pixel',
			extent: extent
		})
		const imageLayer = new ol.layer.Image({
			projection: imageProjection,
			source: new ol.source.ImageStatic({
				// url: './src/assets/mountain.webp', // 图片URL
				url: mountain,
				imageSize: [120, 120],
				imageExtent: extent // 图片的经纬度范围，例如左上角和右下角的坐标
			}),
			zIndex: 20
		})
		this.map = new ol.Map({
			target: document.querySelector(`#${this.mapId}`),
			// loadTilesWhileInteracting: true,
			layers: [xyz],
			view: new ol.View({
				projection: projection, //使用这个坐标系
				// center: fromLonLat([87.865021, 43.165363]),
				center,
				zoom: maxZoom - 2,
				maxZoom: maxZoom,
				minZoom: minZoom,
				showFullExtent: true,
				restrictedExtent: true
			})
		})

		clip(xyz, outline)
		// 隐藏控件
		this.map.controls.forEach((control) => (control.element.style.display = 'none'))

		mask({ xyz, outline })

		const { geojsonLayer, geojsonSource } = addFilter({
			map: this.map,
			xyz,
			url: fullUrl
		})
		outlineLayer({ map: this.map, outline, source: geojsonSource })
		highLight({
			map: this.map,
			featureLayer: geojsonLayer,
			featureSource: geojsonSource,
			callback: (layer) => {
				const code = layer.get('adcode')
				const level = layer.get('level')
				const childrenNum = layer.get('childrenNum')
				const name = layer.get('name')
				const { adcode } = layer.get('parent') || {}
				console.log('name main', code, level)
				this.parentId = adcode

				if (this.currentLevel === district) return

				// 假设你有一个名为 vectorLayer 的矢量图层
				// geojsonLayer.getSource().clear() // 清空当前数据
				this.#clearMap()
				this.#createMap()
				this.title.querySelector('#current-level-name').textContent = name
				this.#getData({
					areaCode: code,
					level,
					hasChild: childrenNum > 0
				})
				this.map.renderSync()
				this.map.render()
			}
		})
	}
	#clearMap() {
		const oldMap = document.querySelector(`#${this.mapId}`)
		this.target.removeChild(oldMap)
	}
}

const m = new initMap('#map')

console.log('mmm', m)
