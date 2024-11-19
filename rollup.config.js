import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
    preserveModules: true,
  },
  plugins: [resolve(), typescript({ useTsconfigDeclarationDir: true })],
  external: ["classnames", "react", "react-dom"],
};
