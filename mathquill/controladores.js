var arregloSpans = [];
var arregloMQ = [];

$(function () {
   

    var answerSpan = document.getElementById("ecuacion");
    var answerMathField = MQ.MathField(answerSpan);
    answerMathField.write("Ax^2+By^2+Cz^2+Dxy+Exz+Fyz+Gx+Hy+Iz=J");


    for (let index = 65; index <= 74; index++) {
        var element = document.getElementById(String.fromCharCode(index));
        arregloSpans.push(element)
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
        var pos = getIndicesOf("-",enteredMath);
        pos.forEach(element => {
            if(element === 0){
                enteredMath = '0'+enteredMath;
            }else{
                enteredMath = enteredMath.slice(0, element)+'0'+enteredMath.slice(element);
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
        answerMathField.select();
        answerMathField.clearSelection();
        answerMathField.latex(convertirEcuacion());
        console.log(convertirEcuacion());
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
        if (values[index] !== 0) {
            equation += inicial;
        }
    }
    equation += '=' + values[index];
    return equation;
}

function show(){
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