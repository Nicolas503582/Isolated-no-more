import { Entidad } from "./entidades.js";
import { calculos } from "./general.js";

const calculo = new calculos();

let canvas = document.getElementById("juego");
let ctx = canvas.getContext("2d");

let entidades = [];
let robot1 = new Entidad(100, 100, "robot1.png", ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white"]);
let h = 0;

entidades.push(robot1);

function loop() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, canvas.height, canvas.width);

    const color_nuevo = calculo.hsvToRgba(h, 100, 100);
    robot1.cambiarColor([`rgb(${color_nuevo.r},${color_nuevo.g},${color_nuevo.b})`]);

    entidades.forEach(entidad => {
        entidad.dibujar(canvas, ctx, 1);
    });
    
    requestAnimationFrame(loop);
}

function ajustarResolucionCanvas(can, contexto) {
    const anchoVisual = window.innerWidth -10;
    const altoVisual = window.innerHeight -10;
    
    const dpr = window.devicePixelRatio || 1;
    
    can.width = anchoVisual * dpr;
    can.height = altoVisual * dpr;
    
    can.style.width = anchoVisual + "px";
    can.style.height = altoVisual + "px";
    
    contexto.scale(dpr, dpr);
    contexto.imageSmoothingEnabled = false; 
}

window.addEventListener('wheel', (e) => {
    h += (e.deltaY/3)/8;
    while(h < 0 || h > 360)
    {
        if(h > 360) h -=360;
        if(h<0) h += 360;
    }
    console.log(h);
});


window.addEventListener("resize", ajustarResolucionCanvas);


ajustarResolucionCanvas(canvas, ctx);
loop();