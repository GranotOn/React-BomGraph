export default function drawUI(context, graph) {
  const categories = new Map();
  graph.nodes.forEach((node) => {
    if (node.level === 2) {
      if (!categories.has(node.type))
        categories.set(node.type, {
          rx: -Infinity,
          ry: Infinity,
          lx: Infinity,
          ly: Infinity,
          color: "red",
        });
      const typeCat = categories.get(node.type);
      typeCat.rx = Math.max(node.x, typeCat.rx);
      typeCat.ry = Math.min(node.y, typeCat.ry);
      typeCat.lx = Math.min(node.x, typeCat.lx);
      typeCat.ly = Math.min(node.y, typeCat.ly);
      typeCat.color = node.color;
      categories.set(node.type, typeCat);
    }
  });

  for (const [type, opts] of categories) {
    context.fillStyle = opts.color;
    context.font = "16px serif";
    context.fillText(type.toUpperCase(), (opts.rx + opts.lx) / 2, opts.ry - 50);
  }
}
