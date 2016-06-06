var fs = require('fs')
var exec = require('child_process').exec

var inDir = process.argv[2]
var outDir = process.argv[3]

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

watch(inDir, convert)

fs.readdir(inDir, function (e, list) {
  if (e) { console.error(e); return }
  list.forEach(function (p) {
    var path = inDir+'/'+p
    if (!(fs.statSync(path).isDirectory()&&p[0]!=='.'&&p!=='node_modules'))return
    watch(path,convert)
  })
})

function watch (path, cb) {
  var update = null
  fs.watch(path, function (e,f) {
    if (e !== 'change') return
    var ctime = fs.statSync(path+'/'+f).ctime.toString()
    if (update !== ctime && f.match('.js')) {
      update = ctime
      cb(path,f)
    }
  })
}

function convert (path,f) {
  var inpath = path + '/' + f
  var outpath = path.replace(inDir,outDir)
  if (!fs.existsSync(outpath)) fs.mkdirSync(outpath)
  var cmd = 'node_modules/bin/babel/babel.js '+inpath+' --out-file '+outpath+'/'+f
  exec(cmd, function (e,so,se) {
    if (e) console.error(e)
    else console.log(inpath+' -> '+outpath+'/'+f)
  })
}
