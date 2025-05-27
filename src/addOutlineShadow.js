export default function addOutlineShadow(ctx, option) {
	// 设置属性控制图形的外观
	ctx.fillStyle = option.fillStyle || 'transparent'
	ctx.strokeStyle = option.strokeStyle || 'transparent'
	ctx.lineWidth = option.lineWidth || 1

	//  设置Y轴偏移量
	ctx.shadowOffsetY = option.shadowOffsetY || 20
	//  设置X轴偏移量
	ctx.shadowOffsetX = option.shadowOffsetX || 2
	//  设置模糊度
	ctx.shadowBlur = option.shadowBlur || 2
	//  设置阴影颜色
	ctx.shadowColor = option.shadowColor || '#000'
	ctx.beginPath()
	let arr = option.coodArr || []
	for (let i = 0; i < arr.length; i++) {
		const data = arr[i]
		if (i === 0) {
			ctx.moveTo(data[0], data[1])
		} else {
			ctx.lineTo(data[0], data[1])
		}
	}
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}
