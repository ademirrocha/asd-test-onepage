//VARIAVEIS DE CONTROLE
var totalInt = 9;
var intFeitas = 1;
var totalScore = 0;
var prog = {
    "prog": [
        0,
        false,
        false,
        false
    ]
}

var notaTotalQuiz = 100;
var qtdQuestionsQuiz = 3;
var quizAcertos = 0;

document.addEventListener("DOMContentLoaded", function(event) {
    $('.loading').removeClass('d-flex')
    $('.loading').addClass('d-none')
});

var lmsConnected = false;

//PEGA O SUSPEND DATA

lmsConnected = pipwerks.SCORM.init();
if (lmsConnected) {
    var s_data = pipwerks.SCORM.get('cmi.suspend_data')
    if (s_data != '' && s_data != null) {
        prog = JSON.parse(s_data);
        var arquivado = true;
    }
    //console.log('SUSPEND_DATA: ', s_data)
    //console.log("PROG: ", prog)
}
pipwerks.SCORM.quit();

var progInner = prog.prog;

//FAZ A CHAMADA DO RESUME SUSPEND DATA CASO ELA EXISTA E SEJA VÁLIDA
if (progInner != '') {
    for (var i = 0; i < progInner.length; i++) {
        resumeSuspendData(progInner[i], i);
    }
}

// VIDEO PLAYERS
var player1 = document.querySelector('#playerOne');
player1.onended = function() {
    completedVideo('tarefa1', player1)
    setCompleted(2)
    intFeitas++;
}




//PEGAR PROGRESSO JA EXISTENTE
function resumeSuspendData(element, index) {
    if (element == true && element != 0) {
        setCompleted(index);
        //console.log('TRUE >>>>')
       //console.log('RESUME SUSPEND DATA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
       //console.log('INDEX: ', index, 'ELEMENT: ', element)
        switch (index) {
            case 0:
                totalScore = progInner[0];
                prog["prog"][0] = progInner[0];
                break;
            case 1: //card
                const cartoesConc = document.querySelectorAll('.cartao')

                //console.log('AQUIIIIIIIIIIIIIIII>>>>>>>>>>>>>>>>>')
                //console.log(cartoesConc)

                for (let i = 0; i < cartoesConc.length; i++) {
                    //completedCard(cartoesConc[i]);
                }
                break;
            case 2: //video
                var player1 = document.querySelector('#playerOne');
                completedVideo('tarefa1', player1)
                break;
           case 3:
                let quiz = document.querySelector('.quiz-total-container')
                quiz.innerHTML = `<h1 class="text-white p-5">Você já fez o teste. Nota: ${progInner[0]}</h1>`
                break;
            default:
                break;
        }
    }
    //console.log('FALSE >>>>')
    //console.log('RESUME SUSPEND DATA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    //console.log('INDEX: ', index, 'ELEMENT: ', element)
    atualizaBarra();
}
//console.log('PROG DEBUG >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
//console.log('PROG: ', prog.prog);

function atualizaBarra() {
    intFeitasSc = document.querySelectorAll('[scorm=completed');
    var scrolled = ((intFeitasSc.length + 1) / totalInt) * 100;
    //console.log('intFeitasSc: ', intFeitasSc.length + 1);
    //console.log('totalInt: ', totalInt);
    //console.log('SCROLL: ', scrolled)
    $('#progresso').animate({ width: scrolled + "%" }, 100)
}

function setCompleted(idCompleto) {

    $(`#${idCompleto}`).attr('completed', 'true');
    var prox = idCompleto + 1;
    if (parseInt(intFeitasSc.length + 1) < totalInt) {
        $(`#${idCompleto}-block`).addClass('d-none');
        $(`#${idCompleto}-block`).removeClass('d-flex');
        $(`#${prox}-block`).removeClass('d-none');
        $(`#${prox}-block`).addClass('d-flex');

        $(`#${prox}`).removeClass('d-none');
        $(`#${prox}`).addClass('d-flex');
    }

    $('#navFor' + parseInt(idCompleto+1)).removeClass('disabled')
    
    

    prog["prog"][idCompleto] = true;

    if (idCompleto == 3 && !arquivado){
        
        prog["prog"][0] = totalScore;
        
    }
        

    atualizaBarra();

    //console.log(prog);

    pipwerks.SCORM.init();
    pipwerks.SCORM.set('cmi.suspend_data', JSON.stringify(prog));
    pipwerks.SCORM.save();
    pipwerks.SCORM.quit();

    //console.log('FORA IF')
    if (intFeitasSc.length + 1 == totalInt) {
        //console.log('CHAMADA SCORM DENTRO')
        if (progInner != '')
            finalizarScorm(progInner[0]);
        else
            finalizarScorm(totalScore);
    }else{
        navigateTo(parseInt(idCompleto+1), 2000)
    }
}

function finalizarScorm(totalScore) {
    pipwerks.SCORM.init();
    var statusScorm = pipwerks.SCORM.get('cmi.core.lesson_status');
    //console.log('GET STATUS: ', statusScorm)
    var success = pipwerks.SCORM.set('cmi.core.lesson_status', 'completed');
    if (success) {
        pipwerks.SCORM.set('cmi.core.score.raw', totalScore);
        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();
    }
}

function completedVideo(idTarefa, player) {
    var tarefa = document.querySelector(`#${idTarefa}`);
    tarefa.setAttribute('style', 'display: inline');
    tarefa.classList.add("wow");
    tarefa.classList.add("pulse");
    tarefa.setAttribute('data-wow-delay', '2s');
    player.setAttribute('scorm', 'completed');
}

function completedCard(cartao) {
    $(cartao).toggleClass('flipped');
    $(cartao).attr('card', 'completed');
    $(cartao).attr('scorm', 'completed');
    $(cartao).children(":first").toggleClass("d-none")
}

function completedQuestion(question) {

    question = $('.question-container')[question - 1]
    $(question).attr('question', 'completed');
    $(question).attr('scorm', 'completed');

    $('.radiocontainer').each(function(){
        if($(this).is(":visible")){
            $(this).removeClass('radiocontainer-hover')
        }
        
    });
    
    intFeitas++;
    
}

// CARTOES
$('.cartao').click(function() {
    completedCard(this);
    
    const cartoes = $('[card=completed]');
    if (cartoes.length == 3)
        setCompleted(1)
    
    intFeitas++;
});


// QUIZ
//https://github.com/jchamill/jquery-quiz

$('#quiz').quiz({
    // allows incorrect options
    // allowIncorrect: true,

    // counter settings
    // counter: true,
    counterFormat: 'Pergunta %current de %total',

    // default selectors & format
    startScreen: '#quiz-start-screen',
    startButton: '#quiz-start-btn',
    // homeButton: '#quiz-home-btn',
    resultsScreen: '#quiz-results-screen',
    resultsFormat: 'Você acertou %score de %total!',
    // gameOverScreen: '#quiz-gameover-screen',

    // button text
    nextButtonText: 'Continuar',
    finishButtonText: 'Finalizar',
    restartButtonText: '',
    questions: [
        {
            'q': 'O que significa HTML?',
            'options': [
                '<label class="radiocontainer radiocontainer-hover" id="label1" onclick="clickRadio(this)" > Hiperlinks e linguagem de marcação de texto<input type="radio" name="quiz" id="radio1" value="radio1"><span class="checkmark unCheckedRadio" id="check1"></span></label>',
                '<label class="radiocontainer radiocontainer-hover" id="label2" onclick="clickRadio(this)" > Linguagem de marcação de hipertexto<input type="radio" name="quiz" id="radio2" value="radio2"><span class="checkmark unCheckedRadio" id="check2"></span></label>',
                '<label class="radiocontainer radiocontainer-hover" id="label3" onclick="clickRadio(this)" > Linguagem de marcação da ferramenta inicial<input type="radio" name="quiz" id="radio3" value="radio3"><span class="checkmark unCheckedRadio" id="check3"></span></label>',
            ],
            'correctIndex': 1,
            'correctResponse': 'Você Acertou!',
            'incorrectResponse': 'Você Errou!'
        },
        {
            'q': 'Qual das alternativas a seguir está correta?',
            'options': [
                '<label class="radiocontainer radiocontainer-hover" id="label4" onclick="clickRadio(this)" > JQuery é uma biblioteca JSON<input type="radio" name="quiz" id="radio4" value="radio4"><span class="checkmark unCheckedRadio" id="check4"></span></label>',
                '<label class="radiocontainer radiocontainer-hover" id="label5" onclick="clickRadio(this)" > JQuery é uma biblioteca JavaScript<input type="radio" name="quiz" id="radio5" value="radio5"><span class="checkmark unCheckedRadio" id="check5"></span></label>',
            ],
            'correctIndex': 1,
            'correctResponse': 'Você Acertou!',
            'incorrectResponse': 'Você Errou!'
        },
        {
            'q': 'O que CSS significa?',
            'options': [
                '<label class="radiocontainer radiocontainer-hover" id="label6" onclick="clickRadio(this)" > Folhas de estilo criativo (Creative Style Sheets)<input type="radio" name="quiz" id="radio6" value="radio6"><span class="checkmark unCheckedRadio" id="check6"></span></label>',
                '<label class="radiocontainer radiocontainer-hover" id="label7" onclick="clickRadio(this)" > Folhas de estilo em cascata (Cascading Style Sheets)<input type="radio" name="quiz" id="radio7" value="radio7"><span class="checkmark unCheckedRadio" id="check7"></span></label>',
                '<label class="radiocontainer radiocontainer-hover" id="label8" onclick="clickRadio(this)" > Folhas de estilo de computador (Computer Style Sheets)<input type="radio" name="quiz" id="radio8" value="radio8"><span class="checkmark unCheckedRadio" id="check8"></span></label>',
                '<label class="radiocontainer radiocontainer-hover" id="label9" onclick="clickRadio(this)" > Folhas de estilo coloridas (Colorful Style Sheets)<input type="radio" name="quiz" id="radio9" value="radio9"><span class="checkmark unCheckedRadio" id="check9"></span></label>',
            ],
            'correctIndex': 1,
            'correctResponse': 'Você Acertou!',
            'incorrectResponse': 'Você Errou!'
        }
    ],

    // CALLBACKS

    answerCallback: function(currentQuestion, selected, questions) {
        if (selected === questions.correctIndex) {
            totalScore += notaTotalQuiz / qtdQuestionsQuiz;
            quizAcertos++;
        }
        completedQuestion(currentQuestion)
    },

    // nextCallback: function() {
    //     // do something
    // },

    finishCallback: function(total) {
        $('#quiz-results').html('Pontuação final: ' + parseFloat(totalScore).toFixed(2) + ' pontos');
        const questions = $('[question=completed]');
        $('.quiz-total-container').attr('scorm', 'completed')
        if (questions.length == 3)
            setCompleted(3)

        $('#quiz-acertos').html(quizAcertos)
        $('#quiz-questions').html(qtdQuestionsQuiz)
        $('#quiz-pontos').html(parseFloat(totalScore).toFixed(2))
    },

    // homeCallback: function() {
    //     // do something
    // }
});