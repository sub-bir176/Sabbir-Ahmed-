import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NODE_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSizeScale;
  uniform vec3 uMouse;
  uniform float uMouseActive;
  uniform vec3 uPulseOrigin;
  uniform float uPulseAge;

  attribute float aSize;
  attribute float aPhase;
  attribute float aBoost;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vEnergy;

  void main() {
    vColor = color;

    vec3 pos = position;
    // Gentle organic floating drift
    pos.x += sin(uTime * 0.45 + aPhase) * 0.45;
    pos.y += cos(uTime * 0.38 + aPhase * 1.3) * 0.32;
    pos.z += sin(uTime * 0.3 + aPhase * 0.7) * 0.35;

    // Mouse proximity influence: dots follow & swirl softly around cursor
    vec2 delta = uMouse.xy - pos.xy;
    float mouseDist = length(delta);
    float mouseMask = smoothstep(38.0, 0.0, mouseDist) * uMouseActive;
    if (mouseDist > 0.001 && mouseMask > 0.001) {
      vec2 dir = delta / mouseDist;
      vec2 perp = vec2(-dir.y, dir.x);
      pos.xy += dir * mouseMask * 3.8 + perp * mouseMask * 1.6;
      pos.z += mouseMask * 2.5;
    }

    // Expanding click ripple wave
    float pulseDist = distance(pos, uPulseOrigin);
    float pulseWave = 0.0;
    if (uPulseAge > 0.0 && uPulseAge < 2.2) {
      float radius = uPulseAge * 44.0;
      pulseWave = exp(-pow((pulseDist - radius) * 0.16, 2.0)) * (1.0 - uPulseAge / 2.2);
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float depthFactor = clamp(92.0 / max(18.0, -mvPosition.z), 0.45, 1.85);

    vEnergy = clamp(aBoost + mouseMask * 0.9 + pulseWave * 1.1, 0.0, 1.5);
    float depthFade = smoothstep(-135.0, -18.0, mvPosition.z);
    vAlpha = clamp(0.42 + depthFade * 0.55 + vEnergy * 0.3, 0.18, 1.0);

    gl_PointSize = aSize * uPixelRatio * uSizeScale * depthFactor * (1.0 + mouseMask * 0.55 + pulseWave * 0.6);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const NODE_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vEnergy;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Crisp luminous pinpoint dot with subtle tight aura (no blurry blobs)
    float dotCore = smoothstep(0.32, 0.1, dist);
    float tightAura = exp(-dist * 9.5) * 0.42;
    float intensity = dotCore + tightAura;

    vec3 finalTint = mix(vColor, vec3(0.84, 0.98, 1.0), dotCore * 0.55 + vEnergy * 0.28);
    gl_FragColor = vec4(finalTint, clamp(intensity * vAlpha, 0.0, 0.98));
  }
`;

const LINE_VERTEX_SHADER = /* glsl */ `
  attribute float aLineAlpha;
  attribute float aProgress;
  attribute float aPulseSeed;

  varying vec3 vColor;
  varying float vLineAlpha;
  varying float vProgress;
  varying float vPulseSeed;
  varying vec3 vWorldPos;

  void main() {
    vColor = color;
    vLineAlpha = aLineAlpha;
    vProgress = aProgress;
    vPulseSeed = aPulseSeed;
    vWorldPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LINE_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uMouseActive;
  uniform vec3 uPulseOrigin;
  uniform float uPulseAge;

  varying vec3 vColor;
  varying float vLineAlpha;
  varying float vProgress;
  varying float vPulseSeed;
  varying vec3 vWorldPos;

  void main() {
    float activeMask = step(0.66, fract(vPulseSeed * 17.13));
    float flow = fract(vProgress - uTime * (0.45 + fract(vPulseSeed * 7.3) * 0.45) + vPulseSeed * 5.0);
    float packet = pow(max(0.0, 1.0 - abs(flow - 0.5) * 6.5), 3.0) * activeMask;

    float mouseProximity = smoothstep(28.0, 0.0, distance(vWorldPos.xy, uMouse.xy)) * uMouseActive;

    float pulseWave = 0.0;
    if (uPulseAge > 0.0 && uPulseAge < 2.2) {
      float radius = uPulseAge * 44.0;
      pulseWave = exp(-pow((distance(vWorldPos, uPulseOrigin) - radius) * 0.16, 2.0)) * (1.0 - uPulseAge / 2.2);
    }

    vec3 finalColor = mix(vColor, vec3(0.65, 0.96, 1.0), packet * 0.8 + mouseProximity * 0.5 + pulseWave * 0.75);
    float alpha = vLineAlpha * (0.22 + packet * 0.52 + mouseProximity * 0.42 + pulseWave * 0.6);

    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.82));
  }
`;

const DOT_PALETTE = [
  new THREE.Color('#22D3EE'), // Cyan
  new THREE.Color('#3B82F6'), // Electric Blue
  new THREE.Color('#2DD4BF'), // Turquoise
  new THREE.Color('#7DD3FC'), // Soft Ice Cyan
  new THREE.Color('#E0F2FE'), // Crisp Starlight White-Blue
];

// Reusable math helpers outside the animation loop (zero GC)
const _mouseTarget = new THREE.Vector3(0, 0, 0);
const _mouseSmoothed = new THREE.Vector3(0, 0, 0);
const _pulseOrigin = new THREE.Vector3(0, 0, 0);

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function PlexusCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const initialRect = container.getBoundingClientRect();
    const initialWidth = Math.max(
      1,
      Math.ceil(initialRect.width || container.clientWidth || window.innerWidth)
    );
    const initialHeight = Math.max(
      1,
      Math.ceil(initialRect.height || container.clientHeight || 90)
    );
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

    const scene = new THREE.Scene();

    // Proportional FOV & camera distance so 72–90px ribbon keeps a natural 1:1 uncompressed ratio
    const camera = new THREE.PerspectiveCamera(
      34,
      initialWidth / Math.max(1, initialHeight),
      0.5,
      300
    );
    camera.position.set(0, 0, 52);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.setClearColor(0x05070d, 0);

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.maxWidth = 'none';
    canvas.style.outline = 'none';
    canvas.style.border = 'none';
    canvas.style.background = 'transparent';
    container.appendChild(canvas);

    // High-density crisp dot budget + subtle interactive constellation nodes
    const ambientCount = isMobile ? 1100 : isTablet ? 2000 : 3200;
    const nodeCount = isMobile ? 110 : isTablet ? 185 : 260;
    const maxConnections = isMobile ? 450 : 950;

    // Height-matched 3D bounding box directly tied to frustum aspect so dots never look squished or compressed
    const frustumHalfHeight =
      Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z;
    const frustumHalfWidth = frustumHalfHeight * camera.aspect;
    let spreadX = Math.max(60, frustumHalfWidth * 2.1);
    let spreadY = Math.max(14, frustumHalfHeight * 1.9);
    const spreadZ = 24;
    let maxConnectDistance = isMobile
      ? 10.5
      : Math.min(18, Math.max(11, Math.sqrt((spreadX * spreadY) / nodeCount) * 1.18));
    let maxConnectDistSq = maxConnectDistance * maxConnectDistance;

    // 1. High-density Floating Stardust Dots Layer (GPU-animated)
    const ambientGeo = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientColors = new Float32Array(ambientCount * 3);
    const ambientSizes = new Float32Array(ambientCount);
    const ambientPhases = new Float32Array(ambientCount);
    const ambientBoosts = new Float32Array(ambientCount);

    for (let i = 0; i < ambientCount; i++) {
      const i3 = i * 3;
      ambientPositions[i3] = (Math.random() - 0.5) * spreadX * 1.15;
      ambientPositions[i3 + 1] = (Math.random() - 0.5) * spreadY * 1.15;
      ambientPositions[i3 + 2] = -Math.random() * 68 + 10;

      const c = DOT_PALETTE[i % DOT_PALETTE.length];
      ambientColors[i3] = c.r;
      ambientColors[i3 + 1] = c.g;
      ambientColors[i3 + 2] = c.b;

      // Crisp pinpoint sizing with gentle variation
      ambientSizes[i] = 1.6 + Math.pow(Math.random(), 1.6) * 2.8;
      ambientPhases[i] = Math.random() * Math.PI * 2;
      ambientBoosts[i] = Math.random() * 0.12;
    }

    const ambientPosAttr = new THREE.BufferAttribute(ambientPositions, 3);
    const ambientColAttr = new THREE.BufferAttribute(ambientColors, 3);
    ambientGeo.setAttribute('position', ambientPosAttr);
    ambientGeo.setAttribute('color', ambientColAttr);
    ambientGeo.setAttribute('aSize', new THREE.BufferAttribute(ambientSizes, 1));
    ambientGeo.setAttribute(
      'aPhase',
      new THREE.BufferAttribute(ambientPhases, 1)
    );
    ambientGeo.setAttribute(
      'aBoost',
      new THREE.BufferAttribute(ambientBoosts, 1)
    );

    const sharedUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSizeScale: { value: THREE.MathUtils.clamp(initialHeight / 92, 0.78, 1.15) },
      uMouse: { value: _mouseSmoothed },
      uMouseActive: { value: 0 },
      uPulseOrigin: { value: _pulseOrigin },
      uPulseAge: { value: 10 },
    };

    const ambientMat = new THREE.ShaderMaterial({
      uniforms: sharedUniforms,
      vertexShader: NODE_VERTEX_SHADER,
      fragmentShader: NODE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const ambientPoints = new THREE.Points(ambientGeo, ambientMat);
    ambientPoints.frustumCulled = false;
    scene.add(ambientPoints);

    // 2. Interactive Constellation Hero Dots
    const nodeGeo = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeVelocities = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const nodeSizes = new Float32Array(nodeCount);
    const nodePhases = new Float32Array(nodeCount);
    const nodeBoosts = new Float32Array(nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3;
      nodePositions[i3] = (Math.random() - 0.5) * spreadX;
      nodePositions[i3 + 1] = (Math.random() - 0.5) * spreadY;
      nodePositions[i3 + 2] = (Math.random() - 0.5) * spreadZ;

      nodeVelocities[i3] = (Math.random() - 0.5) * 3.2;
      nodeVelocities[i3 + 1] = (Math.random() - 0.5) * 1.4;
      nodeVelocities[i3 + 2] = (Math.random() - 0.5) * 1.4;

      const c = DOT_PALETTE[i % DOT_PALETTE.length];
      nodeColors[i3] = c.r;
      nodeColors[i3 + 1] = c.g;
      nodeColors[i3 + 2] = c.b;

      nodeSizes[i] = 2.8 + Math.random() * 2.8;
      nodePhases[i] = Math.random() * Math.PI * 2;
      nodeBoosts[i] = 0.22;
    }

    const nodePosAttr = new THREE.BufferAttribute(nodePositions, 3);
    nodePosAttr.setUsage(THREE.DynamicDrawUsage);
    const nodeColAttr = new THREE.BufferAttribute(nodeColors, 3);
    const nodeBoostAttr = new THREE.BufferAttribute(nodeBoosts, 1);
    nodeBoostAttr.setUsage(THREE.DynamicDrawUsage);

    nodeGeo.setAttribute('position', nodePosAttr);
    nodeGeo.setAttribute('color', nodeColAttr);
    nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(nodeSizes, 1));
    nodeGeo.setAttribute('aPhase', new THREE.BufferAttribute(nodePhases, 1));
    nodeGeo.setAttribute('aBoost', nodeBoostAttr);

    const nodeMat = new THREE.ShaderMaterial({
      uniforms: sharedUniforms,
      vertexShader: NODE_VERTEX_SHADER,
      fragmentShader: NODE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const coreNodes = new THREE.Points(nodeGeo, nodeMat);
    coreNodes.frustumCulled = false;
    scene.add(coreNodes);

    // 3. Delicate Connecting Lines BufferGeometry
    const maxLineVertices = maxConnections * 2;
    const linePositions = new Float32Array(maxLineVertices * 3);
    const lineColors = new Float32Array(maxLineVertices * 3);
    const lineAlphas = new Float32Array(maxLineVertices);
    const lineProgress = new Float32Array(maxLineVertices);
    const lineSeeds = new Float32Array(maxLineVertices);

    const lineGeo = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePositions, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    const lineColAttr = new THREE.BufferAttribute(lineColors, 3);
    lineColAttr.setUsage(THREE.DynamicDrawUsage);
    const lineAlphaAttr = new THREE.BufferAttribute(lineAlphas, 1);
    lineAlphaAttr.setUsage(THREE.DynamicDrawUsage);
    const lineProgAttr = new THREE.BufferAttribute(lineProgress, 1);
    lineProgAttr.setUsage(THREE.DynamicDrawUsage);
    const lineSeedAttr = new THREE.BufferAttribute(lineSeeds, 1);
    lineSeedAttr.setUsage(THREE.DynamicDrawUsage);

    lineGeo.setAttribute('position', linePosAttr);
    lineGeo.setAttribute('color', lineColAttr);
    lineGeo.setAttribute('aLineAlpha', lineAlphaAttr);
    lineGeo.setAttribute('aProgress', lineProgAttr);
    lineGeo.setAttribute('aPulseSeed', lineSeedAttr);
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.ShaderMaterial({
      uniforms: sharedUniforms,
      vertexShader: LINE_VERTEX_SHADER,
      fragmentShader: LINE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    lineSegments.frustumCulled = false;
    scene.add(lineSegments);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer & Resize Interaction
    let pointerActive = false;
    let pointerNdcX = 0;
    let pointerNdcY = 0;
    let mouseActiveSmooth = 0;
    let pulseAge = 10;

    const projectPointerToWorld = (ndcX: number, ndcY: number) => {
      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      const halfHeight = Math.tan(fovRad / 2) * camera.position.z;
      const halfWidth = halfHeight * camera.aspect;
      _mouseTarget.set(ndcX * halfWidth, ndcY * halfHeight, 0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // Respond both inside the canvas AND across the hero region above / just below
      const withinInteractiveBand =
        event.clientY >= 0 && event.clientY <= rect.bottom + 260;

      if (!withinInteractiveBand) {
        pointerActive = false;
        return;
      }

      const rawNdcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const rawNdcY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointerNdcX = THREE.MathUtils.clamp(rawNdcX, -1.15, 1.15);
      pointerNdcY = THREE.MathUtils.clamp(rawNdcY, -1.45, 1.45);
      pointerActive = true;
      projectPointerToWorld(pointerNdcX, pointerNdcY);
    };

    const handlePointerLeave = () => {
      pointerActive = false;
    };

    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      projectPointerToWorld(ndcX, ndcY);
      _pulseOrigin.copy(_mouseTarget);
      pulseAge = 0.01;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    container.addEventListener('click', handleClick);

    let halfX = spreadX * 0.5;
    let halfY = spreadY * 0.5;
    const halfZ = spreadZ * 0.5;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.ceil(rect.width || container.clientWidth || window.innerWidth));
      const h = Math.max(1, Math.ceil(rect.height || container.clientHeight || 90));
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      sharedUniforms.uSizeScale.value = THREE.MathUtils.clamp(h / 92, 0.78, 1.15);

      // Recompute horizontal/vertical spread proportionally to actual canvas width & height
      const nextHalfH =
        Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z;
      const nextHalfW = nextHalfH * camera.aspect;
      const nextSpreadX = Math.max(60, nextHalfW * 2.1);
      const nextSpreadY = Math.max(14, nextHalfH * 1.9);
      const scaleX = nextSpreadX / spreadX;
      const scaleY = nextSpreadY / spreadY;

      if (Math.abs(scaleX - 1) > 0.03 || Math.abs(scaleY - 1) > 0.03) {
        for (let i = 0; i < nodeCount; i++) {
          const i3 = i * 3;
          nodePositions[i3] *= scaleX;
          nodePositions[i3 + 1] *= scaleY;
        }
        for (let i = 0; i < ambientCount; i++) {
          const i3 = i * 3;
          ambientPositions[i3] *= scaleX;
          ambientPositions[i3 + 1] *= scaleY;
        }
        spreadX = nextSpreadX;
        spreadY = nextSpreadY;
        halfX = spreadX * 0.5;
        halfY = spreadY * 0.5;
        maxConnectDistance = isMobile
          ? 10.5
          : Math.min(18, Math.max(11, Math.sqrt((spreadX * spreadY) / nodeCount) * 1.18));
        maxConnectDistSq = maxConnectDistance * maxConnectDistance;
        nodePosAttr.needsUpdate = true;
        ambientPosAttr.needsUpdate = true;
      }

      const pxRatio = isSoftwareGl
        ? 1
        : Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pxRatio);
      sharedUniforms.uPixelRatio.value = pxRatio;
      renderer.setSize(w, h, false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // Simulation & Render Loop
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const tick = () => {
      if (disposed) return;

      const rawDelta = Math.min(clock.getDelta(), 0.05);
      const dt = prefersReducedMotion ? rawDelta * 0.2 : rawDelta;
      const elapsed = clock.elapsedTime;
      sharedUniforms.uTime.value = elapsed;

      if (pulseAge < 2.2) {
        pulseAge += dt * 1.15;
      }
      sharedUniforms.uPulseAge.value = pulseAge;

      mouseActiveSmooth = THREE.MathUtils.damp(
        mouseActiveSmooth,
        pointerActive ? 1 : 0,
        6,
        rawDelta
      );
      sharedUniforms.uMouseActive.value = mouseActiveSmooth;

      _mouseSmoothed.x = THREE.MathUtils.damp(
        _mouseSmoothed.x,
        _mouseTarget.x,
        10,
        rawDelta
      );
      _mouseSmoothed.y = THREE.MathUtils.damp(
        _mouseSmoothed.y,
        _mouseTarget.y,
        10,
        rawDelta
      );

      // Subtle depth parallax on camera
      const targetCamX = pointerActive
        ? pointerNdcX * 6.0
        : Math.sin(elapsed * 0.18) * 1.8;
      const targetCamY = pointerActive
        ? THREE.MathUtils.clamp(pointerNdcY, -1.1, 1.1) * 3.0
        : Math.cos(elapsed * 0.14) * 1.2;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 3.8, rawDelta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 3.8, rawDelta);
      camera.lookAt(0, 0, 0);

      // Update core node positions with smooth drift, wave motion & responsive cursor attraction + orbital swirl
      const cursorFollowRadius = 56;
      const cursorFollowRadiusSq = cursorFollowRadius * cursorFollowRadius;

      for (let i = 0; i < nodeCount; i++) {
        const i3 = i * 3;
        let x = nodePositions[i3] + nodeVelocities[i3] * dt;
        let y = nodePositions[i3 + 1] + nodeVelocities[i3 + 1] * dt;
        let z = nodePositions[i3 + 2] + nodeVelocities[i3 + 2] * dt;

        // Gentle organic boundary bounce
        if (x > halfX || x < -halfX) {
          nodeVelocities[i3] *= -1;
          x = THREE.MathUtils.clamp(x, -halfX, halfX);
        }
        if (y > halfY || y < -halfY) {
          nodeVelocities[i3 + 1] *= -1;
          y = THREE.MathUtils.clamp(y, -halfY, halfY);
        }
        if (z > halfZ || z < -halfZ) {
          nodeVelocities[i3 + 2] *= -1;
          z = THREE.MathUtils.clamp(z, -halfZ, halfZ);
        }

        // Responsive magnetic follow + gentle orbital swirl when pointer is active
        let boost = 0.15;
        if (mouseActiveSmooth > 0.02) {
          const dx = _mouseSmoothed.x - x;
          const dy = _mouseSmoothed.y - y;
          const distSq2D = dx * dx + dy * dy;
          if (distSq2D < cursorFollowRadiusSq && distSq2D > 1.2) {
            const dist = Math.sqrt(distSq2D);
            const influence = (1 - dist / cursorFollowRadius) * mouseActiveSmooth;
            const nx = dx / dist;
            const ny = dy / dist;
            // Pull softly toward cursor + tangential swirl so particles orbit rather than collapse
            x += (nx * 20.0 - ny * 9.5) * influence * dt;
            y += (ny * 20.0 + nx * 9.5) * influence * dt;
            boost += influence * 1.1;
          }
        }

        nodePositions[i3] = x;
        nodePositions[i3 + 1] = y;
        nodePositions[i3 + 2] = z;
        nodeBoosts[i] = boost;
      }

      nodePosAttr.needsUpdate = true;
      nodeBoostAttr.needsUpdate = true;

      // Build dynamic plexus connecting lines
      let vertexIndex = 0;
      let connectionCount = 0;

      for (let i = 0; i < nodeCount; i++) {
        if (connectionCount >= maxConnections) break;
        const i3 = i * 3;
        const x1 = nodePositions[i3];
        const y1 = nodePositions[i3 + 1];
        const z1 = nodePositions[i3 + 2];

        for (let j = i + 1; j < nodeCount; j++) {
          const j3 = j * 3;
          const dx = x1 - nodePositions[j3];
          const dy = y1 - nodePositions[j3 + 1];
          const dz = z1 - nodePositions[j3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxConnectDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = Math.pow(1 - dist / maxConnectDistance, 1.35);
            const seed = ((i * 73 + j * 139) % 997) / 997;

            const vPos = vertexIndex * 3;
            linePositions[vPos] = x1;
            linePositions[vPos + 1] = y1;
            linePositions[vPos + 2] = z1;
            linePositions[vPos + 3] = nodePositions[j3];
            linePositions[vPos + 4] = nodePositions[j3 + 1];
            linePositions[vPos + 5] = nodePositions[j3 + 2];

            lineColors[vPos] = nodeColors[i3];
            lineColors[vPos + 1] = nodeColors[i3 + 1];
            lineColors[vPos + 2] = nodeColors[i3 + 2];
            lineColors[vPos + 3] = nodeColors[j3];
            lineColors[vPos + 4] = nodeColors[j3 + 1];
            lineColors[vPos + 5] = nodeColors[j3 + 2];

            lineAlphas[vertexIndex] = alpha;
            lineAlphas[vertexIndex + 1] = alpha;

            lineProgress[vertexIndex] = 0;
            lineProgress[vertexIndex + 1] = 1;

            lineSeeds[vertexIndex] = seed;
            lineSeeds[vertexIndex + 1] = seed;

            vertexIndex += 2;
            connectionCount++;
            if (connectionCount >= maxConnections) break;
          }
        }
      }

      // Dynamic cursor-to-node constellation links reaching softly toward the moving cursor
      if (mouseActiveSmooth > 0.05 && connectionCount < maxConnections) {
        const cursorConnectRadius = 32;
        const cursorConnectRadiusSq = cursorConnectRadius * cursorConnectRadius;
        const cursorCol = DOT_PALETTE[0];
        let cursorLinks = 0;

        for (let i = 0; i < nodeCount; i++) {
          if (connectionCount >= maxConnections || cursorLinks >= 18) break;
          const i3 = i * 3;
          const nx = nodePositions[i3];
          const ny = nodePositions[i3 + 1];
          const nz = nodePositions[i3 + 2];
          const dx = _mouseSmoothed.x - nx;
          const dy = _mouseSmoothed.y - ny;
          const distSq2D = dx * dx + dy * dy;

          if (distSq2D < cursorConnectRadiusSq) {
            const dist = Math.sqrt(distSq2D);
            const alpha =
              Math.pow(1 - dist / cursorConnectRadius, 1.3) *
              mouseActiveSmooth *
              0.75;
            const vPos = vertexIndex * 3;
            linePositions[vPos] = nx;
            linePositions[vPos + 1] = ny;
            linePositions[vPos + 2] = nz;
            linePositions[vPos + 3] = _mouseSmoothed.x;
            linePositions[vPos + 4] = _mouseSmoothed.y;
            linePositions[vPos + 5] = 2;

            lineColors[vPos] = nodeColors[i3];
            lineColors[vPos + 1] = nodeColors[i3 + 1];
            lineColors[vPos + 2] = nodeColors[i3 + 2];
            lineColors[vPos + 3] = cursorCol.r;
            lineColors[vPos + 4] = cursorCol.g;
            lineColors[vPos + 5] = cursorCol.b;

            lineAlphas[vertexIndex] = alpha;
            lineAlphas[vertexIndex + 1] = alpha;

            lineProgress[vertexIndex] = 0;
            lineProgress[vertexIndex + 1] = 1;

            lineSeeds[vertexIndex] = (i * 0.13) % 1;
            lineSeeds[vertexIndex + 1] = (i * 0.13) % 1;

            vertexIndex += 2;
            connectionCount++;
            cursorLinks++;
          }
        }
      }

      lineGeo.setDrawRange(0, vertexIndex);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;
      lineAlphaAttr.needsUpdate = true;
      lineProgAttr.needsUpdate = true;
      lineSeedAttr.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);

      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();

      ambientGeo.dispose();
      ambientMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full overflow-hidden border-0"
      aria-hidden="true"
    />
  );
}
