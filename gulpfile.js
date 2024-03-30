
const
	gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass')(require('sass')),
	rename = require("gulp-rename"),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	htmlmin = require('gulp-htmlmin'),
	clean = require('gulp-clean'), //--------------------------------------плагин для удаления файлов
	fs = require('fs'), // ------------------------------------------------для работы плагина clean 
	terser = require('gulp-terser'), //------------------------------------ для сжатия js кода и не только
	changed = require('gulp-changed'); //----------------------------------для того, чтобы проверить уже выполненные процессы, если они были выполнены, то отменяет их повторное выполнение при повторном запуске gulp


// удаление папки dist с помощью gulp-clean
gulp.task('clean-dist', function (done) {
	if (fs.existsSync('dist')) { // проверка, есть ли папка dist, если ее нет, тогда вывести просто ошибку и продолжать работу
		return gulp.src('dist', { read: false }).pipe(clean());
	}
	done();
});

// gulp.task('clean-svg', function () { //---------------------------------------------плагин для удаления файлов
// 	return gulp.src(['dist/icons/*.svg', '!dist/icons/*.min.svg']).pipe(clean());
// });

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: "dist"
		}
	});
	gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function () {
	return gulp.src("src/scss/**/*.+(scss|sass)")
		.pipe(sass({ outputSyle: 'compressed' }).on('error', sass.logError))
		.pipe(rename({
			prefix: "",
			suffix: ".min"
		}))

		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))

		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.stream());
});


gulp.task('watch', function () {
	gulp.watch("src/scss/**/*.+(scss|sass|css)", gulp.parallel('styles'));
	gulp.watch("src/*.html").on("change", gulp.parallel('html'));
	gulp.watch("src/js/**/*.js").on("change", gulp.parallel("scripts"));
	gulp.watch("src/mailer/**/*", gulp.parallel('mailer'));
	gulp.watch("src/fonts/**/*").on("all", gulp.parallel("fonts"));
	gulp.watch("src/icons/**/*").on("all", gulp.parallel("icons"));
	gulp.watch("src/img/**/*").on("all", gulp.parallel("images"));
});

gulp.task('html', function () {
	return gulp.src(["src/*.html", "!src/_*.html"])
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest("dist/"));
});

gulp.task('scripts', function () {
	return gulp.src("src/js/**/*.js")
		.pipe(terser())
		.pipe(rename({
			prefix: "",
			suffix: ".min"
		}))
		.pipe(gulp.dest("dist/js"))
		.pipe(browserSync.stream());
});

gulp.task('fonts', function () {
	return gulp.src("src/fonts/**/*")
		.pipe(gulp.dest("dist/fonts"))
		.pipe(browserSync.stream());
});

gulp.task('icons', function () { // 2 разных файла скопировать в 2 разных пути
	//---------------------------------- можно было бы обойтись и без gulp-clean, просто написав здесь *.min.svg, перекинуть файлы с именем .min.svg, тогда ничего удалять бы не пришлось, однако это функционал полезен и знать хорошо
	return gulp.src("src/icons/*.min.svg")
		.pipe(gulp.dest("dist/icons")),

		gulp.src("src/icons/*.min.+(gif|jpg|png)")
			.pipe(gulp.dest("dist/icons")),

		gulp.src("src/icons/favicon/*")
			.pipe(gulp.dest("dist/icons/favicon"))
			.pipe(browserSync.stream());
});

gulp.task('mailer', function () {
	return gulp.src("src/mailer/**/*")
		.pipe(gulp.dest("dist/mailer"))
		.pipe(browserSync.stream());
});

gulp.task('images', function () {
	return gulp.src("src/img/**/*.min.*")
		.pipe(changed("dist/img")) // для отказа повторного выполнения сжатия всех картин, если они уже были сжаты
		.pipe(imagemin({ verbose: true }))
		.pipe(gulp.dest("dist/img"))
		.pipe(browserSync.stream());
});


gulp.task('default', gulp.series( // последовательное выполнение таксов
	'clean-dist', // 1-ое выполнение
	gulp.parallel('styles', 'html', 'scripts', 'fonts', 'icons', 'mailer', 'images'), // 2-ое выполнение
	// 'clean-svg', // 3-е выполнение удаления файов, после выгрузки в папку dist
	gulp.parallel('browser-sync', 'watch') // 4-ое выполнение
));




