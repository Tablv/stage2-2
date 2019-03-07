// 封装一个读写cookie的方法
var myCookie = {
    //此方法是用来设置cookie的,参数有key value days
    set:function(key,value,days){
    //判断value的数据类型

    document.cookie = key+"="+value+";max-days="+days;
    },
    //此方法是用来获取cookie的
    get:function(key){
    //按照 '; '切割
    var result = document.cookie.split('; ');
    //返回value;
    for(var i=0;i<result.length;i++){
        //按等于号切割
        var  resArr = result[i].split("=");
        if(resArr[0] === key){
            return resArr[1];
        }
    }
    }
}