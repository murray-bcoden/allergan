var gulpfile = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var cleanCss = require('gulp-clean-css');

var js = {
    'header': [
        'src/assets/vendor/jquery/jquery.min.js',
        'src/assets/vendor/jquery-migrate/jquery-migrate.min.js',
        'src/assets/vendor/bootstrap/bootstrap.min.js',
        'src/assets/vendor/appear.js',
        'src/assets/js/hs.core.js',
        'src/assets/js/components/hs.header.js',
        'src/assets/js/helpers/hs.height-calc.js',
        'src/assets/js/components/hs.onscroll-animation.js',
        'src/assets/js/components/hs.go-to.js',
        'src/assets/js/vendor/jquery.ihavecookies.min.js',
        'src/assets/js/custom.js'
    ],
    'footer': []
};

var css = {
    'header': [
        'src/assets/vendor/icon-awesome/css/font-awesome.min.css',
        'src/assets/vendor/bootstrap/bootstrap.min.css',
        'src/assets/vendor/animate.css',
        'src/assets/css/unify-core.css',
        'src/assets/vendor/icon-hs/style.css',
        'src/assets/css/unify-components.css',
        'src/assets/css/unify-globals.css',
        'src/assets/css/cookies.css',
        'src/assets/css/custom.css'
    ],
    'footer': []
};

gulpfile.task('pack-header-css', function () {
    return gulpfile.src(css.header)
        .pipe(concat('bundle.header.css'))
        .pipe(cleanCss())
        .pipe(gulpfile.dest('src/assets/css/'));
});

gulpfile.task('pack-footer-css', function () {
    return gulpfile.src(css.footer)
        .pipe(concat('bundle.footer.css'))
        .pipe(cleanCss())
        .pipe(gulpfile.dest('src/assets/css/'));
});

gulpfile.task('pack-footer-js', function () {
    return gulpfile.src(js.footer)
        .pipe(concat('bundle.footer.js'))
        .pipe(minify())
        .pipe(gulpfile.dest('src/assets/js/'));
});

gulpfile.task('pack-header-js', function () {
    return gulpfile.src(js.header)
        .pipe(concat('bundle.header.js'))
        .pipe(minify())
        .pipe(gulpfile.dest('src/assets/js/'));
});
gulpfile.task('default', gulpfile.series(['pack-header-css', 'pack-header-js']));