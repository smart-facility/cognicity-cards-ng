import gulp from "gulp";
import parseArgs from "minimist";

const args = parseArgs(process.argv.slice(2));
const dep = args.dep;

const deploymentMap = {
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

gulp.task(
  "default",
  gulp.series(
    "clearPreviousAssets",
    gulp.parallel(
      "fetchEnvironment",
      "fetchAssets",
      "fetchResources",
      "fetchIndexFile"
    )
  )
);
