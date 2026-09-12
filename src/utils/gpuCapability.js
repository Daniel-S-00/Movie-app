const SOFTWARE_RENDERER_PATTERN =
  /swiftshader|llvmpipe|softpipe|software|basic render|offscreen|virtualbox|vmware/i;

const getUnmaskedRenderer = () => {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (!gl) return null;

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (!debugInfo) return "";

  return String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "");
};

export const detectGpuAcceleration = () => {
  if (typeof document === "undefined") return true;

  try {
    const renderer = getUnmaskedRenderer();
    if (renderer === null) return false;
    if (!renderer) return true;
    return !SOFTWARE_RENDERER_PATTERN.test(renderer);
  } catch {
    return true;
  }
};

const getOverride = () => {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("gpu");
  return value === "on" || value === "off" ? value : null;
};

export const applyGpuCapability = () => {
  if (typeof document === "undefined") return;
  const override = getOverride();
  const accelerated =
    override === null ? detectGpuAcceleration() : override === "on";

  document.documentElement.dataset.gpu = accelerated ? "on" : "off";
};
