window.onload = function(e){
	var elementList = document.getElementsByClassName("panelHeader");
	for (var counter = 0; counter< elementList.length; counter++) {
		elementList[counter].addEventListener("click", function(){
			this.classList.toggle("active");
			var contentDiv = this.nextElementSibling;			  
			if (contentDiv.style.display != "none") {
				contentDiv.style.display = "none";
			}else{ 
				contentDiv.style.display = "block";
			}
		});
	}	
}