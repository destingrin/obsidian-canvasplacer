import esbuild from "esbuild";

const isProduction = process.argv.includes("--production");

const shared = {
  entryPoints: ["main.ts"],
  bundle: true,
  external: ["obsidian"],
  format: "cjs",
  target: "es2016",
  logLevel: isProduction ? "info" : "debug",
  sourcemap: isProduction ? "linked" : "inline",
};

if (isProduction) {
  esbuild.build({
    ...shared,
    outfile: "main.js",
    minify: true,
  });
} else {
  esbuild.build({
    ...shared,
    outfile: "main.js",
  }).then(() => {
    process.stdin.on('close', () => process.exit(0)); // Properly close stdin
  });
}