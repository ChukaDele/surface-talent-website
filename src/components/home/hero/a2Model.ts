/** Shared content and timing keep SVG and Three.js as a fair depth-only comparison. */
export const A2_CALLOUTS = [
  { layer: 1, label: "Experience", role: "Technical sales" },
  { layer: 3, label: "Tolerance", role: "Quality" },
  { layer: 5, label: "Chemistry", role: "Process" },
  { layer: 6, label: "Throughput", role: "Operations" },
  { layer: 7, label: "Substrate", role: "Leadership" },
] as const;

export const A2_MESSAGE = "Generalists see the finish. We recruit through the full role system.";

export const A2_TIMING = {
  completeHoldEnd: 1.8,
  labelsInStart: 2.85,
  separationEnd: 3.25,
  labelsInEnd: 3.5,
  inspectionEnd: 5.9,
  labelsOutEnd: 6.4,
  reassemblyStart: 6.15,
  reassemblyEnd: 7.5,
  total: 9.3,
} as const;

const smooth = (value: number) => value * value * (3 - 2 * value);
const between = (time: number, start: number, end: number) => smooth(Math.min(1, Math.max(0, (time - start) / (end - start))));

export function a2StateAtTime(elapsed: number) {
  const time = ((elapsed % A2_TIMING.total) + A2_TIMING.total) % A2_TIMING.total;
  const openness = time < A2_TIMING.reassemblyStart
    ? between(time, A2_TIMING.completeHoldEnd, A2_TIMING.separationEnd)
    : 1 - between(time, A2_TIMING.reassemblyStart, A2_TIMING.reassemblyEnd);
  const labels = time < A2_TIMING.inspectionEnd
    ? between(time, A2_TIMING.labelsInStart, A2_TIMING.labelsInEnd)
    : 1 - between(time, A2_TIMING.inspectionEnd, A2_TIMING.labelsOutEnd);
  return { openness, labels };
}
