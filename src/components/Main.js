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

/*
* 获取0-30度之间的任意正负值
*/
var get30DegRandom=()=>{
    return (Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30);
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
                //     }，
                //     rotate:0 //旋转角度
                //     isInverse:false // 图片正反面判断,false正面
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

        // 居中的图片不需要旋转
        imgsArrangeCenterArr[0].rotate=0;

        // 取出要布局上侧图片的状态信息
        topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
        imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value,index){
            imgsArrangeTopArr[index]={
                pos:{
                    top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                    left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                },
                rotate:get30DegRandom(),
                isInverse:false
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
                },
                rotate:get30DegRandom()
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
    /*
    * 翻转图片
    * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
    * @return {function}这是一个闭包函数，其内return一个真正待被执行的函数
    * 闭包:能够读取其他函数内部变量的函数
    */
    inverse(index){
        return function(){
            var imgsArrangeArr=this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr:imgsArrangeArr
            });
        }.bind(this);

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
                    },
                    rotate:0
                }
            }
           imgFigures.push(<ImageFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}/>);
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
    constructor(props){
        super(props);
    }
    /*
    * ImageFigure的click函数
    */
    handleClick(e){
        console.log(this);
        this.props.inverse();
        e.stopPropagation();
        e.preventDefault();
    }
    render(){
        var styleObj={};

        // 如果props属性中指定了这张图片的位置，则使用
        if(this.props.arrange.pos){
            styleObj=this.props.arrange.pos;
        }
        // 如果图片的旋转角度不为0，添加旋转角度(es6写法)
        if(this.props.arrange.rotate){
            (['-moz-','-ms-','-webkit-','']).forEach((value)=>{
                styleObj[`${value}transform`]=`rotate(${this.props.arrange.rotate}deg)`;
            });
            
        }
        var imgFigureClassName='img-figure';
        imgFigureClassName+=this.props.arrange.isInverse?' is-inverse':'';
        return(
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
                <img src={this.props.data.imageURL} alt={this.props.data.title} />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick.bind(this)}><p>{this.props.data.desc}</p></div>
                </figcaption>
            </figure>
        );
    }
}
AppComponent.defaultProps = {
};
export default AppComponent;
