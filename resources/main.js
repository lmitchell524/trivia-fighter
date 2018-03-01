$(document).ready(initialize);

var game;
function initialize(){
    game = new GameModel();
    game.controller.getSessionToken();
    addClickHandlers();
    game.view.handleAvatarHover();
    game.controller.buildCharacterInfo();
    $('.gameBoard').css('background-image','url("./resources/images/backgrounds/' + game.gameBoardBackgrounds[Math.floor(Math.random()*game.gameBoardBackgrounds.length)] + '")');
}


function addClickHandlers(){
    $('.playerAvatar').click(function(){
        if (game.avatarClickable){
            if (game.turn === 1){
              $('.playerContainerLeft').css({'animation': 'alternate-spin 6s infinite',
              'animation-timing-function': 'linear'});
            } else {
              $('.playerContainerRight').css({'animation': 'alternate-spin 6s infinite',
              'animation-timing-function': 'linear'})
            }
            var characterSelection = $(event.target).attr('id');
            game.addPlayer(characterSelection);
            game.view.addOutlineToSelectedPlayer();
        }
    });

    $('.questionModal').on('click', '.answer', function(){
        game.controller.selectAnswer(this);
    });

    $('.playAgain').click(function(){
        game.endGame();
        game.resetCharacterSelection();
        $('.loadScreen').hide();
        $('.modalContainer').fadeIn(2000);
        $('.winnerModal').hide();
    });

    $('.readyButton').on('click',function(){
        clearInterval(game.roundTimer);
        game.dmgMultiplier = 0;
        game.controller.questionBank(game.questions);
        game.roundTime=60;
        game.view.renderComboButton()
        game.view.renderTimer();
        game.view.playerTurn();
        game.view.renderMultiplier();
        $('.readyBanner').fadeOut();
        $('.questionModal').addClass('questionModalShow');
    });

    $('.dmgBtn').on('click', function(){
        game.dmgMultiplier = 0;
        game.controller.dealDamage(game.damageBank);
        game.view.renderComboButton()
        game.view.renderMultiplier();
    });
    $('.instruction').on('click', function(){
        $('.instruction-content').show();
        $('.modalContainer').hide();
        $('.warning').addClass('hide');
        $('body').css('overflow-y', 'visible');
    });

    $('.back').on('click', function(){
        $('.modalContainer').show();
        $('.warning').removeClass('hide');
        $('.instruction-content').hide();
        $('body').css('overflow-y', 'hidden');
    });
}
