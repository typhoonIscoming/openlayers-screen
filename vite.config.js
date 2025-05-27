export default {
	build: {
		sourcemap: true
	},
	server: {
		port: 5173, // vite的默认端口是5173
		open: true, // 服务启动后，自动在浏览器中打开，默认是不打开的
		hmr: true // 为开发服务启用热更新，默认是不启用热更新的
	}
}
