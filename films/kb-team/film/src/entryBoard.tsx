// The storyboard as stills: npx remotion render src/entryBoard.tsx Board out/sb --sequence --image-format=jpeg --scale=0.5
import { registerRoot } from "remotion";
import { BoardRoot } from "./Storyboard";
registerRoot(BoardRoot);
