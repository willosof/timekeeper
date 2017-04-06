window.$ = require("jquery");
window.jQuery = window.$;
var Client = require('electron-rpc/client')
app = new Client();

function init() {

  $("#min-btn").click(function() {
    console.log("window_minimize");
    app.request('window_minimize');
  });

  $("#max-btn").click(function() {
    console.log("window_maximize");
    app.request('window_maximize');
  });

  $("#close-btn").click(function() {
    console.log("window_close");
    app.request('window_close');
  });

};

$("#content .tab").hide();
$("#tab_panel").show();

var load_tab = function(tab_name) {
  if (tab_name == 'tab_panel') {

  }
  if (tab_name == 'tab_settings') {
    console.log("settings");
  }
};

$("#topmenu li a").click(function() {
  $("#topmenu li a").removeClass("active");
  $(this).addClass("active");
  var id = $(this).attr('data-id');
  $("#content .tab").hide();
  $("#"+id).show();
  load_tab(id);
});

init();
