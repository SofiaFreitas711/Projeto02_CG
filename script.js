import * as THREE from './libs/three.module.js';


let camera, scene, renderer;
let paredeDireita, paredeEsquerda, paredeFundo, teto, chao;
let roboRosa, bracoDireito, bracoEsq,ombroDir,antBracoDir, ombroEsq, antBracoEsq, centro, pirueta, pointLight1, pointLight2, pointLight3;
let rodarCorpo = false;
let bracosCima = false;
let valor = 0.01;

let centroR2D2, ligacaoDireito, ligacaoEsquerdo, ligacaoCentral, pescoco// PIVOTS (Object3D)
let robo;
let rodar = -1
let saltar = 1;
let girarRobo, saltoRobo = false;

// once everything is loaded, we run our Three.js stuff
window.onload = function init() {
    //criação da cena
    scene = new THREE.Scene();


    //definições da camara
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 8;
    camera.lookAt(scene.position); //point the camera to the center of the scene

    const listener = new THREE.AudioListener();
    camera.add( listener );

    //som
    const sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'SPOILER_pepas.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.5 );
        sound.play();
    });


    //criação do render/cena
    renderer = new THREE.WebGLRenderer({ antialias: false }); // aliasing (jagged edges when rendering)
    renderer.setSize(window.innerWidth, window.innerHeight);
    // configure renderer clear color
    renderer.setClearColor("#000000");

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);

    // Luzes
    // const light = new THREE.AmbientLight( 'White' );
    // light.intensity = 0.9 // soft white light
    // scene.add( light );

    let pointLight1 = new THREE.PointLight("DarkRed");
    pointLight1.position.set(10,10,10);
    pointLight1.intensity = 2;
    pointLight1.position.x = 0;
    pointLight1.position.y = 7

    let pointLight2 = new THREE.PointLight("DarkGreen");
    pointLight2.position.set(10,10,10);
    pointLight2.intensity = 2;
    pointLight2.position.x = 6;
    pointLight2.position.y = 7

    let pointLight3 = new THREE.PointLight("Navy");
    pointLight3.position.set(10,10,10);
    pointLight3.intensity = 2;
    pointLight3.position.x = -6;
    pointLight3.position.y = 7

    scene.add(pointLight1,pointLight2,pointLight3);

    //OBJETOS            

    //Discoteca
    let geometry1 = new THREE.BoxGeometry(1, 8, 10);
    let textureParedes = new THREE.TextureLoader().load ('./textures/parede.png');
    let materialParedes = new THREE.MeshLambertMaterial({ map:textureParedes });
    paredeDireita = new THREE.Mesh(geometry1, materialParedes);
    paredeDireita.position.x = 8
    
    scene.add(paredeDireita);

    paredeEsquerda = new THREE.Mesh(geometry1, materialParedes);
    paredeEsquerda.position.x = -8
    scene.add(paredeEsquerda);

    let geometry2 = new THREE.BoxGeometry(17, 1, 8);
    let materialTeto = new THREE.MeshLambertMaterial(
        { color: 'DarkRed'});
    teto = new THREE.Mesh(geometry2, materialTeto);
    teto.position.y = 4.5 
    scene.add(teto);

    let geometry3 = new THREE.BoxGeometry(16, 8 , 4);
    let textureParedeFundo = new THREE.TextureLoader().load ('./textures/paredeFundo.png');
    let materialParedeFundo = new THREE.MeshLambertMaterial({ map:textureParedeFundo });
    paredeFundo = new THREE.Mesh(geometry3, materialParedeFundo);
    paredeFundo.position.z = -4
    scene.add(paredeFundo);

    let texture = new THREE.TextureLoader().load ('./textures/chao.png');
    let materialChao = new THREE.MeshLambertMaterial({ map:texture });
    chao = new THREE.Mesh(geometry2, materialChao);
    chao.position.y = -4
    scene.add(chao);

    const geometryBola = new THREE.SphereGeometry( 0.8, 100, 100);
    let textureBola = new THREE.TextureLoader().load ('./textures/bola.png');
    const materialBola = new THREE.MeshLambertMaterial( { map: textureBola } );
    const bola = new THREE.Mesh( geometryBola, materialBola );
    bola.position.y = 3.2
    scene.add( bola );

    //mesa de DJ retirado do sketchfab
    // function mesa(){
    //     const loader = new GLTFLoader();

    //     loader.load( 'mesa/scene.gltf', function ( gltf ) {
    //         const mesa = gltf.scene;
    //         mesa.scale.set(3,2,0);
    //         mesa.position.x = -3;
    //         scene.add( mesa );

    //     });
    // }
    
    // mesa();
    const mesaDJ = new THREE.BoxGeometry(5,3,1);
    let textureMesa = new THREE.TextureLoader().load ('./textures/mesaDJ.png');
    const materialMesa = new THREE.MeshPhongMaterial( { map: textureMesa } );
    const mesaDJObj = new THREE.Mesh( mesaDJ, materialMesa );
    mesaDJObj.position.x = -3
    mesaDJObj.position.y = -2
    mesaDJObj.position.z = -1.5
    scene.add( mesaDJObj );

    //coluna
    const coluna = new THREE.BoxGeometry(1.8,2.5,1);
    let textureColuna = new THREE.TextureLoader().load ('./textures/coluna.png');
    const materialColuna = new THREE.MeshPhongMaterial( { map: textureColuna },{ color:'LightPink' } );
    const colunaObj = new THREE.Mesh( coluna, materialColuna );
    colunaObj.position.x = -6
    colunaObj.position.y = 2.5
    colunaObj.position.z = -0.5
    colunaObj.rotation.y = 0.5
    scene.add( colunaObj );

    const colunaObj2 = new THREE.Mesh( coluna, materialColuna );
    colunaObj2.position.x = 6
    colunaObj2.position.y = 2.5
    colunaObj2.position.z = -0.5
    colunaObj2.rotation.y = -0.5
    scene.add( colunaObj2 );
    
    // Robozinho da ganda Fifi <3
    const roboRosa = new THREE.Group()

    //corpo
    centro = new THREE.Object3D();
    roboRosa.add( centro );

    const geometryPernas = new THREE.SphereGeometry( 1, 100, 100);
    const materialCorpo = new THREE.MeshLambertMaterial( { color:'LightPink' } );
    const sphere = new THREE.Mesh( geometryPernas, materialCorpo );
    centro.add( sphere );

    const geometryVestido = new THREE.ConeGeometry( 1.5, 3, 10);
    const materialVestido = new THREE.MeshLambertMaterial( { color:'DeepPink' } );
    const cone = new THREE.Mesh( geometryVestido, materialVestido );
    cone.position.y = 1.5

    centro.add( cone );

    //braços
    //Esquerdo
    ombroEsq = new THREE.Object3D();
    ombroEsq.position.x = -1;
    ombroEsq.position.y = 1.1;
    centro.add(ombroEsq);

    const geometryBracoEsq = new THREE.CylinderGeometry(0.2,0.2,1);
    const bracoEsq = new THREE.Mesh( geometryBracoEsq, materialCorpo );
    bracoEsq.rotation.z = -0.5
    ombroEsq.add( bracoEsq );
        
    antBracoEsq = new THREE.Object3D();
    antBracoEsq.position.x = -0.6;
    antBracoEsq.position.y = -0.6;
    ombroEsq.add(antBracoEsq);

    const bracoEsqAnt = new THREE.Mesh( geometryBracoEsq, materialCorpo );
    bracoEsqAnt.rotation.z = -1
    antBracoEsq.add( bracoEsqAnt );
    
    //Direito
    ombroDir = new THREE.Object3D();
    ombroDir.position.x = 1;
    ombroDir.position.y = 1.1;
    centro.add(ombroDir);

    const bracoDireito = new THREE.Mesh( geometryBracoEsq, materialCorpo );
    bracoDireito.rotation.z = 0.5
    ombroDir.add( bracoDireito );
        
    const antBracoDir = new THREE.Object3D();
    antBracoDir.position.x = 0.6;
    antBracoDir.position.y = -0.6;
    ombroDir.add(antBracoDir);

    const bracoDirAnt = new THREE.Mesh( geometryBracoEsq, materialCorpo );
    bracoDirAnt.rotation.z = 1
    antBracoDir.add( bracoDirAnt );

    //cabeça
    const geometryCabeca = new THREE.BoxGeometry(2,2,2);
    const cabeca = new THREE.Mesh( geometryCabeca, materialCorpo );
    cabeca.position.y = 3
    centro.add( cabeca );

    const geometryOlhos = new THREE.SphereGeometry(0.15,100,100);
    const materialOlhoDir = new THREE.MeshLambertMaterial( { color:'SeaGreen' } );
    const olhoDir = new THREE.Mesh( geometryOlhos, materialOlhoDir );
    olhoDir.position.x = -0.26;
    olhoDir.position.y = 0.01;
    olhoDir.position.z = 1
    cabeca.add( olhoDir );

    const materialOlhoEsq = new THREE.MeshLambertMaterial( { color:'Firebrick' } );
    const olhoEsq = new THREE.Mesh( geometryOlhos, materialOlhoEsq );
    olhoEsq.position.x = 0.26;
    olhoEsq.position.y = 0.01;
    olhoEsq.position.z = 1
    cabeca.add( olhoEsq );

    centro.position.x = 0;
    centro.position.y = -2.5;

    scene.add(roboRosa)


    // Parte do Paulo Rodrigues
    const texturaMetalica = new THREE.TextureLoader().load ('./textures/texturaMetalica.jpg')

    robo = new THREE.Group();
    robo.position.y = -2
    robo.position.x = -5
    scene.add(robo)

    centroR2D2 = new THREE.Object3D();
    centroR2D2.rotation.x = -20 * Math.PI / 180;
    robo.add(centroR2D2);
    
    // Corpo
    let corpoTexture = new THREE.TextureLoader().load ('./textures/corpo.png');
    const corpo = new THREE.Mesh(
        new THREE.CylinderGeometry( 1, 1, 2.5, 20),
        new THREE.MeshBasicMaterial({map: corpoTexture},
        new THREE.MeshPhongMaterial({
            map: corpoTexture ,
            bumpMap: texturaMetalica,
            bumpScale: 2
        }))
    );
    
    corpo.position.y = 1
    centroR2D2.add(corpo);

    //pescoço
    pescoco = new THREE.Object3D();
    pescoco.position.y = 1.25
    corpo.add(pescoco);

    //cabeça
    let cabecaTexture = new THREE.TextureLoader().load ('./textures/cabeca.png');
    const cabecaR2D2 = new THREE.Mesh(
        new THREE.SphereGeometry( 0.99, 20, 25),
        new THREE.MeshBasicMaterial({map: cabecaTexture},
            new THREE.MeshPhongMaterial({
                map: cabecaTexture ,
                bumpMap: texturaMetalica,
                bumpScale: 2
            }))
    );
    pescoco.add(cabecaR2D2);

    //olho
    const olho = new THREE.Mesh(
        new THREE.SphereGeometry( 0.1, 20, 25),
        new THREE.MeshLambertMaterial({color: "#FF0000", emissive: "#FF0000"})
    )
    olho.position.x = 0.27
    olho.position.y = 0.42
    olho.position.z = 0.85
    pescoco.add(olho);

    // proteçao de olho
    const protecaoOlho = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.15, 20),
        new THREE.MeshLambertMaterial({color: "#049ef4", emissive: "#fff"})
    )
    protecaoOlho.position.x = 0.25
    protecaoOlho.position.y = 0.40
    protecaoOlho.position.z = 0.79
    protecaoOlho.rotation.x = 70 * Math.PI / 180;
    protecaoOlho.rotation.z = -15 * Math.PI / 180;
    pescoco.add(protecaoOlho);
    
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
    ligacaoCentral.position.y = -1.70;
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
            bumpMap: texturaMetalica,
            bumpScale: 2,
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
            bumpMap: texturaMetalica,
            bumpScale: 2,
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
            bumpMap: texturaMetalica, 
            bumpScale: 2,
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

            renderer.setAnimationLoop(render);
         }


function render() {
    // Sofia Freitas
    if(bracosCima){
        if(ombroDir.rotation.z.toFixed(1) < 2)
            ombroDir.rotation.z += 0.01
        if(ombroEsq.rotation.z.toFixed(1) > -2)
            ombroEsq.rotation.z -= 0.01
    }

    if(rodarCorpo){
        centro.rotation.z -= valor
        console.log(centro.rotation.z);
        if(centro.rotation.z.toFixed(1) == -0.3 || centro.rotation.z.toFixed(1) == 0.3)
            valor *= -1;
        
    }

    if(pirueta){
        if(centro.rotation.y.toFixed(1) < 180){
            centro.rotation.y += 0.01
        }
    }

    if(!bracosCima){
        if(ombroDir.rotation.z>0.5)
            ombroDir.rotation.z -= 0.01
        if(ombroEsq.rotation.z<-0.5)
            ombroEsq.rotation.z += 0.01                    
        
    }

    if(!rodarCorpo){
        if(centro.rotation.z.toFixed(1) > 0)
            centro.rotation.z -= 0.01
        else if(centro.rotation.z.toFixed(1) < 0)
            centro.rotation.z += 0.01
    }

    if(!pirueta){
        if(centro.rotation.y.toFixed(1) != 0){
            centro.rotation.y -= 0.05
        }
    }

    // Paulo Rodrigues
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
        ligacaoCentral.rotation.x -= saltar * 0.01
        pescoco.rotation.y -=  0.1

        if(robo.position.y.toFixed(1) == -0.5){
            saltar *= -1;
        }
        else if(robo.position.y <= -2){
            saltar *= -1;
            saltoRobo = false;
        }
    }
    
    robo.rotation.y += rodar *0.01
    if(pescoco.rotation.y != 0){
        pescoco.rotation.y -=  0.1
        console.log(pescoco.rotation.y.toFixed(0) * 180 / Math.PI);
        if(pescoco.rotation.y.toFixed(0) * 180 / Math.PI <= -360){
            pescoco.rotation.y = 0
        }
    }
    
    // render the scene into viewport using the camera
    renderer.render(scene, camera);
}

/*****************************
* KEYBOARD EVENTS 
* ***************************/
document.addEventListener("keydown", event => {
    if (event.key == 'i'){
        bracosCima = true;
        rodarCorpo = true;
    }
    if (event.key == 'l'){
        pirueta = true;
    }

    if (event.key == 'w'){
        girarRobo = true;
    }
    if (event.key == ' '){
        saltoRobo = true;
    }

})

document.addEventListener("keyup", event => {
    if (event.key == 'i'){
        bracosCima = false;
        rodarCorpo = false;
    }
    if (event.key == 'l'){
        pirueta = false;
    }
    
})

     