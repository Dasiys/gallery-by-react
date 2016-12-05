# gallery-by-react
one photo gallery project based on react

1.安装node.js,最新版会包含npm。
2.然后就是安装webpack，最新版的去除了gruntfile，以及webpack.config也做了变化，相关的内容都在cfg文件夹下。
// 安装全局yoman
npm install -g yo

// 查看yoman版本
yo version

// 安装yo
npm install yo

// 安装react生成器
npm install -g generator-react-webpack

yo react-webpack ****   //***表示你的项目名称

3.使用npm start来启动项目，不是grunt server.
4.采用了es6的写法，使用foreach进行循环时，不用再bind(this)
5.图标可以在https://icomoon.io这个网站进行下载。
6.使用图标 ::after时，content为"\e965"
