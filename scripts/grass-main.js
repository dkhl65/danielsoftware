$(document).ready(() => {
  // create the 50x50 plain dark background
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      if ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0)) {
        $("#editor-div").append(
          '<img class="light grass-img" src="images/grass/light.png"></img>'
        );
      } else {
        $("#editor-div").append(
          '<img class="dark grass-img" src="images/grass/dark.png"></img>'
        );
      }
    }
    $("#editor-div").append("<br>");
  }

  let grassDeployed = 0; // count how many grass tiles are used

  // deploy or reclaim individual grass tiles by clicking
  $(".grass-img").click((ev) => {
    const src = $(ev.target).prop("src");
    if (
      (src.indexOf("dark.png") >= 0 || src.indexOf("light.png") >= 0) &&
      grassDeployed < 50
    ) {
      $(ev.target).prop("src", "images/grass/grass.png");
      grassDeployed++;
    } else if (src.indexOf("grass.png") >= 0) {
      if ($(ev.target).prop("class").indexOf("dark") >= 0) {
        $(ev.target).prop("src", "images/grass/dark.png");
      } else {
        $(ev.target).prop("src", "images/grass/light.png");
      }
      grassDeployed--;
    }
    $("#remaining-grass-text").text(50 - grassDeployed);
  });

  // prevent the middle mouse button from scrolling
  $(".grass-img").on("mousedown", (ev) => {
    if (ev.which === 2) {
      return false;
    }
  });

  // hold middle mouse button and drag to deploy grass continuously
  $(".grass-img").on("mousemove", (ev) => {
    const src = $(ev.target).prop("src");
    if (
      ev.which === 2 &&
      (src.indexOf("dark.png") >= 0 || src.indexOf("light.png") >= 0) &&
      grassDeployed < 50
    ) {
      $(ev.target).prop("src", "images/grass/grass.png");
      grassDeployed++;
    }
    $("#remaining-grass-text").text(50 - grassDeployed);
  });

  // press space bar to reclaim all grass tiles
  $("body").keypress((ev) => {
    if (ev.which === 32) {
      $(".dark").prop("src", "images/grass/dark.png");
      $(".light").prop("src", "images/grass/light.png");
      grassDeployed = 0;
      ev.preventDefault();
    }
    $("#remaining-grass-text").text(50 - grassDeployed);
  });

  // show and hide help text
  $("#help-button").click(() => {
    if ($("#help-div").is(":hidden")) {
      $("#help-button").text("Hide Help");
    } else {
      $("#help-button").text("Show Help");
    }
    $("#help-div").toggle();
  });
});
