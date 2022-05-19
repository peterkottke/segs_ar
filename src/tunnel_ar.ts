import { Engine, KeyboardEventTypes, Axis, Scene, CreatePlane, CreateLines, DynamicTexture, WebXRSessionManager, WebXRPlaneDetector, WebXRHitTest, WebXRAnchorSystem, ArcRotateCamera, StandardMaterial, AxesViewer, Color3, FreeCamera, Matrix, SceneLoader, HemisphericLight, Vector3, MeshBuilder, Mesh, ThinRenderTargetTexture, HandConstraintZone, Quaternion, Texture, TransformNode } from "babylonjs";
import 'babylonjs-loaders';
import * as GUI from "babylonjs-gui";
import { cross, dot, acos, norm, string } from "mathjs";
// import {GUI} from 'babylonjs-gui';

var canvas: any = document.getElementById("renderCanvas");
var engine: any = new Engine(canvas, true);

class App {
    camera: ArcRotateCamera;
    explanationButton: GUI.Button;

    constructor () {


        // function createScene(): Scene {
        //     var scene: Scene = new Scene(engine);

        //     var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        //     camera.attachControl(canvas, true);

        //     var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        //     var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

        //     return scene;
        // }

        var scene: any = this.createScene();

        var that = this;

        engine.runRenderLoop(() => {
            // scene.render();
            scene.then(function(scene) {
                // that.explanationButton.textBlock.text = String(that.camera.position)
                scene.render()
            });
        });
    }

    async createScene() {

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


        var sphereOrigin: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
        // var segmentOffset = new Vector3(2.598,-5.32,-9.15)
        // sphereOrigin.position;
        sphereOrigin.position = new Vector3(0,0,0);
        var sphereMaterial = new StandardMaterial("myMaterial", scene);
        sphereMaterial.diffuseColor = new Color3(0.5,0,0);
        sphereOrigin.material = sphereMaterial;

        
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
        sphere.position = new Vector3(0,0,2.5);
        // sphere.position = new Vector3(0,0,0);
        var sphereMaterial = new StandardMaterial("myMaterial", scene);
        sphereMaterial.diffuseColor = new Color3(0,0.5,0.5);
        sphere.material = sphereMaterial;
        sphere.parent = sphereOrigin;

        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
        sphere.position = new Vector3(2.5,0,0);
        // sphere.position = new Vector3(0,0,0);
        var sphereMaterial = new StandardMaterial("myMaterial", scene);
        sphereMaterial.diffuseColor = new Color3(0,0.5,0);
        sphere.material = sphereMaterial;
        sphere.parent = sphereOrigin;

        // var CoT = new TransformNode("root", scene);
        // sphereOrigin.parent = CoT;

        var segmentAlpha = 1;


        var available = await WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');
        // available = false;
        if (available) {
            let xr = await scene.createDefaultXRExperienceAsync({
                // ask for an ar-session
                uiOptions: {
                sessionMode: "immersive-ar",
                referenceSpaceType: "local-floor"
                },
                optionalFeatures: ["hit-test", "anchors"],
            });
            // sphere.rotate(Axis.Y, 3.1415);
            segmentAlpha = 0.5;

            const fm = xr.baseExperience.featuresManager;
            const xrPlanes = fm.enableFeature(WebXRPlaneDetector.Name, "latest");
            const anchorSystem = fm.enableFeature(WebXRAnchorSystem, 'latest',
                // {
                //     worldParentNode: CoT
                // }
            ) as WebXRAnchorSystem;
            const hitTest = fm.enableFeature(WebXRHitTest, 'latest') as WebXRHitTest;
            var lastHitTest: any;

            anchorSystem.onAnchorAddedObservable.add((anchor) => {
                anchor.attachedNode = sphereOrigin;
                anchor.attachedNode.rotation = new Vector3(0,180,0);
                // anchor.attachedNode = CoT;
              });
            // anchorSystem.worldParentNode()
    
            
            hitTest.onHitTestResultObservable.add((results) => {
                if (results.length) {
                    lastHitTest = results[0];
                } else {
                    lastHitTest = null;
                }
            });
    
            scene.onPointerObservable.add(async (eventData) => {
                if (lastHitTest) {
                    if (lastHitTest.xrHitResult.createAnchor) {
                        const anchor = await anchorSystem.addAnchorPointUsingHitTestResultAsync(lastHitTest);
                    }
                }
            }, BABYLON.PointerEventTypes.POINTERDOWN);
    
        }

        let seg_rotations = require("./ci_data.json");
        // console.log(seg_rotations)

        // https://stackoverflow.com/questions/1263072/changing-a-matrix-from-right-handed-to-left-handed-coordinate-system

        var ringXs:number[] = [];
        var ringYs:number[] = [];
        var ringZs:number[] = [];
        var ringRotations:number[] = [];

        let offsetX = 1758200;
        let offsetY = 5908082;
        let offsetZ = 0;
        let segmentOffset = new Vector3(offsetX, offsetZ, offsetY);


        
        for (let key in seg_rotations['P-Number']) {
            if (key == 'RingYCoord') { // only for CI, error in DB specification
                for (let result in seg_rotations['P-Number'][key]) {
                    ringXs.push(seg_rotations['P-Number'][key][result]["value"])
                }
            }
            if (key == 'RingXCoord') { // only for CI, error in DB specification
                for (let result in seg_rotations['P-Number'][key]) {
                    ringYs.push(seg_rotations['P-Number'][key][result]["value"])
                }
            }
            if (key == 'RingZCoord') {
                for (let result in seg_rotations['P-Number'][key]) {
                    ringZs.push(seg_rotations['P-Number'][key][result]["value"])
                }
            }
            if (key == 'KeyStoneAngle') {
                for (let result in seg_rotations['P-Number'][key]) {
                    ringRotations.push(seg_rotations['P-Number'][key][result]["value"])
                }
            }
        }

        var seg_mesh: any;
            
        let importPromise = SceneLoader.ImportMeshAsync(
            null,
            "./meshes/",
            "CI_ring.obj",
            scene
        );
        importPromise.then((meshes) => {
                
            for (let idx = 0; idx < ringXs.length; idx++) {
                for (let meshIdx = 0; meshIdx < meshes['meshes'].length; meshIdx++) {

                    // console.log(meshes);
                    seg_mesh = meshes['meshes'][meshIdx];
                    seg_mesh.name = "Seg_" + meshIdx;
                    // console.log(seg_mesh);

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

                    seg_mesh.material = myMaterial;
                    seg_mesh.isVisible = false;
                    // myMaterial.alpha = segmentAlpha;
                    seg_mesh.parent = sphereOrigin;
                        
                    // console.log(seg_name + ": " + seg_rotations[seg_name].length);

                    console.log("creating instances")

                    let meshInstance = seg_mesh.createInstance("i" + idx);
                    meshInstance.name = string(idx);


                    
                    // let newQuat = new Quaternion(
                    //     -seg_rotations[seg_name][j]['qx'], // x 
                    //     -seg_rotations[seg_name][j]['qz'], // z
                    //     -seg_rotations[seg_name][j]['qy'], // y
                    //     seg_rotations[seg_name][j]['qw'], // w
                    //     );

                    // meshInstance.rotationQuaternion = newQuat;
                    meshInstance.parent = sphereOrigin;

                    meshInstance.rotate(new Vector3(0,0,1), ringRotations[idx] * 3.1415/180, BABYLON.Space.WORLD);

                    let segmentAxis = [0,0,1];
                    let asbuiltAxis = [ringXs[idx+1] - ringXs[idx], ringZs[idx+1] - ringZs[idx], ringYs[idx+1] - ringYs[idx]];

                    let rotationAxis = cross(segmentAxis, asbuiltAxis);
                    // let a = norm(segmentAxis);
                    let rotationMagnitude = acos(dot(segmentAxis, asbuiltAxis)/((norm(segmentAxis) as number)*(norm(asbuiltAxis) as number)));

                    meshInstance.rotate(new Vector3(rotationAxis[0], rotationAxis[1], rotationAxis[2]), rotationMagnitude, BABYLON.Space.WORLD);

                    meshInstance.position = new Vector3(ringXs[idx], ringZs[idx], ringYs[idx]).subtract(segmentOffset);
                }
                    
            }

        });

        this.camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        this.camera.attachControl(canvas, true);

        this.camera.zoomToMouseLocation = true;
        this.camera.panningSensibility = 0.1e3;
        this.camera.wheelDeltaPercentage = 0.1;
        this.camera.position = new Vector3(1079.2689865948171, 4.2231861664889427+100, -6175.4743729886959);
        this.camera.target = new Vector3(1079.2689865948171, 4.2231861664889427, -6175.4743729886959);
        this.camera.position = new Vector3(15,15,15);
        this.camera.target = new Vector3(0,0,0);
        this.camera.maxZ = 0;
        this.camera.minZ = 0.1;
        
        // var alignment = require("./alignment.json");
        var alignment_i = 0;

        var cameraVertOffset = new Vector3(0,0,0)

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
                    
                    alignment_i = Math.min(alignment_i, ringXs.length - 1)
                    alignment_i = Math.max(alignment_i, 1)

                    updateCamera(this.camera, [ringXs, ringZs, ringYs], alignment_i, segmentOffset, cameraVertOffset);
                    
                break;
            }
        });

        const axes = new AxesViewer(scene, 25)

        //Creates a gui label to display the cannon
        let guiCanvas = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let guiButton = GUI.Button.CreateSimpleButton("guiButton", "None");

        // let guiSlider = new GUI.Slider("guiSlider");
        
        // guiSlider.minimum = -50;
        // guiSlider.maximum = 50;
        // guiSlider.value = 0;
        // guiSlider.height = "20px";
        // guiSlider.width = "200px";
        // guiSlider.onValueChangedObservable.add(function(value) {
        //     cameraVertOffset.y = value
        //     updateCamera(this.camera, alignment, alignment_i, segmentOffset, cameraVertOffset);
        // });
        // guiCanvas.addControl(guiSlider);


        var guiLine = new GUI.Line();

        scene.onPointerDown = function castRay(){
            var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(), this.camera);	

            var hit = scene.pickWithRay(ray);

            if (hit.pickedMesh){
                createGUIButton(hit.pickedMesh, guiCanvas, guiButton, guiLine);
            }
        }   
        
        // this.explanationButton = GUI.Button.CreateSimpleButton("guiButton", "W: Forward\nS: Backward\n" + available + this.camera.position);
        this.explanationButton = GUI.Button.CreateSimpleButton("guiButton", "W: Forward\nS: Backward\nLeft Mouse: Rotate\nRight Mouse: Pan");
        this.explanationButton.width = "150px"
        this.explanationButton.height = "80px";
        this.explanationButton.color = "white";
        this.explanationButton.cornerRadius = 5;
        this.explanationButton.background = "green";
        this.explanationButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.explanationButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.explanationButton.left = "50px"
        this.explanationButton.top = "300px"
        guiCanvas.addControl(this.explanationButton);

        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        return Promise.resolve(scene);

    };
}

function createGUIButton(mesh, guiCanvas, guiButton, guiLine){
    guiButton.textBlock.text= "Ring: " + mesh.name + "\nSegment: " + mesh.sourceMesh.name
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

function updateCamera(camera, alignment, alignment_i, segmentOffset, cameraVertOffset) {
    let i = 10
    camera.target = new Vector3(alignment[0][alignment_i], alignment[1][alignment_i], alignment[2][alignment_i]).subtract(segmentOffset);
    camera.position = new Vector3(alignment[0][alignment_i-i], alignment[1][alignment_i-i], alignment[2][alignment_i-i]).subtract(segmentOffset).subtract(cameraVertOffset);
}

new App();