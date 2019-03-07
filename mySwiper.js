/* 
  实现移动端轮播图 
  1.自动轮播
    定时器+CSS3的transition过渡和translate位移, 无缝衔接(过渡结束+定位) 
  2.滑动效果
    需要结合 touch 事件 
*/
window.onload = function () {
  // mySwiper();
  mySwiper.initSwiper();
  searchChange();
};
/* 对象的形式重构它 */
var mySwiper = {
  banner: null,
  w: 0,
  imageBox: null,
  pointBox: null,
  points: null,
  index: 1,
  startX: 0,
  moveX: 0,
  distanceX: 0,
  isMove: false,
  timer: null,
  initSwiper: function () {
    this.banner = document.querySelector('.jd_banner');
    this.w = this.banner.clientWidth;
    this.imageBox = this.banner.children[0];
    this.pointBox = this.banner.children[1];
    this.points = this.pointBox.querySelectorAll('li');
    var _this = this;
    this.setTimer();
    // visibilitychange 页面可见性改变事件 
    document.addEventListener('visibilitychange', function () {
      // 判断当前是否可见 
      if (document.hidden) {
        clearInterval(_this.timer);
        _this.timer = null;
      } else {
        // 否则，再起执行 timer 
        _this.setTimer();
      }
    });
    /*  过渡结束事件 transitionEnd */
    this.imageBox.addEventListener("webkitTransitionEnd", function () {
      // 处理过渡结束之后的逻辑
      if (_this.index >= 9) {
        _this.index = 1;
      } else if (_this.index <= 0) {
        _this.index = 8;
      }
      _this.cleartrans();
      _this.addtranl(-_this.w * _this.index); // 定位到第一张
      
    });
    // 调用 touchEvent
    this.touchEvent(this.imageBox, this.touchStart, this.touchMove, this.touchEnd);
  },
  // timer 的封装 
  setTimer: function () {
    var _this = this;
    this.timer = setInterval(function () {
      _this.index++; // 到下一张  
      // 调用位移 过渡 
      _this.addtrans();
      _this.addtranl(-_this.w * _this.index);
      _this.setPoint();
    }, 2000);
  },
  addtrans: function () {
    this.imageBox.style.transition = "all 0.3s ease-out";
    this.imageBox.style.webkitTransition = "all 0.3s ease-out"; // 兼容写法
  },
  addtranl: function (x) {
    this.imageBox.style.transform = "translateX(" + x + "px)";
    this.imageBox.style.webkitTransform = "translateX(" + x + "px)";
  },
  cleartrans: function () {
    this.imageBox.style.transition = "none";
    this.imageBox.style.webkitTransition = "none";
  },
  setPoint: function () {
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].className = '';
    }
    var n;
    if(this.index > 8){
      n = 9;
    }else if(this.index < 1) {
      n = 7;
    }else{
      n = 1;
    }
    this.points[Math.abs(this.index - n)].className = 'now';
  },
  touchEvent: function (elem, touchs, touchm, touche) {
    // this-> mySwiper 
    var _this = this;
    elem.addEventListener('touchstart', function (e) {
      // this ->  
      touchs && touchs.call(_this, e);
    });
    elem.addEventListener('touchmove', function (e) {
      touchm && touchm.call(_this, e);
    });
    elem.addEventListener('touchend', function (e) {
      touche && touche.call(_this, e);
    });
  },
  // 三个touch事件回调
  touchStart: function (e) {
    e.preventDefault(); // 取消前面的事件
    // 停止自动轮播 
    clearInterval(this.timer);
    this.timer = null;
    this.startX = e.touches[0].pageX; // 记录起始坐标
  },
  touchMove: function (e) {
    e.preventDefault();
    this.isMove = true; // 表示 开始滑动
    this.moveX = e.touches[0].pageX; // 记录moveX
    this.distanceX = this.moveX - this.startX; // 计算 distanceX 
    this.cleartrans();
    this.addtranl(-this.w * this.index + this.distanceX); // 滑动的位置
  },
  touchEnd: function (e) {
    e.preventDefault();
    if (this.isMove) {
      // 判断滑动滑动是否有效 distanceX > w/4 有效的
      if (Math.abs(this.distanceX) > this.w / 4) {
        // 滑动到 上一张 或 下一张 
        if (this.distanceX > 0) { // 上一张
          this.index--;
        } else {
          this.index++;
        }
        // 调用过渡+位移
        this.addtrans();
        this.addtranl(-this.w * this.index);
        this.setPoint(); 
      } else { // 滑动无效
        // 位移回去 
        this.addtrans();
        this.addtranl(-this.w * this.index);
      }
    }
    // 再次启动定时器 初始化参数 
    this.startX = 0, this.moveX = 0, this.distance = 0, this.isMove = false;
    this.setTimer();
   
  }
};

/* 搜索区域透明图变化 */

function searchChange(){
  /* 
    1.区域透明度 随着页面滚动 逐渐加深
         scroll 滚动事件  scrollTop 
    2.当滚动超过 轮播图高度是，透明度不变
  */
   // 搜索盒子
   var searchBox = document.querySelector('.jd_header_box');
   // 图片高度 
   var h =  document.querySelector('.jd_banner').clientHeight;
   // 监听滚动事件 
   window.onscroll = function(){
      /* 
        不断的获取 document.body.scrollTop 
        offsetTop  < h  逐渐改变透明度 0 ~ 1   
      */
      var top = document.documentElement.scrollTop;
      // 设置 透明度 opacity 为 0
      var opacity = 0;
      if(top < h){
         opacity =  top / h;   
      }else{
         opacity = 1;        
      }
      searchBox.style.backgroundColor = "rgba(201,21,35,"+ opacity +")";
   }
}


