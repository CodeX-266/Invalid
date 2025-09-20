"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface DesignObject {
  type: "text" | "image";
  value: string;
  fontSize?: number;
  width?: number;
  height?: number;
  uv?: THREE.Vector2;
  scale?: number;
  rotation?: number;
  color?: string;
}

const TshirtModel = ({ texture }: { texture: THREE.Texture }) => {
  const { scene } = useGLTF("/models/tshirt.glb") as { scene: THREE.Group };

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material) {
        material.map = texture;
        material.color = new THREE.Color("#ffffff");
        material.needsUpdate = true;
      }
    }
  });

  scene.position.set(0, -1.5, 0);
  scene.rotation.set(0, Math.PI, 0);

  return <primitive object={scene} />;
};

const InteractiveTshirt = ({
  objects,
  setObjects,
  texture,
  controlsRef,
  setSelectedIndex,
}: {
  objects: DesignObject[];
  setObjects: React.Dispatch<React.SetStateAction<DesignObject[]>>;
  texture: THREE.Texture;
  controlsRef: React.MutableRefObject<THREE.EventDispatcher | null>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const { camera, gl, scene } = useThree();
  const selectedRef = useRef<DesignObject | null>(null);

  useEffect(() => {
    if (!gl?.domElement) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (objects.length === 0) return;

      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const mouse = new THREE.Vector2(x, y);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const uv = intersects[0].uv;
        if (!uv) return;

        if (controlsRef.current && "enabled" in controlsRef.current) {
          (controlsRef.current as any).enabled = false;
        }

        selectedRef.current = { ...objects[objects.length - 1], uv };
        setSelectedIndex(objects.length - 1);
        setObjects((prev) => [...prev.slice(0, -1), selectedRef.current!]);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!selectedRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const mouse = new THREE.Vector2(x, y);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const uv = intersects[0].uv;
        if (!uv) return;

        selectedRef.current.uv = uv;
        setObjects((prev) => [...prev.slice(0, -1), selectedRef.current!]);
      }
    };

    const handlePointerUp = () => {
      selectedRef.current = null;
      if (controlsRef.current && "enabled" in controlsRef.current) {
        (controlsRef.current as any).enabled = true;
      }
    };

    gl.domElement.addEventListener("pointerdown", handlePointerDown);
    gl.domElement.addEventListener("pointermove", handlePointerMove);
    gl.domElement.addEventListener("pointerup", handlePointerUp);

    return () => {
      gl.domElement.removeEventListener("pointerdown", handlePointerDown);
      gl.domElement.removeEventListener("pointermove", handlePointerMove);
      gl.domElement.removeEventListener("pointerup", handlePointerUp);
    };
  }, [gl, camera, scene, objects, setObjects, controlsRef, setSelectedIndex]);

  return <TshirtModel texture={texture} />;
};

const BasicEditor = () => {
  const [objects, setObjects] = useState<DesignObject[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [canvasTexture, setCanvasTexture] = useState<THREE.CanvasTexture | null>(null);

 const controlsRef = useRef<React.ElementRef<typeof OrbitControls> | null>(null);

  // Create canvas only on client
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const texture = new THREE.CanvasTexture(canvas);
    setCanvasTexture(texture);
  }, []);

  // Redraw texture when objects change
  useEffect(() => {
    if (!canvasTexture) return;

    const image = canvasTexture.image as HTMLCanvasElement | undefined;
    if (!image) return;

    const ctx = image.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, image.width, image.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, image.width, image.height);

    objects.forEach((obj) => {
      if (!obj?.uv) return;

      const x = obj.uv.x * image.width;
      const y = (1 - obj.uv.y) * image.height;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((obj.rotation || 0) * (Math.PI / 180));
      ctx.scale(obj.scale ?? 1, obj.scale ?? 1);

      if (obj.type === "text") {
        ctx.font = `${obj.fontSize || 80}px Arial`;
        ctx.fillStyle = obj.color || "black";
        ctx.fillText(obj.value, 0, 0);
      } else if (obj.type === "image") {
        const img = new Image();
        img.src = obj.value;
        img.onload = () => {
          ctx.drawImage(
            img,
            -((obj.width || 300) / 2),
            -((obj.height || 300) / 2),
            obj.width || 300,
            obj.height || 300
          );
          canvasTexture.needsUpdate = true;
        };
      }
      ctx.restore();
    });

    canvasTexture.needsUpdate = true;
  }, [objects, canvasTexture]);

  const addText = () => {
    setObjects([...objects, { type: "text", value: "Hello World", fontSize: 80, scale: 1, rotation: 0 }]);
    setSelectedIndex(objects.length);
  };

  const addImage = () => {
    setObjects([
      ...objects,
      { type: "image", value: "/images/sample-design.png", width: 300, height: 300, scale: 1, rotation: 0 },
    ]);
    setSelectedIndex(objects.length);
  };

  const deleteSelected = () => {
    if (selectedIndex === null) return;
    const newObjects = objects.filter((_, i) => i !== selectedIndex);
    setObjects(newObjects);
    setSelectedIndex(null);
  };

  const updateSelected = (key: "scale" | "rotation" | "color", value: any) => {
    if (selectedIndex === null || !objects[selectedIndex]) return;
    const newObjects = [...objects];
    newObjects[selectedIndex] = { ...newObjects[selectedIndex], [key]: value };
    setObjects(newObjects);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="flex flex-col md:flex-row w-full h-full gap-6 p-6">
        {/* Left Panel */}
        <div className="flex flex-col w-full md:w-1/3 bg-gray-800 rounded-xl shadow-lg p-6 gap-6 h-full">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Design Editor</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={addText}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-500 transition"
            >
              Add Text
            </button>
            <button
              onClick={addImage}
              className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-500 transition"
            >
              Add Image
            </button>
            {selectedIndex !== null && (
              <button
                onClick={deleteSelected}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-500 transition"
              >
                Delete Selected
              </button>
            )}
          </div>

          {selectedIndex !== null && objects[selectedIndex] && (
            <div className="flex flex-col gap-3 mt-6">
              <label className="text-white font-semibold">Scale</label>
              <input
                type="range"
                min={0.1}
                max={5}
                step={0.01}
                value={objects[selectedIndex].scale ?? 1}
                onChange={(e) => updateSelected("scale", parseFloat(e.target.value))}
              />
              <label className="text-white font-semibold">Rotation</label>
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={objects[selectedIndex].rotation ?? 0}
                onChange={(e) => updateSelected("rotation", parseFloat(e.target.value))}
              />
              {objects[selectedIndex].type === "text" && (
                <>
                  <label className="text-white font-semibold">Color</label>
                  <input
                    type="color"
                    value={objects[selectedIndex].color || "#000000"}
                    onChange={(e) => updateSelected("color", e.target.value)}
                    className="w-full h-10 p-1 rounded"
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="flex-1 rounded-xl shadow-lg overflow-hidden border border-gray-700 h-full">
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }} className="w-full h-full">
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 2, 2]} intensity={0.8} />
            <Suspense fallback={null}>
              {canvasTexture && (
                <InteractiveTshirt
                  objects={objects}
                  setObjects={setObjects}
                  texture={canvasTexture}
                  controlsRef={controlsRef}
                  setSelectedIndex={setSelectedIndex}
                />
              )}
            </Suspense>
            <OrbitControls ref={controlsRef} enablePan={false} enableZoom={true} />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default BasicEditor;
