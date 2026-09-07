export type RtPoint = { latitude: number; longitude: number };

export type RtMapBounds = { lonMin: number; lonMax: number; yMin: number; yMax: number };

const PADDING_RATIO = 0.28;

export function mercatorY(lat: number) {
  const rad = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
}

export function computeRtMapBounds(points: RtPoint[]): RtMapBounds {
  const lons = points.map((p) => p.longitude);
  const ys = points.map((p) => mercatorY(p.latitude));
  const lonMin = Math.min(...lons);
  const lonMax = Math.max(...lons);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const lonSpan = lonMax - lonMin || 0.001;
  const ySpan = yMax - yMin || 0.001;
  const lonPad = lonSpan * PADDING_RATIO;
  const yPad = ySpan * PADDING_RATIO;
  return { lonMin: lonMin - lonPad, lonMax: lonMax + lonPad, yMin: yMin - yPad, yMax: yMax + yPad };
}

export function rtPercentPosition(point: RtPoint, bounds: RtMapBounds) {
  const y = mercatorY(point.latitude);
  const xPct = ((point.longitude - bounds.lonMin) / (bounds.lonMax - bounds.lonMin)) * 100;
  const yPct = ((bounds.yMax - y) / (bounds.yMax - bounds.yMin)) * 100;
  return { xPct, yPct };
}
