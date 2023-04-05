
/**
 * 
    "hiperboloide_1_hoja"
    "hiperboloide_2_hojas"
    "elipsoide" 
    "paraboloide_eliptico"
    "paraboloide_hiperbolico"
    //"esfera":esfera //1 ejecucion(especial)
    "cono_eliptico"
 */
var t = "desconocido"

const hip_1h = function (a, b, c, sign, u, v) {
    let [x, y, z] = [0, 0, 0];
    if (quads.x["value"] < 0) {
        //despejar x;
        // x=a*sqrt(-(b^2c^2)+y^2c^2+z^2b^2)/bc
        y = u;
        z = v;
        a *= sign;
        let insidesqrt = -(b * b * c * c) + (y * y * c * c) + (z * z * b * b);
        x = a * Math.sqrt(insidesqrt) / (b * c);
    }

    if (quads.y["value"] < 0) {
        //despejar y;
        // y = b*sqrt(-(a^2c^2)+x^2c^2+z^2a^2)/ac
        x = u;
        z = v;
        b *= sign;
        let insidesqrt = -(a * a * c * c) + (x * x * c * c) + (z * z * a * a);
        y = b * Math.sqrt(insidesqrt) / (a * c);
    }

    if (quads.z["value"] < 0) {
        //despejar z;
        //z= c*sqrt(-(a^2b^2)+x^2b^2+y^2a^2)/ab
        x = u;
        y = v;
        c *= sign;
        var insidesqrt = -(a * a * b * b) + (x * x * b * b) + (y * y * a * a);
        z = c * Math.sqrt(insidesqrt) / (a * b);
    }


    //var insidesqrt = (a * a * b * b) - (x * x * b * b) + (z * z * a * a);
    //var y = c * Math.sqrt(insidesqrt) / a * b;
    return [x, y, z];
}

const hip_2h = function (a, b, c, sign, u, v) {
    let [x, y, z] = [0, 0, 0];
    if (quads.x["value"] > 0) {
        //despejar x;
        // x= a*sqrt(b^2c^2+y^2c^2+z^2b^2)/bc
        y = u;
        z = v;
        a *= sign;
        let insidesqrt = (b * b * c * c) + (y * y * c * c) + (z * z * b * b);
        x = a * Math.sqrt(insidesqrt) / (b * c);
    }

    if (quads.y["value"] > 0) {
        //despejar y;
        //y=b*sqrt(a^2c^2+x^2c^2+z^2a^2)/ac
        x = u;
        z = v;
        b *= sign;
        let insidesqrt = (a * a * c * c) + (x * x * c * c) + (z * z * a * a);
        y = b * Math.sqrt(insidesqrt) / (a * c);
    }

    if (quads.z["value"] > 0) {
        //despejar z;
        //z= c*sqrt((a^2b^2)+x^2b^2+y^2a^2)/ab
        x = u;
        y = v;
        c *= sign;
        var insidesqrt = (a * a * b * b) + (x * x * b * b) + (y * y * a * a);
        z = c * Math.sqrt(insidesqrt) / (a * b);
    }
    //var insidesqrt = -(a * a * b * b) - (x * x * b * b) + (z * z * a * a);
    //y = c * Math.sqrt(insidesqrt) / a * b;
    return [x, y, z];
}

const elipsoide = function (a, b, c, sign, u, v) {
    let [x, y, z] = [0, 0, 0];
    let menor = Math.min(quads.x["value"], quads.y["value"], quads.z["value"]);

    if (menor === quads.x["value"]) {
        //despejar x
        //x=a*sqrt(b^2c^2-y^2c^2-z^2b^2)/{bc}
        y = u;
        z = v;
        a *= sign;
        let insidesqrt = (b * b * c * c) - (y * y * c * c) - (z * z * b * b);
        x = a * Math.sqrt(insidesqrt) / (b * c);
    }

    if (menor === quads.y["value"]) {
        //despejar y
        //y=b*sqrt{a^2c^2-x^2c^2-z^2a^2}/{ac}
        x = u;
        z = v;
        b *= sign;
        let insidesqrt = (a * a * c * c) - (x * x * c * c) - (z * z * a * a);
        y = b * Math.sqrt(insidesqrt) / (a * c);
    }

    if (menor === quads.z["value"]) {
        //despejar z
        //z=c*sqrt{a^2b^2-x^2b^2-y^2a^2}/{ab}
        x = u;
        y = v;
        c *= sign;
        let insidesqrt = (a * a * b * c) - (x * x * b * b) - (y * y * a * a);
        z = c * Math.sqrt(insidesqrt) / (a * b);
    }
    //console.log(a, b, c);
    //var x = u;
    //var z = v;
    //var insidesqrt = (a * a * b * b) - (x * x * b * b) - (z * z * a * a);
    //if(insidesqrt<0)insidesqrt*=-1;
    //var y = c * Math.sqrt(insidesqrt) / a * b;
    return [x, y, z];
}

const parab_elip = function (a, b, c, sign, u, v) {
    let [x, y, z] = [0, 0, 0];

    if (quads.x["exp"] === 1) {
        //despejar x
        //x = a^2-{a^2y^2}/{b^2}-{a^2z^2}/{c^2}
        y = u;
        z = v;

        x = (a * a) - ((a * a * y * y) / (b * b)) - ((a * a * z * z) / (c * c));
        if (quads.x["value"] < 0) x *= -1;
    }

    if (quads.y["exp"] === 1) {
        //despejar y
        //y= b^2-{b^2x^2}/{a^2}-{b^2z^2}/{c^2}
        x = u;
        z = v;
        y = (b * b) - ((b * b * x * x) / (a * a)) - ((b * b * z * z) / (c * c));
        if (quads.y["value"] < 0) y *= -1;
    }

    if (quads.z["exp"] === 1) {
        //despejar z
        //z =c^2-{c^2x^2}/{a^2}-{c^2y^2}/{b^2}
        x = u;
        y = v;
        z = (c * c) - ((c * c * x * x) / (a * a)) - ((c * c * y * y) / (b * b));
        if (quads.z["value"] < 0) z *= -1;
    }

    //var x = u;
    //var y = v;
    // c = Math.abs(c);
    //var z = (c * x * x) / a * a + (c * y * y) / (b * b);
    return [x, y, z];
}

const parab_hiper = function (a, b, c, sign, u, v) {
    let [x, y, z] = [0, 0, 0];

    if (quads.x["exp"] === 1) {
        //despejar x

        y = u;
        z = v;
        if (quads.z["value"] < 0) {
            //x=a^2+{a^2y^2}/{b^2}-{a^2z^2}/{c^2}
            x = (a * a) + ((a * a * y * y) / (b * b)) - ((a * a * z * z) / (c * c));
        }
        if (quads.y["value"] < 0) {
            //x=a^2-{a^2y^2}/{b^2}+{a^2z^2}/{c^2}
            x = (a * a) - ((a * a * y * y) / (b * b)) + ((a * a * z * z) / (c * c));
        }

    }

    if (quads.y["exp"] === 1) {
        //despejar y
        //y= b^2-{b^2x^2}/{a^2}-{b^2z^2}/{c^2}
        x = u;
        z = v;
        if (quads.z["value"] < 0) {
            //y=b^2+{b^2x^2}/{a^2}-{b^2z^2}/{c^2}
            y = (b * b) + ((b * b * x * x) / (a * a)) - ((b * b * z * z) / (c * c));
        }
        if (quads.x["value"] < 0) {
            //y=b^2-{b^2x^2}/{a^2}+{b^2z^2}/{c^2}
            y = (b * b) - ((b * b * x * x) / (a * a)) + ((b * b * z * z) / (c * c));
        }
    }

    if (quads.z["exp"] === 1) {
        //despejar z
        //z =c^2-{c^2x^2}/{a^2}-{c^2y^2}/{b^2}
        x = u;
        y = v;
        if (quads.x["value"] < 0) {
            //z=c^2+{c^2x^2}/{a^2}-{c^2y^2}/{b^2}
            z = (c * c) + ((c * c * x * x) / (a * a)) - ((c * c * y * y) / (b * b));
        }
        if (quads.y["value"] < 0) {
            //y=b^2-{b^2x^2}/{a^2}+{b^2z^2}/{c^2}
            z = (c * c) - ((c * c * x * x) / (a * a)) + ((c * c * y * y) / (b * b));
        }
    }


    //var x = u;
    //var z = v;
    //c = Math.abs(c);
    //var y = (c * x * x) / a * a - (c * z * z) / (b * b);
    return [x, y, z];
}


const cono_elip = function (a, b, c, sign, u, v) {
    let [x, y, z] = [0, 0, 0];
    if (quads.x["value"] < 0) {
        //despejar x;
        //x=a*sqrt{c^2y^2+b^2z^2}/{bc}
        y = u;
        z = v;
        a *= sign;
        let insidesqrt = (y * y * c * c) + (z * z * b * b);
        x = a * Math.sqrt(insidesqrt) / (b * c);
    }

    if (quads.y["value"] < 0) {
        //despejar y;
        // y=b*sqrt{c^2x^2+a^2z^2}/{ac}
        x = u;
        z = v;
        b *= sign;
        let insidesqrt = (x * x * c * c) + (z * z * a * a);
        y = b * Math.sqrt(insidesqrt) / (a * c);
    }

    if (quads.z["value"] < 0) {
        //despejar z;
        //z = c*sqrt{b^2x^2+a^2y^2}/{ab}
        x = u;
        y = v;
        c *= sign;
        var insidesqrt =  (x * x * b * b) + (y * y * a * a);
        z = c * Math.sqrt(insidesqrt) / (a * b);
    }

    //var x = u;
    //var z = v;
    //var insidesqrt = x * x * b * b - z * z * a * a;
    //var y = c * Math.sqrt(insidesqrt) / a * b;
    return [x, y, z];
}


function val(u, v, sign) {
    u -= 0.5;
    u *= ZOOM;
    v -= 0.5;
    v *= ZOOM;
    var a = A;
    var b = B;
    var c = C;

    //console.log(insidesqrt^);
    return equations[t](a, b, c, sign, u, v);
}



var equations = {
    "hiperboloide_1_hoja": hip_1h,
    "hiperboloide_2_hojas": hip_2h,
    "elipsoide": elipsoide,
    "paraboloide_eliptico": parab_elip,//1 ejecucion
    "paraboloide_hiperbolico": parab_hiper,
    "cono_eliptico": cono_elip
}


var f1 = function (v, u, target) {

    var [x, y, z] = val(u, v, 1);
    target.set(x, y, z);

}
var f2 = function (v, u, target) {
    var [x, y, z] = val(u, v, -1);
    target.set(x, y, z);

}


