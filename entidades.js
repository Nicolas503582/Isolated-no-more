import { dibujo } from './funciones_dibujo.js';
import { calculos } from './general.js';

const pincel = new dibujo();
const calculo = new calculos();

export class Entidad{
        constructor(x, y, imagen = "", colores_iniciales){
            //this.listo = false;
            this.x = x;
            this.y = y;
            this.imagen = new Image();

            this.canvasOculto = document.createElement('canvas');
            this.canvasOculto.width = 0;
            this.canvasOculto.height = 0;
            this.ctxOculto = this.canvasOculto.getContext('2d');

            this.canvasAux = document.createElement('canvas');
            this.canvasAux.width = 1;
            this.canvasAux.height = 1;
            this.ctxAux = this.canvasAux.getContext('2d');

            this.colores = colores_iniciales;

            this.guardarimagen(imagen);
        }

        inicio(){
            this.ctxOculto.drawImage(this.imagen, 0, 0);
            this.cambiarColor(this.colores);
            console.log(pincel.aNormal(this.ctxOculto, this.canvasOculto));
        }
        cambiarColor(color){
            let Dataimage = pincel.aNormal(this.ctxOculto, this.canvasOculto);
            let Data = Dataimage.data;
            let colores_nuevos = [];
            let colores_nuevos_hsv = [];
            let colores_viejos = [];
            let colores_viejos_hsv = [];

            for(let i = 0; i<color.length; i++){
                this.ctxAux.fillStyle = color[i];
                this.ctxAux.fillRect(0, 0, 1, 1);
                let colorData = this.ctxAux.getImageData(0, 0, 1, 1).data;
                colores_nuevos.push([colorData[0], colorData[1], colorData[2]]);
                colores_nuevos_hsv.push(calculo.rgbaToHsv(colorData[0], colorData[1], colorData[2]));
            }

            for(let i = 0; i < Data.length; i += 4){
                let aux = false;
                for(let j = 0; j < colores_viejos.length; j++){
                    let aux_Data = calculo.rgbaToHsv(Data[i], Data[i + 1], Data[i + 2]);
                    if(!colores_viejos[j] || !colores_nuevos[j]) continue;
                    let diferencia = aux_Data.h - colores_viejos_hsv[j].h;
                    if(Math.abs(diferencia) < 20)
                    {
                        aux_Data.h = colores_nuevos_hsv[j].h + diferencia;
                        if(aux_Data.h < 0) aux_Data.h += 360;
                        if(aux_Data.h > 360) aux_Data.h -= 360;

                        let aux_s = aux_Data.s - colores_viejos_hsv[j].s;
                        aux_Data.s = colores_nuevos_hsv[j].s + aux_s;
                        if(aux_Data.s < 0) aux_Data.s += aux_s*2;
                        if(aux_Data.s > 100) aux_Data.s -= aux_s*2;

                        let aux_v = aux_Data.v - colores_viejos_hsv[j].v;
                        aux_Data.v = colores_nuevos_hsv[j].v + aux_v;
                        if(aux_Data.v < 0) aux_Data.v += aux_v*2;
                        if(aux_Data.v > 100) aux_Data.v -= aux_v*2;

                        let nuevoColor = calculo.hsvToRgba(aux_Data.h, aux_Data.s, aux_Data.v);
                        Data[i] = nuevoColor.r;
                        Data[i + 1] = nuevoColor.g;
                        Data[i + 2] = nuevoColor.b;
                        Data[i + 3] = Data[i + 3];
                        aux = true;
                        break;
                    }
                }
                if(!aux && Data[i + 3] !== 0/* && Data[i] !== 0 && Data[i + 1] !== 0 && Data[i + 2] !== 0*/){
                    let j = colores_viejos.length;
                    colores_viejos.push([Data[i], Data[i + 1], Data[i + 2]]);
                    colores_viejos_hsv.push(calculo.rgbaToHsv(colores_viejos[j][0], colores_viejos[j][1], colores_viejos[j][2]));
                    if(colores_nuevos[j] === undefined) continue;
                    Data[i] = colores_nuevos[j][0];
                    Data[i + 1] = colores_nuevos[j][1];
                    Data[i + 2] = colores_nuevos[j][2];
                }/*
                else if(Data[i + 3] != 255)
                {
                    Data[i + 3] = 255;
                    Data[i] = 255;
                    Data[i + 1] = 255;
                    Data[i + 2] = 255;
                }
                else if(Data[i] === 0 && Data[i + 1] === 0 && Data[i + 2] === 0)
                {
                    Data[i] = 255;
                    Data[i + 1] = 100;
                    Data[i + 2] = 0;
                }*/
            }
            /*
            for(let i = 0; i < Data.length; i += 4){
                for(let j = 0; j < this.colores.length; j++){
                    if(colores_nuevos[j] === undefined) continue;
                    if(Data[i] === colores_viejos[j][0] && Data[i + 1] === colores_viejos[j][1] && Data[i + 2] === colores_viejos[j][2]){
                        Data[i] = colores_nuevos[j][0];
                        Data[i + 1] = colores_nuevos[j][1];
                        Data[i + 2] = colores_nuevos[j][2];
                    }
                }
            }*/
           console.log(colores_nuevos);
           console.log(colores_viejos);
           this.ctxOculto.putImageData(Dataimage, 0, 0);
        }
        guardarimagen(src) {
            this.imagen.src = src;
            this.imagen.onload = () => {
                this.ctxOculto.drawImage(this.imagen, 0, 0);
                this.listo = true;
                this.canvasOculto.width = this.imagen.naturalWidth;
                this.canvasOculto.height = this.imagen.naturalHeight;
                this.inicio();
            }
            this.canvasOculto.width = this.imagen.naturalWidth;
            this.canvasOculto.height = this.imagen.naturalHeight;
        }
        dibujar(can, ct, tamaño){
            //const normal = pincel.aNormal(this.ctxOculto, this.canvasOculto);
            if(!this.listo) return;
            pincel.dibujarData(this.canvasOculto/*normal*/, can, ct, tamaño, this.x, this.y);
            //ct.drawImage(this.canvasOculto, this.x, this.y);
        }
    }