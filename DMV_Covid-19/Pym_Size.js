var pymChild = new pym.Child();
function plot_size_load(e) {
    // send updated height to parent
    pymChild.sendHeight();
}

function plot_size_resize(e) {
  // send updated height to parent
  pymChild.sendHeight();
}

window.setTimeout(plot_size_resize, 3000);
window.setTimeout(plot_size_resize, 4000);
window.setTimeout(plot_size_resize, 5000);
const body = document.querySelector('body');
body.addEventListener("load", plot_size_load);
body.addEventListener("resize", plot_size_resize);

// window.onload = function() {
//   this.setTimeout(this.plot_size_resize, 6000);
// };

