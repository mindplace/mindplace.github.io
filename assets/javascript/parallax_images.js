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
  var base = '/assets/images/';

  var availableImages = [
    { src: base + "mountain.jpg",
      user: "Samuel Scrimshaw",
      photoLink: "https://unsplash.com/photos/2oFdVd00xOg" },

    { src: base + "north.jpg",
      user: "Martin Jernberg",
      photoLink: "https://unsplash.com/photos/UdURxHDhrgY" },

    { src: base + "phone-flower.jpg",
      user: "Tyler Mullins",
      photoLink: "https://unsplash.com/photos/H-lDpIVIlBM" },

    { src: base + "stars.jpg",
      user: "Nathan Anderson",
      photoLink: "https://unsplash.com/photos/L-7cP4p5hik" },

    { src: base + "lady.jpg",
      user: "Miles Tan",
      photoLink: "https://unsplash.com/photos/RFgO9B_OR4g" },

    { src: base + "wolf.jpg",
      user: "Marek Szturk",
      photoLink: "https://unsplash.com/photos/BiSFSSQtAmg" },

    { src: base + "stones.jpg",
      user: "Danny Postma",
      photoLink: "https://unsplash.com/photos/XqtJY5gTo5k" },

    { src: base + "coupola.jpg",
      user: "Skiathos Greece",
      photoLink: "https://unsplash.com/photos/IRaJVADIVAE" },

    { src: base + "gardens.jpg",
      user: "贝莉儿 NG",
      photoLink: "https://unsplash.com/photos/dqXiw7nCb9Q" },

    { src: base + "coffee.jpg",
      user: "AJ Garcia",
      photoLink: "https://unsplash.com/photos/i_6Y2V81ceA" }
  ];

  shuffle(availableImages);
  return availableImages;
};

var photos = fallbackImages();

function getImages(){
  var param = "8537fc6f3f82700ac356a09754ceac2d9c32286598268e44e09304e5e271cd52",
      photoCount = 3;

  $.ajax({ url: "https://api.unsplash.com/photos/random?query=landscape&count=" + photoCount + "&client_id=" + param })
    .done(function(response){
      photos = [];

      response.forEach(function(item){
        var photo = {
          src: item.urls.regular,
          user: item.user.name,
          photoLink: item.links.html
        }

        photos.push(photo);
      });

    }).error(function(response){
      return photos;
    })

  return photos;
};

function manageParallax(){
  var availableImages = getImages();

  $(document).ajaxStop(function(){ // wait for the photos to return from unsplash
    var parallaxItems = $('.parallax');

    $.each(parallaxItems, function(index, item){
      var image = availableImages[index],
      imageSRC = image.src,
      user = image.user,
      referralText = "?utm_source=personal_site&utm_medium=referral&utm_content=creditCopyText",
      photoLink = image.photoLink + referralText,
      unsplash = "https://unsplash.com/" + referralText;

      $(item).parallax({
        imageSrc: imageSRC,
        speed: 0.8
      });

      var attributionElement = "<span class='attribution'></span>";
      $(item).append(attributionElement);

      function clearCover(){
        var attribution = "Photo by <a href='" + photoLink + "' target='_blank'>" + user + "</a> on <a href='" + unsplash + "' target='_blank'>Unsplash</a>";
        $(item).find(".attribution").append(attribution);
        $(item).addClass("parallax-loaded");
      };

      setTimeout(clearCover, 400)
    });
  });
};

$(document).ready(function(){

  manageParallax();

});
