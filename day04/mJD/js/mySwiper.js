/* 
    实现移动端轮播图
    1.自动轮播
        定时器+CSS3的transition过渡和translate位移,无缝衔接(过渡结束+定位)
    2.滑动效果
        需要结合 touch 事件
*/ 
window.onload=function(){
    
    mySwiper01.innerSwiper();
    // console.log(mySwiper01.addtrans());
    searchChange();
};
//用面向对象的形式重构

//轮播图对象
//属性+功能
var mySwiper01={
    //属性
    //图片宽度
    w:document.querySelector('.jd_banner').clientWidth,
    //图片盒子
    imageBox:document.querySelector('.jd_banner ul:first-child'),
    //原点点集合
    points:document.querySelectorAll('.jd_banner ul:last-child li'),
    
    //图片索引
    index:1,
    //定时器
    timer: null,
    startX : 0 , //记录开始滑动的坐标
    moveX : 0,  //记录滑动结束时候的坐标
    distanceX : 0, //滑动的距离 moveX - startX
    isMove: false,  //是否滑动过
    

    //功能
    innerSwiper:function(){
        //初始化轮播图
        //启动定时器
        this.setTimer();
        //对页面后台的可视性
        this.backstag();
        // index >=9 设置 index 为 1
        // 过渡结束事件  过渡结束后触发
        // console.log(this.imageBox.addEventListener.call())
        this.imageBox.addEventListener('transitionend',function(){
            this.cleartrans();
            this.addtransl(-this.w * this.index); //定位到第一张
        }.bind(this));
        //实现滑动效果  touch事件
        //我们需要在touch的过程中记录一些值
        // startX | moveX | distanceX | isMove
        this.imageBox.addEventListener('touchstart',function(e){
            e.preventDefault();
            //停止自动轮播
            //停止计时器
            clearInterval(this.timer);
            this.timer = null;
            this.startX = e.touches[0].pageX; //记录起始坐标
        }.bind(this));
        this.imageBox.addEventListener('touchmove',function(e){
            e.preventDefault();
            this.isMove = true; //表示 开始滑动
            this.moveX = e.touches[0].pageX; // 记录 moveX
            this.distanceX = this.moveX - this.startX; // 计算 distanceX
            this.cleartrans();
            this.addtransl(-this.w * this.index + this.distanceX);
        }.bind(this));
        //当滑动距离超过图片的四分之一是,是有效滑动,就滑到上一张,或下一张,
        //否则  是无效滑动
        this.imageBox.addEventListener('touchend',function(e){
            e.preventDefault();
            //判断有没有滑动,如果没有滑动,就直接return
            if(this.isMove){
                //判断滑动时候有效 > w/4
                //Math.abs 绝对值
                console.log(this.distanceX);
                if(Math.abs(this.distanceX) > this.w/4){
                    //当前的行为是有效的
                    //滑动情况的判断:上一张或者下一张
                    if(this.distanceX > 0){
                        //上一张
                        this.index--;
                    }else{
                        this.index++;
                    }
                }
                this.addtrans();
                this.addtransl(-this.w*this.index);
                this.setPoint();
            }
            //再次启动定时器,重新初始化变量
            this.startX =0 , //记录开始滑动的坐标
            this.moveX = 0,  //记录滑动结束时候的坐标
            this.distanceX =0, //滑动的距离 moveX - startX
            this.isMove = false;  //是否滑动过
            this.setTimer();
        }.bind(this))
    },
    //公共方法
    //过渡方法 addtrans
    addtrans:function(){
        this.imageBox.style.transition="all 0.3s ease-out";
        this.imageBox.style.webkiTransition="all 0.3s ease-out";//兼容写法
    },
    //位移方法 addtranl
    addtransl:function(x){
        this.imageBox.style.transform="translateX("+x+"px)";
        this.imageBox.style.webkiTransition="translateX("+x+"px)";//兼容写法
    },
    //清除过渡方法 cleartrans
    cleartrans:function(){
        this.imageBox.style.transition="none";
        this.imageBox.style.webkiTransition="none";
    },
    //后台运行控制
    backstag:function(){
        document.addEventListener('visibilitychange',function(){
            //判断当前时候可见
            if(document.hidden){
                clearInterval(timer);
                this.timer = null;
            }else{
                this.setTimer();
            }
        });
    },
    setTimer:function(){
        this.timer = setInterval(function(){
            this.index++;//到下一张
            //调整位移  过渡
            this.addtrans();
            this.addtransl(-this.w*this.index);
            this.setPoint();
        }.bind(this),2000);
    },
    //指示器跟随轮播图滚动(改变当前点的样式)
    setPoint:function(){
        for(var i = 0;i<this.points.length;i++){
            this.points[i].className = '';
        }
        if(this.index >=9){
            this.index = 1;
        }else if(this.index <= 0){
            this.index = 8;
        }
        this.points[this.index-1].className = 'now';

    }
};


/*
搜索区域透明度变化
*/
function searchChange(){
    /* 
        1.区域透明度   随着页面滚动  逐渐加深
            scroll  滚动事件
            scrollTop   距离页面顶部的滚动距离
        2.当滚动超过    轮播图高度时, 透明度不变
    */
   //搜索盒子
   var searchBox = document.querySelector('.jd_header_box');
   //图片高度
   var h = document.querySelector('.jd_banner').clientHeight;
   //监听滚动事件
   window.onscroll = function(){
       /* 
        不断的获取  doucment.body.scrollTop
       */
      var top = document.body.scrollTop;
      console.log(top);
      //设置透明度 apacity 为0
      var opacity = 0;
      if(top<h){
          opacity = top / h;
      }else{
          opacity = 1;
      }
      searchBox.style.backgroundColor = "rgba(201,21,35,"+opacity+")";
   }
}