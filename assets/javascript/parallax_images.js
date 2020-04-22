function shuffle(array) {
  var j, x, i;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
};

function fallbackImages() {
  var base = '/assets/images/parallax_fallback/';
  var availableImages = [
    {
      urls: { regular: base + "mountain.jpg" },
      user: {
        name: "Samuel Scrimshaw",
        links: { html: "https://unsplash.com/photos/2oFdVd00xOg" },
      },
    },
    {
      urls: { regular: base + "north.jpg" },
      user: {
        name: "Martin Jernberg",
        links: { html: "https://unsplash.com/photos/UdURxHDhrgY" },
      },
    },
    {
      urls: { regular: base + "stars.jpg" },
      user: {
        name: "Nathan Anderson",
        links: { html: "https://unsplash.com/photos/L-7cP4p5hik" },
      },
    },
    {
      urls: { regular: base + "stones.jpg" },
      user: {
        name: "Danny Postma",
        links: { html: "https://unsplash.com/photos/XqtJY5gTo5k" },
      },
    },
  ];

  return shuffle(availableImages);
};

function buildPhotosFetcher() {
  var parallaxItems = $('.parallax');
  var photoCount = parallaxItems.length;
  var param = "8537fc6f3f82700ac356a09754ceac2d9c32286598268e44e09304e5e271cd52";

  return $.ajax({
    url: "https://api.unsplash.com/photos/random?query=mountains&count=" + photoCount + "&client_id=" + param
  }).done(function(response){
    return response;
  }).error(function(response){
    return fallbackImages();
  });
};

function clearCover(userLink, image, parallaxItem, unsplashLink){
  var attribution = "Photo by <a href='" + userLink + "' target='_blank'>" + image.user.name + "</a> on <a href='" + unsplashLink + "' target='_blank'>Unsplash</a>";
  $(parallaxItem).find(".attribution").append(attribution);
  $(parallaxItem).addClass("parallax-loaded");
};

function appendPhotos(photos){
  var parallaxItems = $('.parallax');
  var referralText = "?utm_source=personal_site&utm_medium=referral&utm_content=creditCopyText";
  var unsplashLink = "https://unsplash.com/" + referralText;

  $.each(parallaxItems, function(index, parallaxItem){
    var image = photos[index];
    var userLink = image.user.links.html + referralText;
    var imageSrc = image.urls.regular + referralText;

    $(parallaxItem).append("<span class='attribution'></span>");
    $(parallaxItem).parallax({ imageSrc: imageSrc, speed: 0.8 });
    setTimeout(clearCover(userLink, image, parallaxItem, unsplashLink), 400);
  });
};

$(document).ready(function() {
  Promise.all(buildPhotosFetcher()).then(function(result) {
    appendPhotos(result);
  });

  // Handler for when Unsplash API is down
  window.addEventListener("unhandledrejection", function(e) {
    e.preventDefault();
    appendPhotos(fallbackImages());
  });
});
