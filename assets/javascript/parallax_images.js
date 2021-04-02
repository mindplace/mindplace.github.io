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

async function fallbackImages() {
  return $.getJSON("/assets/javascript/fallback_images.json", function(data) {
    return shuffle(data);
  });
};

function keywordSearch() {
  var keywords = ["mountain", "forest", "landscape", "sky", "plants"];
  return shuffle(keywords)[0];
};

function buildPhotosFetcher() {
  var parallaxItems = $('.parallax');
  var photoCount = parallaxItems.length;
  var param = "8537fc6f3f82700ac356a09754ceac2d9c32286598268e44e09304e5e271cd52";

  return $.ajax({
    url: "https://api.unsplash.com/photos/random?query=" + keywordSearch() + "&count=" + photoCount + "&client_id=" + param
  }).done(function(response){
    return response;
  }).error(function(response){
    return fallbackImages();
  });
};

function appendPhotos(photos){
  var parallaxItems = $('.parallax');
  var referralText = "?utm_source=personal_site&utm_medium=referral&utm_content=creditCopyText";
  var unsplashLink = "https://unsplash.com/" + referralText;

  $.each(parallaxItems, function(index, parallaxItem){
    var image = photos[index];
    var userLink = image.user.links.html + referralText;
    var imageSrc = image.urls['regular'] + referralText;

    $(parallaxItem).attr('id', index);
    $(parallaxItem).find(".attribution .artist-link").attr('href', userLink);
    $(parallaxItem).find(".attribution .artist-link").text(image.user.name);
    $(parallaxItem).find(".attribution .unsplash-link").attr('href', unsplashLink);

    function clearCover() {
      var item = document.getElementById(index);
      setTimeout(function() {
        $(item).parent().css('background-color', 'transparent');
      }, 2000);
    }

    $(parallaxItem).parallax(
      { imageSrc: imageSrc, speed: 0.8 },
      clearCover,
    );
  });
};

function fetchAndAttachImages(){
  Promise.all(buildPhotosFetcher()).then(function(result) {
    appendPhotos(result);
  });
};

$(document).ready(function() {
  // fetchAndAttachImages();
  Promise.resolve(fallbackImages()).then(function(images) {
    appendPhotos(images);
  });

  // Handler for when Unsplash API is down
  window.addEventListener("unhandledrejection", function(e) {
    e.preventDefault();
    Promise.resolve(fallbackImages()).then(function(images) {
      appendPhotos(images);
    });
  });
});
