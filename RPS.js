
(function($) {

  /* prevent 300ms delay on mobile web */
  function NoClickDelay(el) {
    this.element = el;
    if( window.Touch ) this.element.addEventListener('touchstart', this, false);
  }

  NoClickDelay.prototype = {
    handleEvent: function(e) {
      switch(e.type) {
        case 'touchstart': this.onTouchStart(e); break;
        case 'touchmove': this.onTouchMove(e); break;
        case 'touchend': this.onTouchEnd(e); break;
      }
    },

    onTouchStart: function(e) {
      e.preventDefault();
      this.moved = false;

      this.element.addEventListener('touchmove', this, false);
      this.element.addEventListener('touchend', this, false);
    },

    onTouchMove: function(e) {
      this.moved = true;
    },

    onTouchEnd: function(e) {
      this.element.removeEventListener('touchmove', this, false);
      this.element.removeEventListener('touchend', this, false);

      if( !this.moved ) {
        // Place your code here or use the click simulation below
        var theTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;

        var theEvent = document.createEvent('MouseEvents');
        theEvent.initEvent('click', true, true);
        theTarget.dispatchEvent(theEvent);
      }
    }
  };


  window.RPS = {

    p1Score : 0,

    p2Score : 0,

    cards : [
      'rock',
      'paper',
      'scissors'
    ],

    scoringMatrix : {
      'rock':{
        'scissors':{
          'action':'breaks'
        }
      },
      'paper':{
        'rock':{
          'action':'covers'
        }
      },
      'scissors':{
        'paper':{
          'action':'cut'
        }
      }
    },


    play : function(p1, p2) {

      RPS.gameEnded = true;

      if ( p1 === p2 ) {
        $('.message').text('draw!');
      } 

      if ( RPS.scoringMatrix[p1][p2] ) {
        RPS.p1Score++;
        $('.message').addClass('win').text(p1 + ' ' + RPS.scoringMatrix[p1][p2].action + ' ' + p2 + '!');
      }

      if ( RPS.scoringMatrix[p2][p1] ) {
        RPS.p2Score++;
        $('.message').addClass('lose').text(p2 + ' ' + RPS.scoringMatrix[p2][p1].action + ' ' + p1);
      }

      $('#player-one-score').text(RPS.p1Score);
      $('#player-two-score').text(RPS.p2Score);

      window.setTimeout(RPS.reset,2000);

    },

    reset : function() {
      $('.message').removeClass('win lose').text('');
      $('#player-two-card').cycleCards(300);
      $('#player-one-card').hide();
      $('.play').show();
      RPS.gameEnded = false;
    },  


    randomCard : function() {

      return Math.floor(Math.random() * 3);

    }

  };

 $(document).ready(function(){

  $.fn.cycleCards = function(ms){
    var el = this;
    var clearInterval = window.setInterval(function(){
      var index = parseInt( el.attr('data-index') );
      if ( ++index >= RPS.cards.length ) {
        index = 0;
      }
      el.attr('data-index', index);
    },ms);
    el.attr('data-interval', clearInterval);
    return $(el);
  };

  $('#player-two-card').cycleCards(300);

 	$('.play').click(function(e){
      e.preventDefault();
      $(this).hide();
      $('.rps-player-one .card').show().cycleCards(500);
      window.clearInterval($('#player-two-card').attr('data-interval'));
      $('#player-two-card').attr('data-index', RPS.randomCard()).hide();
      $('.question-mark').show();
 	});



  $('#player-one-card').click(function(e){

    e.preventDefault();

    if ( RPS.gameEnded ) {
      return false;
    }

    window.clearInterval($(this).attr('data-interval'));

    $('.question-mark').hide();
    $('#player-two-card').show();

    RPS.play(
      RPS.cards[$('#player-one-card').attr('data-index')],
      RPS.cards[$('#player-two-card').attr('data-index')]
    );

  });

    NoClickDelay(document.getElementById('player-one-card'));


 });


})(jQuery);
