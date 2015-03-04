
(function($) {

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


 });


})(jQuery);
