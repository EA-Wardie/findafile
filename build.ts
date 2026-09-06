Bun.build({
  entrypoints: ["./index.ts"],
  compile: {
    target: "bun-linux-x64",
    outfile: "./dist/findafile",
    autoloadDotenv: false,
    autoloadBunfig: false,
  },
  minify: true,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    VERSION: JSON.stringify("0.0.1"),
  },
})
  .then(() => {
    console.log("Build successful.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
