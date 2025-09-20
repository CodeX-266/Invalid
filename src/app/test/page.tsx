"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const TshirtModel = ({ texture }: { texture?: string }) => {
  const { scene, materials } = useGLTF("/models/tshirt.glb") as any;

  if (texture) {
    materials.TshirtMaterial.map = new THREE.TextureLoader().load(texture);
    materials.TshirtMaterial.needsUpdate = true;
  }

  return <primitive object={scene} />;
};

const Tshirt3D = ({ texture }: { texture?: string }) => {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 2, 2]} intensity={0.8} />
      <Suspense fallback={null}>
        <TshirtModel texture={texture} />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={true} />
    </Canvas>
  );
};

export default Tshirt3D;
