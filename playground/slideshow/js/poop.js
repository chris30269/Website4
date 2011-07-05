function XMLtoHTML(){
xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET","http://www.prism.gatech.edu/~cernst3/website4/playground/slideshow/show.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;
var scenes = xmlDoc.getElementsByTagName("scene");
var images = xmlDoc.getElementsByTagName("image");
//alert("Scenes: "+scenes.length);
var newoffset = 0;
var oldoffset = 0;
var width = window.innerWidth;
var height = window.innerHeight;
for (i=0; i<scenes.length; i++)
			{
				var scenei = "scene"+i;
				document.getElementById("main").innerHTML+="<section id='"+scenei+"'></section>";
				//document.write("Images: "+images.length+"<br/>");
				oldoffset = newoffset;
				newoffset=oldoffset+parseInt(scenes[i].getAttribute("numberOfElements"));
				for (j=oldoffset; j<newoffset; j++)
				{
					//alert("oldoffset: "+oldoffset);
					//alert("newoffset: "+newoffset);
					var imagej = "image"+j;
					//document.write("begin image "+j+"<br/>");
					var contentsrc = images[j].getAttribute("contentsrc");
					var contentx = images[j].getAttribute("xpos");
					var contenty = images[j].getAttribute("ypos");
					var contentWidth = images[j].getAttribute("xsize");
					var contentHeight = images[j].getAttribute("ysize");
					var action1 = "";
					action1 = images[j].childNodes[1].getAttribute("action1");
					var action2 = "";
					var action2is= images[j].childNodes[1].getAttribute("action2");//.nodeValue;
					var action3 = "";
					action3 = images[j].childNodes[1].getAttribute("action3");
					if(action1=="glow")
					{
						action1 = 'onMouseOver="document.getElementById(\''+imagej+'\').style.webkitBoxShadow=\'0 0 50px 20px rgba(207, 181, 59, 0.3)\';" onMouseOut="document.getElementById(\''+imagej+'\').style.webkitBoxShadow=\'0 0 0 0\';"';
					}
					if(action2is=="fullscreen")
					{
						action2 = 'onClick="toggleSize(\''+imagej+'\')"';
					}
					if(action2is.indexOf("gotoID")!=-1)
					{
						action2 = 'onClick=\''+action2is+'\'';
					}
					
					document.getElementById(scenei).innerHTML+="<img id="+imagej+" src='"+contentsrc+"' originalWidth='"+contentWidth*width+"' originalHeight='"+contentHeight*height+"' originalX='"+contentx*width+"' originalY='"+contenty*height+"' style='z-index:1;position:absolute;left:"+contentx*width+"px;top:"+contenty*height+"px;width:"+contentWidth*width+"px;height:"+contentHeight*height+"px;'"+action1+" "+action2+">";//class='image'  style='width:10%;'
				}
			}
}

function toggleSize(imagej){
	var image = document.getElementById(imagej);
	//var image = document.getElementById("image1");
	//alert("width: "+parseFloat(image.style.width));
	if(parseFloat(image.style.width) > parseFloat(image.getAttribute("originalWidth")) || parseFloat(image.style.height) > parseFloat(image.getAttribute("originalHeight")))
	{
		image.style.width = image.getAttribute("originalWidth")+"px";
		image.style.height = image.getAttribute("originalHeight")+"px";
		image.style.left = image.getAttribute("originalX")+"px";
		image.style.top = image.getAttribute("originalY")+"px";
		image.style.zIndex = "1";
	}
	else
	//if(parseFloat(image.style.width) == parseFloat(image.getAttribute("originalWidth")) || parseFloat(image.style.height) == parseFloat(image.getAttribute("originalHeight")))
	{
		var ratio = Math.min(window.innerWidth/parseFloat(image.style.width), window.innerHeight/parseFloat(image.style.height));
		//alert("new width: "+parseFloat(image.style.width)*ratio+"px");
		image.style.width = parseFloat(image.style.width)*ratio+"px";
		image.style.height = parseFloat(image.style.height)*ratio+"px";
		image.style.left = "0px";
		image.style.top = "0px";
		image.style.zIndex="20";
	}
}

function gotoID(index){
	alert(index);
	Slideshow.updateSlides( '#main>section', index);
}