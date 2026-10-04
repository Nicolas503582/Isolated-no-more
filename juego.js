
import { Entidad } from "./entidades.js";

let canvas = document.getElementById("juego");
let ctx = canvas.getContext("2d");

let entidades = [];
let robot1 = new Entidad(100, 100, "robot_designs.png", ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white"]);

entidades.push(robot1);

function loop() {
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


window.addEventListener("resize", ajustarResolucionCanvas);


ajustarResolucionCanvas(canvas, ctx);
loop();