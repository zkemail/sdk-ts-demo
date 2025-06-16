let wasmCache: any = null;

export async function initNoirWasm() {
  if (wasmCache) {
    return wasmCache;
  }

  try {
    console.log('Initializing Noir WASM modules (simple approach)...');
    
    // Just import the main modules without any explicit WASM initialization
    // The Node.js versions should handle WASM loading automatically
    const noirModule = await import("@noir-lang/noir_js");
    const bbModule = await import("@aztec/bb.js");

    // Create the modules object without testing or validation
    // Let the SDK handle any WASM-related errors
    const wasmModules = {
      Noir: noirModule.Noir,
      UltraHonkBackend: bbModule.UltraHonkBackend,
    };

    wasmCache = wasmModules;
    console.log('Noir WASM modules loaded successfully');
    
    return wasmModules;
  } catch (error) {
    console.error('Failed to load Noir modules:', error.message);
    throw new Error(`Module loading failed: ${error.message}`);
  }
}

/**
 * Reset the WASM cache
 */
export function resetWasmCache() {
  wasmCache = null;
}

/**
 * Check if WASM modules are cached
 */
export function isWasmCached(): boolean {
  return wasmCache !== null;
}
