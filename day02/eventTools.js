// 全局添加一个 eventTools 对象
// elem : 需要绑定事件的dom元素
// moused | mousem | mouseu :每一个事件对应的回调函数 
window.eventTools = {};
//添加一个方法到eventTools  把mousedown|mouseup|mousemove三个事件封装到其中
eventTools.mouseEvent = function(elem,moused,mousem,mouseu){
    //获取当前鼠标坐标的方法
    function getPoints(e){
        //e  --->event
        //pageX|pageY可以获取鼠标在页面上的实时坐标
        // offsetLeft|offsetTop可以获取elem元素的偏移值
        //根据上面内容,计算数来当前elem内的实时坐标
        var left= document.getElementById('top').offsetLeft;
        var top= document.getElementById('top').offsetTop;
        var x  = e.pageX - elem.offsetLeft - left;
        var y  = e.pageY - elem.offsetTop -top;
        return {dx:x,dy:y};

    }
    // 留住this 
    var _this = this;
    //绑定事件件 addEventListener
    elem.addEventListener('mousedown',function(event){
        //写真正要做的事情 ---真正业务逻辑(在外边定义)
        event.point = getPoints(event);
        moused && moused.call(_this,event);
    })
    elem.addEventListener('mousemove',function(event){
        event.point = getPoints(event);
        mousem && mousem.call(_this,event);
    })
    elem.addEventListener('mouseup',function(event){
        event.point = getPoints(event);
        mouseu && mouseu.call(_this,event);
    })
    
}