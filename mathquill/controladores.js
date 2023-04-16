
var arregloSpans = [];
var arregloMQ = [];
var informacionDiv = null;
$(function () {
    informacionDiv = document.getElementById("info")

    var answerSpan = document.getElementById("ecuacion");
    var answerMathField = MQ.StaticMath(answerSpan);
    answerMathField.latex(convertirEcuacion());
    //console.log(answerMathField);


    for (let index = 65; index <= 71; index++) {
        var element = document.getElementById(String.fromCharCode(index));
        if (element !== null) arregloSpans.push(element)
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
    let signo = (values[index] < 0)?'':'+';

    equation += (values[index] !== 0? signo+values[index]:"") + '=0';
    return equation;
}

function dividir() {
    let resultado = JSON.parse(JSON.stringify(values));
    
    return resultado;
}

function show() {
    let rta = validarNaN();
    if (rta !== "ok") {
        alert(rta + ", por favor, revisa los datos");
        return;
    }
    let dividida = dividir();
    tipo = verificarForma(dividida);
    console.log(tipo);
    //console.log(dividida);
    mostrarInformacion(tipo)

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
            if(tipo.t === "Elipsoide"){
                let centro = info.centro;
                let disFx = info.dx/2;
                let disFy = info.dy/2;
                let disFz = info.dz/2;
                let x1 = `(${centro.x + disFx}, ${centro.y}, ${centro.z})`;
                let x2 = `(${centro.x - disFx}, ${centro.y}, ${centro.z})`;
                let y1 = `(${centro.x}, ${centro.y + disFy}, ${centro.z})`;
                let y2 = `(${centro.x}, ${centro.y - disFy}, ${centro.z})`;
                let z1 = `(${centro.x}, ${centro.y}, ${centro.z + disFz})`;
                let z2 = `(${centro.x}, ${centro.y}, ${centro.z - disFz})`;                
                api.evalCommand(`D1 = Segment(${x1}, ${x2})`);
                api.evalCommand(`D2 = Segment(${y1}, ${y2})`);
                api.evalCommand(`D3 = Segment(${z1}, ${z2})`);
                api.setColor("D1",255,255,0);
                api.setColor("D2",0,255,0);
                api.setColor("D3",0,0,255);
            }
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

