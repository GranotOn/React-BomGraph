import { faker } from "@faker-js/faker";
import { getRandomColor } from "./utils";

export function createRandomLevelOne() {
  return {
    id: faker.datatype.uuid(),
    name: faker.internet.userName(),
    color: faker.color.rgb(),
    level: 1,
  };
}

export function createRandomLevelTwo() {
  return {
    id: faker.datatype.uuid(),
    name: faker.internet.userName(),
    color: faker.color.rgb(),
    level: 2,
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
  Array.from({ length: count }).map(() => createRandomLevelTwo());
