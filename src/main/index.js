class initMap {
	constructor(container) {
		this.target = null
		this.map = null
		this.mapId = null
		this.container = container
		this.currentLevel = 'province'
		this.parentId = null
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
	}
}
