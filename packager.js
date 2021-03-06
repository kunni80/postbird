var packager = require('electron-packager');
var packageJson = require('./package.json');
var child_process = require('child_process');

var opts = {
  version: '1.4.3',
  dir: '.',
  arch: 'x64',
  platform: 'darwin',
  'app-bundle-id': 'com.postbird',
  'app-category-type': 'public.app-category.developer-tools',
  'app-version': packageJson.version,
  'build-version': packageJson.version,
  icon: 'build_files/icon.icns',
  name: packageJson.name,
  prune: true,
  overwrite: true,
  out: process.env.HOME + '/Postbird_release',
  protocol: 'postbird',
  'extend-info': 'build_files/Info.plist'
};

child_process.exec('git rev-list HEAD --count', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  var commitsCount = stdout.trim();
  child_process.exec("git log --pretty=format:'%h' -n 1", (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    var commitID = stdout;

    opts['build-version'] = commitsCount + ' - ' + commitID;
    console.log('build-version', opts['build-version']);

    packager(opts, function done (err, appPath) {
      console.log("Done");
      if (err) {
        console.error(err);
      } else {
        console.log(appPath);
      }
    });
  });
});
