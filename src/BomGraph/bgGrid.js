export default function drawGrid(canvas, boxSize = 50) {
  if (!canvas) return;

  // grid width & height
  const gw = canvas.width * 3;
  const gh = canvas.height * 3;

  const context = canvas.getContext("2d");

  context.beginPath();
  for (let x = -gw; x <= gw; x += boxSize) {
    context.moveTo(0.5 + x, 0);
    context.lineTo(0.5 + x, gh);
  }

  for (let x = -gh; x <= gh; x += boxSize) {
    context.moveTo(0, x + 0.5);
    context.lineTo(gw, 0.5 + x);
  }

  context.lineWidth = 0.2;
  context.setLineDash([2, 5]);
  context.strokeStyle = "grey";
  context.stroke();
}
