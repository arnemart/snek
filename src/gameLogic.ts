type Direction = "Up" | "Down" | "Left" | "Right";
type OtherAction = "Move" | "Start";
export type Action = Direction | OtherAction;

type Pos = [number, number];
type Snek = Pos[];

export type GameState = {
  tick: number;
  delay: number;
  running: boolean;
  crashed: boolean;
  score: number;
  direction: Direction;
  nextDirection: Direction;
  size: number;
  snek: Snek;
  apple: Pos;
};

const SIZE = 20;
const START_DELAY = 500;
const SPEEDUP_FACTOR = 0.95;

const overlaps = ([x, y]: Pos, snek: Snek) =>
  snek.some(([sx, sy]) => x == sx && y == sy);

const randomFreePosition = (snek: Snek, W = SIZE, H = SIZE) => {
  const freePositions = [...Array(W)]
    .flatMap((_, x) => [...Array(H)].map((_, y) => [x, y] as Pos))
    .filter((pos) => !overlaps(pos, snek));
  return freePositions[Math.floor(Math.random() * freePositions.length)];
};

export const initState = (): GameState => {
  const snek: Snek = [
    [7, 10],
    [6, 10],
    [5, 10],
    [4, 10],
  ];
  return {
    tick: 0,
    delay: START_DELAY,
    running: false,
    crashed: false,
    score: 0,
    direction: "Right",
    nextDirection: "Right",
    size: SIZE,
    snek: snek,
    apple: randomFreePosition(snek),
  };
};

const deltas: Record<Direction, Pos> = {
  Up: [0, -1],
  Down: [0, 1],
  Left: [-1, 0],
  Right: [1, 0],
};

const legalTurns: Record<Direction, Direction[]> = {
  Up: ["Left", "Right"],
  Down: ["Left", "Right"],
  Left: ["Up", "Down"],
  Right: ["Up", "Down"],
};

const crashed = (snek: Snek) => {
  const head = snek[0];
  return (
    head[0] < 0 ||
    head[1] < 0 ||
    head[0] >= SIZE ||
    head[1] >= SIZE ||
    overlaps(head, snek.slice(1))
  );
};

export const reducer = (state: GameState, action: Action): GameState => {
  switch (action) {
    case "Start":
      return state.crashed
        ? { ...initState(), running: true }
        : { ...state, running: true };

    case "Up":
    case "Down":
    case "Left":
    case "Right":
      return {
        ...state,
        nextDirection: legalTurns[state.direction].includes(action)
          ? action
          : state.nextDirection,
      };

    case "Move": {
      if (!state.running) {
        return state;
      }

      const longerSnek: Snek = [
        [
          state.snek[0][0] + deltas[state.nextDirection][0],
          state.snek[0][1] + deltas[state.nextDirection][1],
        ],
        ...state.snek,
      ];
      const movedSnek = longerSnek.slice(0, -1);

      const nextState = {
        ...state,
        snek: movedSnek,
        tick: state.tick + 1,
        direction: state.nextDirection,
      };

      if (crashed(movedSnek)) {
        return { ...state, running: false, crashed: true };
      } else if (
        state.apple[0] == movedSnek[0][0] &&
        state.apple[1] == movedSnek[0][1]
      ) {
        return {
          ...nextState,
          snek: longerSnek,
          score: state.score + 1,
          apple: randomFreePosition(longerSnek),
          delay: state.delay * SPEEDUP_FACTOR,
        };
      } else {
        return nextState;
      }
    }
  }
};
