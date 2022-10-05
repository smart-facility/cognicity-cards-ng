"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require("gulp");

var _gulp2 = _interopRequireDefault(_gulp);

var _del = require("del");

var _del2 = _interopRequireDefault(_del);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _gulp2.default.task("clearPreviousAssets", function (done) {
  (0, _del2.default)(["../src/assets/icons", "../src/assets/images", "../src/assets/locales", "../src/assets/logos", "../src/resources/*", "src/index.html"], { force: true }); // Force deleting outside Current Working Directory

  done();
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpChangedInPlace = require('gulp-changed-in-place');

var _gulpChangedInPlace2 = _interopRequireDefault(_gulpChangedInPlace);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));
var dep = args.dep;

exports.default = _gulp2.default.task('fetchAssets', function () {
  return _gulp2.default.src(['../deployments/' + dep + '/assets/**/*']).pipe((0, _gulpChangedInPlace2.default)({ firstPass: true })).pipe(_gulp2.default.dest('../src/assets/'));
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpChangedInPlace = require('gulp-changed-in-place');

var _gulpChangedInPlace2 = _interopRequireDefault(_gulpChangedInPlace);

var _gulpChange = require('gulp-change');

var _gulpChange2 = _interopRequireDefault(_gulpChange);

var _gulpRename = require('gulp-rename');

var _gulpRename2 = _interopRequireDefault(_gulpRename);

var _gulpIf = require('gulp-if');

var _gulpIf2 = _interopRequireDefault(_gulpIf);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _gulpReplace = require('gulp-replace');

var _gulpReplace2 = _interopRequireDefault(_gulpReplace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));
var dep = args.dep;

var compileCardRoutes = function compileCardRoutes(content) {
  var env = JSON.parse(content.toString());
  var decks = env.decks;

  var deckRoutes = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = decks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var deck = _step.value;

      var name = deck.name;

      deckRoutes.push({
        path: name,
        loadChildren: './' + name + '/' + name + '.module#' + name.charAt(0).toUpperCase() + name.substr(1) + 'Module'
      });
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var cardRoutes = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = decks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _deck = _step2.value;

      cardRoutes[_deck.name] = [];

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _deck.cards[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var card = _step3.value;

          cardRoutes[_deck.name].push({
            path: card,
            loadChildren: '../../cards/' + card + '/' + card + '.module#' + card.charAt(0).toUpperCase() + card.substr(1) + 'Module',
            data: { preload: true }
          });
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  delete env.decks;

  env.supportedDecks = deckRoutes;
  env.supportedCards = cardRoutes;

  return 'export const environment = ' + JSON.stringify(env, null, 2) + ';' + '\n';
};

var isDev = function isDev(file) {
  if (file.basename === 'environment.ts') return true;

  return false;
};

exports.default = _gulp2.default.task('fetchEnvironment', function () {
  return _gulp2.default.src(['../src/environments/' + dep + '/*.json']).pipe((0, _gulpChange2.default)(compileCardRoutes)).pipe((0, _gulpRename2.default)(function (path) {
    return path.extname = '.ts';
  })).pipe((0, _gulpReplace2.default)('"', '\'')).pipe((0, _gulpChangedInPlace2.default)({ firstPass: true })).pipe(_gulp2.default.dest('../src/environments/' + dep))
  // Required for local development when using ng serve
  .pipe((0, _gulpIf2.default)(isDev, _gulp2.default.dest('../src/environments')));
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpChangedInPlace = require('gulp-changed-in-place');

var _gulpChangedInPlace2 = _interopRequireDefault(_gulpChangedInPlace);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));
var dep = args.dep;

exports.default = _gulp2.default.task('fetchIndexFile', function () {
  return _gulp2.default.src(['../deployments/' + dep + '/index.html']).pipe((0, _gulpChangedInPlace2.default)({ firstPass: true })).pipe(_gulp2.default.dest('../src/'));
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpChangedInPlace = require('gulp-changed-in-place');

var _gulpChangedInPlace2 = _interopRequireDefault(_gulpChangedInPlace);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));
var dep = args.dep;

exports.default = _gulp2.default.task('fetchResources', function () {
  return _gulp2.default.src(['../deployments/' + dep + '/resources/**/*']).pipe((0, _gulpChangedInPlace2.default)({ firstPass: true })).pipe(_gulp2.default.dest('../src/resources/'));
});
"use strict";

var _gulp = require("gulp");

var _gulp2 = _interopRequireDefault(_gulp);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));
var dep = args.dep;

var deploymentMap = {
  jp: "Japan, riskmap.jp",
  in: "India, riskmap.in",
  us: "USA, riskmap.us",
  id: "Indonesia, petabencana.id",
  ph: "Philippines, petabencana.ph",
  au: "Wollongong, Australia"
};

if (dep === "jp" || dep === "in" || dep === "us" || dep === "id" || dep === 'ph' || dep === 'au') {
  console.log("Specified deployment is " + deploymentMap[dep]);
} else {
  throw "No deployment specified, prefix `export dep=jp|in|us` to command";
}

_gulp2.default.task("default", _gulp2.default.series("clearPreviousAssets", _gulp2.default.parallel("fetchEnvironment", "fetchAssets", "fetchResources", "fetchIndexFile")));
