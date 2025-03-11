import { render } from "preact";
import { SnekGame } from "./snek";

const root = document.querySelector("#🐍")!;

render(<SnekGame />, root);
