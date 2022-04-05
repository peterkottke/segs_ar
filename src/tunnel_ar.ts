import { Engine, KeyboardEventTypes, Scene, WebXRSessionManager, WebXRPlaneDetector, WebXRHitTest, WebXRAnchorSystem, ArcRotateCamera, StandardMaterial, AxesViewer, Color3, FreeCamera, Matrix, SceneLoader, HemisphericLight, Vector3, MeshBuilder, Mesh, ThinRenderTargetTexture, HandConstraintZone, Quaternion, Texture, TransformNode } from "babylonjs";
import 'babylonjs-loaders';
import * as GUI from "babylonjs-gui";
// import {GUI} from 'babylonjs-gui';

var canvas: any = document.getElementById("renderCanvas");
var engine: any = new Engine(canvas, true);

class App {

        constructor () {
        var createScene = async function () {

            // This creates a basic Babylon Scene object (non-mesh)
            var scene = new Scene(engine);

            // // This creates and positions a free camera (non-mesh)
            // var camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);

            // // This targets the camera to scene origin
            // camera.setTarget(new Vector3(0, 0, 1));
            // // camera.maxR = 1000;

            // // This attaches the camera to the canvas
            // camera.attachControl(canvas, true);

            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            var light1 = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
            var light2 = new HemisphericLight("light", new Vector3(0, -1, 0), scene);

            // Default intensity is 1. Let's dim the light a small amount
            light1.intensity = 0.5;
            light2.intensity = 0.5;


            // https://www.dropbox.com/s/je705shue9fxuqt/unit_cube.obj?dl=0

            let seg_rotations = require("./segs_block_rotations.json");
            // console.log(seg_rotations)

            // https://stackoverflow.com/questions/1263072/changing-a-matrix-from-right-handed-to-left-handed-coordinate-system

            for (var seg_name in seg_rotations) {
                console.log(seg_name)

                var seg_mesh: any;
                
                let importPromise = SceneLoader.ImportMeshAsync(
                    null,
                    "./meshes/",
                    seg_name + ".obj",
                    // "https://dl.dropbox.com/s/je705shue9fxuqt/",
                    // "unit_cube.obj",
                    scene
                );
                importPromise.then((meshes) => {
                    
                    // console.log(meshes);
                    seg_mesh = meshes['meshes'][0];
                    seg_mesh.name = seg_name;
                    console.log(seg_mesh);

                    let scale = 1;
                    seg_mesh.scaling.x = scale;
                    seg_mesh.scaling.y = scale;
                    seg_mesh.scaling.z = -scale; // rhino outputs OBJ weird, even with mapping Z to Y


                    // var myMaterial = new StandardMaterial("myMaterial", scene);
                    var myMaterial = new StandardMaterial("myMaterial", scene);
                    myMaterial.bumpTexture = new Texture("./meshes/concrete_40-1K/1K-concrete_40-normal.jpg")
                    // myMaterial.opacityTexture = new Texture("./meshes/concrete_40-1K/1K-concrete_40-oa.jpg")
                    myMaterial.diffuseTexture = new Texture("./meshes/concrete_40-1K/1K-concrete_40-diffuse.jpg")
                    // myMaterial.specularTexture = new Texture("./meshes/concrete_40-1K/1K-concrete_40-specular.jpg")


                    let c = Math.random() / 2 + 0.25
                    myMaterial.diffuseColor = new Color3(c, c, c);
                    // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
                    // myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
                    // myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

                    // myMaterial.alpha = 0.5;

                    seg_mesh.material = myMaterial;
                        
                    console.log(seg_name + ": " + seg_rotations[seg_name].length);
                    // for (let j=0; j<seg_rotations[seg_name].length; j++) {
                    // for (let j=0; j<seg_rotations[seg_name].length; j++) {
                    for (let j=0; j<10; j++) {
                        console.log("creating instances")

                        let meshInstance = seg_mesh.createInstance("i" + j);

                        meshInstance.position.x = seg_rotations[seg_name][j]['dx'];
                        meshInstance.position.y = seg_rotations[seg_name][j]['dz'];
                        meshInstance.position.z = seg_rotations[seg_name][j]['dy'];

                        
                        let newQuat = new Quaternion(
                            -seg_rotations[seg_name][j]['qx'], // x 
                            -seg_rotations[seg_name][j]['qz'], // z
                            -seg_rotations[seg_name][j]['qy'], // y
                            seg_rotations[seg_name][j]['qw'], // w
                            );

                        meshInstance.rotationQuaternion = newQuat;

                        // meshInstance.rotation()

                        // meshInstance.rotate(BABYLON.Axis.Z, seg_rotations[seg_name][j]['ea'], BABYLON.Space.WORLD);
                        // meshInstance.rotate(BABYLON.Axis.Y, -seg_rotations[seg_name][j]['eb'], BABYLON.Space.WORLD);
                        // meshInstance.rotate(BABYLON.Axis.Z, seg_rotations[seg_name][j]['eg'], BABYLON.Space.WORLD);

                    }
                });

            }


        //     let myPath = [
        //         // new Vector3(-5.91, 5.72, 3.73),
        //         // new Vector3(-5.67, 5.84, 4.00),
        //         // new Vector3(-5.55, 5.74, 4.31),
        //         // new Vector3(-5.29, 5.85, 4.61),
        //         new Vector3(-1,0,25),
        //         new Vector3(0,0,25),
        //         new Vector3(0,0,0),
        //         new Vector3(25,0,0),
        //     ];

        //     const options = {
        //     path: myPath, //vec3 array,
        //     updatable: true,
        //     radius: 0.05,
        // }

        //     let tube = MeshBuilder.CreateTube("tube", options, scene);  //scene is optional and defaults to the current scene

        //     var myMaterial = new StandardMaterial("myMaterial", scene);


        //     myMaterial.diffuseColor = new Color3(1,0,0);
        //     myMaterial.alpha = 0.5;

        //     tube.material = myMaterial;
            
            //  BABYLON.SceneLoader.ImportMesh(
            //     "",
            //     // "https://dl.dropbox.com/s/0mqelj0ld0lsynt/",
            //     //"sse_segs.obj",
            //     "https://dl.dropbox.com/s/je705shue9fxuqt/",
            //     "unit_cube.obj",
            //     scene,
            //     function (meshes) {          
            //         for (let i =0; i<meshes.length; i++) {
            //             // meshes[i].material = (0,255,0);
                        
            //             // console.log(meshes[i].scaling);
            //             // console.log(meshes[i].getBoundingInfo());

            //             scale = 1;
            //             meshes[i].scaling.x = scale;
            //             meshes[i].scaling.y = scale;
            //             meshes[i].scaling.z = scale;

            //             var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);


            //             myMaterial.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            //             // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
            //             // myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
            //             // myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

            //             myMaterial.alpha = 0.5;

            //             meshes[i].material = myMaterial;

            //         }
            //     }
            // );

            //BABYLON.SceneLoader.ImportMesh("", "https://dl.dropbox.com/s/rANdoMGeneR4tedLink/", "my-file.glb", scene);

            // Our built-in 'sphere' shape.
            // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 15, segments: 32}, scene);

            // Move the sphere upward 1/2 its height
            // sphere.position.y = 1;W

            // scene.createDefaultEnvironment();

            // XR
            // const xrHelper = await scene.createDefaultXRExperienceAsync();
            const available = await WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');

            if (available) {
                let xr = await scene.createDefaultXRExperienceAsync({
                    // ask for an ar-session
                    uiOptions: {
                    sessionMode: "immersive-ar",
                    referenceSpaceType: "local-floor"
                    },
                    optionalFeatures: ["hit-test", "anchors"],
                });
    
                // const fm = xr.baseExperience.featuresManager;
                // const xrPlanes = fm.enableFeature(WebXRPlaneDetector.Name, "latest");
                // const anchorSystem = fm.enableFeature(WebXRAnchorSystem, 'latest') as WebXRAnchorSystem;
                // const hitTest = fm.enableFeature(WebXRHitTest, 'latest') as WebXRHitTest;

                // // var sphereTN = new TransformNode("tn", scene);
                // var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
                // sphere.position = new Vector3(0,0,0-5);

                // anchorSystem.onAnchorAddedObservable.add((anchor) => {
                //     //...
                //     anchor.attachedNode = sphere;
                //   });
        
                // let lastHitTest: BABYLON.Nullable<BABYLON.IWebXRHitResult> = null;
                // // const anchorPromise = anchorSystem.addAnchorPointUsingHitTestResultAsync(lastHitTest);
        
                // let anchorsAvailable = false;
                
                // anchorSystem.onAnchorAddedObservable.add((anchor) => {
                //     anchor.attachedNode = processClick();
                // });
        
                // scene.onPointerObservable.add(async (eventData) => {
                //     if (lastHitTest) {
                //         if (lastHitTest.xrHitResult.createAnchor) {
                //             const anchor = await anchorSystem.addAnchorPointUsingHitTestResultAsync(lastHitTest);
                //         } else {
                //             processClick();
                //         }
                //     }
                // }, BABYLON.PointerEventTypes.POINTERDOWN);
        
            }

            // const xrPlanes = fm.enableFeature(BABYLON.WebXRPlaneDetector.Name, "latest");


            // console.log("after")

            // var scene: Scene = new Scene(engine);

            var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
            camera.attachControl(canvas, true);

            camera.zoomToMouseLocation = true;
            camera.panningSensibility = 0.1e3;
            camera.wheelDeltaPercentage = 0.1;
            camera.position = new Vector3(1079.2689865948171, 4.2231861664889427+100, -6175.4743729886959);
            camera.target = new Vector3(1079.2689865948171, 4.2231861664889427, -6175.4743729886959);
            camera.position = new Vector3(0,30,0);
            camera.target = new Vector3(0,0,0);
            // camera.rotation.z = 180;
            camera.maxZ = 0;
            camera.minZ = 0.1;
            // let axesA = new AxesViewer(scene, 10);
            // let axesB = new AxesViewer(scene, 20);
            // let axesC = new AxesViewer(scene, 30);
            // axesC.position

            
            var alignment = require("./alignment.json");
            var alignment_i = 0;

            // scene.onKeyboardObservable.add((kbInfo) => {
            //     switch (kbInfo.type) {
            //       case KeyboardEventTypes.KEYDOWN:
            //         console.log("KEY DOWN: ", kbInfo.event.key);
            //         break;
            //       case KeyboardEventTypes.KEYUP:
            //         console.log("KEY UP: ", kbInfo.event.code);
            //         break;
            //     }
            //   });

            scene.onKeyboardObservable.add((kbInfo) => {
                switch (kbInfo.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:
                        switch (kbInfo.event.key) {
                            case "w":
                            case "W":
                                alignment_i += 25;

                            break
                            case "s":
                            case "S":
                                alignment_i -= 25;
                            break
                        }
                        
                        alignment_i = Math.min(alignment_i, alignment.length - 1)
                        alignment_i = Math.max(alignment_i, 1)
                        let off_x = camera.target.x - camera.position.x
                        let off_y = camera.target.y - camera.position.y
                        let off_z = camera.target.z - camera.position.z

                        camera.target = new Vector3(alignment[alignment_i][0], alignment[alignment_i][2], alignment[alignment_i][1]);
                        // camera.target.x = alignment[alignment_i][0];
                        // camera.target.y = alignment[alignment_i][2];
                        // camera.target.z = alignment[alignment_i][1];
                        
                        camera.position = new Vector3(alignment[alignment_i-1][0], alignment[alignment_i-1][2], alignment[alignment_i-1][1]);
                        // camera.position.y = alignment[alignment_i-1][2];
                        // camera.position.z = alignment[alignment_i-1][1];

                        // camera.position.x = camera.target.x + off_x
                        // camera.position.y = camera.target.y + off_y
                        // camera.position.z = camera.target.z + off_z
                    break;
                }
            });

            //Creates a gui label to display the cannon
            let guiCanvas = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            let guiButton = GUI.Button.CreateSimpleButton("guiButton", "None");
            var guiLine = new GUI.Line();
            scene.onPointerDown = function castRay(){
                var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(), camera);	
    
                var hit = scene.pickWithRay(ray);
    
                if (hit.pickedMesh){
                    createGUIButton(hit.pickedMesh, guiCanvas, guiButton, guiLine);
                }
            }   
            
            let explanationButton = GUI.Button.CreateSimpleButton("guiButton", "W: Forward\nS: Backward");
            explanationButton.width = "150px"
            explanationButton.height = "80px";
            explanationButton.color = "white";
            explanationButton.cornerRadius = 5;
            explanationButton.background = "green";
            explanationButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            explanationButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            explanationButton.left = "50px"
            explanationButton.top = "300px"
            guiCanvas.addControl(explanationButton);

            var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

            // var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
            // sphere.position = new Vector3(0,0,0-5);

            return Promise.resolve(scene);

        };

        // function createScene(): Scene {
        //     var scene: Scene = new Scene(engine);

        //     var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        //     camera.attachControl(canvas, true);

        //     var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        //     var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

        //     return scene;
        // }

        var scene: any = createScene();

        engine.runRenderLoop(() => {
            scene.then(function(scene) {
                scene.render()
            });
        });
    }
}

function createGUIButton(mesh, guiCanvas, guiButton, guiLine){
    guiButton.textBlock.text= "Segment: " + mesh.sourceMesh.name + "\nInstance: " + mesh.name
    guiButton.textBlock.horizontalAlignment = "left"
    guiButton.width = "150px"
    guiButton.height = "80px";
    guiButton.color = "white";
    // guiButton.
    guiButton.cornerRadius = 5;
    guiButton.background = "green";
    guiButton.onPointerUpObservable.add(function() {
        guiCanvas.dispose();
    });
    guiButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    guiButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    guiButton.left = "50px"
    guiButton.top = "50px"
    guiCanvas.addControl(guiButton);

    guiLine.lineWidth = 4;
    guiLine.color = "Orange";
    guiLine.y2 = 20;
    // line.linkOffsetY = -20;
    guiCanvas.addControl(guiLine);
    guiLine.linkWithMesh(mesh); 
    guiLine.connectedControl = guiButton;  
}

new App();