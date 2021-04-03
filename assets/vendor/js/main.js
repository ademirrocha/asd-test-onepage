//VARIAVEIS DE CONTROLE
var totalInt = 6;
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
    console.log('SUSPEND_DATA: ', s_data)
    console.log("PROG: ", prog)
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
        // console.log('TRUE >>>>')
        console.log('RESUME SUSPEND DATA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log('INDEX: ', index, 'ELEMENT: ', element)
        switch (index) {
            case 0:
                totalScore = progInner[0];
                prog["prog"][0] = progInner[0];
                break;
            case 1: //card
                const cartoesConc = document.querySelectorAll('.cartao')

                console.log('AQUIIIIIIIIIIIIIIII>>>>>>>>>>>>>>>>>')
                console.log(cartoesConc)

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
    // console.log('FALSE >>>>')
    // console.log('RESUME SUSPEND DATA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    // console.log('INDEX: ', index, 'ELEMENT: ', element)
    atualizaBarra();
}
// console.log('PROG DEBUG >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
// console.log('PROG: ', prog.prog);

function atualizaBarra() {
    intFeitasSc = document.querySelectorAll('[scorm=completed');
    var scrolled = ((intFeitasSc.length + 1) / totalInt) * 100;
    console.log('intFeitasSc: ', intFeitasSc.length + 1);
    console.log('totalInt: ', totalInt);
    console.log('SCROLL: ', scrolled)
    $('#progresso').animate({ width: scrolled + "%" }, 100)
}

function setCompleted(idCompleto) {

    $(`#${idCompleto}`).attr('completed', 'true');
    var prox = idCompleto + 1;

    $(`#${idCompleto}-block`).addClass('d-none');
    $(`#${idCompleto}-block`).removeClass('d-flex');
    $(`#${prox}-block`).removeClass('d-none');
    $(`#${prox}-block`).addClass('d-flex');

    $(`#${prox}`).removeClass('d-none');
    $(`#${prox}`).addClass('d-flex');

    atualizaBarra();

    prog["prog"][idCompleto] = true;

    if (idCompleto == 3 && !arquivado)
        prog["prog"][0] = totalScore;

    console.log(prog);

    pipwerks.SCORM.init();
    pipwerks.SCORM.set('cmi.suspend_data', JSON.stringify(prog));
    pipwerks.SCORM.save();
    pipwerks.SCORM.quit();

    // console.log('FORA IF')
    if (intFeitasSc.length + 1 == totalInt) {
        // console.log('CHAMADA SCORM DENTRO')
        if (progInner != '')
            finalizarScorm(progInner[0]);
        else
            finalizarScorm(totalScore);
    }
}

function finalizarScorm(totalScore) {
    pipwerks.SCORM.init();
    var statusScorm = pipwerks.SCORM.get('cmi.core.lesson_status');
    // console.log('GET STATUS: ', statusScorm)
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
    questions: [{
            'q': 'Essa é a primeira pergunta',
            'options': [
                'A-) Essa é uma resposta incorreta, ela não soma pontos.',
                'B-) Essa é uma resposta CORRETA, se quiser somar pontos, clique nela!',
                'C-) Essa é uma resposta incorreta, ela não soma pontos.'
            ],
            'correctIndex': 1,
            'correctResponse': 'Acertou!',
            'incorrectResponse': 'Errou!'
        },
        {
            'q': 'Essa é a segunda pergunta.',
            'options': [
                'A-) Essa é uma resposta incorreta, ela não soma pontos.',
                'B-) Essa é uma resposta CORRETA, se quiser somar pontos, clique nela!',
                'C-) Essa é uma resposta incorreta, ela não soma pontos.'
            ],
            'correctIndex': 1,
            'correctResponse': 'Acertou!',
            'incorrectResponse': 'Errou!'
        }
    ],

    // CALLBACKS

    answerCallback: function(currentQuestion, selected, questions) {
        if (selected === questions.correctIndex) {
            totalScore += 50;
        }
    },

    // nextCallback: function() {
    //     // do something
    // },

    finishCallback: function(total) {
        $('#quiz-results').html('Pontuação final: ' + totalScore + ' pontos');
        setCompleted(3)
        intFeitas++;
        $('.quiz-total-container').attr('scorm', 'completed')
    },

    // homeCallback: function() {
    //     // do something
    // }
});