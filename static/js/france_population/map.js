$(function() {
  var map,
    colorscale,
    departments = {},
    w = $("#map")
      .parent()
      .width();

  // initialize qtip tooltip class
  $.fn.qtip.defaults.style.classes = "ui-tooltip-bootstrap";
  $.fn.qtip.defaults.style.def = false;

  $.getJSON("/others/france_population/departments.json", function(
    departments
  ) {
    $.get("/others/france_population/france-departments.svg", function(svg) {
      // $.each(['Reds', 'GnBu', 'RdYlBu', 'PiYG', 'PRGn', 'YlOrRd'], function(i, brewer) {
      $.each(["RdYlBu"], function(i, brewer) {
        var div = $("<div />").addClass("mapnail");
        $("#map").append(div);

        var map = kartograph.map(div, w * 0.33, w / 3);
        // color function

        map.setMap(svg);

        map.addLayer("departments", {
          styles: {
            "stroke-width": 0.7,
            fill: function(d) {
              if (departments[d.id].category > 0) {
                return "#CC0000";
              } else {
                return "#FFFF66";
              }
              // return color(departments[d.id].category);
            }
            // stroke: function(d) { return color(departments[d.id].category).darker(); }
          },
          tooltips: function(d) {
            return [d.name, departments[d.id].pop + " habs"];
          }
        });
      });
    });
  });
});
