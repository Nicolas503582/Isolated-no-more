export class calculos{
    calculo_escala(imagen, can) {
        if(can.naturalHeight && can.naturalWidth){
            const scale = Math.min(can.naturalWidth / imagen.naturalWidth, can.naturalHeight / imagen.naturalHeight);
            return scale;
        }
        else{
            const scale = Math.min(can.width / imagen.width, can.height / imagen.height);
            return scale;
        }
    }

    rgbaToHsv(r, g, b, a = 255) {
        // Normalizamos RGB de 0-255 a 0-1
        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let diferencia = max - min;

        let h = 0;
        let s = 0;
        let v = max;

        // Saturación
        if (max !== 0) {
            s = diferencia / max;
        }

        // Hue (tono)
        if (diferencia !== 0) {
            if (max === r) {
                h = 60 * (((g - b) / diferencia) % 6);
            } else if (max === g) {
                h = 60 * (((b - r) / diferencia) + 2);
            } else {
                h = 60 * (((r - g) / diferencia) + 4);
            }
        }

        // Evitamos valores negativos
        if (h < 0) {
            h += 360;
        }

        return {
            h: h,           // 0 - 360
            s: s * 100,     // 0 - 100
            v: v * 100,     // 0 - 100
            a: a            // 0 - 255
        };
    }

    hsvToRgba(h, s, v, a = 255) {
        if(h != 0 || s != 0 || v != 0)
        {
        console.log({h, s, v, a});
        }
        // Normalizamos S y V
        s /= 100;
        v /= 100;

        let c = v * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = v - c;

        let r = 0;
        let g = 0;
        let b = 0;

        if (h >= 0 && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (h >= 60 && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (h >= 180 && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (h >= 240 && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (h >= 300 && h <= 360) {
            r = c;
            g = 0;
            b = x;
        }

        // Volvemos de 0-1 a 0-255
        console.log({
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255),
            a: a
    });
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255),
            a: a
        };
    }
}