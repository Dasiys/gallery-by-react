require('normalize.css/normalize.css');
require('styles/App.scss');

// (踩坑)最新版本已不再使用React.findDOMNode(),要引入React-dom，使用ReactDOM.findDOMNode()
import ReactDOM from 'react-dom';
import React from 'react';

// 获取图片相关的数组
var imageDatas=require('../data/imageDatas.json');

// 利用循环函数，设置图片的URL路径信息
imageDatas.forEach(function(singleImageData){
     singleImageData.imageURL=require('../images/'+singleImageData.fileName);
 });

/*
* 获取区间内的一个随机值
* @param low 最小值
* @param high 最大值
*/
var getRangeRandom = (low, high) =>{
    return Math.ceil(Math.random()*(high-low)+low);
}
class AppComponent extends React.Component {
    constructor(props){
        // super的意思是调用父类构造器初始化Props，在这里父类指的是React.Component
        super(props);
        this.state={
            imgsArrangeArr:[
                // {
                //     pos:{
                //         left:'0',
                //         top:'0'
                //     }
                // }
            ]
        };
        this.Constant = {
            centerPos : {
                left : 0,
                right : 0
            },
            hPosRange : {
                leftSecX : [0,0],
                rightSecX : [0,0],
                y : [0,0]
            },
            vPosRange : {
                x : [0,0],
                topY : [0,0]
            }
        };
    }
    // (踩坑)es6写法，不再使用rearrange:function(centerIndex)
    /*
    * 重新布局所有图片
    * @param centerIndex 指定居中排布哪个图片
    */
    rearrange(centerIndex){
        var imgsArrangeArr=this.state.imgsArrangeArr,
            Constant=this.Constant,
            centerPos=Constant.centerPos,
            hPosRange=Constant.hPosRange,
            vPosRange=Constant.vPosRange,
            hPosRangeLeftSecx=hPosRange.leftSecX,
            hPosRangeRightSecx=hPosRange.rightSecX,
            hPosRangeY=hPosRange.y,
            vPosRangeTopY=vPosRange.topY,
            vPosRangeX=vPosRange.x,
            imgsArrangeTopArr=[],
            topImgNum=Math.ceil(Math.random()*2), // 取一个或者不取图片放置上层
            topImgSpliceIndex=0,
            imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);

        // 首先居中centerIndex的图片
        imgsArrangeCenterArr[0].pos=centerPos;

        // 取出要布局上侧图片的状态信息
        topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
        imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value,index){
            imgsArrangeTopArr[index].pos={
                top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            };
        });

        // 布局左右两侧的图片
        for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
            var hPosRangeLOrRX=null;
            // 前半部分布局左边，右半部份布局右边
            if(i<k){
                hPosRangeLOrRX=hPosRangeLeftSecx;
            }else{
                hPosRangeLOrRX=hPosRangeRightSecx;
            }

            imgsArrangeArr[i]={
                pos:{
                    top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                    // left:getRangeRandom(hPosRangeLOrRX[0],hPosRangeLOrRX[1])
                    left:getRangeRandom(hPosRangeLOrRX[0],hPosRangeLOrRX[1])
                }
            };
        }

        if(imgsArrangeTopArr&&imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        // （踩坑）关掉 .eslintrc中的"no-console";
        console.log(this.state.imgsArrangeArr);

        this.setState({
            imgsArrangeArr:imgsArrangeArr
        });
    }
    componentDidMount(){
        // 首先拿到舞台的大小
        var stageDom= ReactDOM.findDOMNode(this.refs.stage),
            stageW=stageDom.scrollWidth,
            stageH=stageDom.scrollHeight,
            halfStageW=Math.ceil(stageW/2),
            halfStageH=Math.ceil(stageH/2);

        // 拿到一个imageFigure的大小
        var imgFigureDom=ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW=imgFigureDom.scrollWidth,
            imgH=imgFigureDom.scrollHeight,
            halfImgW=Math.ceil(imgW/2),
            halfImgH=Math.ceil(imgH/2);

        // 计算中心位置的位置点
        this.Constant.centerPos={
            left:halfStageW-halfImgW,
            top:halfStageH-halfImgH
        };

        // 计算左侧右侧区域图片排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0]=-halfImgW;
        this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW*3;
        this.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
        this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
        this.Constant.hPosRange.y[0]=-halfImgH;
        this.Constant.hPosRange.y[1]=stageH-halfImgH;

        // 计算上侧区域图片排布的取值范围
        this.Constant.vPosRange.topY[0]=-halfImgH;
        this.Constant.vPosRange.topY[1]=halfStageH-3*halfImgH;
        this.Constant.vPosRange.x[0]=halfStageW-imgW;
        this.Constant.vPosRange.x[1]=halfStageW;
        var num = Math.floor(Math.random() * 10);
        this.rearrange(num);
    }
    render() {

        var controllerUnits=[],
            imgFigures=[];
        imageDatas.forEach((value,index)=>{
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index]={
                    pos:{
                        left:'0',
                        top:'0'
                    }
                }
            }
           imgFigures.push(<ImageFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}/>);
        });
        return (
         <section className="stage" ref="stage">
            <section className="img-sec">
                {imgFigures}
            </section>
            <nav className="controller-nav">
                {controllerUnits}
            </nav>
         </section>
    );
  }
}
// 组件加载以后为每张图片其位置的范围
class ImageFigure extends React.Component{
    render(){
        var styleObj={};

        // 如果props属性中指定了这张图片的位置，则使用
        if(this.props.arrange.pos){
            styleObj=this.props.arrange.pos;
        }
        return(
            <figure className="img-figure" style={styleObj}>
                <img src={this.props.data.imageURL} alt={this.props.data.title} />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        );
    }
}
AppComponent.defaultProps = {
};
export default AppComponent;
