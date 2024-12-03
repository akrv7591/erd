import type { XYPosition, Position, Node, EdgeProps } from "@xyflow/react";
// import PF from "pathfinding";

type Direction = "top" | "bottom" | "left" | "right";

type NodeBoundingBox = {
  id: string;
  width: number;
  height: number;
  topLeft: XYPosition;
  bottomLeft: XYPosition;
  topRight: XYPosition;
  bottomRight: XYPosition;
};

type GraphBoundingBox = {
  width: number;
  height: number;
  topLeft: XYPosition;
  bottomLeft: XYPosition;
  topRight: XYPosition;
  bottomRight: XYPosition;
  xMax: number;
  yMax: number;
  xMin: number;
  yMin: number;
};

export type PathFindingFunction = (
// @ts-ignore
  grid: PF.Grid,
  start: XYPosition,
  end: XYPosition,
) => {
  fullPath: number[][];
  smoothedPath: number[][];
} | null;

export type SVGDrawFunction = (
  source: XYPosition,
  target: XYPosition,
  path: number[][],
) => string;

export type PointInfo = {
  x: number;
  y: number;
  position: Position;
};


export type EdgeParams = Pick<
	EdgeProps,
	| 'sourceX'
	| 'sourceY'
	| 'targetX'
	| 'targetY'
	| 'sourcePosition'
	| 'targetPosition'
>

export type GetSmartEdgeOptions = {
	gridRatio?: number
	nodePadding?: number
	drawEdge?: SVGDrawFunction
	generatePath?: PathFindingFunction
}

export type GetSmartEdgeParams = EdgeParams & {
	options?: GetSmartEdgeOptions
	nodes: Node[]
}

export type GetSmartEdgeReturn = {
	svgPathString: string
	edgeCenterX: number
	edgeCenterY: number
}

export default function generateSmartPath({
	options = {},
	nodes = [],
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition
}: GetSmartEdgeParams) {

  const round = (x: number, multiple = 10) =>
    Math.round(x / multiple) * multiple;

  const roundDown = (x: number, multiple = 10) =>
    Math.floor(x / multiple) * multiple;

  const roundUp = (x: number, multiple = 10) =>
    Math.ceil(x / multiple) * multiple;

  const toInteger = (value: number, min = 0) => {
    let result = Math.max(Math.round(value), min);
    result = Number.isInteger(result) ? result : min;
    result = result >= min ? result : min;
    return result;
  };

  const graphToGridPoint = (
    graphPoint: XYPosition,
    smallestX: number,
    smallestY: number,
    gridRatio: number,
  ): XYPosition => {
    let x = graphPoint.x / gridRatio;
    let y = graphPoint.y / gridRatio;

    let referenceX = smallestX / gridRatio;
    let referenceY = smallestY / gridRatio;

    if (referenceX < 1) {
      while (referenceX !== 1) {
        referenceX++;
        x++;
      }
    } else if (referenceX > 1) {
      while (referenceX !== 1) {
        referenceX--;
        x--;
      }
    } else {
      // Nothing to do
    }

    if (referenceY < 1) {
      while (referenceY !== 1) {
        referenceY++;
        y++;
      }
    } else if (referenceY > 1) {
      while (referenceY !== 1) {
        referenceY--;
        y--;
      }
    } else {
      // Nothing to do
    }

    return { x, y };
  };

  /**
   * Converts a grid point back to a graph point, using the reverse logic of
   * graphToGridPoint.
   */
  const gridToGraphPoint = (
    gridPoint: XYPosition,
    smallestX: number,
    smallestY: number,
    gridRatio: number,
  ): XYPosition => {
    let x = gridPoint.x * gridRatio;
    let y = gridPoint.y * gridRatio;

    let referenceX = smallestX;
    let referenceY = smallestY;

    if (referenceX < gridRatio) {
      while (referenceX !== gridRatio) {
        referenceX = referenceX + gridRatio;
        x = x - gridRatio;
      }
    } else if (referenceX > gridRatio) {
      while (referenceX !== gridRatio) {
        referenceX = referenceX - gridRatio;
        x = x + gridRatio;
      }
    } else {
      // Nothing to do
    }

    if (referenceY < gridRatio) {
      while (referenceY !== gridRatio) {
        referenceY = referenceY + gridRatio;
        y = y - gridRatio;
      }
    } else if (referenceY > gridRatio) {
      while (referenceY !== gridRatio) {
        referenceY = referenceY - gridRatio;
        y = y + gridRatio;
      }
    } else {
      // Nothing to do
    }

    return { x, y };
  };

  const getNextPointFromPosition = (
    point: XYPosition,
    position: Direction,
  ): XYPosition => {
    switch (position) {
      case "top":
        return { x: point.x, y: point.y - 1 };
      case "bottom":
        return { x: point.x, y: point.y + 1 };
      case "left":
        return { x: point.x - 1, y: point.y };
      case "right":
        return { x: point.x + 1, y: point.y };
    }
  };

  /**
   * Guarantee that the path is walkable, even if the point is inside a non
   * walkable area, by adding a walkable path in the direction of the point's
   * Position.
   */
  const guaranteeWalkablePath = (
    // @ts-ignore
    grid: PF.Grid,
    point: XYPosition,
    position: Position,
  ) => {
    let node = grid.getNodeAt(point.x, point.y);
    while (!node.walkable) {
      grid.setWalkableAt(node.x, node.y, true);
      const next = getNextPointFromPosition(node, position);
      node = grid.getNodeAt(next.x, next.y);
    }
  };

  const getBoundingBoxes = (nodes: Node[], nodePadding = 2, roundTo = 2) => {
    let xMax = Number.MIN_SAFE_INTEGER;
    let yMax = Number.MIN_SAFE_INTEGER;
    let xMin = Number.MAX_SAFE_INTEGER;
    let yMin = Number.MAX_SAFE_INTEGER;

    const nodeBoxes: NodeBoundingBox[] = nodes.map((node) => {
      const width = Math.max(node.measured?.width || 0, 1);
      const height = Math.max(node.measured?.height || 0, 1);

      const position: XYPosition = {
        x: node.position?.x || 0,
        y: node.position?.y || 0,
      };

      const topLeft: XYPosition = {
        x: position.x - nodePadding,
        y: position.y - nodePadding,
      };
      const bottomLeft: XYPosition = {
        x: position.x - nodePadding,
        y: position.y + height + nodePadding,
      };
      const topRight: XYPosition = {
        x: position.x + width + nodePadding,
        y: position.y - nodePadding,
      };
      const bottomRight: XYPosition = {
        x: position.x + width + nodePadding,
        y: position.y + height + nodePadding,
      };

      if (roundTo > 0) {
        topLeft.x = roundDown(topLeft.x, roundTo);
        topLeft.y = roundDown(topLeft.y, roundTo);
        bottomLeft.x = roundDown(bottomLeft.x, roundTo);
        bottomLeft.y = roundUp(bottomLeft.y, roundTo);
        topRight.x = roundUp(topRight.x, roundTo);
        topRight.y = roundDown(topRight.y, roundTo);
        bottomRight.x = roundUp(bottomRight.x, roundTo);
        bottomRight.y = roundUp(bottomRight.y, roundTo);
      }

      if (topLeft.y < yMin) yMin = topLeft.y;
      if (topLeft.x < xMin) xMin = topLeft.x;
      if (bottomRight.y > yMax) yMax = bottomRight.y;
      if (bottomRight.x > xMax) xMax = bottomRight.x;

      return {
        id: node.id,
        width,
        height,
        topLeft,
        bottomLeft,
        topRight,
        bottomRight,
      };
    });

    const graphPadding = nodePadding * 2;

    xMax = roundUp(xMax + graphPadding, roundTo);
    yMax = roundUp(yMax + graphPadding, roundTo);
    xMin = roundDown(xMin - graphPadding, roundTo);
    yMin = roundDown(yMin - graphPadding, roundTo);

    const topLeft: XYPosition = {
      x: xMin,
      y: yMin,
    };

    const bottomLeft: XYPosition = {
      x: xMin,
      y: yMax,
    };

    const topRight: XYPosition = {
      x: xMax,
      y: yMin,
    };

    const bottomRight: XYPosition = {
      x: xMax,
      y: yMax,
    };

    const width = Math.abs(topLeft.x - topRight.x);
    const height = Math.abs(topLeft.y - bottomLeft.y);

    const graphBox: GraphBoundingBox = {
      topLeft,
      bottomLeft,
      topRight,
      bottomRight,
      width,
      height,
      xMax,
      yMax,
      xMin,
      yMin,
    };

    return { nodeBoxes, graphBox };
  };

  enum DiagonalMovement {
      Always = 1,
      Never = 2,
      IfAtMostOneObstacle = 3,
      OnlyWhenNoObstacles = 4,
  }

  const pathfindingJumpPointNoDiagonal: PathFindingFunction = (
    grid,
    start,
    end,
  ) => {
    try {
      // @ts-ignore
      const finder = new PF.JumpPointFinder({
        diagonalMovement: DiagonalMovement.Never,
      });
      const fullPath = finder.findPath(start.x, start.y, end.x, end.y, grid);
      const smoothedPath = fullPath;
      if (fullPath.length === 0 || smoothedPath.length === 0) return null;
      return { fullPath, smoothedPath };
    } catch {
      return null;
    }
  };

  const svgDrawStraightLinePath: SVGDrawFunction = (
    source,
    target,
    path
  ) => {
    const firstPoint = path[0]
    const secondPoint = path[1]

    let svgPathString = ""

    if (firstPoint[0] === secondPoint[0]) {
      svgPathString += `M ${firstPoint[0]}, ${source.y} `
    } else {
      svgPathString += `M ${source.x}, ${firstPoint[1]} `
    }

    path.forEach((point) => {
      const [x, y] = point
      svgPathString += ` L ${x}, ${y} `
    })

    const lastPoint = path[path.length - 1]
    const beforeLastPoint = path[path.length - 2]

    if (lastPoint[0] === beforeLastPoint[0]) {
      svgPathString += ` L ${lastPoint[0]}, ${target.y} `
    } else {
      svgPathString += ` L ${target.x}, ${lastPoint[1]} `
    }
    return svgPathString
  }

  const createGrid = (
    graph: GraphBoundingBox,
    nodes: NodeBoundingBox[],
    source: PointInfo,
    target: PointInfo,
    gridRatio = 2,
  ) => {
    const { xMin, yMin, width, height } = graph;

    // Create a grid representation of the graph box, where each cell is
    // equivalent to 10x10 pixels (or the grid ratio) on the graph. We'll use
    // this simplified grid to do pathfinding.
    const mapColumns = roundUp(width, gridRatio) / gridRatio + 1;
    const mapRows = roundUp(height, gridRatio) / gridRatio + 1;
    // @ts-ignore
    const grid = new PF.Grid(mapColumns, mapRows);

    // Update the grid representation with the space the nodes take up
    nodes.forEach((node) => {
      const nodeStart = graphToGridPoint(node.topLeft, xMin, yMin, gridRatio);
      const nodeEnd = graphToGridPoint(node.bottomRight, xMin, yMin, gridRatio);

      for (let x = nodeStart.x; x < nodeEnd.x; x++) {
        for (let y = nodeStart.y; y < nodeEnd.y; y++) {
          grid.setWalkableAt(x, y, false);
        }
      }
    });

    // Convert the starting and ending graph points to grid points
    const startGrid = graphToGridPoint(
      {
        x: round(source.x, gridRatio),
        y: round(source.y, gridRatio),
      },
      xMin,
      yMin,
      gridRatio,
    );

    const endGrid = graphToGridPoint(
      {
        x: round(target.x, gridRatio),
        y: round(target.y, gridRatio),
      },
      xMin,
      yMin,
      gridRatio,
    );

    // Guarantee a walkable path between the start and end points, even if the
    // source or target where covered by another node or by padding
    const startingNode = grid.getNodeAt(startGrid.x, startGrid.y);
    guaranteeWalkablePath(grid, startingNode, source.position);
    const endingNode = grid.getNodeAt(endGrid.x, endGrid.y);
    guaranteeWalkablePath(grid, endingNode, target.position);

    // Use the next closest points as the start and end points, so
    // pathfinding does not start too close to the nodes
    const start = getNextPointFromPosition(startingNode, source.position);
    const end = getNextPointFromPosition(endingNode, target.position);

    return { grid, start, end };
  };

  const getSmartEdge = ({
    options = {},
    nodes = [],
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  }: GetSmartEdgeParams): GetSmartEdgeReturn | null => {
    try {
      const {
        drawEdge = svgDrawStraightLinePath,
        generatePath = pathfindingJumpPointNoDiagonal,
      } = options;

      let { gridRatio = 10, nodePadding = 50 } = options;
      gridRatio = toInteger(gridRatio);
      nodePadding = toInteger(nodePadding);

      // We use the node's information to generate bounding boxes for them
      // and the graph
      const { graphBox, nodeBoxes } = getBoundingBoxes(
        nodes,
        nodePadding,
        gridRatio,
      );

      const source: PointInfo = {
        x: sourceX,
        y: sourceY,
        position: sourcePosition,
      };

      const target: PointInfo = {
        x: targetX,
        y: targetY,
        position: targetPosition,
      };

      // With this information, we can create a 2D grid representation of
      // our graph, that tells us where in the graph there is a "free" space or not
      const { grid, start, end } = createGrid(
        graphBox,
        nodeBoxes,
        source,
        target,
        gridRatio,
      );

      // We then can use the grid representation to do pathfinding
      const generatePathResult = generatePath(grid, start, end);

      if (generatePathResult === null) {
        return null;
      }

      const { fullPath, smoothedPath } = generatePathResult;

      // Here we convert the grid path to a sequence of graph coordinates.
      const graphPath = smoothedPath.map((gridPoint) => {
        const [x, y] = gridPoint;
        const graphPoint = gridToGraphPoint(
          { x, y },
          graphBox.xMin,
          graphBox.yMin,
          gridRatio,
        );
        return [graphPoint.x, graphPoint.y];
      });

      // Finally, we can use the graph path to draw the edge
      const svgPathString = drawEdge(source, target, graphPath);

      // Compute the edge's middle point using the full path, so users can use
      // it to position their custom labels
      const index = Math.floor(fullPath.length / 2);
      const middlePoint = fullPath[index];
      const [middleX, middleY] = middlePoint;
      const { x: edgeCenterX, y: edgeCenterY } = gridToGraphPoint(
        { x: middleX, y: middleY },
        graphBox.xMin,
        graphBox.yMin,
        gridRatio,
      );

      return { svgPathString, edgeCenterX, edgeCenterY };
    } catch (e) {
      console.log({e})
      return null;
    }
  };

  return getSmartEdge({
		sourcePosition,
		targetPosition,
		sourceX,
		sourceY,
		targetX,
		targetY,
		options,
		nodes
	})
}
