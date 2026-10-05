
import { Entidad } from "./entidades.js";
import { calculos } from "./general.js";

const calculo = new calculos();

let canvas = document.getElementById("selector");
let ctx = canvas.getContext("2d");
canvas.width = 100;
canvas.height = 100;
let selector = document.getElementById("selector_de_color");
let valorActual = 0;

let entidades = [];
let robot1 = new Entidad(500, 500, "robot3.png", ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white"]);

entidades.push(robot1);


let h = 0;
function loop() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, canvas.height, canvas.width);

    h = valorActual;
    console.log(h);
    
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
    h += e.deltaY/3;
    while(h < 0 || h > 360)
    {
        if(h > 360) h -=360;
        if(h<0) h += 360;
    }
    console.log(h);
});


window.addEventListener("resize", ajustarResolucionCanvas);


ajustarResolucionCanvas(canvas, ctx);


selector.addEventListener("input", function() {
    valorActual = selector.value;
});

loop();