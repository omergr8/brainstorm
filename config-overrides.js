const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    webpack: (config, env) => {
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js"),
                        to: path.resolve(__dirname, "public"),
                    },
                    {
                        from: path.resolve(__dirname, "node_modules/@ricky0123/vad-web/dist/silero_vad.onnx"),
                        to: path.resolve(__dirname, "public"),
                    },
                    {
                        from: path.resolve(__dirname, "node_modules/onnxruntime-web/dist/*.wasm"),
                        to: path.resolve(__dirname, "public"),
                    },
                ],
            })
        );

        return config;
    },
};
