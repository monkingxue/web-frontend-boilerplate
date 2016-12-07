import gulp from "gulp";
import gutil from "gulp-util";
import del from "del";
import less from 'gulp-less';
import minCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import cached from 'gulp-cached';

import webpack from "webpack";
import webpackConfig from "./webpack.config.js";

import connect from 'gulp-connect';
import rest from 'connect-rest';
// import mocks from './mocks';

const src = {
  html: "src/html/*.html",
  vendor: "vendor/**/*",
  style: "src/style/*/index.less",
  assets: "assets/**/*"
};

const dist = {
  root: "dist/",
  html: "dist/",
  style: "dist/style",
  vendor: "dist/vendor",
  assets: "dist/assets"
};

const bin = {
  root: "bin/",
  html: "bin/",
  style: "bin/style",
  vendor: "bin/vendor",
  assets: "bin/assets"
};


/**
 * clean build dir
 */
let clean = (done) => {
  del.sync(dist.root);
  done();
};

/**
 * [cleanBin description]
 * @return {[type]} [description]
 */
let cleanBin = (done) => {
  del.sync(bin.root);
  done();
};

/**
 * [copyVendor description]
 * @return {[type]} [description]
 */
let copyVendor = () =>
  gulp.src(src.vendor)
    .pipe(gulp.dest(dist.vendor));

/**
 * [copyAssets description]
 * @return {[type]} [description]
 */
let copyAssets = () =>
  gulp.src(src.assets)
    .pipe(gulp.dest(dist.assets));

/**
 * [copyDist description]
 * @return {[type]} [description]
 */
let copyDist = () =>
  gulp.src(dist.root + '**/*')
    .pipe(gulp.dest(bin.root));

/**
 * [html description]
 * @return {[type]} [description]
 */
let html = () =>
  gulp.src(src.html)
    .pipe(gulp.dest(dist.html));

/**
 * [style description]
 * @return {[type]}        [description]
 */
let style = () =>
  gulp.src(src.style)
    .pipe(cached('style'))
    .pipe(less())
    .on('error', handleError)
    .pipe(autoprefixer({
      browsers: ['last 3 version']
    }))
    .pipe(minCss())
    .pipe(gulp.dest(dist.style));


/**
 * [webpackProduction description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
let webpackProduction = (done) => {
  let config = Object.create(webpackConfig);
  config.plugins = config.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": "production"
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  webpack(config, (err, stats) => {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:production]", stats.toString({
      colors: true
    }));
    done();
  });
};


/**
 * [webpackDevelopment description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
let devConfig, devCompiler;

devConfig = Object.create(webpackConfig);
devConfig.devtool = "sourcemap";
devConfig.debug = true;
devCompiler = webpack(devConfig);

let webpackDevelopment = (done) => {
  devCompiler.run((err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack:build-dev", err);
    }
    gutil.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    done();
  });
};


let connectServer = (done) => {
  connect.server({
    root: dist.root,
    port: 5000,
    livereload: true,
    middleware: (connect, opt) => {
      return [rest.rester({
        context: "/"
      })]
    }
  });
  // mocks(rest);
  done();
};

/**
 * [watch description]
 * @return {[type]} [description]
 */
let watch = () => {
  gulp.watch(src.html, html);
  gulp.watch("src/**/*.js", webpackDevelopment);
  gulp.watch("src/**/*.less", style);
  gulp.watch("dist/**/*").on('change', () => {
    gulp.src('dist/')
      .pipe(connect.reload());
  });
};

/**
 * default task
 */
gulp.task("default", gulp.series(
  clean,
  gulp.parallel(copyAssets, copyVendor, html, style, webpackDevelopment),
  connectServer,
  watch
));

/**
 * production build task
 */
gulp.task("build", gulp.series(
  clean,
  gulp.parallel(copyAssets, copyVendor, html, style, webpackProduction),
  cleanBin,
  copyDist,
  (done) => {
    console.log('build success');
    done();
  }
));

/**
 * [handleError description]
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
let handleError = (err) => {
  if (err.message) {
    console.log(err.message)
  } else {
    console.log(err)
  }
  this.emit('end')
};