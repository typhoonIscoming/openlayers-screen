;(function (global) {
	//开启严格模式
	'use strict'
	//构造函数定义一个类,使用new调用

	if (typeof module !== 'undefined' && module.exports) {
		//CommonJs规范
		module.exports = initMap
	} else if (typeof define === 'function') {
		//AMD/CMD规范
		define(function () {
			return initMap
		})
	} else {
		//global指向this,this在插件外指向window.可以直接使用script标签
		global.initMap = initMap
	}
})(this)
