const path = require("path");
const webpack = require("webpack");
const createThemeColorReplacerPlugin = require("./config/plugin.config");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const isProd = process.env.NODE_ENV === "production";

const assetsCDN = {
  // webpack build externals
  externals: {},
  css: [],
  js: [],
};

// vue.config.js
const vueConfig = {
  publicPath: "/",
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {},
  },

  chainWebpack: (config) => {
    config.resolve.alias.set("@$", resolve("src"));

    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .oneOf("inline")
      .resourceQuery(/inline/)
      .use("vue-svg-icon-loader")
      .loader("vue-svg-icon-loader")
      .end()
      .end()
      .oneOf("external")
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "assets/[name].[hash:8].[ext]",
      });

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin("html").tap((args) => {
        args[0].cdn = assetsCDN;
        return args;
      });
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          "app-theme-color": "#1890ff",
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
      },
    },
  },
  devServer: {
    // https: true,
    port: 8000, // development server port 8000
    proxy: {
      "/api": {
        target: "http://0.0.0.0:8080", 
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          ["^/api"]: "",
        },
      },
    },
  },
  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],
};

// preview.pro.loacg.com only do not use in your production;
if (!isProd) {
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin());
}

module.exports = vueConfig;
