// libraries
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

// components

// helpers
import drawGrid from "./bgGrid";
import drawNode from "./Node";
import { parseNodes, findIntersection, parseGraphOnHover } from "./utils";
import {
  createEdgesLevelOne,
  createEdgesLevelTwo,
  getLevelOne,
  getLevelTwo,
} from "./faker";
import drawEdge from "./Edge";

// consts
const SCROLL_SENSITIVITY = 0.0005;
const MAX_ZOOM = 3;
const MIN_ZOOM = 0.7;
const EDGE_BATCH = 1;

const sizeObject = {
  0: 15,
  1: 3,
  2: 3,
};

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledCanvas = styled.canvas`
  overflow: hidden;
`;

var levelOne = getLevelOne(900);
var levelTwo = getLevelTwo(100);

const edges = [
  ...createEdgesLevelOne(levelOne),
  ...createEdgesLevelTwo(levelOne, levelTwo),
];

levelTwo = levelTwo.map((node) => {
  const inDeg = edges.reduce(
    (prev, curr) => (curr.to === node.id ? prev + 1 : prev),
    0
  );

  return { ...node, deg: inDeg };
});

const nodes = [
  {
    id: 0,
    level: 0,
    name: "Library",
    color: "#35D0DB",
  },
  {
    id: 1,
    level: 0,
    name: "Application",
    color: "#F07AC1",
  },
  {
    id: 2,
    level: 0,
    name: "OperatingSystem",
    color: "#8EAD52",
  },
  ...levelOne,
  ...levelTwo,
];

export default function BomGraph() {
  const canvas = useRef(null);
  const container = useRef(null);
  const graph = useRef({ nodes: [], edges: [] });
  const graphCopy = useRef({ nodes: [], edges: [] });

  var hoverLock = useRef(false);
  var mouseRef = useRef({ x: 0, y: 0 });
  var lastFrame = useRef(0);
  var drawEdges = useRef(true);
  var hover = useRef({ active: false, node: null });
  var zoom = useRef(1);

  // handlers
  const handleZoom = (e) => {
    const oldZoom = zoom.current;
    const d = -e.deltaY;
    const newZoom = oldZoom + d * SCROLL_SENSITIVITY;

    zoom.current = Math.min(newZoom, MAX_ZOOM);
    zoom.current = Math.max(zoom.current, MIN_ZOOM);
  };

  const handleMouseDown = () => {};
  const handleMouseUp = () => {
    if (!hover.current.active) return;
    hoverLock.current = !hoverLock.current;
  };

  const handleMouseOver = (e) => {
    const rect = canvas.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };

    const nodeIntersection = findIntersection(
      graph.current.nodes,
      mouseRef.current.x,
      mouseRef.current.y,
      sizeObject
    );
    const hoverContext = canvas.current.hoverCanvas.getContext("2d");
    if (nodeIntersection && !hoverLock.current) {
      hover.current.active = true;
      if (hover.current.node === nodeIntersection) return;
      hover.current.node = nodeIntersection;
      graphCopy.current = JSON.parse(JSON.stringify(graph.current));
      graph.current = parseGraphOnHover(graph.current, nodeIntersection);
      hoverContext.beginPath();
      graph.current.edges.forEach((edge) =>
        drawEdge(
          hoverContext,
          edge,
          ...graph.current.nodes.filter((node) => node.id === edge.from),
          ...graph.current.nodes.filter((node) => node.id === edge.to)
        )
      );
      hoverContext.closePath();
      hoverContext.shadowBlur = 5;
      hoverContext.stroke();
    } else if (hover.current.active && !hoverLock.current) {
      hoverContext.clearRect(0, 0, canvas.current.width, canvas.current.height);
      graph.current = graphCopy.current;
      hover.current.active = false;
    }
  };
  // canvas logic
  const draw = (context) => {
    // background pass
    drawGrid(canvas.current);

    var edgeContext = canvas.current.offscreenCanvas.getContext("2d");

    if (drawEdges.current) {
      const es = graph.current.edges;
      for (let i = 0; i <= es.length; i += EDGE_BATCH) {
        const sa = es.slice(i, Math.min(i + EDGE_BATCH, es.length));
        edgeContext.beginPath();
        sa.forEach((edge) => {
          drawEdge(
            edgeContext,
            edge,
            ...graph.current.nodes.filter((node) => node.id === edge.from),
            ...graph.current.nodes.filter((node) => node.id === edge.to)
          );
        });
        edgeContext.closePath();
        edgeContext.stroke();
      }
      drawEdges.current = false;
    }

    if (!hover.current.active) {
      context.drawImage(canvas.current.offscreenCanvas, 0, 0);
    } else {
      context.drawImage(canvas.current.hoverCanvas, 0, 0);
    }

    graph.current.nodes.forEach((node) => drawNode(context, node, sizeObject));
    context.fillColor = "red";
    context.fillRect(mouseRef.current.x, mouseRef.current.y, 5, 5);
  };

  const tick = (ts) => {
    if (lastFrame.current === 0) {
      lastFrame.current = ts;
    }

    const delta = ts - lastFrame.current;
    lastFrame.current = ts;
    const canv = canvas.current;
    const context = canv.getContext("2d", { alpha: false });

    context.save();
    context.clearRect(0, 0, canv.width, canv.height);
    context.translate(mouseRef.current.x, mouseRef.current.y);
    context.scale(zoom.current, zoom.current);
    context.translate(-mouseRef.current.x, -mouseRef.current.y);

    draw(context);

    context.restore();

    window.requestAnimationFrame(tick);
  };

  const initGraph = () => {
    const canv = canvas.current;

    canv.width = container.current.clientWidth;
    canv.height = container.current.clientHeight;
    canv.offscreenCanvas = new OffscreenCanvas(canv.width * 2, canv.height * 2);
    canv.hoverCanvas = new OffscreenCanvas(canv.width * 2, canv.height * 2);

    canv.addEventListener("wheel", handleZoom);
    canv.addEventListener("mousemove", handleMouseOver);
    canv.addEventListener("mousedown", handleMouseDown);
    canv.addEventListener("mouseup", handleMouseUp);

    graph.current.nodes = parseNodes(nodes, canv);
    graph.current.edges = edges;

    window.requestAnimationFrame(tick);
  };

  const destroyGraph = () => {};

  useEffect(() => {
    initGraph();

    return () => destroyGraph();
  }, []);

  return (
    <StyledContainer ref={container}>
      <StyledCanvas ref={canvas}></StyledCanvas>
    </StyledContainer>
  );
}
