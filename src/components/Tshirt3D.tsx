"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

const TshirtModel = ({ canvasTexture }: { canvasTexture: THREE.CanvasTexture }) => {
  const { scene } = useGLTF("/models/tshirt.glb") as GLTF;

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.map = canvasTexture;
      material.needsUpdate = true;
    }
  });

  scene.position.set(0, -1.5, 0);
  scene.rotation.set(0, Math.PI, 0);

  return <primitive object={scene} />;
};

const InteractiveTshirt = () => {
  const [canvasTexture] = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return new THREE.CanvasTexture(canvas);
  });

  const { camera, gl, scene } = useThree();

  const handleClick = (event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(x, y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const uv = intersect.uv;
      if (uv) {
        const ctx = (canvasTexture.image as HTMLCanvasElement).getContext("2d");
        if (ctx) {
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(
            uv.x * (canvasTexture.image as HTMLCanvasElement).width,
            (1 - uv.y) * (canvasTexture.image as HTMLCanvasElement).height,
            20,
            0,
            2 * Math.PI
          );
          ctx.fill();
          canvasTexture.needsUpdate = true;
        }
      }
    }
  };

  useEffect(() => {
    gl.domElement.addEventListener("click", handleClick);
    return () => {
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, [gl.domElement]);

  return <TshirtModel canvasTexture={canvasTexture} />;
};

const Tshirt3DPaintCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 2, 2]} intensity={0.8} />
      <Suspense fallback={null}>
        <InteractiveTshirt />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={true} />
    </Canvas>
  );
};

export default Tshirt3DPaintCanvas;
