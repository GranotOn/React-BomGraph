import { faker } from "@faker-js/faker";
import { hexToShade } from "./utils";

const levelTwoColors = {
  version: "#628395",
  author: "#96897B",
  license: "#D0CE7C",
};

export function createRandomLevelOne() {
  return {
    id: faker.datatype.uuid(),
    name: faker.internet.userName(),
    color: hexToShade("#F07AC1"),
    level: 1,
  };
}

export function createRandomLevelTwo(type) {
  return {
    id: faker.datatype.uuid(),
    name: faker.internet.userName(),
    color: hexToShade(levelTwoColors[type]),
    level: 2,
    type: type,
  };
}

export function createEdge(node) {
  return {
    from: faker.helpers.arrayElement([0, 1, 2]),
    to: node.id,
  };
}

export function createEdgeTwo(node, nodeTwo) {
  return {
    from: node.id,
    to: nodeTwo.id,
  };
}

export const createEdgesLevelOne = (levelOneNodes) => {
  return levelOneNodes.map((node) => createEdge(node));
};

export const createEdgesLevelTwo = (levelOneNodes, levelTwoNodes) => {
  const edges = [];
  levelOneNodes.forEach((node) => {
    const rand = Math.floor(Math.random() * 10) + 1;
    Array.from({ length: rand }).forEach(() =>
      edges.push(
        createEdgeTwo(
          node,
          levelTwoNodes[Math.floor(Math.random() * levelTwoNodes.length)]
        )
      )
    );
  });
  return edges;
};

export const getLevelOne = (count) =>
  Array.from({ length: count }).map(() => createRandomLevelOne());

export const getLevelTwo = (count) =>
  Array.from({ length: count / 3 })
    .map(() => createRandomLevelTwo("version"))
    .concat(
      Array.from({ length: count / 3 }).map(() =>
        createRandomLevelTwo("author")
      )
    )
    .concat(
      Array.from({ length: count / 3 }).map(() =>
        createRandomLevelTwo("license")
      )
    );
