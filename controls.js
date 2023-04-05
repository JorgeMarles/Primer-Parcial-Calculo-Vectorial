var span = document.getElementById("range");
var zoom = document.getElementById("zoom");

var span2 = document.getElementById("range2");
var puntos = document.getElementById("puntos");

zoom.value = ZOOM;
puntos.value = PUNTOS;
update();
function update() {

    span.innerHTML = zoom.value;
    span2.innerHTML = puntos.value;
    ZOOM = zoom.value;
    PUNTOS = puntos.value;
}


