/*
 * this指向  this不能用获取对象上没有原型链, $(this)能用 
*/

function myAddEvent(obj,sEv,fn){
	if(obj.addEventListener)
	{
		obj.addEventListener(sEv, function(ev){
			if (false==fn.call(obj)) {
				ev.cancelBubble=true;
				ev.preventDefault();
			}
		}, false);
	}
	else
	{
		obj.attachEvent('on'+sEv, function (){
			if (false==fn.call(obj)) {
				event.cancelBubble=true;
				return false;
			}
		});
	}
}



function getByClass(oParent,sClass){
	var aEle=oParent.getElementsByTagName('*');
	var aResult=[];
	for (var i=0; i<aEle.length; i++) {
		if (aEle[i].className==sClass) {
			aResult.push(aEle[i]);
		}
	}
	return aResult;
}

//获取计算后的样式 style只获取行间样式
function getStyle(obj,attr){     
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}

//选择器
function VQ (vArg){	
//	elements属性，存储选中的元素
	this.elements=[];
	switch (typeof vArg){    
		case 'function':		
			myAddEvent(window,'load',vArg)
			break;	
//			函数
//			window.onload=vArg;
//			多次调用 普通绑定后者覆盖前者，需事件绑定	
		case 'string':
			switch (vArg.charAt(0)){
				case '#':		//Id
					var obj=document.getElementById(vArg.substring(1));
					this.elements.push(obj)
					break;
				case '.':		//class
					this.elements=getByClass(document,vArg.substring(1));
					break;	
				default:		//tagName
					this.elements=document.getElementsByTagName(vArg);
			}
			break;
		
		case 'object':
			this.elements.push(vArg);
			break;
		
		default:
			break;
	}	
}

VQ.prototype.click=function(fn){
	for (var i=0; i<this.elements.length; i++) {
		myAddEvent(this.elements[i],'click',fn)
	}
	return this;
}

VQ.prototype.show=function(){
	for (var i=0; i<this.elements.length; i++) {
		this.elements[i].style.display='block';
	}
	return this;
}

VQ.prototype.hide=function(){
	for (var i=0; i<this.elements.length; i++) {
		this.elements[i].style.display='none';
	}
	return this;
}

VQ.prototype.hover=function(fnover,fnout){
	for (var i=0; i<this.elements.length; i++) {
		myAddEvent(this.elements[i],'mouseover',fnover);
		myAddEvent(this.elements[i],'mouseout',fnout);
	}
	return this;
}
/*
VQ.prototype.css=function(attr,value){
	if (arguments.length==2) {
		for (var i=0; i<this.elements.length; i++) {
			this.elements[i].style[attr]=value;
		}	
	} else{
//		jq中获取第一个匹配元素样式
		return getStyle(this.elements[0],attr);
	}
}
*/

VQ.prototype.css=function(attr,value){
	if (arguments.length==2) {
		for (var i=0; i<this.elements.length; i++) {
			this.elements[i].style[attr]=value;
		}	
	} else{
		if (typeof attr=='string') {
			return getStyle(this.elements[0],attr);
		} else{
			for (var i=0; i<this.elements.length; i++) {
				for(var k in attr){
					this.elements[i].style[k]=attr[k];
				}
			}
			
		}
	}
	return this;
}

VQ.prototype.attr=function(attr,value){
	if (attr='className') {
		attr='class'
	}
	if (arguments.length==2) {
		for (var i=0; i<this.elements.length; i++) {
			//this.elements[i][attr]=value;
			this.elements[i].setAttribute(attr,value);
		}
	}else{
			//return this.elements[0][attr];
		return this.elements[0].getAttribute(attr);
	}
	return this;
}

VQ.prototype.toggle=function(){		//、
	var _arguments=arguments;
	for (var i=0; i<this.elements.length; i++) {
		addToggle(this.elements[i]);
	}
	function addToggle(obj){
		var count=0;
		myAddEvent(obj, 'click', function (){
			_arguments[count++%_arguments.length].call(obj);
		});
	}
	return this;
}

VQ.prototype.eq=function(n){
	return $(this.elements[n])
}

function appendArr(arr1, arr2)
{
	for(var i=0;i<arr2.length;i++)
	{
		arr1.push(arr2[i]);
	}
}

VQ.prototype.find=function (str)
{
	var aResult=[];
	for(var i=0;i<this.elements.length;i++)
	{
		switch(str.charAt(0))
		{
			case '.':	//class
				var aEle=getByClass(this.elements[i], str.substring(1));
				aResult=aResult.concat(aEle);
				break;
			default:	//标签
				var aEle=this.elements[i].getElementsByTagName(str);
				//aResult=aResult.concat(aEle);
				appendArr(aResult, aEle);
		}
	}
	//?
	var newVquery=$();
	newVquery.elements=aResult;
	return newVquery;
};


function getIndex(obj)
{
	var aBrother=obj.parentNode.children;	
	for(var i=0;i<aBrother.length;i++)
	{
		if(aBrother[i]==obj)
		{
			return i;
		}
	}
}

VQ.prototype.index=function ()
{
	return getIndex(this.elements[0]);
	
};

VQ.prototype.html=function (str)
{
	if (str) {
		for (var i=0; i<this.elements.length; i++) {
			this.elements[i].innerHTML=str;
		}
	} else{
		return this.elements[0].innerHTML;
	}
	return this;
};

VQ.prototype.val=function (str)
{
	if (str) {
		for (var i=0; i<this.elements.length; i++) {
			this.elements[i].value=str;
		}
	} else{
		return this.elements[0].value;
	}
	return this;
};

/*绑定*/
VQ.prototype.bind=function (sEv, fn)
{
	for (var i=0; i<this.elements.length; i++) {
		myAddEvent(this.elements[i],sEv,fn);
	}
}


/*原型添加方法 插件机制 例 size*/
VQ.prototype.extend=function (name, fn)
{
	VQ.prototype[name]=fn;
};


function $(vArg){
	return new VQ(vArg);
}