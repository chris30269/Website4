function showHide(id) {
		x = document.getElementById(id).style.display;
		//y = document.getElementById(id+'nav').style.display;
		if(x=='none'){
			document.getElementById(id).style.display = 'block';
			document.getElementById(id+'nav').style.borderColor = 'rgb(0,200,255)';
		} else {
			document.getElementById(id).style.display = 'none';
			document.getElementById(id+'nav').style.borderColor = 'rgb(89,255,200)';
		}
	}
	
	
	/*function newshowEvent(eventid) {
		all = getDivByClassName("main");
		for(i=0;i<all.length;i++) {
			all[i].style.display = "none";
			}
		eventid = getDivByClassName(eventid);
		for(i=0;i<eventid.length;i++) {
				eventid[i].style.display = "block";
				}
	}*/