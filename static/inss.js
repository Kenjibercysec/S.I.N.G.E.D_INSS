var coll = document.getElementsByClassName("btn-info-box");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "none") {
      content.style.display = "none";
    } else {
      content.style.display = "none";
    }
  });
}