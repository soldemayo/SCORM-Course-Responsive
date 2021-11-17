//V20210722
var $scorm = 1;
var $avanceCerrado = 1;
var $menu = $("#menu");
var $btnMenu = $("header .menu");
var $btnSalir = $("header .salir");
var $btnAyuda = $("footer .ayuda");
var $btnDoc = $("footer .doc");
var $btnSonido = $("footer .sonido");
var $cierraMenu = $("#menu .cerrar");
var $inicio = $("#inicio");
var $inicioComenzar = $("#inicio .comenzar");
var $volverLocation = $("#volver .volversi");
var $pagActual = null;
var $btnPrev = $(".carousel-control-prev");
var $movilPrev = $("footer.movil .prev");
var $btnNext = $(".carousel-control-next");
var $movilNext = $("footer.movil .next");
var $indicadores = $(".indicadores");
var $indicadorLi = $(".indicadores li");
var $totales = $(".pagTotales");
var contador = 0;
var porcentaje = 0;
var $moduloN = $("#modulo .moduloN");
var $moduloNom = $("#modulo .moduloNom");
var $moduloDIV = $("#modulo");
var $modulosArray = ["Conceptos Generales", "Riesgos en la Estación de Servicio", "Riesgos específicos y operaciones con riesgo", "Medio Ambiente en Estaciones de Servicio", "Señalización", "Situaciones de Emergencia"];
var $locuciones = [2, 3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41, 42, 43, 44, 45, 47, 48, 49, 50, 52]
var $indice = $(".indice");
var $video = undefined;
var $animadosPagina
var $animadosArray = [];
var $lessonStatus = ""
var $dataRecuperada
var $lessonLocation = 1;
var $vistosArray = [];
var $menuArray = [];
var sdata = {};
sdata.itemVistos = $vistosArray;
sdata.modVistos = $menuArray;
var $paginaTest = $('.carousel-inner > div.active > #pagina').hasClass("pagTest")


    //////////////////////////////////////////////// COMUNICACION SCORM ////////////////////////////////////////////////
	function $ejecutaScorm(){
		if($avanceCerrado == 0){
			$(".indicadores li").addClass("open");
		}
		
		if($scorm != 0){
		inicializaSCORM();
		startTimer();
		console.log("$dataRecuperadaFUERA======="+JSON.stringify($dataRecuperada));
		$dataRecuperada = recuperaLMS();
		if($dataRecuperada != null){
			$lessonLocationR = doGetValue('cmi.core.lesson_location');
			$lessonLocation = parseInt($lessonLocationR);
			$pagActual = $lessonLocation;
			porcentaje = doGetValue('cmi.core.score.raw');
			$lessonStatus = doGetValue('cmi.core.lesson_status');
			$vistosArray = $dataRecuperada.itemVistos;
			$menuArray = $dataRecuperada.modVistos;
			sdata.itemVistos = $vistosArray;
			sdata.modVistos = $menuArray;
			console.log("$dataRECUPERADA======="+$dataRecuperada)
			console.log("$lessonLocationRECUPERADA======="+$lessonLocation)
			console.log("porcentajeRECUPERADA======="+porcentaje)
			console.log("$lessonStatusRECUPERADA======="+$lessonStatus);
			console.log("$vistosArray======="+$vistosArray);
			console.log("$menuArray======="+$menuArray);
			console.log("$vistosArray.length======="+$vistosArray.length);
			console.log("$menuArray.length======="+$menuArray.length);
			actualizaPorciento();
						
			$.each(sdata.itemVistos, function () {
				$pos = this;
				console.log("vistosPOS========="+$pos)
				$(".indicadores li[data-index="+$pos+"]").removeClass("inactivo").addClass("visto");
			});	
			
			$.each(sdata.modVistos, function () {
				$posM = this;
				console.log("modulosPOS========="+$posM)
				$(".indice li[data-lista="+$posM+"]").removeClass("inactivo").addClass("activo")
				$(".indice li[data-lista="+$posM+"] i").text("lock_open");
			});
				   
			console.log("$vistosArray.indexOf($lessonLocation)============" + $vistosArray.indexOf($lessonLocation.toString()));
			if($vistosArray.indexOf($lessonLocation.toString())!= -1){
				$btnNext.removeClass("btnInactivo");
				$movilNext.removeClass("nextInactivo");
			   }

			console.log("$lessonLocation======="+$lessonLocation);
			console.log("$lessonLocationTYPE======="+typeof($lessonLocation));
			
		   }else{
			   iniciaDatos();
			   $lessonLocation = 1;
		   }
			
		
		/*$(window).on("beforeunload pagebeforehide pagehide", function () {
			terminarSesion();
		});*/
			
			
	}/// FIN IF $SCORM != 0 ///
	}
	



    //////////////////////////////////////////////// COMUNICACION SCORM ////////////////////////////////////////////////	



  function doAnimations(elems) {
    $animadosPagina = elems.length
    //Cache the animationend event in a variable
    var animEndEv = "webkitAnimationEnd animationend";
    $("*").animate({
      scrollTop: 0
    }, 500);
	  
    elems.each(function () {

      var $this = $(this),
		  $animationType = $this.data("animation");
		
		$this.addClass($animationType).one(animEndEv, function () {
        $this.removeClass($animationType);
		  
        if ($animadosArray.indexOf($this) == -1) {
          $animadosArray.push($this);
        }
			if ($animadosArray.length == $animadosPagina) {
				$animadosArray.length = 0;
			//SI ES PAGINA DE TEST//
			$paginaTest = $('.carousel-inner > div.active > #pagina').hasClass("pagTest")
			console.log("$paginaTest======="+$paginaTest)
			if(!$paginaTest){
				consultarObligatorios();
			}
          
        }
        console.log("===============$animadosArray==============" + $animadosArray.length);


      });
    });
  }

  //Variables on page load
  var $myCarousel = $("#interface"),
	  $firstAnimatingElems = $myCarousel
      .find(".carousel-item:first")
      .find("[data-animation ^= 'animated']");

  //Initialize carousel
  $myCarousel.carousel({
	  touch: false
  });

function flechasonoff(){
		if($pagActual > 1){
			  $btnPrev.fadeIn();
			  $movilPrev.removeClass("prevMuestra");
		  }else{
			  $btnPrev.fadeOut(100);
			  $movilPrev.addClass("prevMuestra");
		  }
	
		if($pagActual == $totalPaginas){
			  $btnNext.fadeOut(100);
			  $movilNext.addClass("nextMuestra");
		  }else{
			  $btnNext.fadeIn();
			  $movilNext.removeClass("nextMuestra");
		  }
}

function avance(){
	console.log("AVANCE AGREGADO")
	$animadosArray.length = 0;
	console.log("===============$ANIMADORARRAY EN AVANCE==============" + $animadosArray.length);
	$ultimoVistoArray = ($vistosArray.length);
	console.log("$ultimoVistoArray ========="+$ultimoVistoArray)
	if($vistosArray.indexOf($pagActual) != -1){
		$btnNext.removeClass("btnInactivo animNext");
		$movilNext.removeClass("nextInactivo");
		console.log("$pagActual == $ultimoVistoArray")
	}
	$nextPage = ($pagActual*1)+1;
	$nextPageString = $nextPage.toString();
	console.log("$nextPage ========="+$nextPage);
	console.log("$vistosArray ========="+$vistosArray);
	console.log("$nextPageindexOf ========="+$vistosArray.indexOf($nextPageString))
	
	if($vistosArray.indexOf($nextPageString) != -1){
		$btnNext.removeClass("btnInactivo");
		$movilNext.removeClass("nextInactivo");
	}else{
		$btnNext.addClass("btnInactivo");
		$movilNext.addClass("nextInactivo");
	}	
}

function retrocede(){
	$btnNext.removeClass("btnInactivo animNext").addClass("d-flex")
	$movilNext.removeClass("nextInactivo");
}
////////// MODAL HIDE.BS //////////

	$('.modal').on('hide.bs.modal', function (e) {
  	  if($video =! undefined){
		  $.each($('video'), function(){
			  this.pause()
			  this.currentTime = 1;
		  });
	  }
		consultarObligatorios();
	})
////////// SLID.BS //////////

$myCarousel.on("slid.bs.carousel", function(e) {
		conocerIndex();
		flechasonoff();
		nombraModulo();	
	$(".collapse").removeClass("show");
	
	//PASO EL STRING A NUMERO Y SI LA PAGINA NO ES NUMERO 1 EJECUTO EL AUDIO
	var iNum = parseInt($pagActual)
	if($locuciones.indexOf(iNum) != -1){
		if($pagActual != 1){
			$("#aud" + $pagActual)[0].play();
		}
	}
	if($vistosArray.indexOf($pagActual) != -1){
		 $(".carousel-control-next").removeClass("btnInactivo").addClass("d-flex");
		$("footer.movil .next").removeClass("nextInactivo");
	}
	
});
////////// SLIDE.BS //////////
$myCarousel.on("slide.bs.carousel", function(e) {
	  //conocerIndex();
	//SILENCIAR AUDIO
	if($pagActual >= 2){
			 $.each($('audio'), function(){
			  this.pause()
			  this.currentTime = 0;
		  });
	   }


	  var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
	  doAnimations($animatingElems);
		if ($video = !undefined) {
		  $.each($('video'), function () {
		    this.pause()
		    this.currentTime = 1;
		  });
		}
/*	if($paginaTest){
		$('iframe').attr('src', $('iframe').attr('src'));
	}*/
	
	  console.log("===============ELEMS ANIMADOS EN SLIDE===============" + $animadosPagina)
  });
 //Animate captions in first slide on page load
doAnimations($firstAnimatingElems);
 
////////// MENU //////////

function toogleMenu(elemento, texto){
	$menu.toggleClass("visible");

	$(elemento).toggleClass("d-block");
	$("#menu h2").text(texto);
	
		$menu.on("transitionend webkitTransitionEnd oTransitionEnd" , function(){
				if(!$menu.hasClass("visible")){
					setTimeout(function(){ $("#menu ul").removeClass("d-block"); }, 500);
					
				}
		})
	
}


$btnMenu.click(function(){
	toogleMenu(".indice", "Indice");
});
$btnAyuda.click(function(){
	toogleMenu(".ayuda", "Ayuda");
});
$btnDoc.click(function(){
	toogleMenu(".doc", "Documentación");
});



$cierraMenu.click(function(){
	toogleMenu("cierra");
});

$(".indice li").click(function(){
	$data = $(this).data("index");
	$myCarousel.carousel($data);
	toogleMenu();
})
$btnNext.click(function(){
	avance();
})
$movilNext.click(function(){
	avance();
})
$btnPrev.click(function(){
	retrocede();
})
$movilPrev.click(function(){
	retrocede();
})

function darlePlay(boton){
	$video = boton.parent('.contieneVideo').find('video').get(0);
	$video.play();
	console.log($video);
	console.log("clikPkayedl")
}



    //////////////////////////////////////////////// GENERA PAGINAS ////////////////////////////////////////////////	
var $totalPaginas = 53;
var content = [];

function $cargarPaginas(){
	for (let index = 1; index <= $totalPaginas; index++) {
		$(".carousel-inner").append('<div id="'+ (index) +'" class="carousel-item h-100 s'+(index)+'"></div>');
		$.get("cont/p" + index +".html",  function(htmlexterno){
			content = $('<div>').append(htmlexterno).find('#pagina');
			var Sn = ".s"+index;
			$(Sn).html(content);
			if(index == $totalPaginas){
				$inicio.fadeIn("fast", function(){
					$(".cargando").fadeOut("slow", function(){
						conocerIndex();
					});
					
				});
			}
		});	//GET
		
		$indicadores.append('<li class="inactivo" data-index="'+ index +'" data-toggle="tooltip" data-placement="top" title="'+ index +'"></li>');
		$totales.text($totalPaginas);
		$moduloDIV.hide();
		if($locuciones.indexOf(index)!= -1){
		   $('body').append('<audio id="aud'+index+'" src="media/loc/p'+index+'.mp3"></audio')
		   }
	}//FOR

}

    var $circle = $('#svg #bar');
    var val = 0
    var r = $circle.attr('r');
    var c = Math.PI*(r*2);



////////// FUNCION AVANCE //////////

function actualizaSuspend(){
	console.log("ACTUALIZA XCIENTO==========="+porcentaje);
	console.log("VISTOS ARRAY==========="+JSON.stringify(sdata));
	console.log("PAGINA ACTUAL==========="+$pagActual);
	$sdataCompleto = JSON.stringify(sdata).replace(/\"/g, '*');
	if(porcentaje >= 99){
		console.log("COMPLETED");
		$lessonStatus = "completed"
	   }else{
		   console.log("INCOMPLETE");
		   $lessonStatus = "incomplete"
	   }
	computeTime();
	guardaLMS($sdataCompleto, $pagActual, porcentaje, $lessonStatus)
}
   function actualizaPorciento(){
        var $elementosVistos = $vistosArray.length;
        porcentaje = (Math.round(($elementosVistos / $totalPaginas)*100));
        $('.progress-value > div').text(porcentaje + "%");
        var pct = ((100-porcentaje)/100)*c;
        $('.progress').attr('data-percentage',porcentaje);
        $circle.css({ strokeDashoffset: pct});
	   actualizaSuspend();
    }

		function consultarObligatorios() {
			console.log("CHE ESTA PAGINA ESTA VISTA????"+$vistosArray.indexOf($pagActual));
			if($vistosArray.indexOf($pagActual) == -1){
				console.log("CHE ESTA PAGINA ESTA VISTA!!!!!");
				var paginaObligatorios = $('div.active').find(".obligatorio");
				console.log("paginaObligatorios.length========"+paginaObligatorios.length)
			
			if (paginaObligatorios.length == 0) {

				if($pagActual != 0){
					$vistosArray.push($pagActual);
				}
				
				if($pagActual != $totalPaginas){
					if($vistosArray.indexOf($pagActual) != -1){
						$(".carousel-control-next").removeClass("btnInactivo").addClass("animNext").one("webkitAnimationEnd animationend", function(){
							$(".carousel-control-next").removeClass("animNext").addClass("d-flex");
						});
						$("footer.movil .next").removeClass("nextInactivo");
					}
						
				}
				
				$(".indicadores li[data-index="+$pagActual+"]").removeClass("inactivo actual").addClass("visto");
				if($paginaTest || $pagActual == 47){
					console.log("$menuArrayLARGO======"+$menuArray.length)
					console.log("$menuArrayLARGO+1======"+$menuArray.length + 1)
					if($menuArray.length < 6){
						$modlul = $menuArray.length + 1
						$menuArray.push(($modlul));
						$(".indice li[data-lista="+$modlul+"]").removeClass("inactivo").addClass("activo")
						$(".indice li[data-lista="+$modlul+"] i").text("lock_open");
					}
					
				}
				actualizaPorciento();
			}
			   }
	
		}

function nombraModulo(){
	if($pagActual >= 2 && $pagActual <= 8){
	   $moduloN.text("M1");
	   $moduloNom.text($modulosArray[0]);
		$moduloDIV.fadeIn();
	}else if($pagActual >= 10 && $pagActual <= 22){
	   $moduloN.text("M2");
	   $moduloNom.text($modulosArray[1]);
		$moduloDIV.fadeIn();
	} else if($pagActual >= 24 && $pagActual <= 34){
	   $moduloN.text("M3");
	   $moduloNom.text($modulosArray[2]);
		$moduloDIV.fadeIn();
	} else if($pagActual >= 36 && $pagActual <= 38){
	   $moduloN.text("M4");
	   $moduloNom.text($modulosArray[3]);
		$moduloDIV.fadeIn();
	} else if($pagActual >= 40 && $pagActual <= 42){
	   $moduloN.text("M5");
	   $moduloNom.text($modulosArray[4]);
		$moduloDIV.fadeIn();
	} else if($pagActual >= 44 && $pagActual <= 52){
	   $moduloN.text("M6");
	   $moduloNom.text($modulosArray[5]);
		$moduloDIV.fadeIn();
	} else{
		$moduloDIV.fadeOut()
	}
}


////////// LOCALIZO EN QUE PAGINA ESTOY //////////
function conocerIndex(){
	$pagActual = $('.carousel-inner > div.active').attr("id");
	
	if($pagActual == 0){
		$(".numeros > .current").text("1");
	}else{
		$(".numeros > .current").text($pagActual);
		actualizaSuspend();
	}
	console.log("$pagActual========"+$pagActual);
	$(".indicadores li[data-index="+$pagActual+"]").addClass("actual");
}

function pestania(){
	        // Inhibe la acción del link en el link de una pestaña inactiva
        $('#pestana-inactiva-link').click(function(e) {
            e.preventDefault();
            
        });
        
        $('.pestana-link').click(function(e) {
            
            var id = $(this).attr("aria-controls");
            
            $(this).parents(".rps-pestanias").find("[data-value='"+id+"']").trigger('click');
            
        });
}


////////// INICIALIZA //////////
function comenzar(dato){
	
	$btnPrev.hide();
	$inicio.fadeOut("slow", function(){
		console.log("$lessonLocation>>>>>>>>>"+$lessonLocation)
		
		if($lessonLocation != 1){
			$("#volver").modal('show');
		}else{
			$myCarousel.carousel(1);
			$('#aud0')[0].play();
			$('#aud0').on("ended", function(){
				$('#aud1')[0].play();
			})
		}
	});

	
$(".playVideo").click(function(){
	darlePlay($(this));
})

$('video').on("playing", function(){
	$(this).parent('.contieneVideo').find('i').removeClass("d-md-block");
	console.log("play video")
})
$('video').on("ended, pause", function(){
	$(this).parent('.contieneVideo').find('i').addClass("d-md-block");
	console.log("enda pause video")
})

	
	$('button[data-toggle="modal"').click(function(){
		var $file = 'cont/p'+ $pagActual +'.html';
		var $target = $(this).data("target");
		var $titulo = $(this).data("titulo");
		var $contPop = $(this).data("contpop");
		$($target).find('.modal-body').empty();
		$($target).find('.modal-title').text($titulo);
		console.log("DATA_ESTA???========" + $contPop);
		if($contPop == undefined){
			$($target).find('.modal-body').load($file + ' #popContenido');
		   }else{
			$($target).find('.modal-body').load($file + ' #popContenido' + $contPop);
		   }
		
	});		
	$('.obligatorio').click(function(){
		$(this).removeClass("obligatorio");
		if($(this).data("toggle") == "modal"){
			console.log("BOTON ABRE UN POP")
		}else{
			consultarObligatorios();
		}
	});	
	
	
	
	
	$('.indicadores > li').click(function(){
		var $dataIndex = $(this).data("index");
		$myCarousel.carousel($dataIndex);
	});	
	
	$('.logoCabecera').click(function(){
		$.get("cont/p" + $pagActual +".html",  function(htmlexterno){
			content = $('<div>').append(htmlexterno).find('#pagina');
			var Sn = ".s"+$pagActual;
			$(Sn).html(content);
		});	//GET
	});
	
		$('[data-toggle="tooltip"]').tooltip({
		animation:true,
		trigger:"hover"
	})
}


	$inicioComenzar.click(function(){
		comenzar()
	});

$volverLocation.click(function(){
		$(".modal").modal('hide');
		console.log("$lessonLocation>>>>>>>>>"+$lessonLocation)
		$myCarousel.carousel($lessonLocation);
	});

	$('.volverno').click(function(){
		$(".modal").modal('hide');
		$myCarousel.carousel(1);
	});

	$btnSalir.click(function(){
		$("#salir").modal('show');
	});
	
	$('.salirsi').click(function(){
		cerrar();
	});
	
	$('.salirno').click(function(){
		$(".modal").modal('hide');
	});	

	function cerrar(){
		window.close();
		top.close();
	}


 
    //////////////////////////////////////////////// READY!!!!!!!! ////////////////////////////////////////////////	


$(document).ready(function () {
	$(document).on('visibilitychange', function() {
    if (document.visibilityState == 'hidden') {
        console.log("***********_____NOOOOO_____ESTOY VISIBLE***********");

    }
    if (document.visibilityState == 'visible') {
        console.log("***********ESTOY VISIBLE***********")
    }
	});
	
	$cargarPaginas();
	$ejecutaScorm();
	$btnSonido.click(function(){
		if(!$(this).hasClass("off")){
		$(this).text("volume_up")
		$(this).addClass("off");
		$.each($('audio'), function(){
			this.volume = 0;
		});
		$('audio').attr("muted");
	}else{
		$(this).text("volume_off")
		$(this).removeClass("off");
		$.each($('audio'), function(){
			this.volume = 1;
		});
	}
});
	
window.onbeforeunload = function() {
	terminarSesion();
    //return "Perderá la información";
};
	
			
});
