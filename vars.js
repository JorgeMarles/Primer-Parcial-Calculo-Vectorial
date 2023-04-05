
var A = 2;
var B = 1;
var C = 1;
var R = 1;
var ZOOM = 10;
var PUNTOS = 1000;
var quads = {}
var wireframe = true;

function getInfo(ecuacion, t) {
    let cuadraticas = []
    let lineales = []
    let constante;
    //console.log(ecuacion);

    for (let index = 0; index < ecuacion.length; index++) {
        const element = ecuacion[index];
        if (element["lin"]) lineales.push(element["value"]);
        else if (index !== ecuacion.length - 1) cuadraticas.push(element["value"]);
        else constante = element["value"];
    }

    var info = {};
    info.imagen = `img/${t}.png`;

    if (cuadraticas.length === 3) {

        let [Al, Bl, Cl] = lineales;
        let [ecX, ecY, ecZ] = cuadraticas;
        switch (t) {
            case "hiperboloide_1_hoja":
                info.nombre = "Hiperboloide de 1 hoja";
                
                if(ecX < 0){
                    info.eje_apertura = "X";
                }else if(ecY < 0){
                    info.eje_apertura = "Y";
                }else{
                    info.eje_apertura = "Z";
                }
                
                break;
            case "hiperboloide_2_hojas":
                info.nombre = "Hiperboloide de 2 hojas";
                if(ecX > 0){
                    info.eje_apertura = "X";
                }else if(ecY > 0){
                    info.eje_apertura = "Y";
                }else{
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

                let df = Math.sqrt(a * a - c * c) ;
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

                if(minimoCoef === ecX){
                    info.foco1.x += df;
                    info.foco2.x -= df;
                }

                if(minimoCoef === ecY){
                    info.foco1.y += df;
                    info.foco2.y -= df;
                }

                if(minimoCoef === ecZ){
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
                if(ecX < 0){
                    info.eje_apertura = "X";
                }else if(ecY < 0){
                    info.eje_apertura = "Y";
                }else{
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
        let [ecA, ecB] = cuadraticas;
        let lineal = lineales[0];
        switch (t) {
            case "paraboloide_eliptico":
                info.nombre = "Paraboloide Eliptico";
                if (quads.x["exp"] === 1) {
                    
                    if (lineal < 0) info.eje_apertura = "+X";
                    else info.eje_apertura = "-X";
                }
            
                if (quads.y["exp"] === 1) {
                   
                    if (lineal < 0) info.eje_apertura = "+Y";
                    else info.eje_apertura = "-Y";
                }
            
                if (quads.z["exp"] === 1) {
                   
                    if (lineal < 0) info.eje_apertura = "+Z";
                    else info.eje_apertura = "-Z";
                }
                break;
            case "paraboloide_hiperbolico":
                info.nombre = "Paraboloide Hiperbolico";
                if (quads.x["exp"] === 1) {
                    
                    info.eje_apertura = "X";
                }
            
                if (quads.y["exp"] === 1) {
                   
                    info.eje_apertura = "Y";
                }
            
                if (quads.z["exp"] === 1) {
                   
                    info.eje_apertura = "Z";
                }
                break;
            default:
                info.nombre = "Superficie Desconocida";
                info.p = "La ecuacion dada no corresponde a una ecuacion cuadrica";
                break;
        }
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
    return info;
}