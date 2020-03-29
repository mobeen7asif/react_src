let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/assets/js/app.js', 'public/js');
mix.sourceMaps('cheap-module-eval-source-map');
  // .sass('resources/assets/sass/app.scss', 'public/css');
mix.styles([
    'public/assets/css/jquery-ui/themes/base/jquery-ui.css',
    'public/assets/css/style.css',
    'public/assets/css/responsive.css',
    'public/assets/css/ion.rangeSlider.css',
    'public/assets/css/ion.rangeSlider.skinFlat.css',
    'public/assets/js/jquery.scrollbar-gh-pages/jquery.scrollbar.css',
     'public/assets/css/custom.css',
    'public/assets/css/percdaentage-difference-chart.css',
    'public/assets/css/google-fonts.css',
    'public/assets/css/jquery.tag-editor.css',
    'node_modules/react-super-treeview/dist/style.css',
    'public/assets/css/select2.min.css',
    'public/assets/css/circle.css',
    'public/assets/css/jquery.passwordstrength.css',
    'public/assets/css/slick.css',
    'public/assets/css/members_style.css',
    'public/assets/css/new_member_style.css',


], 'public/css/app.css').options({
    processCssUrls: false
});

mix.js([
    'public/assets/jquery-ui-1.11.1/jquery-ui.js',
    'public/assets/js/jquery.AshAlom.gaugeMeter-2.0.0.min.js',
    'public/assets/js/jquery.tag-editor.js',
    'public/assets/js/jquery.tagsinput.js',
    'public/assets/js/bootstrap.min.js',
    'public/assets/js/my_script.js',
    'public/assets/js/slick.js',
], 'public/js/vendor.js');

mix.js([
    'public/assets/js/custom_prototypes.js'
], 'public/js/prototypes.js');
