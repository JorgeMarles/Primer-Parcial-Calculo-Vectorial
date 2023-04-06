var arregloSpans = [];
var arregloMQ = [];

$(function () {
    for (let index = 65; index <= 74; index++) {
        var element = document.getElementById(String.fromCharCode(index));
        arregloSpans.push(element)
    }

    const W = (e) => {
        var enteredMath = e.latex(); // Get entered math in LaTeX format
        console.log(enteredMath);
        validar(enteredMath);
    }

    arregloSpans.map((el) => {
        var elementoMQ = MQ.MathField(el, {
            handlers: {
                edit: W,
            },
        });
        arregloMQ.push(elementoMQ);
    })

    function validar(string){
        var sinLatex = "";
        console.log(string.indexOf("\\frac"));
        let start = string.indexOf("\\frac");
        if(start!==-1){
            string = string.slice(0,start) + string.slice(start+5);
            console.log("rec",string);
        }else{

        }
    }
});