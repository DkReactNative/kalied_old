function loadjsfile(filename) {
    console.log("loading admin " + filename)
    var fileref = document.createElement('script')
    fileref.setAttribute("type", "text/javascript")
    fileref.setAttribute("src", filename)
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function loadcssfile(filename) {
    console.log("loading admin " + filename)
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', filename);
    document.getElementsByTagName('head')[0].appendChild(link);
}
var cssArray = [
    "assets/admin/css/style.css",
    "assets/admin/dist/css/developer.css",
    "assets/admin/bower_components/font-awesome/css/font-awesome.min.css",
    "assets/admin/bower_components/bootstrap/dist/css/bootstrap.min.css",
    "assets/admin/bower_components/Ionicons/css/ionicons.min.css",
    "assets/admin/dist/css/AdminLTE.min.css",
    "assets/admin/dist/css/skins/_all-skins.min.css",
    "assets/admin/bower_components/morris.js/morris.css",
    "assets/admin/bower_components/jvectormap/jquery-jvectormap.css",
    "assets/admin/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css",
    "assets/admin/bower_components/bootstrap-daterangepicker/daterangepicker.css",
    "assets/admin/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css"
]
var jsArray = [
    "assets/admin/bower_components/jquery-ui/jquery-ui.min.js",
    "assets/admin/bower_components/raphael/raphael.min.js",
    "assets/admin/bower_components/jquery-sparkline/dist/jquery.sparkline.min.js",
    "assets/admin/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js",
    "assets/admin/plugins/jvectormap/jquery-jvectormap-world-mill-en.js",
    "assets/admin/bower_components/jquery-knob/dist/jquery.knob.min.js",
    "assets/admin/bower_components/moment/min/moment.min.js",
    "assets/admin/bower_components/bootstrap-daterangepicker/daterangepicker.js",
    "assets/admin/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js",
    "assets/admin/bower_components/jquery-slimscroll/jquery.slimscroll.min.js",
    "assets/admin/bower_components/fastclick/lib/fastclick.js",
    "assets/admin/dist/js/pages/dashboard.js",
    "assets/admin/dist/js/adminlte.js",
    "assets/admin/dist/js/demo.js",
    "assets/admin/script.js"
]


cssArray.forEach(ele => {
    console.log(ele)
    loadcssfile(ele)
})

jsArray.forEach(ele => {
    console.log(ele)
    loadjsfile(ele)
})