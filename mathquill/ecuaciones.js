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

  
    }
    return tipo;
  
  }

function verificarForma(ecuacion) {
    //console.log(ecuacion);

    let [A, B, C, D, E, F, G] = ecuacion;


    var tipo = "desconocido";
    if (A === B && B === C && A === 0) {//si las 3 cuadraticas están en 0, es un plano
        tipo = "plano";
    } else if (A === 0 || B === 0 || C === 0) {
        /*
        si tiene 1 o 2 cuadraticas en 0, puede ser
        Cilindro (parabolico, hiperbolico, eliptico o circular)
        2 Planos paralelos
        Paraboloide Eliptico
        Paraboloide Hiperbolico
        */
        if ((A === 0 && B === 0) || (A === 0 && C === 0) || (B === 0 && C === 0)) {
            /**
             * Si tiene 2 cuadraticas en 0, puede ser
             * 2 Planos paralelos 
             *      (Ax^2+Dx+G=0) || (By^2+Ey+G=0) || (Cz^2+Fz+G=0)
             *      Si signo(A) = signo(G), D^2-4AG >= 0
             *      Por tanto, si G < D^2/4A, 2 planos, y si G=D^2/4A, 1 plano
             *      Si signo(A) != signo(G), D^2+4AG >= 0
             *      Por tanto, G > -(D^2/4A), 2 planos y si G = -(D^2/4A), 1 plano
             * 
             * 
             * Cilindro parabólico (Ax^2+Dx+Ey+Fz+G=0) || (By^2+Dx+Ey+Fz+G=0) || (Cz^2+Dx+Ey+Fz+G=0) 
             *  (D, E Y F)pueden ser 0, pero al menos uno debe ser !==0
             * */
            //cilindro parabolico
            if ((D !== 0 || E !== 0 || F !== 0)) {
                t = "cilindro_parabolico";
            }
            if (A !== 0 && E === 0 && F === 0) {
                //planos
                let discriminante = (D * D / (4 * A));
                if (A < 0) {
                    if (G > discriminante) tipo = "planos_paralelos"
                    if (G === discriminante) tipo = "plano";
                } else {
                    if (G < discriminante) tipo = "planos_paralelos"
                    if (G === -discriminante) tipo = "plano";
                }
            }
            if ((B !== 0 && D === 0 && F === 0)) {
                let discriminante = (E * E / (4 * B));
                if (B < 0) {
                    if (G > discriminante) tipo = "planos_paralelos"
                    if (G === discriminante) tipo = "plano";
                } else {
                    if (G < discriminante) tipo = "planos_paralelos"
                    if (G === discriminante) tipo = "plano";
                }

            }
            if ((C !== 0 && D === 0 && E === 0)) {
                let discriminante = (F * F / (4 * C));
                if (C < 0) {
                    if (G > discriminante) tipo = "planos_paralelos"
                    if (G === discriminante) tipo = "plano";
                } else {
                    if (G < discriminante) tipo = "planos_paralelos"
                    if (G === discriminante) tipo = "plano";
                }
            }
        } else {
            /**
             * Si tiene 1 cuadratica en 0, puede ser
             * Planos intersectados
             * cuando signo(A) != signo(B), C=D=E=F=G=0
             * 
             * Paraboloide eliptico (Ax^2+By^2+Dx+Ey+Fz+G=0) || (Ax^2+Cz^2+Dx+Ey+Fz+G=0) || (By^2+Cz^2+Dx+Ey+Fz+G=0)
             * Si signo(A) = signo(B), F != 0
             * 
             * Paraboloide hiperbolico (Ax^2+By^2+Dx+Ey+Fz+G=0) || (Ax^2+Cz^2+Dx+Ey+Fz+G=0) || (By^2+Cz^2+Dx+Ey+Fz+G=0)
             * Si signo(A) != signo(B), F != 0
             * 
             * Cilindro circular
             * si A = C y F = 0 , signo(A) = signo(C)
             * 
             * Cilindro eliptico
             * Si A != C y F = 0,  signo(A) = signo(C)
             * 
             * Cilindro hiperbolico
             * signo(A) != signo(C) y F = 0
             * */
            //paraboloide eliptico
            if (
                (signo(A) !== signo(B) && (C === D && D === E && E === F && F === G && G === 0)) ||
                (signo(A) !== signo(C) && (B === D && D === E && E === F && F === G && G === 0)) ||
                (signo(B) !== signo(C) && (A === D && D === E && E === F && F === G && G === 0))
            ) tipo = "planos_intersecados";
            else if (
                (signo(A) === signo(B) && F !== 0) ||
                (signo(A) === signo(C) && E !== 0) ||
                (signo(B) === signo(C) && D !== 0)
            ) tipo = "paraboloide_eliptico";
            else if (
                (signo(A) === signo(B) && C === D && D === E && E === F && F === G && G === 0) ||
                (signo(A) === signo(C) && B === D && D === E && E === F && F === G && G === 0) ||
                (signo(B) === signo(C) && A === D && D === E && E === F && F === G && G === 0)
            ) tipo = "recta";
            else if (
                (signo(A) !== signo(B) && F !== 0) ||
                (signo(A) !== signo(C) && E !== 0) ||
                (signo(B) !== signo(C) && D !== 0)
            ) tipo = "paraboloide_hiperbolico";
            else if (
                (A === B && F === 0) ||
                (A === C && E === 0) ||
                (B === C && D === 0)
            ) {
                let radio2 = Math.sqrt((D / (2 * A)) * (D / (2 * A)) + (E / (2 * B))*(E / (2 * B)) - G / A);
                if (radio2 >= 0) tipo = "cilindro_circular";
            }
            else if (
                (signo(A) === signo(B) && F === 0) ||
                (signo(A) === signo(C) && E === 0) ||
                (signo(B) === signo(C) && D === 0)
            ) {
                let a = (1 - ((D * D) / (4 * A * A))) / (A / G);
                let b = (1 - ((E ^ 2) / (4 * B * B))) / (B / G)
                if (b < 0 && a < 0) tipo = "cilindro_eliptico";
            }
            else if (
                (signo(A) !== signo(B) && F === 0) ||
                (signo(A) !== signo(C) && E === 0) ||
                (signo(B) !== signo(C) && D === 0)
            ) tipo = "cilindro_hiperbolico"
        }
    } else if (-4 * A * G + D * D + E + E + F * F > 0) {
        //−𝟒𝑨𝑮+𝑫^𝟐+𝑬^𝟐+𝑭^𝟐>𝟎
        tipo = "esfera";
    } else if (
        (signo(A) === signo(B) && signo(B) === signo(C) && signo(A) !== signo(G))
    ) {
        /**
         * Elipsoide
         * si las cuadraticas son negativas, G debe ser positivo
         * si las cuadraticas son positivas, G debe ser negativo
         * Los signos de las cuadraticas deben ser iguales
         * */
        tipo = "elipsoide";
    }
    cuadraticas = [A,B,C];
    lineales = [D,E,F];
    constante = G;
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
    return ecuacionGeneral(A, B, C, D, E, F, G);
}

function signo(n){
    return n;
}


function mostrarInformacion(info) {
    let title = `<div class="card-header w-100">
                <h2>Informacion de la superficie</h2>
              </div>`;
    let img = `<img src="img/${info.t}.png" alt="" class="card-img-top" id="info_imagen">`;
    let name = getName(info.t);
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
    let texto = "";

    switch (info.t) {
        case "Elipsoide":
            texto += informacionPuntual("Centro", punto(info.centro))
            texto += informacionPuntual("Diametro eje X", info.dx);
            texto += informacionPuntual("Diametro eje Y", info.dy);
            texto += informacionPuntual("Diametro eje Z", info.dz);
            texto += informacionPuntual("Excentricidad", info.excentricidad);
            break;
        case "Esfera":
            texto += informacionPuntual("Centro", punto(info.centro))
            texto += informacionPuntual("Radio", info.radio);

            break;
        case "Hiperboloide de 1 hoja":
            texto += informacionPuntual("Centro", punto(info.centro));
            texto += informacionPuntual("Eje por el que se abre", info.eje);

            break;
        case "Hiperboloide de 2 hojas":
            texto += informacionPuntual("Centro", punto(info.centro));
            texto += informacionPuntual("Eje por el que se abre", info.eje);

            break;
        case "Cilindro Elíptico":
            texto += informacionPuntual("Paralelo al eje", info.eje);

            break;
        case "Cilindro Hiperbólico":
            texto += informacionPuntual("Centro", punto(info.centro));
            texto += informacionPuntual("Paralelo al eje", info.eje);

            break;
        case "Cilindro Parabólico":
            let ejes = "";
            info.ejes.forEach((e, i) => {
                ejes += e;
                if (i !== info.ejes.length - 1) ejes += " y ";
            });
            texto += informacionPuntual("Eje(s) de apertura", ejes);

            break;
        case "Planos Paralelos":
            texto += informacionPuntual("Distancia", info.distancia);
            texto += informacionPuntual("Cortan el eje", info.eje);
            break;
        case "Punto":
            texto += informacionPuntual("Coordenadas",punto(info.punto))
            break;
        case "Cono Elíptico":
            texto += informacionPuntual("Abre en el eje", info.eje);
            break;
        case "Recta Paralela a un Eje Coordenado":
            texto += informacionPuntual("Paralela al eje Coordenado", info.eje);
            break;
        case "Planos que se intersecan":
            texto += informacionPuntual("Su interseccion es paralela al eje", info.eje);
            break;
        case "Plano":
            if(info.corteX !== null)texto += informacionPuntual("Corta al eje X en", info.corteX);
            
            if(info.corteY !== null)texto += informacionPuntual("Corta al eje Y en", info.corteY);
            if(info.corteZ !== null)texto += informacionPuntual("Corta al eje Z en", info.corteZ);
            break;
        case "Plano Coordenado":
            texto += informacionPuntual("Representa el plano", info.plano);
            break;
        case "Paraboloide Elíptico":
            texto += informacionPuntual("Vertice", punto(info.vertice))
            texto += informacionPuntual("Abre en el eje", info.eje);
            break;
        case "Paraboloide Hiperbólico":
            texto += informacionPuntual("Vertice", punto(info.vertice))
            texto += informacionPuntual("Abre en el eje", info.eje);
            break;
        default:
            texto = informacionPuntual("Causa", info.t);
            break;
    }
    return `<p class="card-text">
            ${texto}
          </p>`;
}

function punto(punto) {
    return `(${punto.x}, ${punto.y}, ${punto.z})`;
}