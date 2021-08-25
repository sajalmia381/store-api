(function ($) {
  "use strict";
  /* smooth Scroll */
  // let HtmlBody = $('html, body');
	// $('a[href*="#"]:not([href="#').on('click', function () {
	// 	if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
	// 		var target = $(this.hash);
	// 		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
	// 		if (target.length) {
	// 			HtmlBody.animate({
	// 				scrollTop: target.offset().top - 70
	// 			}, 1000);
	// 			return false;
	// 		}
	// 	}
	// });
  
  // Home try
  var siteBaseUrl = window.location.origin;
  $('#response_try_btn').on('click', function(e) {
    const endpoint = siteBaseUrl + '/api/products/running-shoes';
    const tryLoaderEle = $("#try__loader");
    const preEle = $('#response_try_pre');
    preEle.hide();
    tryLoaderEle.removeClass('d-none');
    fetch(endpoint)
      .then(response => response.json())
      .then(({data}) => {
        console.log(data)
        // const code = $('<code></code>').addClass('language-javascript').text(JSON.stringify(data));
        // console.log(code)
        
        setTimeout(() => {
          tryLoaderEle.addClass('d-none');
          preEle.fadeIn();
        }, 1000)
      })
      .catch(err => {
        alert('Something is wrong')
        console.warn('api error', err)
      });
  })
})(jQuery);