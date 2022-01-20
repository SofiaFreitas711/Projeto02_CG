import * as THREE from './libs/three.module.js';

let camara, scene, renderer;
let centro, ligacaoDireito, ligacaoEsquerdo, ligacaoCentral, pescoco// PIVOTS (Object3D)
let robo;
let rodar = -1
let saltar = 1;

let cenarioRotacao, cenarioRotacaoY, girarRobo, saltoRobo = false;

// uma vez que tudo está carregado, executamos nosso material Three.js
window.onload = function init() {

    // criar uma cena vazia, que conterá todos os nossos elementos, como objetos, câmeras e luzes
    scene = new THREE.Scene();

    // criar uma câmera, que define para onde estamos olhando
    const aspect = window.innerWidth / window.innerHeight;
    camara = new THREE.PerspectiveCamera(75, aspect, 0.1, 10);
    camara.position.x = 0;
    camara.position.y = 2;
    camara.position.z = 7;
    camara.lookAt(scene.position); //aponte a câmera para o centro da cena


    // create a render and set the size
    renderer = new THREE.WebGLRenderer({ antialias: false }); // aliasing (jagged edges when rendering)
    renderer.setSize(window.innerWidth, window.innerHeight);
    // configure renderer clear color
    renderer.setClearColor("#000000");

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);

    robo = new THREE.Group();
    scene.add(robo)

    centro = new THREE.Object3D();
    centro.rotation.x = -20 * Math.PI / 180;
    robo.add(centro);
    

    // Corpo
    let corpoTexture = new THREE.TextureLoader().load ('./textures/corpo8.png');
    const corpo = new THREE.Mesh(
        new THREE.CylinderGeometry( 1, 1, 2.5, 20),
        new THREE.MeshBasicMaterial({map: corpoTexture},
        new THREE.MeshPhongMaterial({
            map: corpoTexture ,
            // bumpMap: bumpmapTexture,
            bumpScale: 2
        }))
    );
    
    corpo.position.y = 1
    centro.add(corpo);

    //pescoço
    pescoco = new THREE.Object3D();
    pescoco.position.y = 1.25
    corpo.add(pescoco);

    //cabeça
    const cabeca = new THREE.Mesh(
        new THREE.SphereGeometry( 1, 20, 25),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#00304d"})
    );
    pescoco.add(cabeca);

    //olho
    const olho = new THREE.Mesh(
        new THREE.SphereGeometry( 0.1, 20, 25),
        new THREE.MeshLambertMaterial({color: "#FF0000", emissive: "#FF0000"})
    )
    olho.position.x = 0.25
    olho.position.y = 0.40
    olho.position.z = 0.82
    pescoco.add(olho);
    
    // ligações
    ligacaoDireito = new THREE.Object3D();
    ligacaoDireito.position.x = 0.75;
    ligacaoDireito.position.y = 1;
    ligacaoDireito.rotation.x = 20 * Math.PI / 180;
    corpo.add(ligacaoDireito);
    
    ligacaoEsquerdo = new THREE.Object3D();
    ligacaoEsquerdo.position.x = -0.75;
    ligacaoEsquerdo.position.y = 1;
    ligacaoEsquerdo.rotation.x = 20 * Math.PI / 180;
    corpo.add(ligacaoEsquerdo);

    ligacaoCentral = new THREE.Object3D();
    ligacaoCentral.position.y = -1.75;
    ligacaoCentral.rotation.x = 20 * Math.PI / 180;
    corpo.add(ligacaoCentral);

    //pernas
    const geometriaPerna = new THREE.CylinderGeometry( 0.3, 0.5, 2.5, 20);
    let pernasTexture = new THREE.TextureLoader().load ('./textures/Pernas.png');

    const pernaDireita = new THREE.Mesh(
        geometriaPerna,
        new THREE.MeshBasicMaterial({map: pernasTexture}),
        new THREE.MeshPhongMaterial({
            map: pernasTexture,
            bumpScale: 2,
            reapet: 2,
        })
    );
    pernaDireita.position.x = 0.5
    pernaDireita.position.y = -1.75
    ligacaoDireito.add(pernaDireita);

    const pernaEsquerda = new THREE.Mesh(
        geometriaPerna,
        new THREE.MeshBasicMaterial({map: pernasTexture}),
        new THREE.MeshPhongMaterial({
            map: pernasTexture,
            bumpScale: 2,
            reapet: 2,
        })
    );
    pernaEsquerda.position.x = -0.5
    pernaEsquerda.position.y= -1.75
    ligacaoEsquerdo.add(pernaEsquerda);

    const pernaCentral = new THREE.Mesh(
        new THREE.CylinderGeometry( 0.25, 0.45, 1.15, 20),
        new THREE.MeshBasicMaterial({map: pernasTexture}),
        new THREE.MeshPhongMaterial({
            map: pernasTexture,
            bumpScale: 2,
            reapet: 2,
        })
    );
    ligacaoCentral.add(pernaCentral);

    // pés
    const geometriaPe = new THREE.SphereGeometry( 0.45, 20, 25);

    const peDireito = new THREE.Mesh(
        geometriaPe,
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#049ef4"})
    );
    peDireito.position.x = 0.5
    peDireito.position.y = -2.95
    ligacaoDireito.add(peDireito);

    const peEsquerdo = new THREE.Mesh(
        geometriaPe,
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#049ef4"})
    );
    peEsquerdo.position.x = -0.5
    peEsquerdo.position.y = -2.95
    ligacaoEsquerdo.add(peEsquerdo);

    const peCentral = new THREE.Mesh(
        new THREE.SphereGeometry( 0.40, 20, 25),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#049ef4"})
    );
    peCentral.position.y = -0.5
    ligacaoCentral.add(peCentral);

    /*****************************
     * ANIMATE 
     * ***************************/
    // set the animation function
    renderer.setAnimationLoop(render);
}

function resetarRotacao(){
    if(robo.rotation.y / Math.PI * 180 >= 360 || robo.rotation.y / Math.PI * 180 <= -360){
        robo.rotation.y = 0
    }
}

/*****************************
* ANIMATION FUNCTION 
* ***************************/
function render() {
    if(girarRobo){
        robo.rotation.y += rodar * 0.1

        if ((robo.rotation.y / Math.PI * 180).toFixed(0) >= 360 || (robo.rotation.y / Math.PI * 180).toFixed(0) <= -360){
            robo.rotation.y = 0
            girarRobo = false;
        }
    }
    else{
        if((robo.rotation.y / Math.PI * 180).toFixed(0) == -45 || (robo.rotation.y / Math.PI * 180).toFixed(0) == 45){
            rodar *= -1
        }
    }

    if (saltoRobo){
        robo.position.y += saltar * 0.085
        ligacaoDireito.rotation.z += saltar * 0.01
        ligacaoEsquerdo.rotation.z -= saltar * 0.01

        if(robo.position.y.toFixed(1) == 1.5){
            saltar *= -1;
        }
        else if(robo.position.y <= 0){
            saltar *= -1;
            saltoRobo = false;
        }
    }
    
    robo.rotation.y += rodar *0.01
    
    if (cenarioRotacao){
        scene.rotation.x += 0.01
    }
    if (cenarioRotacaoY){
        scene.rotation.y += 0.01
    }

    // render the scene into viewport using the camera
    renderer.render(scene, camara);
}


/*****************************
* KEYBOARD EVENTS 
* ***************************/
document.addEventListener("keydown", event => {
    if (event.key == 's'){
        cenarioRotacao = true;
    }
    if (event.key == 'a'){
        cenarioRotacaoY = true;
    }
    if (event.key == 'w'){
        girarRobo = true;
    }
    if (event.key == ' '){
        saltoRobo = true;
    }
})

document.addEventListener("keyup", event => {
    if (event.key == 's'){
        cenarioRotacao = false;
    }
    if (event.key == 'a'){
        cenarioRotacaoY = false;
    }
})