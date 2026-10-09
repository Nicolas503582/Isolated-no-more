import { dibujo } from './funciones_dibujo.js';
import { calculos } from './general.js';

const pincel = new dibujo();
const calculo = new calculos();

export class Entidad{
        constructor(x, y, velocidad = 1, imagen = "", colores_iniciales = ["red"], tono = 50, saturacion = 50){
            //this.listo = false;
            this.x = x; //x actual
            this.y = y; //y actual
            this.velocidad = velocidad;

            this.imagen = new Image();
            this.imagenes = {"torso": "Robot1_torsoR1_post.png", "cabeza": "Robot1_cabezaR1_post.png", "brazo": "Robot1_brazoR1_post.png", "pierna": "Robot1_piernaR1_post.png"};

            this.canvasOculto = document.createElement('canvas');
            this.canvasOculto.width = 0;
            this.canvasOculto.height = 0;
            this.ctxOculto = this.canvasOculto.getContext('2d');

            this.canvasAux = document.createElement('canvas');
            this.canvasAux.width = 1;
            this.canvasAux.height = 1;
            this.ctxAux = this.canvasAux.getContext('2d');
            this.canvases = [];
            this.ctxs = [];

            this.colores = colores_iniciales;
            this.tono_viejo = 0;
            this.tono = tono;
            this.saturacion_viejo = 0;
            this.saturacion = saturacion;

            this.guardarimagen(imagen);
        }

        inicio(){
            this.ctxOculto.drawImage(this.imagen, 0, 0);
            this.cambiarColor(this.colores, this.tono, this.saturacion);
            //console.log(pincel.aNormal(this.ctxOculto, this.canvasOculto));
        }
        cambiarColor(color, tono = 50, saturacion = 50){
            this.ctxOculto.drawImage(this.imagen, 0, 0);
            let Dataimage = pincel.aNormal(this.ctxOculto, this.canvasOculto);
            let Data = Dataimage.data;
            let colores_nuevos = [];
            let colores_nuevos_hsv = [];
            let colores_viejos = [];
            let colores_viejos_hsv = [];
            let menor_s = 0;
            let mayor_s = 0;
            let menor_v = 0;
            let mayor_v = 0;

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
                if(hsv_Data.v > 95 || hsv_Data.v < 5) continue;
                for(let j = 0; j < colores_viejos.length; j++){
                    const diferencia = hsv_Data.h - colores_viejos_hsv[j].h;
                    if(Math.abs(diferencia) < 20){
                        if(hsv_Data.s > colores_viejos_hsv[j].s || hsv_Data.v > colores_viejos_hsv[j].v) colores_viejos_hsv[j].s = hsv_Data.s;
                        aux = true;/*
                        if(menor_s[j])
                        {*/
                            if(hsv_Data.s < menor_s)
                            {
                                //console.log("             Menor_S:     antes: " + menor_s + "  ahora: " + hsv_Data.s);
                                menor_s = Math.floor(hsv_Data.s);
                            }
                            else if(hsv_Data.s > mayor_s)
                            {
                                //console.log("             Mayor_S:     antes: " + mayor_s + "  ahora: " + hsv_Data.s);
                                mayor_s = Math.floor(hsv_Data.s);
                            }
                            if(hsv_Data.v < menor_v)
                            {
                                //console.log("             Menor_V:     antes: " + menor_v + "  ahora: " + hsv_Data.v);
                                menor_v = Math.floor(hsv_Data.v);
                            }
                            else if(hsv_Data.v > mayor_v)
                            {
                                //console.log("             Mayor_V:     antes: " + mayor_v + "  ahora: " + hsv_Data.v);
                                mayor_v = Math.floor(hsv_Data.v);
                            }
                        //}
                        break;
                    }
                }
                if(!aux && Data[i + 3] !== 0){
                    colores_viejos.push([Data[i], Data[i + 1], Data[i + 2]]);
                    colores_viejos_hsv.push(hsv_Data);
                }
            }/*
            console.log("menor_s:" + menor_s);
            console.log("mayor_s:" + mayor_s);
            console.log("menor_v:" + menor_v);
            console.log("mayor_v:" + mayor_v);*/
            

            const nuevo_tono = tono-50;
            const nueva_saturacion = saturacion-50;
            let aux_tono = 0;
            let aux_s = 0;
            /*if(nuevo_tono > 0)
            {
                //console.log("mayor_v: " + mayor_v + " tono nuevo: " + nuevo_tono);
                aux_tono = mayor_v + nuevo_tono;
                if(aux_tono >95)
                {
                    aux_tono = 95 - mayor_v;
                }
                else
                {
                    aux_tono = nuevo_tono;
                }
            }
            else
            {
                //console.log("menor_v: " + menor_v + " tono nuevo: " + nuevo_tono);
                aux_tono = menor_v + nuevo_tono;
                if(aux_tono <5)
                {
                    aux_tono = menor_v;
                }
                else
                {
                    aux_tono = nuevo_tono;
                }
            }
            if(nueva_saturacion > 0)
            {
                //console.log("mayor_s: " + mayor_s + " saturacion nuevo: " + nueva_saturacion);
                aux_s = mayor_s + nueva_saturacion;
                if(aux_s >95)
                {
                    aux_s = 95 - mayor_s;
                }
                else
                {
                    aux_s = nueva_saturacion;
                }
            }
            else
            {
               //console.log("menor_s: " + menor_s + " saturacion nuevo: " + nueva_saturacion);
                aux_s = menor_s + nueva_saturacion;
                if(aux_s <5)
                {
                    aux_s = menor_s;
                }
                else
                {
                    aux_s = nueva_saturacion;
                }
            }*/
            
            for(let i = 0; i < Data.length; i += 4){
                const hsv_Data = calculo.rgbaToHsv(Data[i], Data[i + 1], Data[i + 2]);
                let aux = false;
                //if(hsv_Data.v > 95 || hsv_Data.v < 5) continue;
                for(let j = 0; j< colores_viejos.length && j < colores_nuevos.length; j++)
                {
                    //const diferencia_h = hsv_Data.h - colores_viejos_hsv[j].h;
                    /*const diferencia_s = hsv_Data.s - colores_viejos_hsv[j].s;
                    const diferencia_v = hsv_Data.v - colores_viejos_hsv[j].v;*/
                    /*console.log("menor s: " + menor_s);
                    console.log("menor v: " + menor_v);
                    console.log("mayor v: " + mayor_v);
                    console.log("mayor s: " + mayor_s);*/
                    /*if(Math.abs(diferencia_h)<= 20)
                    {*/
                        hsv_Data.h = colores_nuevos_hsv[0].h/*+ diferencia_h*/;
                        if(hsv_Data.h < 0) hsv_Data.h += 360;
                        if(hsv_Data.h > 360) hsv_Data.h -= 360;

                        hsv_Data.s += nueva_saturacion/* - this.saturacion_viejo*/;
                        //hsv_Data.s = colores_nuevos_hsv[0].s;
                        if(hsv_Data.s < 0) hsv_Data.s = 0;
                        if(hsv_Data.s > 100) hsv_Data.s = 100;

                        //hsv_Data.v = colores_nuevos_hsv[j].v + diferencia_v;
                        hsv_Data.v += nuevo_tono/* - this.tono_viejo*/;
                        //hsv_Data.v = colores_nuevos_hsv[0].v;
                        if(hsv_Data.v < 0) hsv_Data.v = 0;
                        if(hsv_Data.v > 100) hsv_Data.v = 100;

                        let nuevoColor = calculo.hsvToRgba(hsv_Data.h, hsv_Data.s, hsv_Data.v);
                        Data[i] = nuevoColor.r;
                        Data[i + 1] = nuevoColor.g;
                        Data[i + 2] = nuevoColor.b;
                        Data[i + 3] = Data[i + 3];
                        aux = true;
                        break;
                    //}
                }
            }
            this.tono_viejo = aux_tono;
            this.saturacion_viejo = aux_s;//////////////28 ancho
            //console.log(Dataimage);
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
        cambiarcolores(colores, tonos = [50], saturaciones = [50]){
            for(let i = 0; i < this.imagenes.length; i++){
                recolor(this.imagenes[i], this.canvases[i], this.ctxs[i], colores[i], tonos[i], saturaciones[i]);
                this.ctxOculto.drawImage(this.canvases[i], 0, 0);
            }
        }
        recolor(sprite, canvas, ctx, color, tono, saturacion)
        {
            ///////////hay que adaptarlo para solo recolorear una parte
            ctx.drawImage(sprite, 0, 0);
            let Dataimage = pincel.aNormal(ctx, canvas);
            let Data = Dataimage.data;

            this.ctxAux.fillStyle = color;
            this.ctxAux.fillRect(0, 0, 1, 1);
            const colornuevo = this.ctxAux.getImageData(0, 0, 1, 1).data;
            let color_hsv = calculo.rgbaToHsv(colornuevo[0], colornuevo[1], colornuevo[2]);

            const nuevo_tono = tono-50;
            const nueva_saturacion = saturacion-50;
            
            for(let i = 0; i < Data.length; i += 4){
                const hsv_Data = calculo.rgbaToHsv(Data[i], Data[i + 1], Data[i + 2]);
                //let aux = false;
                if(hsv_Data.v > 95 || hsv_Data.v < 5) continue;
                hsv_Data.h = color_hsv.h;
                if(hsv_Data.h < 0) hsv_Data.h += 360;
                if(hsv_Data.h > 360) hsv_Data.h -= 360;
                hsv_Data.s += nueva_saturacion;
                if(hsv_Data.s < 0) hsv_Data.s = 0;
                if(hsv_Data.s > 100) hsv_Data.s = 100;
                hsv_Data.v += nuevo_tono;
                if(hsv_Data.v < 0) hsv_Data.v = 0;
                if(hsv_Data.v > 100) hsv_Data.v = 100;
                
                
                let colorFinal = calculo.hsvToRgba(hsv_Data.h, hsv_Data.s, hsv_Data.v);
                Data[i] = colorFinal.r;
                Data[i + 1] = colorFinal.g;
                Data[i + 2] = colorFinal.b;
                Data[i + 3] = Data[i + 3];
            }
            ctx.putImageData(Dataimage, 0, 0);
        }
        guardarimagenes(src) {
            for(let i = 0; i < src.length; i++){
                if(!this.imagenes[i]) this.imagenes.push(new Image());
                this.imagenes[i].src = src[i];
                this.imagenes[i].onload = () => {
                    this.canvasOculto.width = this.imagenes[i].naturalWidth;
                    this.canvasOculto.height = this.imagenes[i].naturalHeight;
                    this.ctxOculto.drawImage(this.imagenes[i], 0, 0);
                    this.listo = true;
                    this.inicio();
                }
                this.canvases.push(document.createElement('canvas'));
                this.canvases[i].width = this.imagenes[i].naturalWidth;
                this.canvases[i].height = this.imagenes[i].naturalHeight;
                this.ctxs.push(this.canvases[i].getContext('2d'));
            }
        }
        cambiarimagen(valor, clave){
            this.imagenes[clave] = ("Robot1/" + valor + "png");
        }
        
        dibujar(can, ct, tamaño){
            //const normal = pincel.aNormal(this.ctxOculto, this.canvasOculto);
            if(!this.listo) return;
            pincel.dibujarData(this.canvasOculto/*normal*/, can, ct, tamaño, this.x, this.y);
            //ct.drawImage(this.canvasOculto, this.x, this.y);
        }
    }