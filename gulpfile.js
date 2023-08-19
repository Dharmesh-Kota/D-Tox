const {src, dest, watch, series} = require('gulp');
// const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
// const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
// const imagemin = require('gulp-imagemin');
// const imagewebp = require('gulp-webp');
// const del = require('del');
const path = require('path');
const fs = require('fs');
const assetBuilder = require('asset-builder')('./assets/manifest.json');

// emptying the public assets directory every time in order to cleat the junk files 
function clean() {
    return del([ 'public/assets' ]);
}

//scss
function compile_scss(){
    return src('./assets/scss/*.scss')
        .pipe(less())
        .pipe(prefix('last 2 versions'))
        .pipe(cleanCSS())
        .pipe(dest('./public/assets/css'));
}

//js
function jsmin(){
    return src('./assets/js/*.js')
        .pipe(terser())
        .pipe(dest('./public/assets/js'))
}

//image minify and creating a webp image file
// function optimize_img(){
//     return src('./assets/images/*.{jpg, png}')
//         .pipe(imagemin([
//             imagemin.mozjpeg({quality: 80, progressive: true}),
//             imagemin.optipng({optimizationLevel: 2})
//         ]))
//         .pipe(dest('./public/assets/images'))
// }

// function webp_images(){
//     return src('./public/assets/images/*.{jpg, png}')
//         .pipe(imagewebp())
//         .pipe(dest('./public/assets/images'))
// }

//creating a function to watch any changes the css, js or image files
function watchTask(){
    watch('./assets/scss/*.scss', compile_scss);
    watch('./assets/js/*.js', jsmin);
    // watch('./assets/images/*.{jpg, png}');
    // watch('./public/assets/images/*.{jpg, png}', webp_images)
}

//default gulp
exports.default = series(
    // clean,
    compile_scss,
    jsmin,
    // optimize_img,
    // webp_images,
    watchTask
);