function shuffle(array) {
  var j, x, i;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
};

function fallbackImages(){
  var base = '/assets/images/parallax_fallback/';

  var availableImages = [
    { src: base + "mountain.jpg",
      user: "Samuel Scrimshaw",
      userLink: "https://unsplash.com/photos/2oFdVd00xOg" },

    { src: base + "north.jpg",
      user: "Martin Jernberg",
      userLink: "https://unsplash.com/photos/UdURxHDhrgY" },

    { src: base + "stars.jpg",
      user: "Nathan Anderson",
      userLink: "https://unsplash.com/photos/L-7cP4p5hik" },

    { src: base + "stones.jpg",
      user: "Danny Postma",
      userLink: "https://unsplash.com/photos/XqtJY5gTo5k" },
  ];

  shuffle(availableImages);
  return availableImages;
};

$(document).ready(function(){

  var param = "8537fc6f3f82700ac356a09754ceac2d9c32286598268e44e09304e5e271cd52",
      parallaxItems = $('.parallax'),
      photoCount = parallaxItems.length,
      photos = [];

  var getPhotos = $.ajax({
        url: "https://api.unsplash.com/photos/random?query=mountains&count=" + photoCount + "&client_id=" + param
      }).done(function(response){
        response.forEach(function(item){
          var photo = {
            src: item.urls.regular,
            user: item.user.name,
            userLink: item.user.links.html
          }

          photos.push(photo);
        });
      }).error(function(response){
        photos = fallbackImages();
      });

  function appendPhotos(){
    $.each(parallaxItems, function(index, item){
      var image = photos[index],
      imageSRC = image.src,
      user = image.user,
      referralText = "?utm_source=personal_site&utm_medium=referral&utm_content=creditCopyText",
      userLink = image.userLink + referralText,
      unsplash = "https://unsplash.com/" + referralText;

      $(item).parallax({
        imageSrc: imageSRC,
        speed: 0.8
      });

      var attributionElement = "<span class='attribution'></span>";
      $(item).append(attributionElement);

      function clearCover(){
        var attribution = "Photo by <a href='" + userLink + "' target='_blank'>" + user + "</a> on <a href='" + unsplash + "' target='_blank'>Unsplash</a>";
        $(item).find(".attribution").append(attribution);
        $(item).addClass("parallax-loaded");
      };

      setTimeout(clearCover, 400);
    });
  };

  Promise.all([ getPhotos ]).then(function() {
    appendPhotos();
  });

  // Handler for when Unsplash API is down
  window.addEventListener("unhandledrejection", function(e) {
    e.preventDefault();
    var reason = e.detail.reason;
    var promise = e.detail.promise;

    appendPhotos();
  });

});
