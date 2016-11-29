require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';

// 获取图片相关的数组
var imageDatas=require('../data/imageDatas.json');

// 利用循环函数，设置图片的URL路径信息
imageDatas.forEach(function(singleImageData){
     singleImageData.imageURL=require('../images/'+singleImageData.fileName);
 });
class AppComponent extends React.Component {
    constructor(){
        super();

    }
    render() {
    return (
     <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
     </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
