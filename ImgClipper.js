// JavaScript Document
;(function($){
	$.fn.ImagePreview = function(options){
		var $this = $(this);
		if(!$this.length) return;
		var opts = $.extend({
			trigger:function(){
				return true;
			},
			success:function(imgdata){
				//console.log(imgobj.toString());
			}
		},options);
		var checktype = function(type){
			var types = ["jpg","jpeg","png","gif","bmp"];
			if(types.indexOf(type.toLowerCase())<0){
				alert("不支持的文件格式！");
				return false;
			}
			return true;
		}
		var changeEv = function(){
			if(!opts.trigger()) return;
			var setImgobj = function(url){
				var imgObj = $("<img />").attr("src",url);
				var tmr = setInterval(function(){
					if(imgObj[0].complete){
						clearInterval(tmr);
						opts.success({
							imgObj:imgObj,
							width:imgObj[0].width,
							height:imgObj[0].height
						});
					}
				},200);
			}

			if(this.files){
				var file = this.files[0];
				if(!file) return;
				console.log(file.type);
				if(!checktype(file.type.replace("image/",""))) return;
				if (window.createObjectURL) { // basic
					url = window.createObjectURL(file);
					setImgobj(url);
				} else if (window.URL) { // mozilla(firefox)
					url = window.URL.createObjectURL(file) ;
					setImgobj(url);
				} else if (window.webkitURL) { // webkit or chrome
					url = window.webkitURL.createObjectURL(file) ;
					setImgobj(url);
				}
				//console.log("objUrl = "+objUrl) ;
			}else{
				if(!$this.val()) return;
				var isie = window.navigator.userAgent.indexOf("MSIE")>0;
				var isie6 = window.navigator.userAgent.indexOf("MSIE 6")>0;
				if(isie){
				   if(isie6 == 6.0){
					  setImgobj($this.val());
				   }else{
						var imgSrc = $this.val();
						if(!imgSrc) return;
						var filetype = imgSrc.substring(imgSrc.lastIndexOf(".")+1,imgSrc.length);
						if(!checktype(filetype)) return;
						this.select();
						try{
							imgSrc = document.selection.createRange().text;
						}catch(e){
							alert("您的浏览器不支持图片预览，请尝试以下设置：\n 打开 Internet选项 -> 安全 -> 自定义级别 -> 找到“其他”中的“将本地文件上载至服务器时包含本地目录路径”，选中“启用”，点击“确定”即可。");
							return;
						}

						var objPreviewFake = $("<div></div>").css("filter","progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src='"+imgSrc+"')").appendTo("body");
						var objPreviewSizeFake = $("<div style=\"position:absolute;left:-100%;width:1px; height:1px\"></div>").css({"filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=image,src='"+imgSrc+"')"}).appendTo("body");

						//objPreviewFake[0].filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src= imgSrc;
						//objPreviewSizeFake[0].filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src= imgSrc;
						//alert(objPreviewSizeFake[0].offsetWidth)
						//alert(objPreviewSizeFake[0].offsetHeight)
						opts.success({
							imgObj:objPreviewFake.clone().css({width:objPreviewSizeFake.width(),height:objPreviewSizeFake.height()}),
							width:objPreviewSizeFake.width(),
							height:objPreviewSizeFake.height()
						});
						$(objPreviewFake).remove();
						$(objPreviewSizeFake).remove();
				   }
				}
			}
		}
		$this.change(changeEv);
	}

	$.fn.imgClip = function(options){
		var $this = $(this);
		if(!$this.length) return;
		var opts = $.extend({
			z_index:9999,
			clipProp:{w:0,h:0},
			canvasSize:{w:500,h:390},
			trigger:function(){
				return true;
			},
			okbtn:function(data){
				alert(JSON.stringify(data))
			}
		},options);


		$this.ImagePreview({
			trigger:function(){
				return opts.trigger();
			},
			success:function(imgdata){
				crop(imgdata);
			}
		});

		var crop = function(imgdata){
			var wh = opts.clipProp;//裁剪比例
			var islim = wh.w*wh.h;//是否约束比例

			var cvsW = opts.canvasSize.w;//画布宽度
			var cvsH = opts.canvasSize.h;//画布高度
			var imgW = imgdata.width;//图片原始宽度
			var imgH = imgdata.height;//图片原始高度
			var adamul = imgW*cvsH>=imgH*cvsW?cvsW/imgW:cvsH/imgH;//图片相对画布缩放比例

			var imgScW = imgW*adamul;//按比例缩放后的高度
			var imgScH = imgH*adamul;//按比例缩放后的宽度

			var scale = imgW/imgScW; ///缩放倍数

			var wtp = wh.w;
			var htp = wh.h;

			if(!islim){//如果没有比例约束，默认裁剪区域比例为1：1
				htp = 1;
				wtp = 1;
			}
			var mul = imgScW*htp>imgScH*wtp?imgScH/htp:imgScW/wtp;//裁剪区域倍数

			var cropW = mul*wtp;//裁剪区域初始宽度
			var cropH = mul*htp;//裁剪区域初始高度

			if(cropW>cropH){
				if(cropH>cvsH*0.5){
					cropH = cvsH*0.5;
					cropW = wtp*(cropH/htp);
				}
			}else{
				if(cropW>cvsW*0.5){
					cropW = cvsW*0.5;
					cropH = htp*(cropW/wtp);
				}

			}
			var $cover = $("<div style='position:fixed; width:100%; height:100%;  background-color:#000;background-color:rgba(0,0,0,.6);filter:progid:DXImageTransform.Microsoft.Alpha(opacity=60); left:0; top:0;'></div>").css("z-index",opts.z_index);
			var $frame = $("<div style=\"position:absolute;border:1px solid #ccc; top:50%; left:50%; margin-left:-300px; margin-top:-300px;\">"+
						"	<div style=\" background-color:#f5f5f5;border-bottom:1px solid #ccc; padding:12px 20px\">图片裁剪</div>"+
						"	<div style=\"width:500px; padding:20px; background-color:#fff\">"+
						"		<div style=\"width:"+cvsW+"px;height:"+cvsH+"px;background-color:#eee;position:relative;\" class=\"imgcropwrap\"></div>"+
						"		<div style=\"padding-top:20px;text-align:center\"><input type=\"button\" value=\"取 消\" class=\"cancelbtn\"/><input type=\"button\" value=\"确 定\" class=\"okbtn\"/></div>"+
						"	</div>"+
						"</div>").css("z-index",opts.z_index+1);
			var $imgobj = imgdata.imgObj.clone().css({width:imgScW,height:imgScH})
			var $imgbox = $("<div style=\"position:absolute;font-size:0\"></div>").css({width:imgScW,height:imgScH,left:(cvsW-imgScW)/2,top:(cvsH-imgScH)/2}).css("z-index",opts.z_index+2);
			var $point = $("<div style=\"position:absolute; border:1px solid #fff; width:5px; height:5px; right:-3px; bottom:-3px; cursor:se-resize; background-color:#999; background-color:rgba(0,0,0,.6);\"></div>").css("z-index",opts.z_index+5);
			var $covers = $("<div></div><div></div><div></div><div></div>").attr("style","position:absolute;background-color:#000;opacity:.6;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=60);").css("z-index",opts.z_index+3)
			var $clipbox = $("<div style=\"position:absolute;cursor:move; background:url(about:blank)\"></div>").css({width:cropW,height:cropH,left:(imgScW-cropW)/2,top:(imgScH-cropH)/2}).css("z-index",opts.z_index+4);

			var isResize = false;
			var isMove = false;

			var ref = {};

			var resetRef = function(e){
				ref.mouseX = e.clientX;
				ref.mouseY = e.clientY;
				ref.cropW = $clipbox.width();
				ref.cropH = $clipbox.height();
				ref.cropX = $clipbox.position().left;
				ref.cropY = $clipbox.position().top;
			}

			var realSize = function(){
				var cw = $clipbox.width(),
					ch = $clipbox.height(),
					cx = $clipbox.position().left,
					cy = $clipbox.position().top;
				$covers.eq(0).css({top:0,left:0,width:"100%",height:cy});
				$covers.eq(1).css({top:cy,left:0,width:cx,height:ch});
				$covers.eq(2).css({bottom:0,left:0,width:"100%",height:imgScH-(ch+cy)});
				$covers.eq(3).css({top:cy,right:0,width:imgScW-(cw+cx),height:ch});
				return {
					x:Math.ceil(cx*scale),
					y:Math.ceil(cy*scale),
					w:Math.ceil(cw*scale),
					h:Math.ceil(ch*scale)
					}
			}

			$point.mousedown(function(e){
				e.stopPropagation();
				resetRef(e);
				isResize = true;
				$("body").css("cursor","se-resize");
			});
			$clipbox.mousedown(function(e){
				resetRef(e);
				isMove = true;
				$("body").css("cursor","move");
			});
			$(document).mousemove(function(e){
				var x = e.clientX;
				var y = e.clientY;
				if(isMove){
					var thisx = ref.cropX + (x-ref.mouseX);
					var thisy = ref.cropY + (y-ref.mouseY);
					//范围约束
					if(thisx+ref.cropW>imgScW) thisx = imgScW-ref.cropW;
					if(thisy+ref.cropH>imgScH) thisy = imgScH-ref.cropH;

					if(thisx<=0) thisx = 0;
					if(thisy<=0) thisy = 0;

					$clipbox.css({left:thisx,top:thisy});
				}
				if(isResize){
					var thisw = ref.cropW+(x-ref.mouseX);
					var thish = ref.cropH+(y-ref.mouseY);
					//范围约束
					if(thisw+ref.cropX>imgScW) thisw = imgScW-ref.cropX;
					if(thish+ref.cropY>imgScH) thish = imgScH-ref.cropY;

					//比例约束
					if(islim){
						if(thisw*wh.h>thish*wh.w){
							thisw = thish*wh.w/wh.h;
						}else{
							thish = thisw*wh.h/wh.w;
						}
					}
					var minlen = 20;

					if(thish<=minlen){
						thish = minlen;
						if(islim) return;
					}
					if(thisw<=minlen){
						thisw = minlen
						if(islim) return;
					}
					$clipbox.width(thisw);
					$clipbox.height(thish);
				}
				realdata = realSize();
			}).mouseup(function(e){
				isResize = false;
				isMove = false;
				$("body").css("cursor","auto");
			});
			$(window).blur(function(){
				$(document).triggerHandler("mouseup");
			});


			$frame.attr('unselectable','on').on('selectstart', function(){ return false; }).css({
				'-moz-user-select':'-moz-none',
				'-moz-user-select':'none',
				'-o-user-select':'none',
				'-khtml-user-select':'none', /* you could also put this in a class */
				'-webkit-user-select':'none',/* and add the CSS class here instead */
				'-ms-user-select':'none',
				'user-select':'none'
			});

			$frame.find(".okbtn").click(function(){
				opts.okbtn({
					imgdata:imgdata,
					cropdata:realdata
				});
				$frame.find(".cancelbtn").trigger("click");
			}).css({"background":"#5cb85c","color":"#fff","border":"1px solid #4cae4c","border-radius":"4px","width":"80px","height":"30px"});
			$frame.find(".cancelbtn").click(function(){
				$cover.remove();
				$frame.remove();
			}).css({"background":"#eee","color":"#666","border":"1px solid #ccc","border-radius":"4px","width":"80px","height":"30px","margin-right":"20px"});
			$cover.appendTo("body");
			$point.appendTo($clipbox);
			$imgobj.appendTo($imgbox);
			$clipbox.appendTo($imgbox);
			$covers.appendTo($imgbox);
			$imgbox.appendTo($frame.find(".imgcropwrap"))
			$frame.appendTo("body");
			$frame.css({left:"50%",top:"50%","margin-left":-$frame.width()*0.5,"margin-top":-$frame.height()*0.5})
			var realdata = realSize();

		}
	}

})(jQuery);
