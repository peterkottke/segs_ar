import { Engine, Scene, ArcRotateCamera, StandardMaterial, Color3, FreeCamera, SceneLoader, HemisphericLight, Vector3, MeshBuilder, Mesh } from "babylonjs";
// import sse_segs from "./static/sse_segs.obj";
import 'babylonjs-loaders'

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
            // camera.maxZ = 0;
            // camera.minZ = 0.1;
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

            console.log(SceneLoader.IsPluginForExtensionAvailable('obj'));
            SceneLoader.ImportMesh(
                null,
                "./static/",
                "sse_segs.obj",
                // "https://dl.dropbox.com/s/je705shue9fxuqt/",
                // "unit_cube.obj",
                scene,
                function (meshes) {          
                    for (let i =0; i<meshes.length; i++) {
                        // meshes[i].material = (0,255,0);
                        
                        // console.log(meshes[i].scaling);
                        // console.log(meshes[i].getBoundingInfo());

                        let scale = 1;
                        meshes[i].scaling.x = scale;
                        meshes[i].scaling.y = scale;
                        meshes[i].scaling.z = scale;

                        var myMaterial = new StandardMaterial("myMaterial", scene);


                        myMaterial.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
                        // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
                        // myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
                        // myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

                        myMaterial.alpha = 0.5;

                        meshes[i].material = myMaterial;

                    }
                }
            );
            SceneLoader.ImportMesh(
                null,
                "./static/",
                "unit_cube.obj",
                // "https://dl.dropbox.com/s/je705shue9fxuqt/",
                // "unit_cube.obj",
                scene,
                function (meshes) {          
                    for (let i =0; i<meshes.length; i++) {
                        // meshes[i].material = (0,255,0);
                        
                        // console.log(meshes[i].scaling);
                        // console.log(meshes[i].getBoundingInfo());

                        let scale = 1;
                        meshes[i].scaling.x = scale;
                        meshes[i].scaling.y = scale;
                        meshes[i].scaling.z = scale;

                        var myMaterial = new StandardMaterial("myMaterial", scene);


                        myMaterial.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
                        // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
                        // myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
                        // myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

                        myMaterial.alpha = 0.5;

                        meshes[i].material = myMaterial;

                    }
                }
            );

        //     // myPath = [
        //     //     new BABYLON.Vector3(-5.9112264284772094, 3.7382329488968589, 5.7229641161418536),
        //     //     new BABYLON.Vector3(-5.6724509971708708, 4.000761787903147, 5.8428544431148906),
        //     //     new BABYLON.Vector3(-5.5569876320144793, 4.3124731143381734, 5.744893080409029),
        //     //     new BABYLON.Vector3(-5.2971435316343145, 4.6179291110125344, 5.8571378718860281),
        //     // ];

            let myPath = [
                new Vector3(-5.91, 5.72, 3.73),
                new Vector3(-5.67, 5.84, 4.00),
                new Vector3(-5.55, 5.74, 4.31),
                new Vector3(-5.29, 5.85, 4.61),
            ];

            const options = {
            path: myPath, //vec3 array,
            updatable: true,
            radius: 0.05,
        }

            let tube = MeshBuilder.CreateTube("tube", options, scene);  //scene is optional and defaults to the current scene

            var myMaterial = new StandardMaterial("myMaterial", scene);


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

            let xr = await scene.createDefaultXRExperienceAsync({
                // ask for an ar-session
                uiOptions: {
                sessionMode: "immersive-ar",
                },
            });
            // console.log("after")

            // var scene: Scene = new Scene(engine);

            var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
            camera.attachControl(canvas, true);

            var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

            var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

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

new App();