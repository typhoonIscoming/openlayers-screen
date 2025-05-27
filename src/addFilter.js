import { Vector as VectorSource } from 'ol/source.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import { Circle as CircleStyle, Style, Stroke, Fill, Icon } from 'ol/style.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import Polygon from 'ol/geom/Polygon.js'
import { transformExtent, fromLonLat, toLonLat } from 'ol/proj'
import { flattenDepth } from 'lodash'
import Big from 'big.js'

import addOutlineShadow from './addOutlineShadow'
import { setTrans, getCoordinates, mapLayer } from './tool'

import bgjpg from './assets/bg.jpg'

import mapJson from './xinjiang'

export default (map) => {
	// 边界的轮廓
	const { layer: bounderLayer, source: bounderSource } = mapLayer({
		url: 'https://geo.datav.aliyun.com/areas_v3/bound/650000.json'
	})
	// 有行政区的图层
	const style = new Style({
		stroke: new Stroke({
			color: 'rgba(0,105,169,0.2)', // 多边形边界颜色
			width: 2 // 多边形边界宽度
		}),
		fill: new Fill({
			color: 'rgba(0,105,169,0)' // 填充颜色
		})
	})
	const { layer: areaLayer, source: areaSource } = mapLayer({
		url: 'https://geo.datav.aliyun.com/areas_v3/bound/650000_full.json',
		style: function (f) {
			return new ol.style.Style({
				image: new ol.style.RegularShape({
					radius: 5,
					radius2: 0,
					points: 4,
					stroke: new ol.style.Stroke({ color: '#000', width: 1 })
				}),
				text: new ol.style.Text({
					text: f.get('name'),
					font: 'bold 11px sans-serif'
				}),
				stroke: new Stroke({
					color: 'rgba(0,105,169,0.2)', // 多边形边界颜色
					width: 2 // 多边形边界宽度
				}),
				fill: new Fill({
					color: 'rgba(0,105,169,0)' // 填充颜色
				})
			})
		}
		// style: (feature) => {
		// 	return style
		// }
		// style: {
		// 	renderer(coordinate, state) {
		// 		let arr = coordinate[0][0]
		// 		const ctx = state.context
		// 		addOutlineShadow(ctx, {
		// 			fillStyle: 'rgba(30, 60, 95,1)',
		// 			shadowOffsetY: 30,
		// 			shadowOffsetX: 2,
		// 			shadowColor: 'rgba(30, 60, 95,1)',
		// 			strokeStyle: 'rgba(30, 60, 95,1)',
		// 			coodArr: arr
		// 		})
		// 		addOutlineShadow(ctx, {
		// 			fillStyle: 'transparent',
		// 			shadowOffsetY: 20,
		// 			shadowOffsetX: 2,
		// 			shadowColor: 'rgba( 56, 113, 139,1)',
		// 			strokeStyle: 'rgba(30, 60, 95,1)',
		// 			coodArr: arr
		// 		})
		// 		addOutlineShadow(ctx, {
		// 			fillStyle: 'transparent',
		// 			shadowOffsetY: 15,
		// 			shadowOffsetX: 2,
		// 			shadowColor: 'rgba(255,255,255,1)',
		// 			strokeStyle: 'rgba(30, 60, 95,1)',
		// 			shadowBlur: 10,
		// 			coodArr: arr
		// 		})
		// 		addOutlineShadow(ctx, {
		// 			fillStyle: 'transparent',
		// 			shadowOffsetY: 10,
		// 			shadowOffsetX: 2,
		// 			shadowColor: 'rgba(83, 173, 214,1)',
		// 			strokeStyle: 'rgba(83, 173, 214,1)',
		// 			coodArr: arr
		// 		})
		// 		addOutlineShadow(ctx, {
		// 			fillStyle: 'transparent',
		// 			shadowOffsetY: 8,
		// 			shadowOffsetX: 2,
		// 			shadowColor: 'rgba(255,255,255,1)',
		// 			strokeStyle: 'rgba(255,255,255,1)',
		// 			shadowBlur: 10,
		// 			coodArr: arr
		// 		})
		// 		addOutlineShadow(ctx, {
		// 			fillStyle: '#fff',
		// 			shadowOffsetY: 5,
		// 			shadowOffsetX: 2,
		// 			shadowColor: 'rgba(70, 133, 171,1)',
		// 			strokeStyle: 'rgba(70, 133, 171,1)',
		// 			shadowBlur: 10,
		// 			coodArr: arr
		// 		})
		// 		addOutlineShadow(ctx, {
		// 			fillStyle: 'rgba(70, 133, 171,1)',
		// 			shadowOffsetY: 5,
		// 			shadowOffsetX: 10,
		// 			shadowColor: 'rgba(255,255,255,1)',
		// 			strokeStyle: '#50e3ff',
		// 			shadowBlur: 15,
		// 			coodArr: arr,
		// 			lineWidth: 2
		// 		})
		// 	}
		// }
	})
	map.addLayer(areaLayer)

	// map.addLayer(bounderLayer)

	// var cnv = document.createElement('canvas')

	const loadImg = () => {
		const cvs = document
			.querySelector('.ol-viewport')
			.getElementsByTagName('canvas')[0]
		console.log('===', cvs)
		if (cvs) {
			// const cvs = canvas[0]

			var ctx = cvs.getContext('2d')
			var img = new Image()
			img.src = bgjpg
			img.onload = function () {
				console.log('====', 123)
				ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
				const vector = new VectorLayer({
					name: '背景',
					source: areaSource
				})
				var pattern = ctx.createPattern(img, 'repeat')
				vector.setStyle(
					new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: 'red',
							lineDash: [5],
							width: 2
						}),
						fill: new ol.style.Fill({
							color: pattern
						})
					})
				)
				map.addLayer(vector)
			}
		}
	}
	Promise.resolve().then(() => {
		setTimeout(() => {
			// loadImg()
		}, 1000)
	})
	return {
		geojsonSource: areaSource,
		geojsonLayer: areaLayer
	}
}
