function convertPolygonToPostGIS(geoJSON) {
    const coordinates = geoJSON.rings[0];
    const polygon = coordinates.map(coord => coord.join(' ')).join(', ');

    return `POLYGON((${polygon}))`;
}

function convertPointToPostGIS(geometry) {
    const x = geometry.x;
    const y = geometry.y;
    return `POINT(${x} ${y})`;
  }



module.exports = {convertPolygonToPostGIS, convertPointToPostGIS}