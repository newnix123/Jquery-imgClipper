# Jquery-imgClipper 图片裁剪工具
支持iE7+
## [点击查看demo](https://newnix123.github.io/Jquery-imgClipper/)
# Use
## 引入Jquery
``` html
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
```
## 引入Jquery-imgClipper
``` html
<script src="ImgClipper.js"></script>
```
## html
``` html
<input type="file" id="filedata"/>
```
## script
``` javascript
$('#filedata').imgClip({
  z_index:9999,//层级
  clipProp:{w:4,h:3},//约束选框宽高比例
  canvasSize:{w:500,h:390},//图片外框大小px
  trigger:function(){//input onchange事件之后，裁剪框弹出之前
    return true;//必须返回Boolean，返回false则终止
  },
  okbtn:function(data){//点击‘确定’按钮
    //返回框选区域位置大小
    console.log(JSON.stringify(data.cropdata));
  }
});
```
