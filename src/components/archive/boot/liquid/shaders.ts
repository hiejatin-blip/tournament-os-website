export const commonNoise = /* glsl */ `
// This block is shared by vertex and fragment stages. Keep derivative-only
// helpers out of it: fwidth is fragment-stage functionality in WebGL1.
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// Standard 5-octave fbm with a strict 0.5 persistence — keeps high-frequency
// octaves subordinate to the base so they cannot dominate and shimmer.
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = turn * p * 2.03 + 13.4;
    amplitude *= 0.5;
  }
  return value;
}

// A softer 4-octave variant for cases where the sampling grid is close to
// screen pixel size — fewer, smoother octaves reduce per-pixel variance.
float fbmSoft(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = turn * p * 1.92 + 9.7;
    amplitude *= 0.5;
  }
  return value;
}

`;

export const waterVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uDepth;
uniform float uClarity;
uniform float uWarmth;
uniform float uBreach;
uniform float uChop;
uniform float uOccluder;
uniform float uStreak;
uniform vec2 uResolution;
varying vec2 vUv;
varying float vWave;
varying vec3 vWorld;
${commonNoise}

void main() {
  vUv = uv;
  vec3 p = position;
  // Vertex-scale octaves — kept relatively low frequency because they drive
  // real geometry displacement (further filtered by tessellation).
  float slow = fbm(p.xy * 0.16 + vec2(uTime * 0.045, -uTime * 0.028));
  float chop = fbm(p.xy * 0.48 + vec2(-uTime * 0.14, uTime * 0.10));
  float fine = fbm(p.xy * 1.05 + vec2(uTime * 0.22, uTime * 0.16));
  // Broader low-frequency displacement gives the surface real weight while
  // retaining the deliberately safe, low-detail sampling used to prevent shimmer.
  float wave = (slow - 0.5) * 1.85 + (chop - 0.5) * uChop * 1.6 + (fine - 0.5) * uChop * 0.3;

  // ---- Massive overhead canopy ----
  // Curves the water plane into a huge hemisphere so the viewer feels *under*
  // the surface instead of simply looking at it. The curvature blends in with
  // uClarity (as the camera rises) so Phase 1 still reads as a flat ceiling
  // of water before the dome fully asserts itself.
  float canopyAmount = smoothstep(0.18, 0.55, 1.0 - uDepth);
  vec2 canopyCoord = (uv - 0.5) * 2.0;
  float canopyRadius = length(canopyCoord);
  float canopyHeight = sqrt(max(0.0, 1.0 - canopyRadius * canopyRadius * 0.82)) * 5.2;
  p.z += canopyHeight * canopyAmount;

  // ---- Pre-breach bulge ----
  // A slow downward pull toward the camera immediately before the breach —
  // the surface bulges like a blister about to pop, so the impact feels
  // inevitable rather than instant. Peaking around progress 0.68.
  float bulgeRise = smoothstep(0.58, 0.69, uProgress);
  float bulgeFade = 1.0 - smoothstep(0.69, 0.74, uProgress);
  float bulge = bulgeRise * bulgeFade * exp(-dot(canopyCoord, canopyCoord) * 1.8) * 2.6;
  p.z -= bulge;

  // The breach tears the surface open around the optical center.
  float d = length((uv - vec2(0.5)) * vec2(1.45, 1.0));
  float tear = exp(-d * d * 42.0) * uBreach;
  p.z += wave + tear * 2.7;
  p.xy += normalize((uv - 0.5) + 0.0001) * tear * 1.5;
  vWave = wave;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const waterFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uDepth;
uniform float uClarity;
uniform float uWarmth;
uniform float uBreach;
uniform float uChop;
uniform float uOccluder;
uniform float uStreak;
uniform vec2 uResolution;
varying vec2 vUv;
varying float vWave;
varying vec3 vWorld;
${commonNoise}

void main() {
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 centered = (vUv - 0.5) * aspect;

  // ---- Refraction warp (low-frequency, no per-pixel detail) ----
  float n1 = fbmSoft(vUv * 2.4 + vec2(uTime * 0.055, -uTime * 0.04));
  float n2 = fbmSoft(vUv * 3.6 + vec2(-uTime * 0.07, uTime * 0.06));
  vec2 refractUv = vUv + vec2(n1 - 0.5, n2 - 0.5) * (0.09 * (1.0 - uClarity));

  // ---- Pre-breach glow ----
  // The canopy surface itself brightens just before breaking — the viewer
  // reads it as water becoming translucent as light punches through.
  float bulgeRiseF = smoothstep(0.58, 0.69, uProgress);
  float bulgeFadeF = 1.0 - smoothstep(0.69, 0.74, uProgress);
  float bulgeGlow = bulgeRiseF * bulgeFadeF * exp(-dot(centered, centered) * 6.0);

  // ---- Caustic lattice ----
  // Frequencies dropped from 12/19 to 3.4/4.8 so cells sit safely above
  // pixel size, and the ridge threshold uses fwidth-based anti-aliasing
  // instead of a hard pow() — this is what removes the static/shimmer.
  float latticeA = fbmSoft(refractUv * 3.4 + uTime * 0.09);
  float latticeB = fbmSoft(refractUv.yx * 4.8 - uTime * 0.11);
  float diff = abs(latticeA - latticeB);
  float w = max(fwidth(diff) * 1.8, 0.006);
  float ridge = 1.0 - smoothstep(0.04, 0.04 + 0.09 + w, diff);
  // Second, softer band widens the caustic look without adding new frequency.
  float halo = 1.0 - smoothstep(0.11, 0.28 + w, diff);
  float caustic = ridge * 0.85 + halo * 0.25;
  caustic *= mix(0.25, 1.15, uClarity) * mix(0.4, 1.0, uDepth);

  // ---- Base colour palette across all four phases ----
  vec3 deep = vec3(0.008, 0.025, 0.11);
  vec3 midWater = vec3(0.018, 0.15, 0.34);
  vec3 clearTeal = vec3(0.09, 0.58, 0.84);
  vec3 surfaceLight = vec3(0.72, 0.93, 1.0);
  vec3 resting = vec3(0.9176, 0.9647, 1.0);
  vec3 base = mix(deep, midWater, smoothstep(0.05, 0.45, uWarmth));
  base = mix(base, clearTeal, smoothstep(0.38, 0.72, uWarmth) * (1.0 - uBreach));
  base = mix(base, resting, smoothstep(0.78, 1.0, uClarity));

  float fresnel = pow(1.0 - clamp(abs(vWave) * 0.55, 0.0, 1.0), 2.0);
  vec3 color = base + surfaceLight * caustic * (0.38 + fresnel * 0.62);
  // A slow blue subsurface pulse adds depth and energy without introducing
  // high-frequency detail that would reintroduce surface shimmer.
  float bluePulse = 0.5 + 0.5 * sin(uTime * 0.32 + n2 * 4.0);
  color += vec3(0.02, 0.12, 0.34) * bluePulse * uDepth * (0.12 + uChop * 0.16);
  float afterGlow = smoothstep(0.62, 0.98, uClarity) * (0.55 + 0.45 * n1);
  color += mix(vec3(0.02, 0.16, 0.19), vec3(0.85, 0.95, 1.0), uWarmth) * afterGlow * 0.26;

  // Pre-breach translucency — surface bleeds light before breaking.
  color += vec3(0.52, 0.88, 1.0) * bulgeGlow * 0.55;

  // ---- Shockwave ring at the breach ----
  // An expanding ring of light radiating from the tear point — gives the
  // moment physical direction and weight, not just brightness.
  float ringRadius = uBreach * 1.6;
  float ringDist = length(centered);
  float ringWidth = 0.08 + uBreach * 0.08;
  float ring = exp(-pow((ringDist - ringRadius) / ringWidth, 2.0)) * uBreach;
  color += vec3(0.78, 0.94, 1.0) * ring * 0.55;

  // Occluder shadow — soft, low frequency.
  vec2 occCenter = vec2(mix(-0.25, 1.25, smoothstep(0.40, 0.55, uProgress)), 0.55);
  float occShadow = exp(-length((vUv - occCenter) * vec2(1.15, 1.8)) * 4.2) * uOccluder;
  color *= 1.0 - occShadow * 0.68;

  // Breach flash + optional streak brightening at the peak.
  float breachCore = exp(-dot(centered, centered) * 13.0) * uBreach;
  vec3 flash = mix(vec3(1.0), vec3(1.0, 0.957, 0.878), smoothstep(0.35, 0.0, uBreach));
  color = mix(color, flash, clamp(uBreach * 0.95 + breachCore * 1.2, 0.0, 1.0));
  color += vec3(1.0, 0.973, 0.925) * uStreak * exp(-abs(centered.y) * 140.0) * 0.5;

  float alpha = mix(0.92, 0.12, smoothstep(0.78, 1.0, uProgress));
  alpha = max(alpha, uBreach * 0.9);
  gl_FragColor = vec4(color, alpha);
}
`;

export const rayVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const rayFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uDepth;
uniform float uClarity;
uniform float uWarmth;
uniform float uBreach;
uniform float uChop;
uniform float uOccluder;
uniform float uStreak;
uniform vec2 uResolution;
varying vec2 vUv;
${commonNoise}
void main() {
  vec2 p = vUv - 0.5;
  // Lowered frequency (7.0 -> 2.8) — shimmer here is very visible because
  // rays are wide, low-contrast, and any noise flicker reads immediately.
  float shimmer = fbmSoft(vec2(p.x * 2.8 + uTime * 0.06, p.y * 1.2 - uTime * 0.035));
  float wobble = (shimmer - 0.5) * 0.22;
  // Soft edges via fwidth so the shafts stay clean at any resolution.
  float axis1 = abs(p.x + p.y * 0.16 + wobble);
  float axis2 = abs(p.x - 0.25 + p.y * 0.12 - wobble * 0.75);
  float w1 = max(fwidth(axis1), 0.002);
  float w2 = max(fwidth(axis2), 0.002);
  float shaft = (1.0 - smoothstep(0.02, 0.32 + w1, axis1)) * 0.85;
  shaft += (1.0 - smoothstep(0.02, 0.22 + w2, axis2)) * 0.55;
  float approach = smoothstep(0.16, 0.72, uProgress) * (1.0 - smoothstep(0.82, 1.0, uProgress));
  float occlusion = 1.0 - uOccluder * exp(-length((vUv - vec2(0.52, 0.5)) * vec2(1.0, 1.8)) * 3.0) * 0.88;
  vec3 cool = vec3(0.15, 0.66, 0.78);
  vec3 hot = vec3(1.0, 0.96, 0.86);
  vec3 color = mix(cool, hot, uWarmth) * shaft * approach * occlusion;
  gl_FragColor = vec4(color, shaft * approach * occlusion * 0.32);
}
`;

export const occluderVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uDepth;
uniform float uClarity;
uniform float uWarmth;
uniform float uBreach;
uniform float uChop;
uniform float uOccluder;
uniform float uStreak;
uniform vec2 uResolution;
varying vec2 vUv;
${commonNoise}
void main() {
  vUv = uv;
  vec3 p = position;
  // Lower frequency (1.1) so the silhouette breathes rather than vibrates.
  float edge = noise(p.xy * 1.1 + uTime * 0.02);
  p.xy *= 1.0 + (edge - 0.5) * 0.14;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const occluderFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uDepth;
uniform float uClarity;
uniform float uWarmth;
uniform float uBreach;
uniform float uChop;
uniform float uOccluder;
uniform float uStreak;
uniform vec2 uResolution;
varying vec2 vUv;
${commonNoise}
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float wobble = fbmSoft(p * 1.35 + vec2(uTime * 0.02, -uTime * 0.014));
  float d = length(p * vec2(0.76, 1.25)) + (wobble - 0.5) * 0.3;
  float body = 1.0 - smoothstep(0.70, 1.02, d);
  float rim = smoothstep(0.66, 0.82, d) * (1.0 - smoothstep(0.82, 1.02, d));
  vec3 color = vec3(0.008, 0.016, 0.039) + vec3(0.02, 0.13, 0.19) * rim;
  gl_FragColor = vec4(color, body * uOccluder * 0.94);
}
`;

export const streakFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uDepth;
uniform float uClarity;
uniform float uWarmth;
uniform float uBreach;
uniform float uChop;
uniform float uOccluder;
uniform float uStreak;
uniform vec2 uResolution;
varying vec2 vUv;
${commonNoise}
void main() {
  vec2 p = vUv - 0.5;
  float line = exp(-abs(p.y) * 105.0);
  float taper = pow(max(0.0, 1.0 - abs(p.x) * 1.78), 1.8);
  float glint = exp(-length(p * vec2(7.0, 1.5)) * 2.0);
  float energy = (line * taper + glint * 0.24) * uStreak;
  gl_FragColor = vec4(vec3(1.0, 0.973, 0.925) * energy, energy);
}
`;

export const particleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uDepth;
uniform float uClarity;
uniform float uWarmth;
uniform float uBreach;
uniform float uChop;
uniform float uOccluder;
uniform float uStreak;
uniform vec2 uResolution;
uniform float uSize;
uniform float uSpeed;
attribute float aPhase;
varying float vAlpha;
void main() {
  vec3 p = position;
  float held = 1.0 - smoothstep(0.60, 0.63, uProgress) * (1.0 - smoothstep(0.67, 0.70, uProgress));
  float release = 1.0 + smoothstep(0.68, 0.72, uProgress) * 2.1;
  float speedShape = mix(0.14, 1.0, held) * release;
  p.y = mod(p.y + uTime * uSpeed * speedShape + aPhase * 9.0 + 7.0, 14.0) - 7.0;
  p.x += sin(uTime * 0.32 + aPhase * 11.0) * uSpeed * 0.32;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (55.0 / max(1.0, -mv.z));
  vAlpha = (1.0 - smoothstep(0.76, 0.97, uProgress)) * mix(0.38, 1.0, uClarity);
}
`;

export const particleFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uDepth;
uniform float uClarity;
uniform float uWarmth;
uniform float uBreach;
uniform float uChop;
uniform float uOccluder;
uniform float uStreak;
uniform vec2 uResolution;
varying float vAlpha;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float aa = max(fwidth(d) * 1.75, 0.0025);
  float outer = 1.0 - smoothstep(0.49 - aa, 0.5 + aa, d);
  float innerFade = smoothstep(0.19 - aa, 0.31 + aa, d);
  float shell = outer * innerFade;
  float core = exp(-d * 8.2) * 0.18;
  float alpha = clamp((shell * 0.92 + core) * vAlpha, 0.0, 1.0);
  vec3 color = mix(vec3(0.45, 0.82, 0.9), vec3(0.85, 0.957, 1.0), uWarmth);
  // Premultiplied output prevents the transparent black framebuffer from
  // bleeding into soft bubble edges during postprocessing/compositing.
  gl_FragColor = vec4(color * alpha, alpha);
}
`;

export const sprayVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uBreach;
uniform float uSize;
attribute vec3 aVelocity;
attribute float aPhase;
varying float vAlpha;
void main() {
  float age = clamp((uProgress - 0.735) / 0.075 - aPhase * 0.14, 0.0, 1.0);
  vec3 p = position + aVelocity * age * 4.0;
  p.y -= age * age * 3.4;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (40.0 / max(1.0, -mv.z));
  vAlpha = sin(age * 3.14159) * (1.0 - age) * 2.0;
}
`;

export const sprayFragmentShader = /* glsl */ `
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float aa = max(fwidth(d) * 1.75, 0.0025);
  float a = (1.0 - smoothstep(0.48 - aa, 0.5 + aa, d)) * vAlpha;
  a = clamp(a, 0.0, 1.0);
  vec3 color = vec3(0.847, 0.957, 1.0);
  gl_FragColor = vec4(color * a, a);
}
`;

// ---------------------------------------------------------------------------
// Environmental object shaders (Part 2)
// ---------------------------------------------------------------------------

// Sediment / particulate cluster — small displaced geometry with soft
// caustic-tinted lighting and rim glow. Deliberately low sampling
// frequencies to avoid reintroducing the Part 1 aliasing on nearby surfaces.
export const sedimentVertexShader = /* glsl */ `
uniform float uTime;
uniform float uClarity;
attribute float aSeed;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vSeed;
${commonNoise}
void main() {
  vSeed = aSeed;
  vec3 p = position;
  float wobble = fbmSoft(p.xy * 0.9 + aSeed * 4.0 + uTime * 0.05);
  p += normal * (wobble - 0.5) * 0.12;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vec4 mv = viewMatrix * world;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

export const sedimentFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uClarity;
uniform float uWarmth;
uniform float uProgress;
uniform vec3 uLightDir;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vSeed;
${commonNoise}
void main() {
  vec3 n = normalize(vNormal);
  vec3 l = normalize(uLightDir);
  float diffuse = clamp(dot(n, l), 0.0, 1.0);
  float back = clamp(dot(n, -l), 0.0, 1.0) * 0.18;
  float rim = pow(1.0 - clamp(dot(n, normalize(vViewDir)), 0.0, 1.0), 3.0);

  vec3 shadow = vec3(0.018, 0.05, 0.075);
  vec3 lit = mix(vec3(0.10, 0.32, 0.42), vec3(0.72, 0.90, 0.98), uWarmth);
  vec3 color = shadow + lit * (diffuse * (0.35 + 0.65 * uClarity) + back);
  color += vec3(0.55, 0.85, 1.0) * rim * (0.18 + 0.35 * uClarity);

  // Slow, coordinated caustic-like brightening on the upper faces —
  // low frequency so it never aliases as pixel flicker.
  float caust = fbmSoft(vec2(vSeed * 3.0 + uTime * 0.08, uTime * 0.06));
  color += vec3(0.62, 0.86, 0.95) * caust * clamp(n.y, 0.0, 1.0) * 0.22 * uClarity;

  float phaseFade = smoothstep(0.14, 0.30, uProgress) * (1.0 - smoothstep(0.78, 0.92, uProgress));
  gl_FragColor = vec4(color, phaseFade);
}
`;

// Larger drifting fragment — same lighting principle as sediment but
// with a stronger silhouette treatment for parallax depth reads.
export const fragmentVertexShader = /* glsl */ `
uniform float uTime;
uniform float uClarity;
attribute float aSeed;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLocal;
varying float vSeed;
${commonNoise}
void main() {
  vSeed = aSeed;
  vec3 p = position;
  float bump = fbmSoft(p.xy * 0.55 + aSeed * 2.3 + uTime * 0.02);
  p += normal * (bump - 0.5) * 0.28;
  vLocal = p;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vec4 mv = viewMatrix * world;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

export const fragmentFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uClarity;
uniform float uWarmth;
uniform float uProgress;
uniform vec3 uLightDir;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLocal;
varying float vSeed;
${commonNoise}
void main() {
  vec3 n = normalize(vNormal);
  vec3 l = normalize(uLightDir);
  float diffuse = clamp(dot(n, l), 0.0, 1.0);
  float rim = pow(1.0 - clamp(dot(n, normalize(vViewDir)), 0.0, 1.0), 2.4);
  float top = clamp(n.y, 0.0, 1.0);

  vec3 shadow = vec3(0.008, 0.028, 0.045);
  vec3 mid = mix(vec3(0.06, 0.20, 0.28), vec3(0.55, 0.78, 0.90), uWarmth);
  vec3 color = shadow + mid * diffuse * (0.42 + 0.58 * uClarity);
  color += vec3(0.5, 0.82, 1.0) * rim * (0.16 + 0.30 * uClarity);

  // Broad, slow caustic wash on upward-facing surfaces.
  float caust = fbmSoft(vLocal.xz * 0.9 + vec2(uTime * 0.07, -uTime * 0.05) + vSeed);
  color += vec3(0.72, 0.92, 1.0) * caust * top * 0.28 * uClarity;

  float phaseFade = smoothstep(0.18, 0.34, uProgress) * (1.0 - smoothstep(0.76, 0.90, uProgress));
  gl_FragColor = vec4(color, phaseFade);
}
`;

// Deep seafloor — only visible in early Phase 1/2 when the camera is
// angled steeply upward; a broad low-frequency terrain with caustic wash.
export const floorVertexShader = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorld;
${commonNoise}
void main() {
  vUv = uv;
  vec3 p = position;
  float h = fbmSoft(p.xz * 0.14) - 0.5;
  p.y += h * 1.6;
  vNormal = normalize(vec3(-h, 1.0, -h));
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const floorFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uClarity;
uniform float uWarmth;
uniform float uProgress;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorld;
${commonNoise}
void main() {
  vec3 base = mix(vec3(0.010, 0.024, 0.038), vec3(0.05, 0.14, 0.20), uClarity);
  float caust = fbmSoft(vWorld.xz * 0.35 + uTime * 0.05);
  float ridge = 1.0 - smoothstep(0.05, 0.05 + 0.10 + max(fwidth(caust) * 2.0, 0.008), abs(caust - 0.5));
  vec3 color = base + vec3(0.55, 0.82, 0.95) * ridge * 0.22 * uClarity;
  float fade = smoothstep(0.02, 0.20, uProgress) * (1.0 - smoothstep(0.55, 0.78, uProgress));
  gl_FragColor = vec4(color, fade * 0.85);
}
`;
