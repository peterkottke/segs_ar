/**
 * Simple WebXR based measuring tape for AR-capable devices
 * 
 * Created by Raanan Weber (@RaananW)
 */
 import * as BABYLON from "babylonjs";
 import * as GUI from "babylonjs-gui";

 interface IMeasurementPair {
    startDot: BABYLON.Mesh;
    endDot?: BABYLON.Mesh;
    line?: BABYLON.LinesMesh;
    label: GUI.Rectangle;
    text: GUI.TextBlock;
}
var canvas: any = document.getElementById("renderCanvas");
var engine: any = new BABYLON.Engine(canvas, true);

class Playground {
    constructor () {
    var createScene = async function () {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const available = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');

        if (!available) {
            alert('immersive-ar WebXR session mode is not available in your browser.');
        }

        const xr = await scene.createDefaultXRExperienceAsync({
            uiOptions: {
                sessionMode: 'immersive-ar'
            },
            optionalFeatures: true
        });

        xr.teleportation.detach();

        const { featuresManager } = xr.baseExperience;

        featuresManager.enableFeature(BABYLON.WebXRBackgroundRemover);

        const hitTest = featuresManager.enableFeature(BABYLON.WebXRHitTest, 'latest') as BABYLON.WebXRHitTest;

        const anchorSystem = featuresManager.enableFeature(BABYLON.WebXRAnchorSystem, 'latest') as BABYLON.WebXRAnchorSystem;

        let lastHitTest: BABYLON.Nullable<BABYLON.IWebXRHitResult> = null;

        const pairs: IMeasurementPair[] = [];
        let currentPair: BABYLON.Nullable<IMeasurementPair> = null;

        let anchorsAvailable = false;

        hitTest.onHitTestResultObservable.add((results) => {
            if (results.length) {
                lastHitTest = results[0];
            } else {
                lastHitTest = null;
            }
        });

        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
        sphere.position = new BABYLON.Vector3(0,0,0);

        anchorSystem.onAnchorAddedObservable.add((anchor) => {
            anchor.attachedNode = sphere;
        });

        scene.onPointerObservable.add(async (eventData) => {
            if (lastHitTest) {
                if (lastHitTest.xrHitResult.createAnchor) {
                    const anchor = await anchorSystem.addAnchorPointUsingHitTestResultAsync(lastHitTest);
                }
            }
        }, BABYLON.PointerEventTypes.POINTERDOWN);

        return scene;
    }

    var scene: any = createScene();

    engine.runRenderLoop(() => {
        scene.then(function(scene) {
            scene.render()
        });
    });
}
}

new Playground();