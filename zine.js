/*eslint-env es6*/

/*VARIABLES-------------------------------------------*/
	var pageCount = $("#zine > div").length;
	var book = document.getElementById('zine');
	var body = document.getElementById('body');
	
	var currentZoom = 1;
	
	var toggle = false;
	var dcToggle = false;
	
	var bounds  = document.getElementById('bounds');
	
	var buttons  = document.getElementById('buttons');
	var hidden = false;

	var spd = 0;

/*BUTTONS-------------------------------------------*/	
	var zoomOut = document.getElementById('zoom-out');
	var zoomIn = document.getElementById('zoom-in');
	var zoomNorm = document.getElementById('zoom-norm');
	var info = document.getElementById('info');
	var light  = document.getElementById('light');
	var hide  = document.getElementById('hide');

/*EVENT LISTENERS-------------------------------------------*/	
	light.addEventListener("click", lightToggle);
	info.addEventListener("click", giveInfo);
	hide.addEventListener("click", hideButtons);
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || screen.innerHeight > screen.innerWidth) {
		$(zoomOut).css("display", "none");
		$(zoomIn).css("display", "none");
		$(zoomNorm).css("display", "none");
		$('#pcCont').css("display", "none");
	}
	else{
		bounds.addEventListener("dblclick", zoomFrame);
		zoomOut.addEventListener("click", zOut);
		zoomIn.addEventListener("click", zIn);
		zoomNorm.addEventListener("click", zNorm);
	}

	window.addEventListener("orientationchange", function() {location.reload();});

/*PAGE CONDITIONS-------------------------------------------*/
window.addEventListener('DOMContentLoaded', function(){
	giveInfo();
	spd = 350;
	preload();
});

window.addEventListener("load", function(){
	$("#loading").fadeOut()
	setTimeout(function(){
		$("#loading").css("display", "none");
	}, 400);
});

//KILL RIGHT CLICK MENU
	$(body).on('contextmenu', function(){ 
		return false; 
	});

//GRAB & DRAG IF OVER BOUNDS
const drag = function(canDrag){
	if(canDrag){
			var clicked = false; 
			var yPos = 0; 
			var xPos = 0;
			
			$(window).mousemove(function(e){
				if(clicked){
					window.scrollBy(xPos - e.pageX, yPos - e.pageY)
				}
			});
			
			$(window).mousedown(function(e){
				yPos = e.pageY;
				xPos = e.pageX;
				clicked = true;
				book.style.cursor = "grabbing";
			});
			
			$(window).mouseup(function(){
				clicked = false;
				book.style.cursor = "grab";
			});
	}
	else if(!canDrag){
		$(window).mousemove(function(){
			window.scrollBy(0, 0)
		});
		
		$(window).mousedown(function(){
			book.style.cursor = "auto";
		});
		
		$(window).mouseup(function(){
			book.style.cursor = "auto";
		});
	}
}

/*FUNCTIONS-------------------------------------------*/
function preload() {
	var imageArray = ["01A", "02A", "03A", "04A", "05A", "06A", "07A", "08A", "09A", "010A"];

	for (var i = 0; i < imageArray.length; i++) {
		var tempImage = new Image();
		tempImage.src = "./images/"+imageArray[i]+".png";
	}
}

//DOUBLE CLICK & ZOOM
	function zoomFrame(){
		if(!dcToggle){
			currentZoom = 2;
			$(book).turn('zoom', 2, 5000);
			checkOverflow();
		}
		else if(dcToggle){
			currentZoom = 1;
			$(book).turn('zoom', 1, 5000);
			checkOverflow();
		}
	}

//ZOOM BUTTONS
	function zOut(){
		currentZoom = currentZoom * .9;
		$(book).turn('zoom', currentZoom, 5000);
		checkOverflow();
	}
	
	function zIn(){
		currentZoom = currentZoom / .9;
		$(book).turn('zoom', currentZoom, 5000);
		checkOverflow();
	}
	
	function zNorm(){
		currentZoom = 1
		$(book).turn('zoom', 1, 5000);
		checkOverflow();
	}

//CHECK IF MAGAZINE IS OVER PAGE BOUNDS
	function checkOverflow(){
		if(currentZoom > 1){
			body.style.overflowX = "auto";
			body.style.overflowY = "auto";
			book.style.cursor = "grab";
			dcToggle = true;
			drag(true);
		}
		else if(currentZoom < 1){
			body.style.overflow = "hidden";
			book.style.cursor = "auto";
			dcToggle = true;
			drag(false);
		}
		else if(currentZoom === 1){
			body.style.overflow = "hidden";
			book.style.cursor = "auto";
			dcToggle = false;
			drag(false);
		}
	}

//ALT IMAGES
	function lightToggle(){
		$(".popup").toggleClass("popupAlt",2500);
		
		if(!toggle){
			
			for (let i = 1; i <= pageCount; i++){
				$(document.getElementById('pg' + i)).fadeOut(50,"swing",function(){
					document.getElementById('pg' + i).src = "images/0" + i + "A.png";
				}).fadeIn(420);
			}
			
			toggle=true;
		}
		
		else if(toggle){
			
			for (let i = 1; i <= pageCount; i++){
				$(document.getElementById('pg' + i)).fadeOut(50,"swing",function(){
					document.getElementById('pg' + i).src = "images/0"+ i + ".png";
				}).fadeIn(420);
			}
			
			toggle=false;
		}

//STYLE SWAP ON TOGGLE		
		switch (toggle) {
			case true:
				body.style.backgroundImage = ("url('assets/BGalt.svg')");
				hide.style.color = "#9ce1f0";
				hide.style.textShadow = "0px 0px 5px #9ce1f0";
				document.getElementById("buttons").style.backgroundColor = "rgba(156,225,240,0.50)"
				document.getElementById("buttons").style.boxShadow = "0px 0px 5px rgba(156,225,240,0.50)"
				document.getElementById("closePop").style.textShadow= "0px 0px 5px #9ce1f0";
				document.getElementById("closePop").style.mixBlendMode= "overlay";
				break;
			case false:
				body.style.backgroundImage = ("url('assets/BG.svg')");
				hide.style.color = "#2d2a2b";
				hide.style.textShadow = "0px 0px 0px #2d2a2b";
				document.getElementById("buttons").style.backgroundColor = "rgba(15,15,15,0.50)"
				document.getElementById("buttons").style.boxShadow = "0px 0px 0px rgba(15,15,15,0.50)"
				document.getElementById("closePop").style.textShadow= "0px 0px 0px #2d2a2b";
				document.getElementById("closePop").style.mixBlendMode= "screen";		
		}
	}

//INFO ALERT
	function giveInfo(){
		$(".popup").animate({
			opacity: 'toggle', 
			height:'toggle', 
			top:'toggle',
			padding:'toggle',
		}, spd);
	}

//HIDE BUTTON ARRAY
	function hideButtons(){
		if(!hidden){
			$(buttons).animate({left: '-='+$(buttons).width()}, "slow");
			hidden = true;
		}
		else if(hidden){
			$(buttons).animate({left: '+='+$(buttons).width()}, "slow");
			hidden = false;
		}
	}
	
/*ZINE DISPLAY SETTINGS-------------------------------------------*/
	window.addEventListener('resize', function () {
		book.style.width = '';
		book.style.height = '';
		$(book).turn('size', book.clientWidth, book.clientHeight);
		//location.reload();
	});
	

	if(window.innerWidth <= 900){
		$(book).turn({
			autoCenter: true,
			gradients: true,
			inclination: 50,
			display: 'single',
		});
	}
	else{
		$(book).turn({
			autoCenter: true,
			gradients: true,
			inclination: 50,
			display: 'double',
		});
	}