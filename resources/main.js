

$(document).ready(initialize)

function initialize(){

    var game = new GameModel();
    var view = new View(game);
    var controller = new Controller(game);
    game.setController(controller);
    game.setView(view);
    view.setController(controller);
    controller.setView(view);
    controller.buildQuestionShoe();
    addClickHandlers(game, view,controller);
    view.handleAvatarHover();
    controller.getCharacterInfo();
}

function addClickHandlers(game, view, controller){
    $('.playerAvatar').click(function(){
        if (game.avatarClickable){
            console.log(game.turn);
            var characterSelection = $(event.target).attr('id');
            game.addPlayer(characterSelection);
            view.addOutlineToSelectedPlayer();
        }
    });
    $('.questionModal').on('click', '.answer', function(){
        controller.selectAnswer(this, view)
    });
    $('.readyButton').on('click',function(){
        controller.questionBank(game.questions);
        $('.readyBanner').fadeOut()
    });
}


function GameModel(){
    this.gameState = 'playerSelection'; //playerSelection, loading, trivia, ready, endgame
    this.avatarClickable = true;
    this.playButtonClickable = false;
    this.bothPlayersSelected = false;
    this.turn = 1;
    this.roundTime = 60; //just a starting number, tracks amount of time left in round;
    // this.questionsLeft = 10; //tracks the number of questions asked
    this.questions = {};
    this.players = {
        //1 : Player {}
        //2 : Player {}
        //built using the add
    };
    var controller = null;
    this.setController = function(control){
        controller = control;
        delete this.setController;
    };
    var view = null;
    this.setView = function(viewer){
        view = viewer;
        delete this.setView;
    };

    this.backgrounds = [
      'sewers.gif',
      'water-fall.gif',
      'wood-ruins.gif',
      'mansion.gif',
      'over-pass.gif'
    ];

    this.availableCharacters = {
        'superman' : {
            name: 'Superman',
            img: 'superman.png',
            category: 'General Knowledge',
            categoryID: '9',
            heroheroID: '644'
        },
        'libertybelle' : {
            name: 'Liberty Belle',
            img: 'liberty-belle.png',
            category: "History",
            categoryID: '19'
        },
        'thething' : {
            name: 'The Thing',
            img: 'thing.png',
            category: "Science & Nature",
            categoryID: '18',
            heroID: '658'
        },
        'mrfantastic' : {
            name: 'Mr. Fantastic',
            img: 'mr-fantastic.png',
            category: 'Computers',
            categoryID: '18',
            heroID: '456'
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
        'nightcrawler' : {
            name: 'Nightcrawler',
            img: 'nightcrawler.png',
            category: "Entertainment: Video Games",
            categoryID: '15',
            heroID: '490'
        },
        'wonderwoman' : {
            name: 'wonderwoman',
            img: 'wonderwoman.png',
            category: "Art",
            categoryID: '27',
            heroID: '720'
        },
        'juggernaut' : {
            name: 'Juggernaut',
            img: 'juggernaut.png',
            category: 'Sports',
            categoryID: '21',
            heroID: '374'
        },
        'mrsinister' : {
            name: 'Mr. Sinister',
            img: 'mr-sinister.png',
            category: "Science & Nature",
            categoryID: '23',
            heroID: '460'
        },
        'robin' : {
            name: 'Robin',
            img: 'robin.png',
            category: "Entertainment: Comics",
            categoryID: '29',
            heroID: '561'
        }
    };


    this.addPlayer = function(character){
        //take selection from player select screen and add that character for that player
        this.players[this.turn] = new Player(character, this);
        if (this.turn === 1){
            this.turn = 2;
        } else {
            this.gameState = 'loading';
            this.avatarClickable = false;
            view.activePlayButton();
            this.bothPlayersSelected = true;
            //display loading screen
            //gather trivia questions based on characters
            //when done, load function will trigger ready state
        }
    }
}


function Player(characterSelection, game){
    this.hitPoints = 100; //we can do whatever here. 100 is just a starting point.
    this.character = game.availableCharacters[characterSelection];
    this.trivia = {}; //object of arrays of objects

    this.getWinQuote = function(characterName){
        //calls chuck norris api
        //replaces chuck norris with character characterName
        //returns info
    }

}

function View(model){
  //all of our functions for updating the view will go here

    this.showEndgameWinner = function() {
        var winner;
        var winnerImg;

        if (model.players['1']['hitPoints'] > 0) {
            // winner = model.players['1']['name'];
            winner = model.players['1']['character']['name'];
            winnerImg = model.players['1']['character']['img']
        } else {
            // winner = model.players['2']['name'];
            winner = model.players['2']['character']['name'];
            winnerImg = model.players['2']['character']['img']
        }
        controller.getQuote(winner, winnerImg);
        setTimeout(function () {

            $('.gameBoard').hide();
            $('.winnerModal').show();

        }, 3000)
        //wait a few seconds
        //add the win quote for the character to the win modal
        //show the win modal
    };
    var controller=null;
    this.setController = function(control){
        controller = control;
        delete this.setController;
    };
    this.renderQuestion = function(qArray){ //renders Question and answers into Arena
        // this'll take qbank question array as a parameter
        console.log('****start of function + ',qArray);
        $('.answer').remove();
        var entry = qArray.shift();
        console.log('****after shift + ',qArray);
        var category = entry.category;
        var question = controller.domParser(entry.question);//parses html entities from api string
        var ansList = entry.incorrect_answers; //array of incorrect answers
        var correctAns = entry.correct_answer;
        var randomNum = Math.floor(Math.random()*4);
        ansList.splice(randomNum,0, correctAns);
        // model.questionsLeft--;
        var catSpan = $('<span>',{
            text: category,
            'class': 'category'
        });
        console.log('****after after span creation ',qArray);
        $('.questionContainer p').text(question).append(catSpan);
        for(var ans_i=0;ans_i<ansList.length;ans_i++){
            this.createAnsDiv(ans_i,ansList[ans_i], entry);
        }
        console.log('****after appending + ',qArray);
        if(model.questionBank.length===0){
            //wincheckstate & player change
            controller.checkWinState();
            console.log('****after checking winstate + ',qArray);
        }

    };
    this.createAnsDiv=function(num,text, entry){
        var ansDiv= $('<div>',{
            id: 'q'+num,
            'class': 'answer',
            text: controller.domParser(text)
        });
        ansDiv[0].difficulty = entry.difficulty;
        ansDiv[0].category = entry.category;
        if(text!==entry.correct_answer){ //stores correct and incorrect properties inside the DOM element
            ansDiv[0].answer= 'incorrect';
        }else{
            ansDiv[0].answer = 'correct'
        }
        $('.questionModal').append(ansDiv)
    };
    this.renderDmg = function(amount){
        var percent = amount/100;//get percent equivalent of the dmg
        var hpBar=null;
        var hp=null;
        var dmg=null;
        var remainingHp=null;
        if(model.turn === 1){
            hpBar = $('.right');

        }else{
            hpBar = $('.left')
        }
        var hpBar2 = hpBar.css('width');
        hp = parseInt(hpBar2.substring(0,hpBar2.indexOf('p')));
        dmg = Math.round(hp*percent);
        if(hp-dmg<0){
            remainingHp=0;
        }else{
            remainingHp=hp-dmg
        }
        hpBar.css('width', remainingHp+"px") //reduces the width by the percentage of the dmg.
    };

  //
  // this.addOutlineToSelectedPlayer = function(){
  //     $(this).addClass('playerAvatarClicked');
  //     console.log(this);
  // }

    this.addOutlineToSelectedPlayer = function(){
        $(event.target).addClass('playerAvatarClicked');
    };

    this.activePlayButton = function(){

        model.playButtonClickable = true;
        $('.playButton').click(function(){
            if(model.playButtonClickable) {
              model.playButtonClickable = false;
              model.avatarClickable = false;
              model.turn = 1;


              $('.modalContainer').fadeOut(3000);
              $('.gameBoard').fadeIn(1500);
              $('.readyBanner').slideDown('slow');

              // add function that triggers game start/load screen
            }
        })
    };

    this.handleAvatarHover = function (){
            $('.playerAvatar').hover(function () {
                if (model.bothPlayersSelected === false) {
                    var characterImg = $(event.target).attr('id');
                    if (model.turn === 1) {
                        $('.playerContainerLeft').css('background-image', "url('resources/images/characters/" + model.availableCharacters[characterImg].img + "')");
                    } else {
                        $('.playerContainerRight').css('background-image', "url('resources/images/characters/" + model.availableCharacters[characterImg].img + "')");
                    }
                }
            }, function () {
                if (model.turn === 1) {
                    $('.playerContainerLeft').removeClass('playerPhotoLeft');
                } else {
                    $('.playerContainerRight').removeClass('playerPhotoRight');
                }
            });
        }

    // this.handlePlayerInfoOnHover = function(){
    //     $('.playerAvatar').hover(function () {
    //         if (model.bothPlayersSelected === false) {
    //             var characterInfo = $(event.target).attr('id');
    //             if (model.turn === 1) {
    //
    //             }
    //         }
    //     })
    // }

}


function Controller(model,view){

    this.questionBank = function(questionsObj){
        var qBank = [];
        for(key in questionsObj){
            // for(var main_i = 0;main_i<questionsArrMain.length;main_i++){
                var maxQ = 3;
                if(key==='easy'){
                    maxQ=4
                }
                for(var sub_i=0;sub_i<maxQ;sub_i++){
                    var qEntry = questionsObj[key].shift();
                    var qA = {
                        question: qEntry.question,
                        category: qEntry.category,
                        difficulty: qEntry.difficulty,
                        correct_answer: qEntry.correct_answer,
                        incorrect_answers: [qEntry.incorrect_answers[0],qEntry.incorrect_answers[1],qEntry.incorrect_answers[2]]
                    };
                    qBank.push(qA)
                }
            }
        model.questionBank = qBank;
        view.renderQuestion(model.questionBank);
    };


  this.dealDamage = function(amount){
    model.turn === 1
    ? model.players[model.turn + 1]['hitPoints'] -= amount
    : model.players[model.turn - 1]['hitPoints'] -= amount;
    view.renderDmg(amount);
    if(model.questionBank===0 || model.players[2]['hitPoints']===0 ||  model.players[1]['hitPoints']===0){
        this.checkWinState();
    }

  };

  this.dmgCalculator = function(difficulty, boolean){
      var damagePercent = 0;
      if(boolean){
          damagePercent+=5;
      }
      switch (difficulty){
          case 'easy':
              damagePercent+=20;
              break;
          case 'medium':
              damagePercent+=25;
              break;
          case 'hard':
              damagePercent+=30;
              break;
      }
      return damagePercent
  };

    var view = null;
    this.setView = function (viewer) {
        view = viewer;
        delete this.setView;
    };


  this.getSessionToken = function(){  //avoids receiving same question w/in 6 hour period
      $.ajax({
          method: 'GET',
          dataType: 'JSON',
          url: 'https://opentdb.com/api_token.php',
          data: {
            command: 'request'
          },
          success: function(data){
             if(data.response_code ===0 ){
                model.token = data.token;
             }else{
                 console.error('server response'+ data.response_code +" "+data.response_message);
             }
          },
          error: function(){
              console.log('error input');
          }
      });
  };

  this.checkWinState = function() {
      if (model.players['1']['hitPoints'] <= 0 || model.players['2']['hitPoints'] <= 0) {
          model.clickable = false;//fix this, it is no longer a valid variable name
          model.gameState = 'endgame';
          view.showEndgameWinner();
      } else {
          if (model.turn === 1) {
              model.turn += 1;
          } else {
              model.turn -= 1;
          }
          $('.readyBanner').slideDown('slow');
          this.questionBank(model.questions)
      }
  };

      this.retrieveQuestions = function (diff) {
          $.ajax({
              method: 'GET',
              dataType: 'JSON',
              data: {
                  'amount': 50,
                  difficulty: diff,
                  type: 'multiple',
                  token: model.token
              },
              url: 'https://opentdb.com/api.php',
              success: function (data) {
                  if (data.response_code === 0) {
                      model.questions[diff] = data.results;
                      console.log('finished ' + diff );
                  } else {
                      alert('Issue with question retrieval. Response code: ' + data.response_code);
                  }
              },
              error: function () {
                  console.log('error input')
              }
          });
      };
      this.buildQuestionShoe = function () {
          console.log('build shoe');
          var difficulty = ['easy', 'medium', 'hard'];

          difficulty.forEach((element) => {
              this.retrieveQuestions(element);
          });

      };

    this.getCharacterInfo = function () {
        for (var key in model.availableCharacters){
            $.ajax({
                method: 'get',
                url: 'https://cors-anywhere.herokuapp.com/' + 'http://superheroapi.com/api/10159579732380612/' + model.availableCharacters[key].heroID,
                dataType: 'json',
                success: function (data) {
                    console.log(model.availableCharacters[key] = data);
                },
                error: function () {
                    console.log('something went wrong');
                }
            });
        }
    }

    this.getQuote = function(winner, winnerImg) {
        $.ajax({
            method: 'get',
            url: 'https://api.chucknorris.io/jokes/random',
            dataType: 'json',
            success: function (quote) {
                console.log('original', quote.value);
                var regEx = new RegExp('chuck norris', 'ig');  //find the word 'chuck norris' in a quote no matter if it's uppercase or lowercase
                var chuckNorrisQuote = quote.value;
                var winnerQuote = chuckNorrisQuote.replace(regEx, winner); //change the word 'chuck norris' with winner's name
                var greenTxt = winnerQuote.replace(winner, winner.fontcolor('limegreen')) //makes font tag to change color of the name
                $('.chuckNorrisQuote p').append(greenTxt);

                $('.winningCharacter').css('background-image', 'url("resources/images/characters/' + winnerImg + '")')
                console.log('winnerQuote', winnerQuote);
                return winnerQuote;
            },
            error: function () {
                console.log('something went wrong!')
            }
        });
    }

      this.selectAnswer = function (element) {
        console.log('hey select answer here', element.answer, model.turn); //delete me after a while

          var specialty = false;

          if (element.answer === 'correct') {
              if (element.category === model.players[model.turn].character.category) {
                  specialty = true;
              }
              this.dealDamage(this.dmgCalculator(element.difficulty, specialty));
          }
          view.renderQuestion(model.questionBank);
      };
      this.domParser = function (input) {
          var doc = new DOMParser().parseFromString(input, "text/html");
          return doc.documentElement.textContent;
      }

}
