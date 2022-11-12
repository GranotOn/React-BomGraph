export const parseNodes = (nodes, canvas) => {
  const PADDING = 40;
  const HEIGHT_DISPERITY = canvas.height / 3 + 50;
  const levelCount = { 0: 0, 1: 0, 2: 0 };
  const levelSeen = { 0: 0, 1: 0, 2: 0 };

  if (!nodes || !canvas) return;

  nodes.forEach(({ level }) => levelCount[level]++);

  const getX = (level) => {
    const x =
      ((canvas.width - PADDING) / levelCount[level]) * levelSeen[level] +
      PADDING;
    ++levelSeen[level];
    return x;
  };

  const getCoords = (level) => {
    switch (level) {
      case 0:
        return { x: getX(level), y: canvas.height - 90 };
      case 1:
        return { x: getX(level), y: canvas.height - HEIGHT_DISPERITY - 90 };
      case 2:
        return { x: getX(level), y: canvas.height - HEIGHT_DISPERITY * 2 - 90 };
      default:
        return { x: -100, y: -100 };
    }
  };

  return nodes.map((node) => {
    return { ...node, ...getCoords(node.level) };
  });
};

export const getRandomColor = (color) => {
  var p = 1,
    temp,
    random = Math.random(),
    result = "#";

  while (p < color.length) {
    temp = parseInt(color.slice(p, (p += 2)), 16);
    temp += Math.floor((255 - temp) * random);
    result += temp.toString(16).padStart(2, "0");
  }
  return result;
};
export const pDistance = (x, y, x1, y1, x2, y2) => {
  var A = x - x1;
  var B = y - y1;
  var C = x2 - x1;
  var D = y2 - y1;

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0)
    //in case of 0 length line
    param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  var dx = x - xx;
  var dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getRadiusWithDegree = (node, sizeObject) => {
  if (node.deg && node.deg >= 0) return sizeObject[node.level] + node.deg / 10;
  return sizeObject[node.level];
};

export const findIntersection = (points, x, y, sizeObject) => {
  function isPointInside(a, b, x, y, r) {
    var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
    r *= r;
    if (dist_points < r) {
      return true;
    }
    return false;
  }

  var node = null;

  points.some((p) => {
    if (isPointInside(p.x, p.y, x, y, getRadiusWithDegree(p, sizeObject))) {
      node = p;
      return true;
    }
  });

  return node;
};

export const parseGraphOnHover = (graph, hoveredNode) => {
  const nodeMap = new Map();
  const edges = [];

  graph.edges.forEach((edge) => {
    if (edge.from === hoveredNode.id || edge.to === hoveredNode.id) {
      edges.push({ ...edge, hover: true });
      nodeMap.set(edge.from, true);
      nodeMap.set(edge.to, true);
    }
  });

  const nodes = graph.nodes.filter((node) => nodeMap.has(node.id));

  return { edges: edges, nodes: nodes };
};
