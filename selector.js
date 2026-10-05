
import { Entidad } from "./entidades.js";
import { calculos } from "./general.js";

const calculo = new calculos();

let canvas = document.getElementById("selector");
let ctx = canvas.getContext("2d");
canvas.width = 100;
canvas.height = 100;
let selector = document.getElementById("selector_de_color");
let selector_value = document.getElementById("selector_de_tono");
let selector_saturacion = document.getElementById("selector_de_saturacion");
let tonoActual = 25;
let valorActual = 50;
let saturacionActual = 50;

const cabeza_mas = document.getElementById("cabeza_+");
const cabeza_men = document.getElementById("cabeza_-");
const torso_mas = document.getElementById("torso_+");
const torso_men = document.getElementById("torso_-");
const brazo_mas = document.getElementById("brazo_+");
const brazo_men = document.getElementById("brazo_-");
const pierna_mas = document.getElementById("pierna_+");
const pierna_men = document.getElementById("pierna_-");

let entidades = [];
let robot1 = new Entidad(0, 0, "robot3.png", ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white"]);

entidades.push(robot1);


let h = 0;
let v = 25;
let s = 50;
function loop() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvas.height, canvas.width);

    h = valorActual;
    v = tonoActual;
    s = saturacionActual;
    console.log(s);
    
    const color_nuevo = calculo.hsvToRgba(h, 100, 100);
    robot1.cambiarColor([`rgb(${color_nuevo.r},${color_nuevo.g},${color_nuevo.b})`], v, s);

    entidades.forEach(entidad => {
        entidad.dibujar(canvas, ctx, 10);
    });
    
    requestAnimationFrame(loop);
}



function ajustarResolucionCanvas(can, contexto) {
    const anchoVisual = window.innerWidth/6;
    const altoVisual = window.innerHeight/2;
    
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


selector.addEventListener("input", function() {
    valorActual = selector.value;
});
selector_value.addEventListener("input", function() {
    tonoActual = selector_value.value;
});
selector_saturacion.addEventListener("input", function() {
    saturacionActual = selector_saturacion.value;
});


loop();