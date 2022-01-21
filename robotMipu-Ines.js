import * as THREE from "./libs/three.module.js";

        /* Variables */

        let camera, scene, renderer;

        /* MESHES OF THE ROBOT */
        let robotFace,
            robotEarOne,
            robotEarTwo,
            robotNeck,
            robotBody,
            robotLegOne,
            robotLegTwo,
            robotFootOne,
            robotFootTwo,
            robotKey;

        /* CAMERA */

        let pivotCenter, pivotKey; /* pivotPezinhos */

        let rotationCoordinate = 0.02;
        let danceRobotDance = false;
        let jumpRobotJump = false;
        let jump = 0.8;

        // once everything is loaded, we run our Three.js stuff
        window.onload = function init() {
            /*********************
             * SCENE
             * *******************/
            // create an empty scene, that will hold all our elements such as objects, cameras and lights
            scene = new THREE.Scene();

            const hatLight = new THREE.PointLight( 0xFFFF00, 2, 20 );
            hatLight.position.set( 0, 4.6, 0 );
            scene.add( hatLight );
            /*********************
             * CAMERA
             * *******************/
            // create a camera, which defines where we're looking at
            const aspect = window.innerWidth / window.innerHeight;
            camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10);
            camera.position.x = 0;
            camera.position.y = 3.5;
            camera.position.z = 8;
            camera.lookAt(scene.position); //point the camera to the center of the scene

            /*********************
             * RENDERER
             * *******************/
            // create a render and set the size
            renderer = new THREE.WebGLRenderer({ antialias: false }); // aliasing (jagged edges when rendering)
            renderer.setSize(window.innerWidth, window.innerHeight);
            // configure renderer clear color
            renderer.setClearColor("#000000");

            // add the output of the renderer to an HTML element (this case, the body)
            document.body.appendChild(renderer.domElement);

            /*****************************
             * MESH = GEOMETRY + MATERIAL
             * ***************************/

            /* Defining materials and Robot textures */

            let materialGlass = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 0.1,
                roughness: 0.05,
                ior: 2.5,
                thickness: 0.2,
                transmission: 1,
                side: THREE.DoubleSide,
            });

            /* ears */

            let mapTextureGreenMetal = new THREE.TextureLoader().load(
                "textures/robotSkin.png"
            );
            let materialGreenMetal = new THREE.MeshLambertMaterial({
                map: mapTextureGreenMetal,
            });

            let mapTextureMetal = new THREE.TextureLoader().load(
                "textures/robotMetal.jpg"
            );
            let materialMetal = new THREE.MeshLambertMaterial({
                map: mapTextureMetal,
            });

            let mapTextureMetalDetails = new THREE.TextureLoader().load(
                "textures/robotMetalDetails.jpg"
            );
            let materialMetalDetails = new THREE.MeshLambertMaterial({
                map: mapTextureMetalDetails,
            });

            let mapTextureLittleHat = new THREE.TextureLoader().load(
                "textures/robotGalaxy.png"
            );
            let materialLittleHat = new THREE.MeshLambertMaterial({
                map: mapTextureLittleHat,
            });

            let mapTexturefaceMaterial = new THREE.TextureLoader().load(
                "textures/robotFace.png"
            );
            let faceMaterial = new THREE.MeshLambertMaterial({
                map: mapTexturefaceMaterial,
            });

            let mapTexturebodyMaterial = new THREE.TextureLoader().load(
                "textures/robotBody.png"
            );
            let bodyMaterial = new THREE.MeshLambertMaterial({
                map: mapTexturebodyMaterial,
            });

            /* Definig GEOMETRIES and MESHES*/

            /* Group */

            let robotInteiro = new THREE.Group();
            scene.add(robotInteiro);

            /* Pivots */

            pivotCenter = new THREE.Object3D();
            robotInteiro.add(pivotCenter);

            pivotKey = new THREE.Object3D();

            /* Geometries */


            const geometryInsideEar = new THREE.SphereGeometry(0.4, 60, 100);
            const coneInsideEar = new THREE.Mesh(
                geometryInsideEar,
                materialLittleHat
            );
            coneInsideEar.position.x = 0;
            coneInsideEar.position.y = 4.5;
            pivotCenter.add(coneInsideEar);

            /* Head */
            let headGeometryMain = new THREE.BoxGeometry(2, 1, 2);

            robotFace = new THREE.Mesh(headGeometryMain, materialGreenMetal);
            robotFace.position.y = 4;
            pivotCenter.add(robotFace);

            const headGeometry = new THREE.BoxGeometry(2, 1.1, 0.1);
            const headPlane = new THREE.Mesh(headGeometry, faceMaterial);
            headPlane.position.y = 4;
            headPlane.position.z = 1.05;
            pivotCenter.add(headPlane);

            /* Right ear */
            let headGeometryEar = new THREE.SphereGeometry(0.4, 30, 35);

            robotEarOne = new THREE.Mesh(headGeometryEar, materialGlass);
            robotEarOne.position.y = 4;
            robotEarOne.position.x = 0.9;
            pivotCenter.add(robotEarOne);

            /* Left ear */
            let headGeometryEarLeft = new THREE.SphereGeometry(0.4, 30, 35);

            robotEarTwo = new THREE.Mesh(headGeometryEarLeft, materialGlass);
            robotEarTwo.position.y = 4;
            robotEarTwo.position.x = -0.9;
            pivotCenter.add(robotEarTwo);

            /* Neck */
            let neckGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 25);

            robotNeck = new THREE.Mesh(neckGeometry, materialMetal);
            robotNeck.position.y = 3.5;
            robotNeck.position.x = 0;
            pivotCenter.add(robotNeck);

            /* Body */
            let bodyGeometry = new THREE.BoxGeometry(2, 0.7, 2);

            robotBody = new THREE.Mesh(bodyGeometry, materialGreenMetal);
            robotBody.position.y = 3;
            pivotCenter.add(robotBody);

            const bodyGeometrySecond = new THREE.BoxGeometry(2, 0.7, 0.1);
            const bodyPlane = new THREE.Mesh(bodyGeometrySecond, bodyMaterial);
            bodyPlane.position.y = 3;
            bodyPlane.position.z = 1.05;
            pivotCenter.add(bodyPlane);

            /* Leg one */
            let legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 150);

            robotLegOne = new THREE.Mesh(legGeometry, materialMetal);
            robotLegOne.position.y = 2.3;
            robotLegOne.position.x = -0.6;
            pivotCenter.add(robotLegOne);

            /* Leg two */
            robotLegTwo = new THREE.Mesh(legGeometry, materialMetal);
            robotLegTwo.position.y = 2.3;
            robotLegTwo.position.x = 0.6;
            pivotCenter.add(robotLegTwo);

            /* Foot one */
            let footGeometry = new THREE.BoxGeometry(0.5, 0.1, 1);

            robotFootOne = new THREE.Mesh(footGeometry, materialGreenMetal);
            robotFootOne.position.y = 1.9;
            robotFootOne.position.x = 0.6;
            robotFootOne.position.z = 0.3;
            pivotCenter.add(robotFootOne);

            /* Foot two */
            robotFootTwo = new THREE.Mesh(footGeometry, materialGreenMetal);
            robotFootTwo.position.y = 1.9;
            robotFootTwo.position.x = -0.6;
            robotFootTwo.position.z = 0.3;
            pivotCenter.add(robotFootTwo);

            /* winding key */
            const geometryKey = new THREE.TorusGeometry(0.2, 0.1, 9, 100);
            const torusOne = new THREE.Mesh(geometryKey, materialMetal);
            torusOne.position.x = 0.1;
            torusOne.position.z = -0.2;
            torusOne.rotation.x = Math.PI / 2;
            pivotKey.add(torusOne);

            const torusTwo = new THREE.Mesh(geometryKey, materialMetal);
            torusTwo.position.x = 0.1;
            torusTwo.position.z = 0.2;
            torusTwo.rotation.x = Math.PI / 2;

            pivotKey.add(torusTwo);

            let keyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.45, 25);

            robotKey = new THREE.Mesh(keyGeometry, materialMetal);
            robotKey.rotation.x = Math.PI / 2;
            robotKey.rotation.z = Math.PI / 2;

            pivotKey.position.y = 3;
            pivotKey.position.x = 1.3;

            pivotKey.add(robotKey);

            pivotCenter.add(pivotKey);

            /*****************************
             * ANIMATE
             * ***************************/
            // set the animation function
            renderer.setAnimationLoop(render);
        };

        function render() {
            if (danceRobotDance) {
                pivotKey.rotation.x += 0.1;
                pivotCenter.rotation.z += rotationCoordinate;
                /*     pivotCenter.rotation.y += 0.01; */
                console.log(pivotCenter.rotation.z);
                if (
                    pivotCenter.rotation.z.toFixed(2) == 0.22 ||
                    pivotCenter.rotation.z.toFixed(2) == -0.22
                ) {
                    rotationCoordinate *= -1;
                }
            } else {
                pivotKey.rotation.x -= 0.06;
                if (pivotCenter.rotation.z.toFixed(2) > 0) {
                    pivotCenter.rotation.z -= 0.02;
                    console.log(pivotCenter.rotation.z);
                } else if (pivotCenter.rotation.z.toFixed(2) < 0) {
                    pivotCenter.rotation.z += 0.02;
                }
            }

            if (jumpRobotJump) {
                pivotKey.rotation.x += 0.1;
                pivotCenter.position.y += jump * 0.085;
                pivotCenter.rotation.y += 0.1428;
                if (pivotCenter.position.y.toFixed(1) == 1.5) {
                    jump *= -1;
                } else if (pivotCenter.position.y <= 0) {
                    jump *= -1;
                    jumpRobotJump = false;
                }
            }
            renderer.render(scene, camera);
        }

        document.addEventListener("keydown", (event) => {
            if (event.key == " ") {
                danceRobotDance = true;
            }
            if (event.key == "x") {
                jumpRobotJump = true;
            }
        });

        document.addEventListener("keyup", (event) => {
            if (event.key == " ") {
                danceRobotDance = false;
            }
        });