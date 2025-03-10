import { render } from "preact";
import SnekGame from "./snek";

const root = document.querySelector("#app")!;

render(<SnekGame />, root);
