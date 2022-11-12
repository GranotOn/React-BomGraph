import { getRadiusWithDegree } from "./utils";

export default function drawNode(context, node, sizeObject) {
  context.fillStyle = node.color;

  if (node.level === 0) {
    context.font = "16px serif";
    context.fillText(node.name, node.x - 5, node.y + 25);
  }

  context.beginPath();
  context.arc(
    node.x,
    node.y,
    getRadiusWithDegree(node, sizeObject),
    0,
    Math.PI * 2,
    false
  );
  context.globalAlpha = 0.7;
  context.fill();
  context.closePath();

  context.globalAlpha = 1;
}
