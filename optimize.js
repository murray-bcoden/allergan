const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
    const files = await imagemin(['assets/images/*.{jpg,png}'], {
        destination: 'src/assets/img/inline/',
        plugins: [
            imageminJpegtran({
                progressive: true,
                max: 61
            }),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });

    console.log(files);
    //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
})();