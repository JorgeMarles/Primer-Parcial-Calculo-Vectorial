var arregloSpans = [];
var arregloMQ = [];
var informacionDiv = null;
$(function () {
    informacionDiv = document.getElementById("info")

    var answerSpan = document.getElementById("ecuacion");
    var answerMathField = MQ.StaticMath(answerSpan);
    //console.log(answerMathField);


    for (let index = 65; index <= 71; index++) {
        var element = document.getElementById(String.fromCharCode(index));
        if(element !== null) arregloSpans.push(element)
    }

    var letrasAnterior = 0;
    var anterior = "";
    function contarLetras(string) {
        let c = 0;
        for (let index = 0; index < string.length; index++) {
            if (/[a-zA-Z]/g.test(string.charAt(index))) c++;
        }
        return c;
    }

    function getIndicesOf(searchStr, str, caseSensitive) {
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        var startIndex = 0, index, indices = [];
        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }

    const W = (e) => {
        var enteredMath = e.latex(); // Get entered math in LaTeX format
        let letras = contarLetras(enteredMath);
        if (enteredMath !== null && letras > letrasAnterior && !(!anterior.includes("frac") && enteredMath.includes("frac"))) {
            e.keystroke("Backspace");
            letras--;
        }
        var calc = 0;
        var pos = getIndicesOf("-", enteredMath);
        pos.forEach(element => {
            if (element === 0) {
                enteredMath = '0' + enteredMath;
            } else {
                enteredMath = enteredMath.slice(0, element) + '0' + enteredMath.slice(element);
            }
        });
        //console.log(enteredMath);
        var calc = new Calc(enteredMath).eval(0);
        let index = e.el().id.charCodeAt(0) - 65;
        values[index] = calc;
        //console.log(calc);
        //console.log(index, values);

        anterior = enteredMath;
        letrasAnterior = letras;
        //answerMathField.select();
        //answerMathField.clearSelection();
        answerMathField.latex(convertirEcuacion());
    }



    arregloSpans.map((el) => {
        var elementoMQ = MQ.MathField(el, {
            handlers: {
                edit: W,
            },
        });
        arregloMQ.push(elementoMQ);
    })



});

function convertirEcuacion() {
    let equation = "";
    let index;
    for (index = 0; index < values.length - 1; index++) {
        let inicial = '' + literales[index];
        if (values[index] !== 1) inicial = Math.abs(values[index]) + inicial;
        if (values[index] < 0) {
            inicial = '-' + inicial;
        } else {
            if (index > 0) {
                inicial = '+' + inicial;
            }
        }
        if (values[index] !== 0 && isFinite(values[index]) && !isNaN(values[index])) {
            equation += inicial;
        }
    }
    equation += '=' + values[index];
    return equation;
}

function dividir() {
    let resultado = JSON.parse(JSON.stringify(values));
    let divisor = resultado[6];

    if (divisor === 0) {
        return resultado;
    }
    for (let index = 0; index < resultado.length - 1; index++) {
        resultado[index] = values[index] / divisor;
    }
    resultado[6] /= divisor;

    return resultado;
}

function show() {
    let rta = validarNaN();
    let rta2 = validarCuadraticas();
    if (rta !== "ok" || rta2 !== "ok") {
        if (rta !== "ok") {
            alert(rta + ", por favor, revisa los datos");
        }
        if (rta2 !== "ok") {
            alert(rta2 + ", por favor, revisa los datos");
        }
        return;
    }
    let dividida = dividir();
    tipo = verificarForma(dividida);
    //console.log(dividida);
    mostrarInformacion(getInfo(values, tipo))

    let elemento = document.querySelector("#ggb-element");
    let ggb = new window.GGBApplet({
        appName: "3d",
        width: elemento.offsetWidth,
        height: window.innerHeight,
        showToolBar: false,
        showMenuBar: false,
        showAlgebraInput: false,
        showResetIcon: false,
        enableLabelDrags: false,
        enableShiftDragZoom: true,
        enableRightClick: false,
        showToolBarHelp: false,
        errorDialogsActive: true,
        useBrowserForJS: false,
        appletOnLoad(api) {
            api.evalCommand(convertirEcuacion());
        },
    });
    ggb.inject("ggb-element");
}

function validarNaN() {
    var ok = true;
    for (let index = 0; ok && index < values.length; index++) {
        ok = !isNaN(values[index]) && isFinite(values[index]);
    }

    return ok ? "ok" : "Hay valores incorrectos o indefinidos";
}

function validarCuadraticas() {
    let cuadraticas = values.slice(0, 3);
    let counter = 0;
    for (let index = 0; index < cuadraticas.length; index++) {
        const element = cuadraticas[index];
        counter = (element !== 0) ? counter + 1 : counter;
    }
    return counter >= 2 ? "ok" : "Las variables cuadráticas deben ser mínimo 2";
}


function verificarForma(ecuacion) {
    //console.log(ecuacion);
    let cuadraticas = [];
    let lineales = [];
    let constante = ecuacion[6];



    for (let index = 0; index < 3; index++) {
        const element = ecuacion[index];
        if (element !== 0) cuadraticas.push(element);
    }

   

    for (let index = 3; index < 6; index++) {
        const element = ecuacion[index];
        lineales.push(element);
    }
    var tipo = "desconocido";
    //CASOS CON LAS 3 AL CUADRADO (todo excepto paraboloide)
    if (cuadraticas.length === 3) {

        let [Al, Bl, Cl] = lineales;

        let [ecX, ecY, ecZ] = cuadraticas;
        //SI TIENE CONSTANTE EN 1
        //si todos los denominadores son iguales, y positivos, es esfera
        if (ecX === ecY && ecY === ecZ && ecX > 0 && constante !== 0) tipo = "esfera";
        //si al menos uno de los denominadores son diferentes, y positivos, es elipsoide
        if (ecX > 0 && ecY > 0 && ecZ > 0 && (ecX !== ecY || ecY !== ecZ) && constante !== 0) tipo = "elipsoide";
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
        let [ecA, ecB, ecC] = cuadraticas;
        let [elG, elH, elI] = lineales;
        let lineal;
        if (ecA === 0) lineal = elG;
        if (ecB === 0) lineal = elH;
        if (ecC === 0) lineal = elI;
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

function getInfo(ecuacion, t) {
    let cuadraticas = [];
    let lineales = [];
    let constante = ecuacion[6];



    for (let index = 0; index < 3; index++) {
        const element = ecuacion[index];
        if (element !== 0) cuadraticas.push(element);
    }

    
    for (let index = 3; index < 6; index++) {
        const element = ecuacion[index];
        lineales.push(element);
    }
    //console.log(ecuacion);
    var info = {};
    info.imagen = `img/${t}.png`;
    //console.log("antes de los if",cuadraticas);
    if (cuadraticas.length === 3) {

        let [Al, Bl, Cl] = lineales;
        let [ecX, ecY, ecZ] = cuadraticas;
        let insidesqrtRadio = (Al / 2) * (Al / 2) + (Bl / 2) * (Bl / 2) + (Cl / 2) * (Cl / 2) + constante;
        R = Math.sqrt(insidesqrtRadio);
        switch (t) {
            case "hiperboloide_1_hoja":
                info.nombre = "Hiperboloide de 1 hoja";

                if (ecX < 0) {
                    info.eje_apertura = "X";
                } else if (ecY < 0) {
                    info.eje_apertura = "Y";
                } else {
                    info.eje_apertura = "Z";
                }

                break;
            case "hiperboloide_2_hojas":
                info.nombre = "Hiperboloide de 2 hojas";
                if (ecX > 0) {
                    info.eje_apertura = "X";
                } else if (ecY > 0) {
                    info.eje_apertura = "Y";
                } else {
                    info.eje_apertura = "Z";
                }
                break;
            case "elipsoide":
                info.nombre = "Elipsoide";
                info.centro = {}
                info.foco1 = {}
                info.foco2 = {}
                //Ax2, By2, Cz2, Dxy, Exz, Fyz, Gx, Hy, Iz, J
                //ecX, ecY, ecZ, ___, ___, ___, Al, Bl, Cl, constante

                let a1 = Math.sqrt((constante + ((Al * Al) / (4 * ecX)) + ((Bl * Bl) / (4 * ecY)) + ((Cl * Cl) / (4 * ecZ))) / ecX);
                let b1 = Math.sqrt((constante + ((Al * Al) / (4 * ecX)) + ((Bl * Bl) / (4 * ecY)) + ((Cl * Cl) / (4 * ecZ))) / ecY);
                let c1 = Math.sqrt((constante + ((Al * Al) / (4 * ecX)) + ((Bl * Bl) / (4 * ecY)) + ((Cl * Cl) / (4 * ecZ))) / ecZ);
                let a = Math.max(a1, b1, c1);
                let c = Math.min(a1, b1, c1);

                let df = Math.sqrt(a * a - c * c);
                let e = df / a;

                info.centro.x = -Al / (2 * ecX);
                info.centro.y = -Bl / (2 * ecY);
                info.centro.z = -Cl / (2 * ecZ);
                info.semieje1 = a1;
                info.semieje2 = b1;
                info.semieje3 = c1;
                info.distanciaFocal = df;
                info.foco1.x = info.centro.x;
                info.foco1.y = info.centro.y;
                info.foco1.z = info.centro.z;
                info.foco2.x = info.centro.x;
                info.foco2.y = info.centro.y;
                info.foco2.z = info.centro.z;

                let minimoCoef = Math.min(ecX, ecY, ecZ);

                if (minimoCoef === ecX) {
                    info.foco1.x += df;
                    info.foco2.x -= df;
                }

                if (minimoCoef === ecY) {
                    info.foco1.y += df;
                    info.foco2.y -= df;
                }

                if (minimoCoef === ecZ) {
                    info.foco1.z += df;
                    info.foco2.z -= df;
                }

                info.excentricidad = e;

                break;
            case "esfera":

                info.nombre = "Esfera";
                info.radio = R;
                info.centro = {}
                info.centro.x = -Al / 2;
                info.centro.y = -Bl / 2;
                info.centro.z = -Cl / 2;
                break;
            case "cono_eliptico":
                info.nombre = "Cono eliptico";
                if (ecX < 0) {
                    info.eje_apertura = "X";
                } else if (ecY < 0) {
                    info.eje_apertura = "Y";
                } else {
                    info.eje_apertura = "Z";
                }
                break;
            default:
                info.nombre = "Superficie Desconocida";
                info.p = "La ecuacion dada no corresponde a una ecuacion cuadrica";
                break;
        }
    } else {
        //paraboloides
        let [ecA, ecB, ecC] = cuadraticas;
        let [elG, elH, elI] = lineales;
        let lineal;
        if (ecA === undefined) lineal = elG;
        if (ecB === undefined) lineal = elH;
        if (ecC === undefined) lineal = elI;

        switch (t) {
            case "paraboloide_eliptico":
                info.nombre = "Paraboloide Eliptico";
                if (lineal === elG) {

                    if (lineal < 0) info.eje_apertura = "+X";
                    else info.eje_apertura = "-X";
                }

                if (lineal === elH) {

                    if (lineal < 0) info.eje_apertura = "+Y";
                    else info.eje_apertura = "-Y";
                }

                if (lineal === elI) {

                    if (lineal < 0) info.eje_apertura = "+Z";
                    else info.eje_apertura = "-Z";
                }
                break;
            case "paraboloide_hiperbolico":
                info.nombre = "Paraboloide Hiperbolico";
                if (lineal === elG) {

                    info.eje_apertura = "X";
                }

                if (lineal === elH) {

                    info.eje_apertura = "Y";
                }

                if (lineal === elI) {

                    info.eje_apertura = "Z";
                }
                break;
            default:
                info.nombre = "Superficie Desconocida";
                info.p = "La ecuacion dada no corresponde a una ecuacion cuadrica";
                break;
        }

    }
    return info;
}



function mostrarInformacion(info) {
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

    switch (tipo) {
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