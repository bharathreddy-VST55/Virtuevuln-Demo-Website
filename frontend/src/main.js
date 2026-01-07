'use strict';

// Flag to prevent multiple initializations
let dependenciesInitialized = false;

export const initDependencies = () => {
  // Prevent multiple initializations
  if (dependenciesInitialized) {
    return;
  }
  
  const $ = window.jQuery;
  if (!$) {
    console.warn('jQuery not loaded yet');
    return;
  }

  // Preloader
  if ($('#preloader').length) {
    $('#preloader')
      .delay(100)
      .fadeOut('slow', function () {
        $(this).remove();
      });
  }

  // Smooth scroll for the navigation menu and links with .scrollto classes
  $(document).on(
    'click',
    '.nav-menu a, .mobile-nav a, .scrollto',
    function (e) {
      if (
        window.location.pathname.replace(/^\//, '') ==
          this.pathname.replace(/^\//, '') &&
        window.location.hostname == this.hostname
      ) {
        e.preventDefault();
        var target = $(this.hash);
        if (target.length) {
          var scrollto = target.offset().top;
          var scrolled = 20;

          if ($('#header').length) {
            scrollto -= $('#header').outerHeight();

            if (!$('#header').hasClass('header-scrolled')) {
              scrollto += scrolled;
            }
          }

          if ($(this).attr('href') == '#header') {
            scrollto = 0;
          }

          $('html, body').animate(
            {
              scrollTop: scrollto
            },
            1500,
            'easeInOutExpo'
          );

          if ($(this).parents('.nav-menu, .mobile-nav').length) {
            $('.nav-menu .active, .mobile-nav .active').removeClass('active');
            $(this).closest('li').addClass('active');
          }

          if ($('body').hasClass('mobile-nav-active')) {
            $('body').removeClass('mobile-nav-active');
            $('.mobile-nav-toggle i').toggleClass(
              'icofont-navigation-menu icofont-close'
            );
            $('.mobile-nav-overly').fadeOut();
          }
          return false;
        }
      }
    }
  );

  // Mobile Navigation - only initialize if not already done
  if ($('.nav-menu').length && !$('.mobile-nav').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    if (!$('.mobile-nav-toggle').length) {
      $('body').prepend(
        '<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>'
      );
    }
    if (!$('.mobile-nav-overly').length) {
      $('body').append('<div class="mobile-nav-overly"></div>');
    }

    $(document).on('click', '.mobile-nav-toggle', function () {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass(
        'icofont-navigation-menu icofont-close'
      );
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function (e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function (e) {
      var container = $('.mobile-nav, .mobile-nav-toggle');
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass(
            'icofont-navigation-menu icofont-close'
          );
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($('.mobile-nav, .mobile-nav-toggle').length) {
    $('.mobile-nav, .mobile-nav-toggle').hide();
  }

  // Navigation active state on scroll - use off() first to prevent duplicates
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');

  $(window).off('scroll.nav-active').on('scroll.nav-active', function () {
    var cur_pos = $(this).scrollTop() + 90;

    nav_sections.each(function () {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav
          .find('a[href="#' + $(this).attr('id') + '"]')
          .parent('li')
          .addClass('active');
      }
      if (cur_pos < 300) {
        $('.nav-menu ul:first li:first').addClass('active');
      }
    });
  });

  // Toggle .header-scrolled class to #header when page is scrolled - use off() first to prevent duplicates
  $(window).off('scroll.header-scroll').on('scroll.header-scroll', function () {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Back to top button - use off() first to prevent duplicates
  $(window).off('scroll.back-to-top').on('scroll.back-to-top', function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function () {
    $('html, body').animate(
      {
        scrollTop: 0
      },
      1500,
      'easeInOutExpo'
    );
    return false;
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $('.testimonials-carousel').owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

  // Init AOS
  function aos_init() {
    // eslint-disable-next-line no-undef
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        once: true
      });
    }
  }
  aos_init();
  
  // Mark as initialized
  dependenciesInitialized = true;
};
