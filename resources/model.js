function GameModel(){
    this.view = new View();
    this.controller = new Controller();
    this.token = null;
    this.avatarClickable = true;
    this.playButtonClickable = false;
    this.bothPlayersSelected = false;
    this.turn = 1;
    this.roundTime = 60; //just a starting number, tracks amount of time left in round;
    this.roundTimer = null;
    this.apiResponse = 0;
    this.questions = {};
    this.players = {
        //1 : Player {}
        //2 : Player {}
        //built using the add
    }
    this.winnerQuote = true;
    this.damageBank = null;
    this.dmgMultiplier = 0;

    this.endGame = function(){
        this.token = null;
        this.avatarClickable = true;
        this.playButtonClickable = false;
        this.bothPlayersSelected = false;
        this.turn = 1;
        this.roundTime = 60;
        this.roundTimer = null;
        this.apiResponse = 0;
        this.questions = {};
        this.players = {
            //1 : Player {}
            //2 : Player {}
            //built using the add
        }
        this.winnerQuote = true;
        this.dmgMultiplier = 0;
        $('.chuckNorrisQuote p').empty();
        $('.hitPoints').css('width','100%');
        $('.playerAvatar').removeClass('playerAvatarClicked');
        game.controller.getSessionToken();
        $('.row:last-child').removeClass('readyPlayButton');
        $('.dmg').hide();

    }

    this.resetCharacterSelection = function(){
        $('.playerContainerLeft').css('background-image', "none");
        $('.playerContainerRight').css('background-image', "none");
        $('.playerOnHoverLeft div span').text("");
        $('.playerOnHoverRight div span').text("");
        $('.characterName').text("");
    }

    this.availableCharacters = {
        'deadpool' : {
            name: 'Deadpool',
            img: 'deadpool.png',
            category: 'General Knowledge',
            categoryID: '9',
            heroID: '213'
        },
        'magneto' : {
            name: 'Magneto',
            img: 'magneto.png',
            category: "Science: Computers",
            categoryID: '19',
            heroID: '423'
        },
        'thething' : {
            name: 'The Thing',
            img: 'the-thing.png',
            category: "Science & Nature",
            categoryID: '18',
            heroID: '658'
        },
        'captainamerica' : {
            name: 'Captain America',
            img: 'captain-america.png',
            category: "History",
            categoryID: '18',
            heroID: '149'
        },
        'batman' : {
            name: 'Batman',
            img: 'batman.png',
            category: "Science: Gadgets",
            categoryID: '9',
            heroID: '70'
        },
        'ironman' : {
            name: 'Iron Man',
            img: 'iron-man.png',
            category: 'Vehicles',
            categoryID: '28',
            heroID: '346'
        },
        'thor' : {
            name: 'Thor',
            img: 'thor.png',
            category: 'Mythology',
            categoryID: '20',
            heroID: '659'
        },
        'domino' : {
            name: 'Domino',
            img: 'domino.png',
            category: "Entertainment: Video Games",
            categoryID: '15',
            heroID: '227'
        },
        'wonderwoman' : {
            name: 'Wonder Woman',
            img: 'wonder-woman.png',
            category: "Art",
            categoryID: '27',
            heroID: '720'
        },
        'mystique' : {
            name: 'Mystique',
            img: 'mystique.png',
            category: 'Sports',
            categoryID: '21',
            heroID: '480'
        },
        'scarletwitch' : {
            name: 'Scarlet Witch',
            img: 'scarlet-witch.png',
            category: "Science & Nature",
            categoryID: '23',
            heroID: '579'
        },
        'superman' : {
            name: 'Superman',
            img: 'superman.png',
            category: "Entertainment: Comics",
            categoryID: '29',
            heroID: '644'
        }
    };

    this.gameBoardBackgrounds = [
      'airport.gif',
      'backalley.gif',
      'castle-ruins.gif',
      'jungle-temple.gif',
      'mansion.gif',
      'over-pass.gif',
      'ruins.gif',
      'ship.gif',
      'shipinterior.gif',
      'water-fall.gif',
      'wood-ruins.gif'
    ];

    this.addPlayer = function(character){
        //take selection from player select screen and add that character for that player
        this.players[this.turn] = new Player(character, this);
        if (this.turn === 1){
            this.turn = 2;
        } else {
            this.avatarClickable = false;
            game.view.activePlayButton();
            this.bothPlayersSelected = true;
        }
    }
}

function Player(characterSelection, game){
    this.hitPoints = 100; //we can do whatever here. 100 is just a starting point.
    this.character = game.availableCharacters[characterSelection];

}
