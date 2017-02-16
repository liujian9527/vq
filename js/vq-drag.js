$().extend('drag',function(){
	
	for(i=0;i<this.elements.length;i++)
	{
		Drag(this.elements[i]);
	}
	
	
			function Drag(oDiv){
				
				var disL=0;
				var disT=0;
				oDiv.onmousedown=function(ev)
				{
					var e=ev||event;
					disL=e.clientX-oDiv.offsetLeft;
					disT=e.clientY-oDiv.offsetTop;
					if (oDiv.setCapture) {
						oDiv.setCapture();
					}
					//鼠标按下时的初始坐标值 然后进行鼠标移动
					document.onmousemove=function(ev)
					{
						
						
						var e=ev||event;
						var L=e.clientX-disL;
						var T=e.clientY-disT;
						//记录 div的位置=鼠标移动后的坐标值-初始值
						
						if (L<0) {
							L=0;
						}else if(L>document.documentElement.clientWidth-oDiv.offsetWidth) {
							L=document.documentElement.clientWidth-oDiv.offsetWidth;
						}
						if (T<0) {
							T=0;
						}else if(T>document.documentElement.clientHeight-oDiv.offsetHeight){
							T=document.documentElement.clientHeight-oDiv.offsetHeight;
						}
						
						//用户体验避免div拖拽的可视区外部
						
						oDiv.style.left=L+'px';
						oDiv.style.top=T+'px';
					}
					document.onmouseup=function()
					{
						if (oDiv.releaseCapture) {
							oDiv.releaseCapture()
						}
						document.onmousemove=null;
						document.onmouseup=null;
						//移动和抬起开关要及时清除
					}
					return false;		//FF bug
				}
			}
})