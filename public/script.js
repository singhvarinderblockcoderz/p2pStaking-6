import $ from "jquery";
import 'owl.carousel';

$('.p2p-feature').owlCarousel({
  loop: true,
  margin: 10,
  nav: false,
  responsive: {
    0: {
      items: 1
    },
    567: {
      items: 1.5
    },
    767: {
      items: 2.3
    },
    1000: {
      items: 3
    }
  }
});

$(document).ready(function() {
  $(".card-item").owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    items: 3,
    center: true
  });
});

$(document).ready(function() {
  $(".community-item").owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    items: 3,
    center: true
  });const webpack = require('webpack');
  module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  config.plugins.push(new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
      }))
  return config;
  }}
});

$(document).ready(function() {
  $(".card-up-down").owlCarousel({
    margin: 10,
    nav: true,
    items: 2,
    dots: false,
    stagePadding: 40,
    responsive: {
      0: {
        items: 1
      },
      567: {
        items: 1.5
      },
      1000: {
        items: 4
      }
    }
  });
});
