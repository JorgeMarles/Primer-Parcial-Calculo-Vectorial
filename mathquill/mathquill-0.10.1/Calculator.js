function cuadricaConCentro(A, B, C, D, E, F, G) {
    let M = -G;

    if (A !== 0) {
        M += (D * D) / (4 * A);
    }

    if (B !== 0) {
        M += (E * E) / (4 * B);
    }

    if (C !== 0) {
        M += (F * F) / (4 * C);
    }

    let a2 = M / A;
    let b2 = M / B;
    let c2 = M / C;
    let h = -D / (2 * A);
    let k = -E / (2 * B);
    let l = -F / (2 * C);

    return [
        isFinite(a2) ? a2 : null,
        isFinite(b2) ? b2 : null,
        isFinite(c2) ? c2 : null,
        isFinite(h) ? h : 0,
        isFinite(k) ? k : 0,
        isFinite(l) ? l : 0,
        isFinite(M) ? M : null,
    ];
}
function cuadricaSinCentro(A, B, C, D, E, F, G) {
    let a2 = 1 / A;
    let b2 = 1 / B;
    let c2 = 1 / C;
    let h = -D / (2 * A);
    let k = -E / (2 * B);
    let l = -F / (2 * C);

    let cuadratico1, cuadratico2;
    if (A === 0) {
        if (B !== 0 && C !== 0) {
            a2 = 1 / D;
            h = -G / D + (E * E) / (4 * B * D) + (F * F) / (4 * C * D);
            cuadratico1 = b2;
            cuadratico2 = c2;
        } else {
            h = null;
            k = null;
            l = null;

            if (B === 0) {
                cuadratico1 = -1 / C;
                cuadratico2 = null;
            }

            if (C === 0) {
                cuadratico1 = -1 / B;
                cuadratico2 = null;
            }
        }
    } else if (B === 0) {
        if (A !== 0 && C !== 0) {
            b2 = 1 / E;
            k = -G / E + (D * D) / (4 * A * E) + (F * F) / (4 * C * E);

            cuadratico1 = a2;
            cuadratico2 = c2;
        } else {
            h = null;
            k = null;
            l = null;

            if (A === 0) {
                cuadratico1 = -1 / C;
                cuadratico2 = null;
            }

            if (C === 0) {
                cuadratico1 = -1 / A;
                cuadratico2 = null;
            }
        }
    } else if (C === 0) {
        if (A !== 0 && B !== 0) {
            c2 = 1 / F;
            l = -G / F + (D * D) / (4 * A * F) + (E * E) / (4 * B * F);
            cuadratico1 = a2;
            cuadratico2 = b2;
        } else {
            h = null;
            k = null;
            l = null;

            if (A === 0) {
                cuadratico2 = null;
            }

            if (B === 0) {
                cuadratico1 = -1 / C;
                cuadratico2 = null;
            }
        }
    }

    return [
        isFinite(cuadratico1) ? cuadratico1 : null,
        isFinite(cuadratico2) ? cuadratico2 : null,
        isFinite(h) ? h : 0,
        isFinite(k) ? k : 0,
        isFinite(l) ? l : 0,
    ];
}

function ecuacionGeneral(A, B, C, D, E, F, G) {

    const cantidadCuadraticos = [A, B, C].filter((e) => e !== 0).length;
    // Existe al menos un valor distinto a 0
    if (
        A !== 0 ||
        B !== 0 ||
        C !== 0 ||
        D !== 0 ||
        E !== 0 ||
        F !== 0 ||
        G !== 0
    ) {
        let cuadraticos = [];
        let lineales = [];
        if (A !== 0) {
            cuadraticos.push("x");
        }
        if (B !== 0) {
            cuadraticos.push("y");
        }
        if (C !== 0) {
            cuadraticos.push("z");
        }
        if (D !== 0) {
            lineales.push("x");
        }
        if (E !== 0) {
            lineales.push("y");
        }
        if (F !== 0) {
            lineales.push("z");
        }

        let linealesSinCuadratico = lineales.filter(
            (e) => !cuadraticos.includes(e)
        );
        info = {};
        if (
            cuadraticos.length < 3 &&
            cuadraticos.length > 0 &&
            linealesSinCuadratico.length > 0
        ) {
            let [a2, b2, h, k, l] = cuadricaSinCentro(A, B, C, D, E, F, G);
            if (cantidadCuadraticos === 2) {
                if ((a2 >= 0 && b2 >= 0) || (a2 < 0 && b2 < 0)) {
                    figura = "Paraboloide Elíptico";
                    let eje = "";

                    if (A === 0) {
                        
                        eje += "X";
                        eje += D < 0 ? " Positivo" : " Negativo";
                    }

                    if (B === 0) {
                        eje += "Y";
                        eje += E < 0 ? " Positivo" : " Negativo";

                    }

                    if (C === 0) {
                        eje += "Z";
                        eje += F < 0 ? " Positivo" : " Negativo";

                    }
                    info.t = figura;
                    info.vertice = {};
                    info.vertice.x = h;
                    info.vertice.y = k;
                    info.vertice.z = l;
                    info.eje = eje;
                }

                if ((a2 >= 0 && b2 < 0) || (a2 < 0 && b2 >= 0)) {
                    figura = "Paraboloide Hiperbólico";
                    let eje = null;

                    if (A === 0) {
                        eje = "X";
                    }

                    if (B === 0) {
                        eje = "Y";
                    }

                    if (C === 0) {
                        eje = "Z";
                    }
                    info.t = figura;
                    info.vertice = {};
                    info.vertice.x = h;
                    info.vertice.y = k;
                    info.vertice.z = l;
                    info.eje = eje;

                }
            } else if (cantidadCuadraticos === 1) {
                if (
                    (a2 === null && b2 !== null) ||
                    (a2 !== null && b2 === null)
                ) {
                    figura = "Cilindro Parabólico";
                    let ejes = [];

                    if (A === 0 && D !== 0) {
                        if(D > 0)ejes.push("X Negativo");
                        else ejes.push("X positivo");
                    }

                    if (B === 0 && E !== 0) {
                        if(E > 0)ejes.push("Y Negativo");
                        else ejes.push("Y positivo");
                    }

                    if (C === 0 && F !== 0) {
                        if(F > 0)ejes.push("Z Negativo");
                        else ejes.push("Z positivo");
                    }
                    info.t = figura;
                    info.ejes = ejes;


                }
            }
        } else if (cuadraticos.length > 0) {
            let [a2, b2, c2, h, k, l, M] = cuadricaConCentro(
                A,
                B,
                C,
                D,
                E,
                F,
                G
            );

            let nulos = [a2, b2, c2].filter((e) => e === null);
            let negativos = [a2, b2, c2].filter(
                (e) => e !== null && e < 0
            ).length;

            if (lineales.length === 0 && G === 0) {
                negativos = [A, B, C].filter((e) => e !== null && e < 0).length;
            }

            if (nulos.length === 0) {
                if (M !== 0) {
                    if (a2 > 0 && b2 > 0 && c2 > 0) {
                        if (a2 === b2 && a2 === c2) {

                            info.t = "Esfera";
                            info.radio = Math.sqrt(a2);
                        } else {
                            let ejeX = (Math.sqrt(a2));
                            let ejeY = (Math.sqrt(b2));
                            let ejeZ = (Math.sqrt(c2));
                            let a = Math.max(ejeX, ejeY, ejeZ);
                            let c = Math.min(ejeX, ejeY, ejeZ);
            
                            let df = Math.sqrt(a * a - c * c) ;
                            let e = df / a;
                            info.t = "Elipsoide";
                            info.excentricidad = e;
                            info.dx = ejeX*2;
                            info.dy = ejeY*2;
                            info.dz = ejeZ*2;
                        }
                        info.centro = {};
                        info.centro.x = h;
                        info.centro.y = k;
                        info.centro.z = l;
                    } else {
                        //Hiperboloide
                        if (negativos === 1) {
                            figura = "Hiperboloide de 1 hoja";
                            let eje = null;

                            if (a2 < 0) {
                                eje = "X";
                            }

                            if (b2 < 0) {
                                eje = "Y";
                            }

                            if (c2 < 0) {
                                eje = "Z";
                            }
                            info.t = figura;
                            info.eje = eje;
                            info.centro = {};
                            info.centro.x = h;
                            info.centro.y = k;
                            info.centro.z = l;

                        } else if (negativos === 2) {
                            figura = "Hiperboloide de 2 hojas";
                            let eje = null;

                            if (a2 >= 0) {
                                eje = "X";
                            }

                            if (b2 >= 0) {
                                eje = "Y";
                            }

                            if (c2 >= 0) {
                                eje = "Z";
                            }
                            info.t = figura;
                            info.eje = eje;
                            info.centro = {};
                            info.centro.x = h;
                            info.centro.y = k;
                            info.centro.z = l;

                        }
                    }
                } else {
                    if (negativos === 0 || negativos === 3) {
                        info.t = "Punto";
                        info.punto = { x: 0, y: 0, z: 0 };
                        if (D !== 0) info.punto.x = -G;
                        if (E !== 0) info.punto.y = -G;
                        if (F !== 0) info.punto.z = -G;
                    } else if (negativos < 3) {
                        let figura = "Cono Elíptico";
                        let eje = null;
                        if (negativos === 1) {
                            if (A < 0) {
                                eje = "X";
                            }

                            if (B < 0) {
                                eje = "Y";
                            }

                            if (C < 0) {
                                eje = "Z";
                            }
                        }

                        if (negativos === 2) {
                            if (A > 0) {
                                eje = "X";
                            }

                            if (B > 0) {
                                eje = "Y";
                            }

                            if (C > 0) {
                                eje = "Z";
                            }
                        }
                        info.t = figura;
                        info.eje = eje;
                    }
                }
            } else if (nulos.length === 1) {
                if (M === 0) {
                    if (negativos === 0 || negativos === 2) {
                        figura = "Recta Paralela a un Eje Coordenado";
                        let eje = null;

                        if (a2 === null) {
                            eje = "X";
                        }

                        if (b2 === null) {
                            eje = "Y";
                        }

                        if (c2 === null) {
                            eje = "Z";
                        }
                        info.t = figura;
                        info.eje = eje;
                    } else if (negativos === 1) {
                        figura = "Planos que se intersecan";
                        let eje = null;

                        if (a2 === null) {
                            eje = "X";
                        }

                        if (b2 === null) {
                            eje = "Y";
                        }

                        if (c2 === null) {
                            eje = "Z";
                        }
                        info.t = figura;
                        info.eje = eje;
                    }
                } else {
                    if (negativos === 0) {
                        figura = "Cilindro Elíptico";

                        let eje = null;

                        if (a2 === null) {
                            eje = "X";
                        }

                        if (b2 === null) {
                            eje = "Y";
                        }

                        if (c2 === null) {
                            eje = "Z";
                        }
                        info.t = figura;
                        info.eje = eje;
                        info.centro = {};
                        info.centro.x = h;
                        info.centro.y = k;
                        info.centro.z = l;

                    } else if (negativos === 1) {
                        let figura = "Cilindro Hiperbólico";
                        let eje = null;

                        if (a2 === null) {
                            eje = "X";
                        }

                        if (b2 === null) {
                            eje = "Y";
                        }

                        if (c2 === null) {
                            eje = "Z";
                        }
                        info.t = figura;
                        info.centro = {}
                        info.centro.x = h;
                        info.centro.y = k;
                        info.centro.z = l;
                        info.eje = eje;
                    }
                }
            } else if (nulos.length === 2) {
                if (M === 0) {
                    figura = "Plano Coordenado";
                    let plano = "";

                    if (a2 === null) {
                        plano += "X";
                    }

                    if (b2 === null) {
                        plano += "Y";
                    }

                    if (c2 === null) {
                        plano += "Z";
                    }
                    info.t = figura;
                    info.plano = plano;
                } else if (negativos === 0 && M !== 0) {
                    figura = "Planos Paralelos";
                    let eje = null;
                    let distancia = null;

                    if (a2 !== null) {
                        eje = "X";
                        distancia = Math.sqrt(a2) * 2;
                    }

                    if (b2 !== null) {
                        eje = "Y";
                        distancia = Math.sqrt(b2) * 2;
                    }

                    if (c2 !== null) {
                        eje = "Z";
                        distancia = Math.sqrt(c2) * 2;
                    }
                    info.t = figura;
                    info.distancia = distancia;
                    info.eje = eje;
                }
            }
        } else if (lineales.length > 0) {
            figura = "Plano";

            if (D !== 0) {
                let ejeX = -G / D;
                info.corteX = ejeX;
            } else {
                info.corteX = null;
            }

            if (E !== 0) {
                let ejeY = -G / E;
                info.corteY = ejeY;
            } else {
                info.corteY = null;
            }

            if (F !== 0) {
                let ejeZ = -G / F;
                info.corteZ = ejeZ;
            } else {
                info.corteZ = null;
            }
            info.t = figura;
            
        }
    }
    if (info.t === undefined) info.t = "Desconocido";
    return info;
}

