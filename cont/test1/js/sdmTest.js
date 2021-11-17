//// V 20210309 ////


var intentos = 0;
var limitePreguntas;
var finalizacionTest;
var $done = false;

var $correctasArray = []
var $scoreArray = []
var $intentosArray = []
var $aprobadoArray = []
var $respuestasArray = []

    var datosTest = {}
    datosTest.int = {}
    datosTest.score = {}
    datosTest.correctas = {}
    datosTest.preguntas = {}
    datosTest.estado = {}

    
    var sdata = {}
    sdata.btns = {}
    sdata.test = datosTest


    /////////////////////////////  RECUPERO LOCAL STORAGE  /////////////////////////////
/*      var recuperoArray = function(){
          
         var gLocal = localStorage.getItem('datos')

        if (gLocal != null) {
          var sdata = JSON.parse(gLocal)

          var $btnsGuardado = sdata.btns;
          $botonesArray = $btnsGuardado; 
            $botonesArray.push(10);
            sdata.btns = $botonesArray;
            localStorage.setItem('datos', JSON.stringify(sdata));
          
      }
      }
      */

      
    /////////////////////////////  FIN LOCAL STORAGE  /////////////////////////////

var TotalIntentos = 0;
var ii = 1;
//
var $testObject = null,
    $questionsList = null,
    successRatio = 0,
    correctResponseClass = "checked_ok",
    wrongResponseClass = "checked_error",
    correctResponsesList = null,
    clickEvents = ('ontouchstart' in window || !!(navigator.msMaxTouchPoints)) ?
        'touchstart' : 'click',
    confirmMessage = '\u00BFSeguro que desea entregar el examen?\n\nCerciores\u00e9 de las ' +
        'respuestas dadas en todos los test.\nUna vez finalizado no podr\u00e1 ' +
        'modificaras';

//Nuevo
var SalvarIntentos = true,
    SalvarObjetivos = true;

function obtenerOrdenGuardado(modulo, preguntas) {
    var preguntasArray = new Array();

    var array1 = preguntas.split(',');


    var preguntaAnterior = 0;

    var preguntaEncontrada;

    $.each(array1, function () {


        var idRespuesta = this.split(':')[0];
        var array2 = this.split("_");


        if (array2[0] == modulo.id) {
            if (preguntaAnterior != array2[1]) {

                if (preguntaEncontrada != undefined)
                    preguntaEncontrada.respuestas = preguntaEncontrada.respuestas2;

                preguntaAnterior = array2[1];


                //buscando la pregunta
                $.each(modulo.preguntas, function () {
                    var preguntaActual = this;
                    var respuestaEncontrada = false;
                    $.each(this.respuestas, function () {
                        if (this.id == idRespuesta) {
                            preguntaEncontrada = preguntaActual;
                            respuestaEncontrada = true;
                            preguntaEncontrada.respuestas2 = [];
                            preguntasArray.push(preguntaEncontrada);
                            return false;
                        }
                    });
                    if (respuestaEncontrada)
                        return false;
                });//fin buscar la pregunta


            }


            $.each(preguntaEncontrada.respuestas, function () {
                if (this.id == idRespuesta) {
                    preguntaEncontrada.respuestas2.push(this);
                    return false;
                }
            });

        }


    });

    return preguntasArray;
}

function cargarJson() {
$("#numerada").empty();

   //inicializaSCORM();

    var _this = this;
    $.ajax({
        url: 'js/preguntas.json',
        data: {},
        type: 'GET',
        dataType: 'JSON',
        success: function (objetoJson) {

            TotalIntentos = objetoJson.intentos;
            var contadorPreguntas = 1;
            var cuerpo = '';
            var notaAprobacion = objetoJson.nota_aprobacion;
            //var respuestas_guardadas = respuestasGuardadas();
            //var respuestasGuardadasArray = respuestas_guardadas.split(',');
            //Nuevo
            if (objetoJson.guardarIntentos != null)
                SalvarIntentos = objetoJson.guardarIntentos;

            if (objetoJson.guardarObjetivos != null)
                SalvarObjetivos = objetoJson.guardarIntentos;
            //Guardar la data
            if (SalvarIntentos) {
                //var int = getData('cmi.comments', 'int');
                if (int != undefined && int != "") {
                    intentos = int;
                } else {
                    intentos = objetoJson.intentos;
                    //Set
					datosTest.int = intentos;
                    //saveData('cmi.comments', intentos, 'int');
                }
            } else {
                intentos = objetoJson.intentos;
            }
            //
            finalizacionTest = objetoJson.finalizacionTest;
            limitePreguntas = objetoJson.limite_preguntas;

            $.each(objetoJson.modulos, function () {
                $("#numerada").append('<div class="modulo">' + this.titulo + '</div>');

                var contadorPregunta = 1;

                var preguntas = new Array();


                $.each(this.preguntas, function () {

                    if (preguntas.length < limitePreguntas)
                        preguntas.push(this);

                });

                if (this.preguntas_aleatorias){
                    var temp = shuffle(preguntas);
                    preguntas = new Array();
                    // Arreglo.
                    for (let i = 0; i < limitePreguntas; i++) {
                        preguntas.push(temp[i]);
                    }
                    console.log(preguntas);
                }


                /*if (respuestas_guardadas.length > 0)
                    preguntas = obtenerOrdenGuardado(this, respuestas_guardadas);*/

                $.each(preguntas, function () {


                    var arrayRespuestas = new Array();
                    var respuestas = '';
                    var letras = ['a', 'b', 'c', 'd'];
                    var contadorRespuestas = 1;

                    $.each(this.respuestas, function () {
                        arrayRespuestas.push(this);
                    });

                    if (this.respuestas_aleatorias)
                        arrayRespuestas = shuffle(arrayRespuestas);

                    $.each(arrayRespuestas, function () {

                        if (this.correcta)
                            if (cuerpo.length == 0)
                                cuerpo += (contadorRespuestas - 1);
                            else
                                cuerpo += ',' + (contadorRespuestas - 1);


                        var idRespuesta = this.id;
                        var valorRespuesta = "";

                       /* if (respuestas_guardadas.length > 0) {
                            $.each(respuestasGuardadasArray, function () {
                                var id = this.split(':')[0];
                                var valor = this.split(':')[1];
                                if (idRespuesta == id && valor == 1) {
                                    valorRespuesta = 'checked="checked"';
                                    return false;
                                }
                            });
                        }*/

                        respuestas += '<li><input ' + valorRespuesta + ' respuesta_id="' + this.id + '" name="opcion_p' + contadorPreguntas + '" type="radio" value="' + letras[contadorRespuestas - 1] + '" class="la_' + letras[contadorRespuestas - 1] + '"><label>' + this.description + '</label></li>';

                        contadorRespuestas++;
                    });

                    //if(this.feddback)
                    respuestas += '<div class="feedback" id="feedback' + contadorPreguntas + '" >' + this.feddback + '</div>';

                    var numeroPregunta = '';

                    if (objetoJson.mostrar_numero_pregunta)
                        numeroPregunta = contadorPregunta + '.- ' + this.titulo;
                    else
                        numeroPregunta = this.titulo;

                    $("#numerada").append('<li class="LIpregunta"><div feedback="feedback' + contadorPreguntas + '" class="cajaPregunta" feedbackVisible="' + this.feedbackVisible + '"><p class="pregunta">' + numeroPregunta + '</p><ul>' + respuestas + '</ul><div class="fed" style="display: none"></div></div></li>');


                    contadorPregunta++;
                    contadorPreguntas++;
                });

            });

            cuerpo = '1;' + cuerpo + ';' + notaAprobacion;
            $('#cuerpo').attr('sdm_test', cuerpo);
			



        },
        async: false,
        error: function (jqXHR, status, error) {
            alert('Disculpe, existe un problema');
        }
    });
	
	
	$('label').click(function () {

          if ($(this).parent().find('input:radio').is(":checked")) {

            $(this).parent().find('input:radio').prop("checked", false).addClass("ChekFALSE");
          } else {
            $(this).parent().find('input:radio').prop("checked", true).addClass("ChekTRUE");
          }
	});
	   $('input[type=radio]').click(function (e) {
          e.stopPropagation();
        });
};

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 != currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

function setup() {
	 $('.finalizar').hide();
	 $('.reintentar').hide();
	
	$("body, html").animate({ scrollTop:0}, 1000);
    cargarJson();
    // Ver si se completo o no.
    var passed = undefined;
	
	$(document).on( 'scroll', function(){
		$(".scrollTest").fadeOut();
	});
	
    $testObject = $('[sdm_test]');
    $questionsList = $('[sdm_test] div').has('input');

    if ($testObject.length == 0) return;

    var testParametersList = $testObject.attr('sdm_test').split(';');
    if (testParametersList.length < 3) {
        console.log('setup(): incorrect sdm_test content');
        return;
    }
    if (testParametersList[0] == 1) {
        //inicializaSCORM();
        //startTimer();
    }
    correctResponsesList = testParametersList[1].split(',');
    successRatio = testParametersList[2] * 1;

    if (testParametersList.length == 4) {
        correctResponseClass = testParametersList[3].split(',')[0];
        wrongResponseClass = testParametersList[3].split(',')[1];
    }
    if (passed == undefined || passed == "") {
        $('.revisar').hide();
        //saveSingleData('cmi.core.lesson_status', 'incomplete');
    }
    // Mostrar en el global
    if (passed != undefined && passed != "") {
        GlobalScore();
        if (intentos > 0) {
            $('.enviar').show();
        }
        $('.revisar').hide();
    }
    if (passed == 'true' && intentos > 0) {
        //Llamar al modal.
        //PopAprobadoIntentos();
        $('.revisar').show();
        $('.guardar').hide();
        $('.enviar').hide();
        $('.reintentar').show();
        $('.finalizar').hide();
    }
    // Si esta pasado y se acabaron los intentos.
    if (passed == 'true' && intentos == 0) {
        //Llamar al modal.
        //PopAprobado();
        $('.revisar').show();
        $('.guardar').hide();
        $('.enviar').hide();
        $('.reintentar').hide();
        $('.finalizar').hide();
        //getBestResponses();
        disableTest();
    }
    if (passed != 'true' && intentos == 0) {
        //Llamar al modal.
        //PopDesaprobado();
        $('.revisar').hide();
        $('.guardar').hide();
        $('.enviar').hide();
        $('.reintentar').hide();
        $('.finalizar').hide();
        //getLastResponses();
        disableTest();
    }
    if (passed == 'true' && intentos > 0) {
        disableTest();
        $('.reintentar').show();
        $('.revisar').show();
    }
    if (passed == 'true' && intentos > 0) {
        $('.enviar').show();
        $('.reintentar').hide();
        $('.revisar').hide();
    }
/*    if (isTestRecordedTwo() && intentos > 0) {
        //getResponses();
    }*/
    $('[sdm_test] [sdm_button="a"]').on(clickEvents, function () {
        if (recordResponses(true)) {
            alert('Las respuestas fueron guardadas.');
        }
    });
    $('[sdm_test] [sdm_button="b"]').on(clickEvents, function () {
        if (recordResponses(true)) {
            checkResponses(true);
        }
        //Liberar los datos guardados
        if (intentos > 0) {
            //cleanSuspend_Data();
        }

    });
    $('[sdm_test] [sdm_button="c"]').on(clickEvents, function () {
        //CerrarIntentos();
        if (testParametersList[0] == 1) terminarSesion();
        setTimeout(Cerrar, 800);
    });
    //Boton revisar.
    $('[sdm_test] [sdm_button="e"]').on(clickEvents, function () {
        Limpiar();
        //getBestResponses();
        disableTest();
    });
	


}
;


function Cerrar() {

    top.window.close();
    window.close();
    self.close();
    close();

}

function recordResponses(controlarTodas) {
    //NewFix
    var tempp = $done
    if (tempp == 'true' && intentos > 0) {
        //saveSingleData('cmi.core.lesson_status', 'completed');
    } else if (tempp == 'false' && intentos > 0) {
        //saveSingleData('cmi.core.lesson_status', 'incomplete');
    }
    //
    var isRecordable = true;

    if (controlarTodas) {
        $questionsList.each(function (indexQuestion) {
            if ($(this).find('input')
                .filter(function () {
                    return $(this).prop('checked') == true;
                })
                .length == 0) {
                alert('Es necesario completar todo el cuestionario');
                isRecordable = false;
                return false;
            }
        });

        if (!isRecordable) return false;
    }


    var respuestas = "";

    $(document).contents().find('*[respuesta_id]').each(function (controlRespuesta) {
        var objeto = this;
        if (respuestas.length == 0)
            respuestas = $(this).attr('respuesta_id') + ':' + ($(this).prop('checked') ? 1 : 0);
        else
            respuestas += "," + $(this).attr('respuesta_id') + ':' + ($(this).prop('checked') ? 1 : 0)

    });

    //guardarRespuestas(respuestas);
	datosTest.preguntas = respuestas;
    console.log("respuestas = " + respuestas)

    //setLessonStatus('incomplete');

    return true;
};

//Nuevo, no existia.
function getResponses() {
    var suspendData = doGetValue('cmi.suspend_data'),
        interactions = (suspendData != undefined && suspendData != "") ?
            suspendData.split(',') : [];
    $questionsList.each(function () {
        $(this).find('input').each(function () {
            var curr = $(this).attr('respuesta_id');
            for (var i = 0; i < interactions.length; i++) {
                var sp = interactions[i].split(':');
                if (sp[0] == curr) {
                    if (sp[1] == '1') {
                        $(this).prop('checked', true);
                    }
                }
            }
        });
    });
}

function getLastResponses() {
    var suspendData = doGetValue('cmi.suspend_data'),
        interactions = (suspendData != undefined && suspendData != "") ?
            suspendData.split(',') : [];
    $questionsList.each(function () {
        $(this).find('input').each(function () {
            var curr = $(this).attr('respuesta_id');
            for (var i = 0; i < interactions.length; i++) {
                var sp = interactions[i].split(':');
                if (sp[0] == curr) {
                    if (sp[1] == '1') {
                        $(this).prop('checked', true);
                    }
                }
            }
        });
    });
    $questionsList.each(function (indexQuestion) {
		console.log("paso por aca 2")
        $(this).find('input').each(function (indexResponse) {
            if (indexResponse == correctResponsesList[indexQuestion]) {
                //mostrar solo la correcta si la marcastes.
                if ($(this).prop('checked') == true) {
                    $(this).addClass('Done');
                    $(this).parent().parent().find('input').each(function () {
                        $(this).addClass('Done');
                    });
                    $(this).parent().removeClass(wrongResponseClass);
                    $(this).parent().addClass(correctResponseClass);
                } else {
                    $(this).parent().removeClass(wrongResponseClass);
                    $(this).parent().removeClass(correctResponseClass);
                }
            } else if ($(this).prop('checked') == true) {
                $(this).parent().removeClass(correctResponseClass);
                $(this).parent().addClass(wrongResponseClass);
            } else {
                $(this).parent().removeClass(wrongResponseClass);
                $(this).parent().removeClass(correctResponseClass);
            }
        });
    });
}

function getBestResponses() {
    var comments = doGetValue('cmi.comments'),
        interactions = (comments != undefined && comments != "") ?
            comments.split(',') : [];
    //Buscar las mejores respuestas.
    var mayor = 0;
    var pos = 0;
    for (var i = 0; i < interactions.length; i++) {
        if (interactions[i].indexOf('score') >= 0) {
            var temp = interactions[i].split('=');
            if (parseInt(temp[1]) > parseInt(mayor)) {
                mayor = temp[1];
                pos = i;
            }
        }
    }
    //
    $questionsList.each(function () {
        $(this).find('input').each(function () {
            var curr = $(this).attr('respuesta_id');
            for (var i = pos; i < interactions.length; i++) {
                var sp = interactions[i].split(':');
                if (sp[0] == curr) {
                    if (sp[1] == '1') {
                        $(this).prop('checked', true);
                    }
                }
            }
        });
    });
    $questionsList.each(function (indexQuestion) {
		console.log("paso por aca 1")
        $(this).find('input').each(function (indexResponse) {
            if (indexResponse == correctResponsesList[indexQuestion]) {
                //mostrar solo la correcta si la marcastes.
                if ($(this).prop('checked') == true) {
                    $(this).addClass('Done');
                    $(this).parent().parent().find('input').each(function () {
                        $(this).addClass('Done');
                    });
                    $(this).parent().removeClass(wrongResponseClass);
                    $(this).parent().addClass(correctResponseClass);
                } else {
                    $(this).parent().removeClass(wrongResponseClass);
                    $(this).parent().addClass(correctResponseClass);
                }
            } else if ($(this).prop('checked') == true) {
                $(this).parent().addClass(correctResponseClass);
                $(this).parent().addClass(wrongResponseClass);
            } else {
                $(this).parent().removeClass(wrongResponseClass);
                $(this).parent().removeClass(correctResponseClass);
            }
        });
    });
}


function checkResponses(setResult, flag, ocultarPopup) {

    //if (setResult && !confirm(confirmMessage)) return;

    var correct = 0,
        testScore = 0,
        feedbackClass = "",
        feedbackText = "";


    $questionsList.each(function (indexQuestion) {
        $(this).find('input').each(function (indexResponse) {
            if ($(this).prop('checked') == true &&
                indexResponse == correctResponsesList[indexQuestion]) correct++;
        });
    });

    //Formula Vieja
    //testScore = (1 - nFaults / correctResponsesList.length) * 100;
    //Formula Nueva
    testScore = (correct / correctResponsesList.length) * 100;
    //

    var isPassed = (testScore >= successRatio * 100);

    $questionsList.each(function (indexQuestion) {

        var feedbackVisible = $(this).attr('feedbackVisible');
        var idFeedback = $(this).attr('feedback');
        if (feedbackVisible == 'ambas')
            $('#' + idFeedback).show();
        if (!flag) {
            $(this).find('input').each(function (indexResponse) {
                if (indexResponse == correctResponsesList[indexQuestion]) {
					console.log("paso por aca 3 si esta bien")
                    //mostrar solo la correcta si la marcastes.
                    if ($(this).prop('checked') == true) {
                        $(this).addClass('Done');
                        $(this).parent().parent().find('input').each(function () {
                            $(this).addClass('Done');
                        });
                        $(this).parent().removeClass(wrongResponseClass);
                        $(this).parent().addClass(correctResponseClass);
                        if (feedbackVisible == 'correcta') {
                            $('#' + idFeedback).show();
                        }
                 // Set objetivos
                       /* if (SalvarObjetivos) {
                            var pregunta = $(this).parent().parent().parent().find('p').text();
                            setObjectivesInteractionResponse(TotalIntentos - intentos, 1, $(this).attr('respuesta_id'), pregunta);
                        }*/
                    } else {
                        //FIXs
						console.log("INTENTOS_3========"+intentos)
						if(intentos == 1){
							$(this).parent().addClass(correctResponseClass);
						}
                        $(this).parent().removeClass(wrongResponseClass);
                    }
                    //
                } else if ($(this).prop('checked') == true) {
					console.log("paso por aca 4 si esta mal")
					console.log("INTENTOS_4========"+intentos)
                    $(this).parent().removeClass(correctResponseClass);
                    $(this).parent().addClass(wrongResponseClass);
                    // Marcarla como incorrecta
                    if (feedbackVisible == 'incorrecta') {
                        $('#' + idFeedback).show();
                    }
                    // Set objetivos
                   /* if (SalvarObjetivos) {
                        var pregunta = $(this).parent().parent().parent().find('p').text();
                        setObjectivesInteractionResponse(TotalIntentos - intentos, 0, $(this).attr('respuesta_id'), pregunta);
                    }*/
                } else {
                    //FIXs
                    $(this).parent().removeClass(correctResponseClass);
                    $(this).parent().removeClass(wrongResponseClass);
                }
            });
        }
    });

    disableTest();

    if (setResult) {
        var scoreAnterior = "";
        if (scoreAnterior == '')
            scoreAnterior = 0;
        scoreAnterior = parseInt(scoreAnterior);
        testScore = parseInt(testScore);
        if (testScore >= scoreAnterior) {

            if (finalizacionTest == 'cerrado') {
                //setScore(testScore.toFixed(0), isPassed);
            } else {
                //abierto
                //setScore2(testScore.toFixed(0), isPassed);
            }
        }
        if (!isPassed) {
            if (intentos > 0) {
                //$('.guardar').hide();
                $('.enviar').hide();
                $('.reintentar').show();
                $('.revisar').hide();
				$('.finalizar').hide();
                // Intentos es lo ultimo que se decrementa sino da error en el ultimo intento.
                intentos--;
                // Guardar los intentos
                //saveData('cmi.comments', intentos, 'int');
            }
        } else {
            if (intentos > 0) {
                //$('.guardar').hide();
                $('.enviar').hide();
                $('.reintentar').show();
                $('.revisar').show();
				$('.finalizar').hide();
                //Intentos es lo ultimo que se decrementa sino da error en el ultimo intento.
                intentos--;
                // Guardar los intentos
                //saveData('cmi.comments', intentos, 'int');
            }
        }
        if (intentos == 0) {
            //$('.guardar').hide();
            $('.enviar').hide();
            $('.reintentar').hide();
            $('.guardar').hide();
			$('.finalizar').hide();
        }
    }
    $("#intentosR").text(intentos.toString());
    //Mostrar los resultados finales.
    Score(correctResponsesList, correct, testScore, TotalIntentos - intentos);
    //Ver si ha pasado alguna vez
    var pps = $done
    //si es aprobado mostrar verde sino rojo.
    if (testScore >= successRatio * 100) {
        feedbackClass = correctResponseClass;
        feedbackText = "¡Enhorabuena!";
		//saveSingleData('cmi.core.lesson_status', 'passed');
		datosTest.estado = feedbackText
        console.log("MostrarScore = " + JSON.stringify(sdata))
        $('[sdm_test] [sdm_test_feedback=d]').removeClass('text-danger').addClass('text-success').html(feedbackText);
        $done = true;
		window.parent.consultarObligatorios();
        //saveData('cmi.comments', 'true', 'done=');
        //NewFix
        //saveSingleData('cmi.core.lesson_status', 'completed');
    } else {
        feedbackClass = wrongResponseClass;
		if(intentos == 0){
			window.parent.consultarObligatorios();
			feedbackText = "Vaya, parece que no has superado la prueba. <br>Puedes avanzar al siguiente módulo, aunque te recomendamos repases los contenidos anteriores.";
		}else{
			feedbackText = "Vaya, parece que no has superado la prueba";
		}
        
        $('[sdm_test] [sdm_test_feedback=d]').removeClass('text-success').addClass('text-danger').html(feedbackText);
		//saveSingleData('cmi.core.lesson_status', 'failed');
    }
datosTest.estado = feedbackText

    // El ultimo intento es el que guarda el lesson_status.
/*    if (intentos == 0) {
        var finalpps = getData('cmi.comments', 'done=');
        $('.revisar').hide();

        if (finalpps == 'true') {
            Limpiar();
            getLastResponses();
            saveSingleData('cmi.core.lesson_status', 'passed');
        }
        if (finalpps != 'true') {
            recordResponses(true);
            saveSingleData('cmi.core.lesson_status', 'failed');
        }
    }*/
    // Fix #1
    if (pps == 'true') {
        $('.revisar').show();
    } else {
        $('.revisar').hide();
    }
    // Mandar el Score Global
    GlobalScore();
    // Arreglar la diferencia de colores.
    $("#resultados2").removeClass(wrongResponseClass).removeClass(correctResponseClass);
    //
    $("#resultados2").addClass(feedbackClass);

    $('#resultados').show();
    var new_position = $('#resultados').offset();
    window.scrollTo(new_position.left, new_position.top);
	
	
    if (!flag && !ocultarPopup)
		$('#resultados').fadeIn();
	$("body, html").animate({ scrollTop: $("#resultados").offset().top}, 1000);
    return isPassed;
};

function disableTest() {
    $questionsList.find('input').prop('disabled', true);
};

//solo habilitar las incorrectas
function enableTest() {
    $questionsList.each(function () {
        $(this).find('input').each(function () {
            $(this).prop('disabled', false);
            $(this).prop('checked', false);
        });
    });
};

function Limpiar() {
    $questionsList.each(function () {
        $(this).find('input').each(function () {
            $(this).prop('disabled', false);
            $(this).prop('checked', false);
            $(this).parent().removeClass(wrongResponseClass);
            $(this).parent().removeClass(correctResponseClass);
            $(this).removeClass('Done');
        });
    });
}

$(document).ready(function () {
	//inicializaSCORM();

    $("#botonTEST").on(clickEvents, function () {
		    $("body, html").animate({
                 scrollTop: 0
             }, 1000);
		$(this).fadeOut();
        $("#caja").fadeOut("fast");
        $("#cuerpo").fadeIn();
        $("#intentosR").text(intentos.toString());
		    setup();

    });

    $(".reintentar").on(clickEvents, function () {
           $('.revisar').hide();
            $('.guardar').show();
            $('.enviar').show();
            $('.reintentar').hide();
            $('.finalizar').hide();
            $('.feedback').hide();
            $('#resultados').hide();
            Limpiar();
            enableTest();
		    setup();

		
    });
});

function saveData(field, value, preffix) {
    if (value == null || value == '') {
        value = 0;
    }
    if (preffix == null || preffix == '') {
        doSetValue(field, value.toString() + ',');
    } else {
        doSetValue(field, preffix + value.toString() + ',');
    }
    doCommit();
}

function saveSingleData(field, value) {
    doSetValue(field, value.toString());
    doCommit();
}

// Obtiene los datos de la tabla basado en prefijo si tiene.
function getData(field, preffix) {
    if (preffix == null || preffix == '') {
        preffix = '';
    }
    var data = doGetValue(field);
    if (data != '') {
        var array = data.split(',');
        var found = '';
        for (i = 0; i < array.length - 1; i++) {
            if (array[i].indexOf(preffix) >= 0) {
                found = array[i];
            }
        }
        found = found.replace(preffix, ' ').trim();
        return found;
    } else return '';
}

function Score(correctResponsesList, corr, testScore, intentos) {
    //
    //var correctas = getData('cmi.comments', 'correctas=');
/*    if (correctas < corr) {
		datosTest.correctas = corr
        //saveData('cmi.comments', corr, 'correctas=');
        //doCommit();
		console.log("$correctasArray = " + $correctasArray)
    }*/
    //
    var calculo = testScore.toFixed(0);
    var score = "";
    if (score == "") {
        score = 0;
    }
    if (parseInt(score) <= parseInt(calculo)) {
		 console.log("$scoreArray = " + $scoreArray)
        datosTest.score = calculo;
        
        if (calculo > 79) {
            $(".btnTest").removeClass("habilitado")
            $(".btnTest").addClass("visto")
            //recuperoArray();
        }
        //saveData('cmi.comments', calculo, 'score=');
        //doCommit();
        // Si supera mi score guardarlo.
        //guardarRespuestasMejorScore(GuardarMejores());
    }
	 datosTest.int = intentos;
    console.log("$intentosArray = " + $intentosArray)
    //
    //saveData('cmi.comments', intentos, 'num=');
    //doCommit();
    //
    MostrarScore(corr, correctResponsesList.length, calculo, intentos);
}

function MostrarScore(a, b, c, d) {
    $('[sdm_test] [sdm_test_feedback=a]').html(a);
    $('[sdm_test] [sdm_test_feedback=b]').html(b);
    $('[sdm_test] [sdm_test_feedback=c]').html(c.toString() + '%');
    $('[sdm_test] [sdm_test_feedback=fail]').html(d);
}

function GlobalScore() {
    var score = "";
    statustext = '';
    if (score >= successRatio * 100) {
        statustext = '¡Enhorabuena!';
		 datosTest.estado = statustext
    } else {
        statustext = 'Suspendido';
		 datosTest.estado = statustext
    }
    $("#CursoEstado").text(statustext);
    $("#BestScore").text(score.toString() + "%");
}

function GuardarMejores() {
    var respuestas = "";

    $(document).contents().find('*[respuesta_id]').each(function () {
        if (respuestas.length == 0)
            respuestas = $(this).attr('respuesta_id') + ':' + ($(this).prop('checked') ? 1 : 0);
        else
            respuestas += "," + $(this).attr('respuesta_id') + ':' + ($(this).prop('checked') ? 1 : 0)
    });
    return respuestas + ',';
}

/*function CerrarIntentos() {
	
    var pps = datosTest.estado
    if (pps == '¡Enhorabuena!') {
        doSetValue('cmi.core.lesson_status', 'passed');
    }
    if (pps == 'Suspendido') {
        doSetValue('cmi.core.lesson_status', 'failed');
    }
    if (pps == "" || pps == null || pps == " " || pps == '') {
        doSetValue('cmi.core.lesson_status', 'incomplete');
    }
}*/

function PopAprobado() {
    BootstrapDialog.show({
        cssClass: 'popup-dialog',
        closable: true,
        draggable: true,
        title: 'Test Aprobado',
        message: $('#popAprobado').html()
    });
}

function PopAprobadoIntentos() {
    BootstrapDialog.show({
        cssClass: 'popup-dialog',
        closable: true,
        draggable: true,
        title: 'Test Aprobado',
        message: $('#popAprobadoIntentos').html()
    });
}

function PopDesaprobado() {
    BootstrapDialog.show({
        cssClass: 'popup-dialog',
        closable: true,
        draggable: true,
        title: 'Test Desaprobado',
        message: $('#popDesaprobado').html()
    });
}
$(window).on("beforeunload pagebeforehide pagehide", function () {
	//CerrarIntentos();
	terminarSesion();     
});
