(function() {
  
  var movingCompanion = {
    init: function() {
      this.cacheDom();
      this.bindEvents();
      googleStreet.init();
      nyTimesLinks.init();
      wikiLinks.init();
    },
    cacheDom: function() {
      this.$formContainer = $("#form-container");
      this.$streetInput = this.$formContainer.find('#street');
      this.$cityInput = this.$formContainer.find('#city');
      this.$submitBtn = this.$formContainer.find('#submit-btn');
    },
    bindEvents: function() {
      this.$submitBtn.on('click', function(e) {
        e.preventDefault();
        movingCompanion.clearImage();        
        var $streetInput = movingCompanion.getStreet();
        var $cityInput = movingCompanion.getCity();       
        googleStreet.render($streetInput, $cityInput);
        nyTimesLinks.getNytimes($streetInput, $cityInput);
        wikiLinks.getWiki($cityInput);
      });
    },
    getStreet: function() {
      return this.$streetInput.val();
    },
    getCity: function() {
      return this.$cityInput.val();
    },
    clearImage: function() {
      if ($('.streetview-image')) {
        $('.streetview-image').remove();
      }
    }
  };
  
  var googleStreet = {
    init: function() {
      this.$googleAddress = '"https://maps.googleapis.com/maps/api/streetview?size=600x400&location=';
    },
    cacheDom: function() {
    },
    bindEvents: function() {      
    },
    render: function(street, city) {
      movingCompanion.$formContainer
      .after('<img class="streetview-image" src='
        + this.$googleAddress
        + street
        + city
        + '">'
      );
    }
  };
  
  var nyTimesLinks = {
    init: function() {
      this.myKey = '5fd8e8fa153a9766443971124d83123a:12:72810650';
      this.$nytimesAddress = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=';
      this.cacheDom();
    },
    cacheDom: function() {
      this.$nytElem = $('#nytimes-articles');
    },
    bindEvents: function() {      
    },
    render: function(data) {
      var articles = '',
        articles = data.response.docs;
        nyTimesLinks.$nytElem.empty();
        for (var i = 0; i < articles.length; i++) {
          var article = articles[i];
          nyTimesLinks.$nytElem.append('<li class="article">' +
            '<a href="' +article.web_url +'" target="_blank">' +article.headline.main
              +'</a>'
              +'<p>' + article.snippet +'</p>'
            +'</li>');
        };
    },
    getNytimes: function(street, city) {      
      $nytimesAddress = nyTimesLinks.$nytimesAddress + city +"&page=1&sort=newest&api-key=" + this.myKey;
      $.getJSON($nytimesAddress , function(data) {nyTimesLinks.render(data)})
        .fail(function() {
          $nytElem.append('<li class="error-message">New York Times Articles Could Not Be Loaded. Sorry.</li>');
        });
    }
  };
  
  var wikiLinks = {
    init: function() {
      this.$wikiAddress = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=';
      this.cacheDom();
    },
    cacheDom: function() {
      this.$wikiElem = $('#wikipedia-links');
    },
    bindEvents: function() {      
    },
    render: function(data) {
      this.$wikiElem.empty();
      for (var i = 0; i < data[1].length; i++) {
        this.$wikiElem.append('<li class="wiki-topics"><a href=' + data[3][i] + ' target="_blank">' + data[1][i] +'</a></li>');
      };
      clearTimeout(this.wikiRequestTimeout);
    },
    getWiki: function(city) {
      var wikiAddress = this.$wikiAddress + city + '&format=json&callback=wikiCallback';
      // For Errors in the Request
      this.wikiRequestTimeout = setTimeout(function() {
          wikiLinks.$wikiElem.text("failed to get wikipedia resources");
        }, 5000);
      $.ajax({
        url: wikiAddress,
        dataType: 'jsonp',
        success: function(data) { 
          wikiLinks.render(data);
        }
      });
    }
  };
  
  
  $(function() {
    movingCompanion.init();
  }());
})();