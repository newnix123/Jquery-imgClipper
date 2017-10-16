# Jquery-imgClipper 图片裁剪工具
**[点击查看demo](https://newnix123.github.io/Jquery-imgClipper/)**
# 使用方法
### 引入Jquery 和 Jquery-imgClipper
``` html
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script src="ImgClipper.js"></script>
```
### html
``` html
<input type="file" id="filedata"/>
```
### script
``` javascript
$('#filedata').imgClip({
  z_index:9999,//层级
  clipProp:{w:4,h:3},//约束选框宽高比例,0为不约束
  canvasSize:{w:500,h:390},//图片外框大小px
  trigger:function(){//input onchange事件之后，裁剪框弹出之前
    return true;//必须返回Boolean，返回false即终止
  },
  okbtn:function(data){//点击‘确定’按钮
    console.log(JSON.stringify(data.cropdata));//获取框选区域位置和大小，传给后端来处理
  }
});
```
