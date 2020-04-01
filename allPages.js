// Get the modal
var modal = document.getElementById('modal');

// Get the images and bind an onclick event on each to insert it inside the modal
// use its "alt" text as a caption
var images = document.querySelectorAll(".Blog-Image");
var modalImg = document.getElementById("modalImg");
var captionText = document.getElementById("captionText");
for(let i = 0; i < images.length; i++){
    images[i].onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
    }
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}