import { useEffect, useReducer } from "preact/hooks";
import { Action, GameState, initState, reducer } from "./gameLogic";

type MessageProps = Pick<GameState, "crashed" | "score"> & {
  start: () => void;
};
const Message = ({ crashed, score, start }: MessageProps) => (
  <div class="snek__message">
    {crashed && <div>Du er dau! Du fikk {score} poeng.</div>}
    <button onClick={start}>{crashed ? "Spill igjen" : "Start spill"}</button>
  </div>
);

type SnekProps = Pick<GameState, "snek" | "direction">;
const Snek = ({ snek, direction }: SnekProps) => (
  <>
    {snek.map(([x, y], i) => (
      <div
        key={i}
        class={`snek__part ${
          i == 0 ? `snek__part--head snek__part--head-${direction}` : ""
        }`}
        style={{ gridColumn: x + 1, gridRow: y + 1 }}
      />
    ))}
  </>
);

type AppleProps = Pick<GameState, "apple">;
const Apple = ({ apple: [x, y] }: AppleProps) => (
  <div
    class="snek__apple"
    style={{
      gridColumn: x + 1,
      gridRow: y + 1,
    }}
  />
);

export const SnekGame = () => {
  const [game, dispatch] = useReducer(reducer, initState());

  useEffect(() => {
    const timer = setTimeout(() => dispatch("Move"), game.delay);
    return () => clearTimeout(timer);
  }, [game.tick, game.running]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          dispatch(e.key.slice(5) as Action);
      }
    };
    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, []);

  return (
    <>
      <div
        class="snek"
        style={{
          gridTemplate: `repeat(${game.size}, 1fr) / repeat(${game.size}, 1fr)`,
        }}
      >
        {game.running ? (
          <>
            <Snek snek={game.snek} direction={game.direction} />
            <Apple apple={game.apple} />
          </>
        ) : (
          <Message
            crashed={game.crashed}
            score={game.score}
            start={() => dispatch("Start")}
          />
        )}
      </div>
      <div>{game.score} poeng</div>
    </>
  );
};
