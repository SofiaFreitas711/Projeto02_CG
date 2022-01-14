import * as THREE from './libs/three.module.js';

let camara, scene, renderer;
let centro, ombroDireito, ombroEsquerdo, cotoveloDireito, cotoveloEsquerdo, ancaDireita, ancaEsquerda, joelhoDireito, joelhoEsquerdo; // PIVOTS (Object3D)

let ombroDireitoRotacao = false;
let ombroEsquerdoRotacao = false;
let cotoveloDireitoRotacao = false;
let cotoveloEsquerdoRotacao = false;

// uma vez que tudo está carregado, executamos nosso material Three.js
window.onload = function init() {

    // criar uma cena vazia, que conterá todos os nossos elementos, como objetos, câmeras e luzes
    scene = new THREE.Scene();

    // criar uma câmera, que define para onde estamos olhando
    const aspect = window.innerWidth / window.innerHeight;
    camara = new THREE.PerspectiveCamera(75, aspect, 0.1, 10);
    camara.position.y = 2;
    camara.position.z = 8;
    camara.lookAt(scene.position); //aponte a câmera para o centro da cena


    // create a render and set the size
    renderer = new THREE.WebGLRenderer({ antialias: false }); // aliasing (jagged edges when rendering)
    renderer.setSize(window.innerWidth, window.innerHeight);
    // configure renderer clear color
    renderer.setClearColor("#000000");

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);

    const robo = new THREE.Group();
    scene.add(robo)

    centro = new THREE.Object3D();
    robo.add(centro);
    
    // show axes for the SHOULDER CS
    let axesShoulder = new THREE.AxesHelper(4);
    centro.add(axesShoulder);

    // Corpo
    const corpo = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 3.5, 1),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"})
    );
    corpo.position.y = 1
    centro.add(corpo);

    //pescoço
    const pescoco = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.75, 0.75),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"}));
    pescoco.position.y = 2
    corpo.add(pescoco);

    //cabeça
    const cabeca = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 1, 1),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"}));
    cabeca.position.y = 2.5
    corpo.add(cabeca);
    
    // Ombros
    ombroDireito = new THREE.Object3D();
    ombroDireito.position.x = 0.75;
    ombroDireito.position.y = 1.5;
    corpo.add(ombroDireito);
    
    ombroEsquerdo = new THREE.Object3D();
    ombroEsquerdo.position.x = -0.75;
    ombroEsquerdo.position.y = 1.5;
    corpo.add(ombroEsquerdo);

    // Antebraços
    const anteBracoDireito = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.5, 1),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"}),
    );
    anteBracoDireito.position.x = 0.25
    anteBracoDireito.position.y = -0.5
    ombroDireito.add(anteBracoDireito);

    const anteBracoEsquerdo = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.5, 1),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"}),
    );
    anteBracoEsquerdo.position.x = -0.25
    anteBracoEsquerdo.position.y = -0.5
    ombroEsquerdo.add(anteBracoEsquerdo);

    // cotovelo
    cotoveloDireito = new THREE.Object3D();
    ombroDireito.add(cotoveloDireito);
    cotoveloDireito.position.y = -1.51;
    cotoveloDireito.position.x = 0.25

    cotoveloEsquerdo = new THREE.Object3D();
    ombroEsquerdo.add(cotoveloEsquerdo);
    cotoveloEsquerdo.position.y = -1.51;
    cotoveloEsquerdo.position.x = -0.25

    // Braços
    const bracoDireito = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.5, 1),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"}),
    );
    bracoDireito.position.y = -0.5
    cotoveloDireito.add(bracoDireito);

    const bracoEsquerdo = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.5, 1),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"}),
    );
    bracoEsquerdo.position.y = -0.5
    cotoveloEsquerdo.add(bracoEsquerdo);

    //Anca
    ancaDireita = new THREE.Object3D();
    corpo.add(ancaDireita);
    ancaDireita.position.y = -1

    ancaEsquerda = new THREE.Object3D();
    corpo.add(ancaEsquerda);
    ancaEsquerda.position.y = -1

    //ante pernas
    const antePernaDireita = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 1.25, 1),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"})
    );
    antePernaDireita.position.x = 0.43
    antePernaDireita.position.y = -1.25
    ancaDireita.add(antePernaDireita);

    const antePernaEsquerda = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 1.25, 1),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"})
    );
    antePernaEsquerda.position.x = -0.43
    antePernaEsquerda.position.y= -1.25
    ancaEsquerda.add(antePernaEsquerda);

    // Joelhos
    joelhoDireito = new THREE.Object3D();
    ancaDireita.add(joelhoDireito);
    joelhoDireito.position.y = -1.5;

    joelhoEsquerdo = new THREE.Object3D();
    ancaEsquerda.add(joelhoEsquerdo);
    joelhoEsquerdo.position.y = -1.5;

    //pernas
    const pernaDireita = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 1, 1),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"})
    );
    pernaDireita.position.x = 0.43
    pernaDireita.position.y = -0.85
    joelhoDireito.add(pernaDireita);

    const pernaEsquerda = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 1, 1),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"})
    );
    pernaEsquerda.position.x = -0.43
    pernaEsquerda.position.y= -0.85
    joelhoEsquerdo.add(pernaEsquerda);

    /*****************************
     * ANIMATE 
     * ***************************/
    // set the animation function
    renderer.setAnimationLoop(render);
}

/*****************************
* ANIMATION FUNCTION 
* ***************************/
function render() {
    if(ombroDireitoRotacao && (ombroDireito.rotation.z <= 90 / 180 * Math.PI)) {
        ombroDireito.rotation.z += 0.01
    }
    if(ombroEsquerdoRotacao && (ombroEsquerdo.rotation.z >= -90 / 180 * Math.PI)) {
        ombroEsquerdo.rotation.z -= 0.01
    }
    if(cotoveloDireitoRotacao && (cotoveloDireito.rotation.z <= 90 / 180 * Math.PI)) {
        cotoveloDireito.rotation.z += 0.01
    }
    if(cotoveloEsquerdoRotacao && (cotoveloEsquerdo.rotation.z >= -90 / 180 * Math.PI)) {
        cotoveloEsquerdo.rotation.z -= 0.01
    }

    // render the scene into viewport using the camera
    renderer.render(scene, camara);
}


/*****************************
* KEYBOARD EVENTS 
* ***************************/
document.addEventListener("keydown", event => {
    if (event.key == 'f'){
        ombroDireitoRotacao = true;
    }
    if (event.key == 's'){
        ombroEsquerdoRotacao = true;
    }
    
    if (event.key == 'd') {
        cotoveloDireitoRotacao = true;
    }
    if (event.key == 'a') {
        cotoveloEsquerdoRotacao = true;
    }
})

document.addEventListener("keyup", event => {
    if (event.key == 'f'){
        ombroDireitoRotacao = false;
    }
    if (event.key == 's'){
        ombroEsquerdoRotacao = false;
    }
    if (event.key == 'd') {
        cotoveloDireitoRotacao = false;
    }
    if (event.key == 'a') {
        cotoveloEsquerdoRotacao = false;
    }
})