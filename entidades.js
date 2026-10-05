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
            //console.log(pincel.aNormal(this.ctxOculto, this.canvasOculto));
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
                const hsv_Data = calculo.rgbaToHsv(Data[i], Data[i + 1], Data[i + 2]);
                for(let j = 0; j < colores_viejos.length; j++){
                    const diferencia = hsv_Data.h - colores_viejos_hsv[j].h;
                    if(Math.abs(diferencia) < 20){
                        if(hsv_Data.s > colores_viejos_hsv[j].s || hsv_Data.v > colores_viejos_hsv[j].v) colores_viejos_hsv[j].s = hsv_Data.s;
                        aux = true;
                        break;
                    }
                }
                if(!aux && Data[i + 3] !== 0){
                    colores_viejos.push([Data[i], Data[i + 1], Data[i + 2]]);
                    colores_viejos_hsv.push(hsv_Data);
                }
            }
            for(let i = 0; i < Data.length; i += 4){
                const hsv_Data = calculo.rgbaToHsv(Data[i], Data[i + 1], Data[i + 2]);
                let aux = false;
                for(let j = 0; j< colores_viejos.length && j < colores_nuevos.length; j++)
                {
                    const diferencia_h = hsv_Data.h - colores_viejos_hsv[j].h;
                    const diferencia_s = hsv_Data.s - colores_viejos_hsv[j].s;
                    const diferencia_v = hsv_Data.v - colores_viejos_hsv[j].v;
                    if(Math.abs(diferencia_h)<= 20)
                    {
                        hsv_Data.h = colores_nuevos_hsv[j].h/*+ diferencia_h*/;
                        if(hsv_Data.h < 0) hsv_Data.h += 360;
                        if(hsv_Data.h > 360) hsv_Data.h -= 360;

                        //hsv_Data.s = colores_nuevos_hsv[j].s + diferencia_s;
                        if(hsv_Data.s < 0) hsv_Data.s += 100;
                        if(hsv_Data.s > 100) hsv_Data.s -= 100;

                        //hsv_Data.v = colores_nuevos_hsv[j].v + diferencia_v;
                        if(hsv_Data.v < 0) hsv_Data.v += 100;
                        if(hsv_Data.v > 100) hsv_Data.v -= 100;

                        let nuevoColor = calculo.hsvToRgba(hsv_Data.h, hsv_Data.s, hsv_Data.v);
                        Data[i] = nuevoColor.r;
                        Data[i + 1] = nuevoColor.g;
                        Data[i + 2] = nuevoColor.b;
                        Data[i + 3] = Data[i + 3];
                        aux = true;
                        break;
                    }
                }
                if(!aux)
                {
                    continue;
                }
            }
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