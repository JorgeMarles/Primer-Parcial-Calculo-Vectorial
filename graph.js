import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var scene = new THREE.Scene();
// Crear una cámara
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
var far = 7;
camera.position.set(far, far, far);
var renderer = new THREE.WebGLRenderer();
var graphdiv = document.getElementById("graph");
renderer.setSize(graphdiv.offsetWidth, graphdiv.offsetHeight);
var geometry1;
var geometry2;
var material;
var mesh1;
var mesh2;


function load() {
console.log(PUNTOS, ZOOM);
  // Crear una escena
  scene.clear();
  renderer.dispose();
  //alert(A+" "+B+" "+C);
  graphdiv.innerHTML = '';
  graphdiv.appendChild(renderer.domElement);


  let cantidadPuntos = PUNTOS;

  // Crear la geometría personalizada para el paraboloide
  if (t === "esfera") {
    geometry1 = geometry2 = new THREE.SphereGeometry(R, 64, 32);
  } else {
    geometry1 = new ParametricGeometry(f1, cantidadPuntos, cantidadPuntos);
    geometry2 = new ParametricGeometry(f2, cantidadPuntos, cantidadPuntos);
  }


  // Crear un material para la malla
  material = new THREE.MeshNormalMaterial({ wireframe: wireframe, depthTest: true, depthWrite: true });

  // Crear una malla para representar la superficie de la ecuación
  mesh1 = new THREE.Mesh(geometry1, material);
  mesh2 = new THREE.Mesh(geometry2, material);

  scene.add(mesh1);
  scene.add(mesh2);

  //The X axis is red.
  //The Y axis is green.
  //The Z axis is blue.


  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  renderer.setClearColor(0xffffff)
  renderer.render(scene, camera);


  function animate() {

    //console.log(window.performance.memory);
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  geometry1.dispose();
  geometry2.dispose();
  material.dispose();
  mesh1 = null;
  mesh2 = null;
}

//load();

var AInput = document.getElementsByName("A");
var BInput = document.getElementsByName("B");
var CInput = document.getElementsByName("C");
var DInput = document.getElementsByName("D");
var EInput = document.getElementsByName("E");
var FInput = document.getElementsByName("F");
var GInput = document.getElementsByName("G");

var expInput = document.getElementsByName("exp");
var recalcular = document.getElementById("recalcular");

t = "elipsoide";
export function change() {
  let starttime = (new Date()).getTime();


  //console.log(AInput, BInput, CInput, DInput, EInput, FInput, GInput);
  if (validar(AInput, BInput, CInput, DInput, EInput, FInput, GInput)) {

    let AX = {};
    AX["value"] = parseFloat(AInput[0].value) / parseFloat(AInput[1].value);
    AX["exp"] = parseInt(expInput[0].value);
    AX["lin"] = AX["exp"] === 1;

    let BY = {};
    BY["value"] = parseFloat(BInput[0].value) / parseFloat(BInput[1].value);
    BY["exp"] = parseInt(expInput[1].value);
    BY["lin"] = BY["exp"] === 1;

    let CZ = {};
    CZ["value"] = parseFloat(CInput[0].value) / parseFloat(CInput[1].value);
    CZ["exp"] = parseInt(expInput[2].value);
    CZ["lin"] = CZ["exp"] === 1;

    let DX = {};
    DX["value"] = parseFloat(DInput[0].value) / parseFloat(DInput[1].value);
    DX["exp"] = 1;
    DX["lin"] = true;

    let EY = {};
    EY["value"] = parseFloat(EInput[0].value) / parseFloat(EInput[1].value);
    EY["exp"] = 1;
    EY["lin"] = true;

    let FZ = {};
    FZ["value"] = parseFloat(FInput[0].value) / parseFloat(FInput[1].value);
    FZ["exp"] = 1;
    FZ["lin"] = true;

    let G = {};
    G["value"] = parseFloat(GInput[0].value) / parseFloat(GInput[1].value);
    G["lin"] = false;

    quads.x = AX;
    quads.y = BY;
    quads.z = CZ;

    let lineales = buscarLinealesEnCuadraticos(AX, BY, CZ);


    if (lineales > 1) {
      alert("Esta ecuacion no es cuadrica, debe tener como minimo 2 variables cuadraticas.");
    } else {
      let ecuacion = sumarLineales(AX, BY, CZ, DX, EY, FZ);

      if (G["value"] !== 0) {
        ecuacion = dividirPor(ecuacion, G);
        G["value"] /= G["value"];
      }

      let sinInversa = JSON.parse(JSON.stringify(ecuacion))
      ecuacion = pasarADenominadores(ecuacion);

      //console.log(ecuacion);
      //console.log(G);

      //a este punto, la ecuación está normalizada

      ecuacion.push(G);
      sinInversa.push(G);

      t = verificarForma(ecuacion);
      if (t === "desconocido") {
        mostrarInformacion(getInfo(sinInversa, t));

      } else {
        mostrarInformacion(getInfo(sinInversa, t));
        load();

      }
      let endtime = (new Date()).getTime();
      console.log("Terminado en ", endtime - starttime, "ms");
      recalcular.disabled = false;
    }



    return false;
  }
}


function validar(...valoresInput) {
  let index = 0;

  for (; index < valoresInput.length; index++) {
    const element = valoresInput[index];
    const num = parseFloat(element[0].value);
    const den = parseFloat(element[1].value);
    if (index < 3) {
      if (num === 0 || den === 0) return false;
    } else {
      if (den === 0) return false;
    }

  }
  return true;
}

function inverso(numero) {
  return numero === 0 ? 0 : Math.pow(numero, -1);
}

function pasarADenominadores(ecuacion) {
  ecuacion.forEach(element => {
    //console.log("pasa de ", element["value"]);
    if (!element["lin"]) element["value"] = inverso(element["value"]);
    //console.log("nuevo elemento", element["value"]);
  });
  return ecuacion;
}

function dividirPor(ecuacion, G) {
  let val = -G["value"];
  ecuacion.forEach(element => {
    element["value"] /= val;
  });
  return ecuacion;
}

function buscarLinealesEnCuadraticos(AX, BY, CZ) {
  let counter = 0;
  if (AX["lin"]) counter++;
  if (BY["lin"]) counter++;
  if (CZ["lin"]) counter++;
  return counter;
}
function sumarLineales(AX, BY, CZ, DX, EY, FZ) {
  let rta = [];

  if (AX["lin"]) {
    AX["value"] += DX["value"];
  } rta.push(AX);


  if (BY["lin"]) {
    BY["value"] += EY["value"];
  } rta.push(BY);


  if (CZ["lin"]) {
    CZ["value"] += FZ["value"];
  } rta.push(CZ);

  if (!AX["lin"]) rta.push(DX);
  if (!BY["lin"]) rta.push(EY);
  if (!CZ["lin"]) rta.push(FZ);
  return rta;
}

function verificarForma(ecuacion) {
  //console.log(ecuacion);
  let cuadraticas = []
  let lineales = []
  let constante;

  for (let index = 0; index < ecuacion.length; index++) {
    const element = ecuacion[index];
    if (element["lin"]) lineales.push(element["value"]);
    else if (index !== ecuacion.length - 1) cuadraticas.push(element["value"]);
    else constante = element["value"];
  }
  var tipo = "desconocido";
  //CASOS CON LAS 3 AL CUADRADO (todo excepto paraboloide)
  if (cuadraticas.length === 3) {

    let [Al, Bl, Cl] = lineales;
    let insidesqrtRadio = (Al / 2) * (Al / 2) + (Bl / 2) * (Bl / 2) + (Cl / 2) * (Cl / 2) + constante;
    R = Math.sqrt(insidesqrtRadio);
    let [ecX, ecY, ecZ] = cuadraticas;
    //SI TIENE CONSTANTE EN 1
    //si todos los denominadores son iguales, y positivos, es esfera
    if (ecX === ecY && ecY === ecZ && ecX > 0 && constante === 1) tipo = "esfera";
    //si al menos uno de los denominadores son diferentes, y positivos, es elipsoide
    if (ecX > 0 && ecY > 0 && ecZ > 0 && (ecX !== ecY || ecY !== ecZ) && constante === 1) tipo = "elipsoide";
    //si tiene un denominador negativo, es hiperboloide de 1 hoja
    if (
      ((ecX < 0 && ecY > 0 && ecZ > 0) ||
        (ecX > 0 && ecY < 0 && ecZ > 0) ||
        (ecX > 0 && ecY > 0 && ecZ < 0)) &&
      constante === 1
    ) tipo = "hiperboloide_1_hoja";
    //si tiene 2 denominadores negativos, es hiperboloide de 2 hojas
    if (
      ((ecX < 0 && ecY < 0 && ecZ > 0) ||
        (ecX > 0 && ecY < 0 && ecZ < 0) ||
        (ecX < 0 && ecY > 0 && ecZ < 0)) &&
      constante === 1
    ) tipo = "hiperboloide_2_hojas";

    //CONSTANTE = 0
    //mismas condiciones que el hiperboloide de 1 hoja, pero, con la constante = 0
    if (
      ((ecX < 0 && ecY > 0 && ecZ > 0) ||
        (ecX > 0 && ecY < 0 && ecZ > 0) ||
        (ecX > 0 && ecY > 0 && ecZ < 0)) &&
      constante === 0
    ) {
      //console.log("entramos a cono, pq la constante es ",constante, constante===0);
      tipo = "cono_eliptico";
    }

    A = ecX;
    B = ecY;
    C = ecZ;


  } else {
    //paraboloides
    let [ecA, ecB] = cuadraticas;
    let lineal = lineales[0];
    //si los denominadores son positivos, paraboloide eliptico
    if (ecA > 0 && ecB > 0) tipo = "paraboloide_eliptico";
    //si tiene un denominador negativo, paraboloide hiperbolico
    if (
      (ecA < 0 && ecB > 0) ||
      (ecA > 0 && ecB < 0)
    ) tipo = "paraboloide_hiperbolico";

    A = ecA;
    B = ecB;
    C = lineal;

  }
  return tipo;

}
var zoom = document.getElementById("zoom");
var puntos = document.getElementById("puntos");
export function reload() {
  ZOOM = zoom.value;
  PUNTOS = puntos.value;
  let starttime = (new Date()).getTime();
  load();
  let endtime = (new Date()).getTime();
      console.log("Terminado en ", endtime - starttime, "ms");
}
var informacionDiv = document.getElementById("info");

export function mostrarInformacion(info) {
  let title = `<div class="card-header w-100">
                <h2>Informacion de la superficie</h2>
              </div>`;
  let img = `<img src="${info.imagen}" class="card-img-top" id="info_imagen">`;
  let name = getName(info.nombre);
  let cardBody = `
  <div class="card-body">
         ${name}
          ${getTexto(info)}
        </div>
  `;

  informacionDiv.innerHTML = title + img + cardBody;
}
/*


        
        <div class="card-body">
          
          <p class="card-text">
            <b>Centro: </b>(x,y,z)
          </p>
        </div>

*/
function getName(texto) {
  return `
  <h2 class="card-title">${texto}</h2>
  `
}

function informacionPuntual(tipo, texto) {
  return `<b>${tipo}:</b> ${texto}<br>`;
}

function getTexto(info) {
  let texto;

  switch (t) {
    case "hiperboloide_1_hoja":
      texto = informacionPuntual("Eje de Apertura", info.eje_apertura);

      break;
    case "hiperboloide_2_hojas":
      texto = informacionPuntual("Eje de Apertura", info.eje_apertura);

      break;
    case "elipsoide":
      texto = informacionPuntual("Centro", punto(info.centro));
      texto += informacionPuntual("Distancia Focal", info.distanciaFocal);
      texto += informacionPuntual("Foco 1", punto(info.foco1));
      texto += informacionPuntual("Foco 2", punto(info.foco2));
      texto += informacionPuntual("Semieje 1", info.semieje1);
      texto += informacionPuntual("Semieje 2", info.semieje2);
      texto += informacionPuntual("Semieje 3", info.semieje3);
      texto += informacionPuntual("Excentricidad", info.excentricidad);

      break;
    case "esfera":
      texto = informacionPuntual("Centro", punto(info.centro));
      texto += informacionPuntual("Radio", info.radio);

      break;
    case "cono_eliptico":
      texto = informacionPuntual("Eje de Apertura", info.eje_apertura);
      break;
    case "paraboloide_eliptico":
      texto = informacionPuntual("Eje de Apertura", info.eje_apertura);
      break;
    case "paraboloide_hiperbolico":
      texto = informacionPuntual("Eje de Apertura", info.eje_apertura);
      break;
    default:
      texto = informacionPuntual("Causa", info.p);
      break;
  }
  return `<p class="card-text">
            ${texto}
          </p>`;
}

function punto(punto) {
  return `(${punto.x}, ${punto.y}, ${punto.z})`;
}