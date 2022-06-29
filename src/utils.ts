import { distance, feature, nearestPointOnLine } from '@turf/turf';

export const sortWaypoints = ({
  features,
  context,
}: {
  features: Feature[];
  context: Feature;
}) => {
  const coords = context.geometry.coordinates;
  const contextLine = feature(context.geometry);

  const fe = features
    .map((feat) => {
      const temp = nearestPointOnLine(contextLine, feat.geometry, {
        units: 'meters',
      });
      return {
        ...feat,
        type: 'Feature',
        properties: { location: temp.properties.location },
      };
    })
    .sort((a: any, b: any) => a.properties.location - b.properties.location);

  const dist = distance(coords[0], coords[coords.length - 1], {
    units: 'meters',
  });
  const roundTrip = Boolean(dist < 50);
  if (roundTrip) {
    fe.push(JSON.parse(JSON.stringify(fe[0])));
  }

  return fe;
};
