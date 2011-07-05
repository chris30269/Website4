/**
 * Handles the very minimal navigation logic involved
 * in the slideshow.
 * 
 * @author Hakim El Hattab
 */
 
var indexh = 0;
var indexv = 0;
var stack = new Array();//past
var stackk = new Array();//future
var xmlDoc;
var avatars;
var width = window.innerWidth;
var height = window.innerHeight;

	
	function drawAvatar(indexh, avatars, width, height){

		//change the location of the avatar by getting it via its ID and then setting it to the location of the new avatar location.
		//it's the same image the whole time, just being moved around.

		/*document.getElementById("main").removeChild(document.getElementById("avatar"));
		var div = document.createElement("div");
		div.setAttribute("id", "avatar");
		div.setAttribute("class", "avatar");
		var avatar = document.getElementById("main").appendChild(div);*/
		//document.getElementById("avatar").innerHTML+="<img class='avatar' src='content/padBear.png' style='position:absolute; left:"+avatars[indexh].getAttribute("xpos")*width+"px;top:"+avatars[indexh].getAttribute("ypos")*height+"px;width:"+avatars[indexh].getAttribute("xsize")*width+"px;height:"+avatars[indexh].getAttribute("ysize")*height+"px;border:0px;-webkit-box-shadow:0 0 0 0;background:none;'>";
		//var thetop = document.getElementById("avatar").style.top;
		//alert(thetop);
		document.getElementById("avatar").style.top = avatars[indexh].getAttribute("ypos")*height+"px";
		document.getElementById("avatar").style.left = avatars[indexh].getAttribute("xpos")*width+"px";
	}
	
	function initialize() {
		//load XML file
		xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET","show.xml",false);
		xmlhttp.send();
		xmlDoc=xmlhttp.responseXML;

		var scenes = xmlDoc.getElementsByTagName("scene");
		var images = xmlDoc.getElementsByTagName("image");
		avatars= xmlDoc.getElementsByTagName("avatar");
		//alert("Scenes: "+scenes.length);
		var newoffset = 0;
		var oldoffset = 0;
		document.getElementById("main").innerHTML+="<div id='avatardiv'></div>";//make new <div> for avatar so that it is not a child of the scene (<section>)
		for (i=0; i<scenes.length; i++)
		{
			var scenei = "scene"+i;
			document.getElementById("main").innerHTML+="<section id='"+scenei+"'></section>";//create new <section> (scene). give section tag id of "scenei" where "i" is the index of the scene
			//update offsets so that only the correct images get put into the correct scenes
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
					//make action1 string be the string that would be inserted into the slide's tag to make it do the appropriate action. This is browser/webkit-readable code.
					action1 = 'onMouseOver="document.getElementById(\''+imagej+'\').style.webkitBoxShadow=\'0 0 50px 20px rgba(207, 181, 59, 0.3)\';" onMouseOut="document.getElementById(\''+imagej+'\').style.webkitBoxShadow=\'0 0 0 0\';"';
				}
				if(action2is=="fullscreen")
				{
					//make action2 string be the string that would be inserted into the slide's tag to make it do the appropriate action. This is browser/webkit-readable code.
					action2 = 'onClick="toggleSize(\''+imagej+'\')"';
				}
				if(action2is.indexOf("gotoID")!=-1)
				{
					//make action2 string be the string that would be inserted into the slide's tag to make it do the appropriate action. This is browser/webkit-readable code.
					var strLen = action2is.length; 
					action2is = action2is.slice(0,strLen-1); 
					action2 = 'onClick=\''+action2is+')\'';
				}
				//reference the "main" of the HTMl and append to it's contents an image tag
				//non-uniform tags like originalWidth will/should be ignored by the browser and are there for our reference
				document.getElementById(scenei).innerHTML+="<img id="+imagej+" src='"+contentsrc+"' originalWidth='"+contentWidth*width+"' originalHeight='"+contentHeight*height+"' originalX='"+contentx*width+"' originalY='"+contenty*height+"' style='z-index:1;position:absolute;left:"+contentx*width+"px;top:"+contenty*height+"px;width:"+contentWidth*width+"px;height:"+contentHeight*height+"px;'"+action1+" "+action2+">";//class='image'  style='width:10%;'
			}
			
		}
		//initialize avatar, much like a scene
		document.getElementById("avatardiv").innerHTML+="<img class ='avatar' id='avatar' src='content/padBear.png' style='position:absolute; left:"+avatars[indexh].getAttribute("xpos")*width+"px;top:"+avatars[indexh].getAttribute("ypos")*height+"px;width:"+avatars[indexh].getAttribute("xsize")*width+"px;border:0px;-webkit-box-shadow:0 0 0 0;background:none;'>";
		
		document.addEventListener('keydown', onKeyDown, false);//listen for key strokes
		
		updateHorizontalSlide();//adds CSS classes to each scene
		updateVerticalSlide();
		
	}
	
	function onKeyDown( event ) {
		
		if( event.keyCode >= 33 && event.keyCode <= 40 ) {
			
			switch( event.keyCode ) {
				case 37: indexh--; indexv = 0; break; // left
				case 39: indexh++; indexv = 0; break; // right
				case 38: indexv--; break; // up
				case 40: indexv++; break; // down
				case 34: pushStackk(stack.pop()); indexh = stack.pop(); break;//page down, back in history
				case 33: indexh = stackk.pop(); break;//page up, forward in history
			}
			
			updateHorizontalSlide();
			updateVerticalSlide();
			
			event.preventDefault();
			
		}
	}
	
	function updateSlides( selector, index ) {
		
		// Select all slides and convert the NodeList result to an array
		var slides = Array.prototype.slice.call( document.querySelectorAll( selector ) );
		
		if( slides.length && index>-1) {
			//enforce max and minimum index bounds by not letting it be too big or too small
			index = Math.max(Math.min(index, slides.length - 1), 0);
			
			//current slide is now current
			slides[index].setAttribute('class', 'current');
			
			//Any scene previous to index is given the 'past' class
			slides.slice(0, index).map(function(element){
				element.setAttribute('class', 'past');
			});
			
			//Any scene subsequent to index is given the 'future' class
			slides.slice(index + 1).map(function(element){
				element.setAttribute('class', 'future');
			});
		}
		
		return index;
	}
	
	function updateHorizontalSlide() {
		indexh = updateSlides( '#main>section', indexh );
		drawAvatar(indexh, avatars, width, height);
		pushStack(indexh);//update history
		
	}
	
	function updateVerticalSlide() {
		indexv = updateSlides( 'section.current>section', indexv );//children of children; not implemented.
	}
	

 function toggleSize(imagej){
	//this function fullscreens and unfullscreens an image
	var image = document.getElementById(imagej);
	//var image = document.getElementById("image1");
	//alert("width: "+parseFloat(image.style.width));
	//if current width is more than the original width
	if(parseFloat(image.style.width) > parseFloat(image.getAttribute("originalWidth")) || parseFloat(image.style.height) > parseFloat(image.getAttribute("originalHeight")))
	{
		//reset to original position and size
		image.style.width = image.getAttribute("originalWidth")+"px";
		image.style.height = image.getAttribute("originalHeight")+"px";
		image.style.left = image.getAttribute("originalX")+"px";
		image.style.top = image.getAttribute("originalY")+"px";
		//set the z-index to be the same as the other elements
		image.style.zIndex = "1";
	}
	else//if(parseFloat(image.style.width) == parseFloat(image.getAttribute("originalWidth")) || parseFloat(image.style.height) == parseFloat(image.getAttribute("originalHeight")))
	{
		//calculate a ratio of the image's width/height
		var ratio = Math.min(window.innerWidth/parseFloat(image.style.width), window.innerHeight/parseFloat(image.style.height));
		//take the smaller ratio and multiply both the width and the height by that ratio
		//alert("new width: "+parseFloat(image.style.width)*ratio+"px");
		image.style.width = parseFloat(image.style.width)*ratio+"px";
		image.style.height = parseFloat(image.style.height)*ratio+"px";
		image.style.left = "0px";
		image.style.top = "0px";
		//set the z-index of the image to be on top of all other elements
		image.style.zIndex="20";//kind of arbitrary, but I think the z-index is incremented as each element is added to the screen, so if there are more than 20 elements, this will break.
	}
}

function gotoID(index){
		//exactly updateSlides, but hard-coded to be parent (horizontal slide) and not a child (vertical) slide.
		if(index>0){index=index-1;}//go from index to slide ID seems to be being done somewhere?! Turns out that's right here :)
		if(index<1){index=0;}
		var slides = Array.prototype.slice.call( document.querySelectorAll( '#main>section' ) );
		
		if( slides.length ) {
			// Enforce max and minimum index bounds
			index = Math.max(Math.min(index, slides.length - 1), 0);
			
			slides[index].setAttribute('class', 'current');
			
			// Any element previous to index is given the 'past' class
			slides.slice(0, index).map(function(element){
				element.setAttribute('class', 'past');
			});
			
			// Any element subsequent to index is given the 'future' class
			slides.slice(index + 1).map(function(element){
				element.setAttribute('class', 'future');
			});
		}
		indexh = index;
		drawAvatar(index, avatars, width, height);
		pushStack(indexh);//update history
}

//rewrite history
function pushStack(newVal) { 
   stack.push(newVal);
   //alert("history: "+stack);
} 
function popStack() { 
   var popVal = stack.pop(); 
   if (popVal == undefined) 
      return indexh; 
   else 
   return popVal; 
}
function pushStackk(newVal) { 
   stackk.push(newVal);
   //alert("future: "+stackk);
} 
function popStackk() { 
   var popVal = stackk.pop(); 
   if (popVal == undefined) 
      return indexh; 
   else 
   return popVal; 
}
