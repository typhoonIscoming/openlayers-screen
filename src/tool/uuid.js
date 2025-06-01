export default function v4(len) {
	let bit = 8,
		max = 36,
		min = bit
	if (len instanceof Number) {
		bit = len > max ? max : len < min ? min : len
	}
	// const str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.slice(0, bit)
	// return str.replace(/[xy]/g, function (c) {
	// 	var r = (Math.random() * 16) | 0
	// 	var v = c == 'x' ? r : (r & 0x3) | 0x8
	// 	return v.toString(16)
	// })
	var characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var result = characters.charAt(
		Math.floor(Math.random() * characters.slice(0, 52).length)
	)
	for (var i = 0; i < bit; i++) {
		var randomIndex = Math.floor(Math.random() * characters.length)
		result += characters.charAt(randomIndex)
	}
	return result
}
