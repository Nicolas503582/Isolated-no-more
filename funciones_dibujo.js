import { calculos } from "./general.js";
const calculo = new calculos();

export class dibujo{

    dibujarimagenoculto(imagen, oculto, ctxOculto) {
        oculto.width = imagen.naturalWidth;
        oculto.height = imagen.naturalHeight;

        ctxOculto.drawImage(imagen, 0, 0, imagen.naturalWidth, imagen.naturalHeight, 0, 0, imagen.naturalWidth, imagen.naturalHeight);
    }
    dibujarimagen(imagen, can, ct, tamaño, inicioX, inicioY) {
        const scale = calculo.calculo_escala(imagen, can);

        let newWidth = Math.floor(imagen.naturalWidth * scale)/10;
        let newHeight = Math.floor(imagen.naturalHeight * scale)/10;

        newWidth = newWidth * tamaño;
        newHeight = newHeight * tamaño;

        ct.drawImage(imagen, 0, 0, imagen.naturalWidth, imagen.naturalHeight, inicioX, inicioY, newWidth, newHeight);
    }
    dibujarData(oculto, can, ct, tamaño, inicioX, inicioY) {
        // 1. Obtenemos la escala base del canvas
        const scale = calculo.calculo_escala(oculto, can);

        let newWidth = Math.floor(oculto.width * scale * tamaño)/10;
        let newHeight = Math.floor(oculto.height * scale * tamaño)/10;

        ct.drawImage(
            oculto, 
            0, 0, 
            oculto.width, oculto.height, 
            inicioX, inicioY, 
            newWidth, newHeight
        );
    }
    aNormal(ctxOculto, oculto)
    {
        let normal = ctxOculto.getImageData(0, 0, oculto.width, oculto.height);
        return normal;
    }
    dibujar(canvas, ctx, ctxOculto, oculto, imagen) {
        this.dibujarimagenoculto(imagen, oculto, ctxOculto);
        const normal = this.aNormal(ctxOculto, oculto);
        this.dibujarData(normal, canvas, ctx, 1, 0, 0);
    }
}