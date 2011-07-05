/**
 * Handles the very minimal navigation logic involved
 * in the slideshow.
 * 
 * @author Hakim El Hattab
 */
 
var indexh = 0;
var indexv = 0;
var stack = new Array();
var stackk = new Array();
var Slideshow = (function(){
	
	
	
	function initialize() {
		
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
		
		document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('touchstart', onTouchStart, false);
		
		updateHorizontalSlide();
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
	
	// Consider this a bonus function. Definitely not needed for
	// presentation but the cool-factor of CSS 3D transform on iOS
	// is through the roof.
	function onTouchStart( event ) {
		
		// We're only interested in one point taps
		if (event.touches.length == 1) {
			event.preventDefault();
			
			var point = {
				x: event.touches[0].clientX,
				y: event.touches[0].clientY
			};
			
			// Define the extent of the areas that may be tapped
			// to navigate
			var wt = window.innerWidth * 0.3;
			var ht = window.innerHeight * 0.3;
			
			if( point.x < wt ) {
				indexh --;
				indexv = 0;
			}
			else if( point.x > window.innerWidth - wt ) {
				indexh ++;
				indexv = 0;
			}
			else if( point.y < ht ) {
				indexv --;
			}
			else if( point.y > window.innerHeight - ht ) {
				indexv ++;
			}
			
			updateHorizontalSlide();
			updateVerticalSlide();
			
		}
	}
	
	function updateSlides( selector, index ) {
		
		// Select all slides and convert the NodeList result to
		// an array
		var slides = Array.prototype.slice.call( document.querySelectorAll( selector ) );
		
		if( slides.length && index>-1) {
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
		
		return index;
	}
	
	function updateHorizontalSlide() {
		indexh = updateSlides( '#main>section', indexh );
		pushStack(indexh);
	}
	
	function updateVerticalSlide() {
		indexv = updateSlides( 'section.current>section', indexv );
	}
	
	// Expose some methods publicly
	return {
		initialize: initialize
	};
	
})();

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
	else//if(parseFloat(image.style.width) == parseFloat(image.getAttribute("originalWidth")) || parseFloat(image.style.height) == parseFloat(image.getAttribute("originalHeight")))
	{
		var ratio = Math.min(window.innerWidth/parseFloat(image.style.width), window.innerHeight/parseFloat(image.style.height));
		//alert("new width: "+parseFloat(image.style.width)*ratio+"px");
		image.style.width = parseFloat(image.style.width)*ratio+"px";
		image.style.height = parseFloat(image.style.height)*ratio+"px";
		image.style.left = "0px";
		image.style.top = "0px";
		image.style.zIndex="20";//kind of arbitrary, but I think the z-index is incremented for each element, so if there are more than 20 elements, this will break.
	}
}

function gotoID(index){
	//Slideshow.updateSlides( , index);
	// Select all slides and convert the NodeList result to
		// an array
		
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
		pushStack(indexh);
}

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