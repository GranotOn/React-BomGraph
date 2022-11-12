export default function drawEdge(context, edge, fromNode, toNode) {
  context.moveTo(fromNode.x, fromNode.y);
  context.bezierCurveTo(
    fromNode.x - 50,
    fromNode.y - 50,
    toNode.x,
    toNode.y + 30,
    toNode.x,
    toNode.y
  );

  const gradient = context.createLinearGradient(
    fromNode.x,
    fromNode.y,
    toNode.x,
    toNode.y
  );

  if (edge.hover) {
    context.setLineDash([]);
    context.lineWidth = 0.5;
    context.shadowColor = fromNode.color;
  } else {
    context.setLineDash([1, 4]);
    context.lineWidth = 0.1;
  }
  gradient.addColorStop(0, fromNode.color);
  gradient.addColorStop(1, toNode.color);
  context.strokeStyle = gradient;
}
