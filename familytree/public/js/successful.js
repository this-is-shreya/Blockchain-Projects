
   window.onload= ()=> {
  var elem = document.getElementById("myBar");
  var width = 1;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
        document.getElementById("verif").innerHTML = "Verified!"
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
    }
  }
}
