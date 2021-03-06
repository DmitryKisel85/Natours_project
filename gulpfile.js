const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');

// Определяем логику работы Browsersync
function browsersync() {
	browserSync.init({
		// Инициализация Browsersync
		server: { baseDir: 'app/' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true, // Режим работы: true или false
	});
}

function scripts() {
	return src([
		// Берем файлы из источников
		'app/js/script.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
	])
		.pipe(concat('script.min.js')) // Конкатенируем в один файл
		.pipe(uglify()) // Сжимаем JavaScript
		.pipe(dest('app/js/')) // Выгружаем готовый файл в папку назначения
		.pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
}

function startwatch() {
	// Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
	watch(['app/**/*.js', '!app/**/*.min.js'], scripts);

	// Мониторим файлы препроцессора на изменения
	watch('app/sass/**/*', styles);

	// Мониторим файлы HTML на изменения
	watch('app/**/*.html').on('change', browserSync.reload);
}

function styles() {
	return src(['app/sass/main.scss', 'app/css/icon-font.css']) // Выбираем источник: "app/sass/main.sass"
		.pipe(sass())
		.pipe(concat('style.min.css')) // Конкатенируем в файл app.min.js
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } /* , format: 'beautify' */ })) // Минифицируем стили
		.pipe(dest('app/css/')) // Выгрузим результат в папку "app/css/"
		.pipe(browserSync.stream()); // Сделаем инъекцию в браузер
}

function buildcopy() {
	return src(
		[
			// Выбираем нужные файлы
			'app/css/**/*.min.css',
			'app/js/**/*.min.js',
			'app/img/dest/**/*',
			'app/**/*.html',
		],
		{ base: 'app' }
	) // Параметр "base" сохраняет структуру проекта при копировании
		.pipe(dest('dist')); // Выгружаем в папку с финальной сборкой
}

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, scripts, browsersync, startwatch);

// Создаем новый таск "build", который последовательно выполняет нужные операции
exports.build = series(styles, scripts, buildcopy);
