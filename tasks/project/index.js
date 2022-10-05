'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpChange = require('gulp-change');

var _gulpChange2 = _interopRequireDefault(_gulpChange);

var _gulpRename = require('gulp-rename');

var _gulpRename2 = _interopRequireDefault(_gulpRename);

var _gulpReplace = require('gulp-replace');

var _gulpReplace2 = _interopRequireDefault(_gulpReplace);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));
// import gulpif from 'gulp-if';

var dep = args.dep;

var modifyProdVariables = function modifyProdVariables(content) {
  var env = JSON.parse(content.toString());

  env.stage = 'prod';
  env.production = true;

  return JSON.stringify(env, null, 2) + '\n';
};

var addBuildScripts = function addBuildScripts(content) {
  var packageConfig = JSON.parse(content.toString());
  var scripts = packageConfig.scripts;

  scripts['build-dev-' + dep] = 'dep=' + dep + ' npm run pre-build-tasks && ' + ('ng build --env=dev-' + dep + ' --output-path=\'dist/dev-' + dep + '\'');

  scripts['build-prod-' + dep] = 'dep=' + dep + ' npm run pre-build-tasks && ' + ('ng build --prod --env=prod-' + dep + ' --output-path=\'dist/prod-' + dep + '\' ') + '--build-optimizer --vendor-chunk=true --stats-json';

  scripts['build-prod-ngsw-' + dep] = 'npm run build-prod-' + dep + ' && ' + ('node_modules/.bin/ngsw-config dist/prod-' + dep + ' ./src/ngsw-config.json ') + ('&& cp node_modules/@angular/service-worker/ngsw-worker.js ./dist/prod-' + dep + '/ngsw-worker.js');

  scripts['build-dev'] += ' && npm run build-dev-' + dep;

  scripts['build-prod'] += ' && npm run build-prod-ngsw-' + dep;

  packageConfig.scripts = scripts;

  return JSON.stringify(packageConfig, null, 2) + '\n';
};

var configureBuildMappings = function configureBuildMappings(content) {
  var seedConfig = JSON.parse(content.toString());
  var buildConfig = seedConfig.projects.Cards.architect.build.configurations;
  var serveConfig = seedConfig.projects.Cards.architect.serve.configurations;

  buildConfig['dev-' + dep] = {
    fileReplacements: [{
      replace: 'src/environments/environment.ts',
      with: 'src/environments/' + dep + '/environment.ts'
    }]
  };

  buildConfig['prod-' + dep] = {
    optimization: true,
    outputHashing: 'all',
    sourceMap: false,
    extractCss: true,
    namedChunks: false,
    aot: true,
    extractLicenses: true,
    vendorChunk: false,
    buildOptimizer: true,
    fileReplacements: [{
      replace: 'src/environments/environment.ts',
      with: 'src/environments/' + dep + '/environment.prod.ts'
    }]
  };

  serveConfig['dev-' + dep] = { browserTarget: 'Cards:build:dev-' + dep };
  serveConfig['prod-' + dep] = { browserTarget: 'Cards:build:prod-' + dep };

  seedConfig.projects.Cards.architect.build.configurations = buildConfig;
  seedConfig.projects.Cards.architect.serve.configurations = serveConfig;

  return JSON.stringify(seedConfig, null, 2) + '\n';
};

// gulp.task('checkExisting', (done) => {
//
// });

_gulp2.default.task('addDevEnvironment', function () {
  return _gulp2.default.src(['../templates/deployments/environment.json']).pipe((0, _gulpReplace2.default)('$dep', dep)).pipe(_gulp2.default.dest('../src/environments/' + dep));
});

_gulp2.default.task('addProdEnvironment', function () {
  return _gulp2.default.src(['../templates/deployments/environment.json']).pipe((0, _gulpReplace2.default)('$dep', dep)).pipe((0, _gulpChange2.default)(modifyProdVariables)).pipe((0, _gulpRename2.default)(function (path) {
    return path.basename += '.prod';
  })).pipe(_gulp2.default.dest('../src/environments/' + dep));
});

_gulp2.default.task('addDeploymentFiles', function () {
  return _gulp2.default.src(['../templates/deployments/{*/**,!(environment.json)}']) // exclude environment.json
  .pipe(_gulp2.default.dest('../deployments/' + dep));
});

_gulp2.default.task('addScripts', function () {
  return _gulp2.default.src(['../package.json']).pipe((0, _gulpChange2.default)(addBuildScripts)).pipe(_gulp2.default.dest('../'));
});

_gulp2.default.task('configureSeed', function () {
  return _gulp2.default.src(['../angular.json']).pipe((0, _gulpChange2.default)(configureBuildMappings)).pipe(_gulp2.default.dest('../'));
});

_gulp2.default.task('default', _gulp2.default.series(
// 'checkExisting',
_gulp2.default.parallel('addDevEnvironment', 'addProdEnvironment', 'addDeploymentFiles', 'addScripts', 'configureSeed')));
