//以面向对象的形式,实现一些东西
var ggl = {
    c1:null,//画布dom元素
    ctx:null,//画布对象
    c1width:376,//画布宽
    c1height:82,//画布高
    ismousedown:false,//标识位,鼠标是否按下
    is_ok:false, //标识位,是否刮开一半
    num:3, //刮的次数

    init:function(){//刮刮乐的初始方法
    //获取画布元素
    this.c1 = document.getElementById('canvas1');
    //获取画布对象
    this.ctx = this.c1.getContext('2d');
    //给画布设置宽高
    this.c1.width = this.c1width;
    this.c1.height = this.c1height;
    //初始化画布的方法
    this.initCanases();
    eventTools.mouseEvent.call(this,this.c1,this.mouseDown,this.mouseMove,this.mouseUp);
    //初始化刮刮乐内容;
    this.setResult();
    },

    //初始化画布
    initCanases:function(){
    // 绘制灰色矩形 #797979
    this.ctx.fillStyle = '#797979';
    this.ctx.fillRect(0,0,this.c1width,this.c1height);  
    //  绘制文字 '刮一刮' #666  文字居中垂直显示 bold 大小:30px;
    this.ctx.fillStyle = '#ddd';
    this.ctx.font = 'blod 30px microsoft yahei';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle'; //垂直居中
    this.ctx.fillText('刮一刮',this.c1width/2,this.c1height/2);
    //设置图层顺序
    this.ctx.globalCompositeOperation = "destination-out";

    },
    //初始化刮刮乐内容
    setResult:function(){
        //设置抽奖的次数
        document.querySelector(".num1").innerHTML = this.num;
        if(this.num==0){
        document.querySelector(".num").innerHTML = '您的抽奖次数已经用完,请明天再来,哈哈哈';
        return;
        }
        //画布消失后,随即出现再来一次,或者领奖按钮
        //定义数据,奖品
        var relist = ['谢谢惠顾','今天天气真好','哈哈哈,再接再励呀','真遗憾,没有中奖,再来一次吧','恭喜你!'];
        //定义随即数
        var rand = Math.round(Math.random()*(relist.length-1));
        //获取标签元素
        var ele = document.getElementById('prompt');
        ele.innerHTML=relist[rand];
        //通过判断内容,来实现按钮
        if(relist[rand]=='恭喜你!'){
            document.querySelector('.btn#ok').style.display ='block';
        }else{
            document.querySelector('.btn#no').style.display ='block';
        }
        //控制抽奖次数
        this.num--;
    },
   


    mouseDown:function(e){
        //取消之前的事件,避免出现事件重叠
        e.preventDefault();
        //鼠标按下
        //此时this指向ggl
        //将鼠标按下是否的标识,改为true,标识已经识别到鼠标按下
        this.ismousedown = true;
    },
    mouseMove:function(e){
        //取消之前的事件,避免出现事件重叠
        e.preventDefault();
        //鼠标移动
        //不停的绘制圆覆盖在矩形画布上
        if(!this.ismousedown){
            return;
        };
        var x = e.point.dx;
        var y = e.point.dy;
        this.ctx.beginPath();
        this.ctx.arc(x,y,20,0,Math.PI*2);
        this.ctx.fill();
    },
    mouseUp:function(e){
        //取消之前的事件,避免出现事件重叠
        e.preventDefault();
        
        //鼠标弹起
        //将鼠标按下是否的标识,改为false,标识已经识别到鼠标按下
        this.ismousedown = false;
        //获取画布中灰色矩形的像素
        var idata = this.ctx.getImageData(0,0,this.c1width,this.c1height);
        console.log(idata);
        for(var i=0,j=0;i<idata.data.length;i+=4){
            if(idata.data[i] ===0){
                j++;
            }
        }
        if(j > idata.data.length/8){
            //表示刮的超过了一半
            this.is_ok = true;
            //把剩余没有刮完的部分去掉
            this.ctx.clearRect(0,0,this.c1width,this.c1height);
        }
        console.log(j);
    }

    
};
//当页面加载完成之后,
window.onload = function(){
    ggl.init();
}