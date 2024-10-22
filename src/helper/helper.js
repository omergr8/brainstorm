export function float32ToPCM(float32Array) {
  const pcmArray = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    // Convert Float32 to Int16
    pcmArray[i] = Math.max(-1, Math.min(1, float32Array[i])) * 32767; // Scale to PCM 16-bit
  }
  return pcmArray.buffer; // Return ArrayBuffer
}
