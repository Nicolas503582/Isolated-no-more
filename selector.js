
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
let brazo = 0;
let pierna = 0;
let torso = 0;
let cabeza = 0;

let entidades = [];
let robot1 = new Entidad(0, 0, "robot3.png", ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white"]);

entidades.push(robot1);


let h = 280;
let v = 50;
let s = 50;

saturacionActual = selector_saturacion.value;
tonoActual = selector_value.value;
valorActual = selector.value;

const color_nuevo0 = calculo.hsvToRgba(h, 100, 100);
robot1.cambiarColor([`rgb(${color_nuevo0.r},${color_nuevo0.g},${color_nuevo0.b})`], v, s);
function loop() {
    ctx.fillStyle = "black";
    ctx.clearRect(0,0, canvas.height, canvas.width);
    ctx.clearRect(0, 0, 1000, 1000);
    //console.log(s);
    
    const color_nuevo = calculo.hsvToRgba(h, 100, 100);
    robot1.cambiarColor([`rgb(${color_nuevo.r},${color_nuevo.g},${color_nuevo.b})`], v, s);


    h = valorActual;
    v = tonoActual;
    s = saturacionActual;

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


cabeza_mas.addEventListener("click", function(){
    cabeza += 1;
    if(cabeza >2) cabeza = 0;
    robot1.guardarimagen(("robot" + (cabeza +1) + ".png"));
});
cabeza_men.addEventListener("click", function(){
    cabeza -= 1;
    if(cabeza <0) cabeza = 2;
});

torso_mas.addEventListener("click", function(){
   torso += 1;
   if(torso >2) torso = 0;
});
torso_men.addEventListener("click", function(){
   torso -= 1;
   if(torso <0) torso = 2;
});

brazo_mas.addEventListener("click", function(){
   brazo += 1;
   if(brazo >2) brazo = 0;
});
brazo_men.addEventListener("click", function(){
   brazo -= 1;
   if(brazo <0) brazo = 2;
});

pierna_mas.addEventListener("click", function(){
    pierna += 1;
    if(pierna >2) pierna = 0;
});
pierna_men.addEventListener("click", function(){
    pierna -= 1;
    if(pierna <0) pierna = 2;
});

loop();