

var ocurre_error = "nada";
var api = null;
var startDate;
var Q_contador = 0;
// set this to false to turn debugging off and get rid of those annoying alert boxes.
var _Debug = false;


/*******************************************************************************
 **  Comprobamos que el LMS est� inicializado.
 **  Si no, lo inicializamos
 **  nro_objetivo  cantidad de ejercicios
 *******************************************************************************/

function inicializaSCORM() {
	var result = false;
    api = getAPIHandle();
	//doInitialize(); //AJG 15-12-09: a�adido para que el test de ADL no arroje error. La comprobaci�n posterior LMSIsInitialized se mantiene por si acaso.
	msg = 'No se pudo conectar con el LMS, cierre esta ventana y vuelva a intentarlo.\n\nSi el problema persiste, pongase en contacto con el administrador del curso.';
    if (api == null) {
        window.status = msg;
		//mensaje_alerta("index",msg);
        return false;
    }
    else	{
        if (LMSIsInitialized() == false) {
            if (_Debug == true) {
				window.status = msg;
				//mensaje_alerta("index",msg);
            }
            result = doInitialize();
        }
        else {
            if (_Debug == true) {
            	alert('inicializa(): LMS ya inicializado.');
            }
            result = true;
        }
    }
    return result;
}



function iniciaDatos(){
	doSetValue('cmi.suspend_data', "");
	doSetValue('cmi.core.lesson_location', "1");
	doSetValue('cmi.core.score.raw', "0");
	doSetValue('cmi.core.lesson_status', "incomplete");
	//doSetValue( "cmi.core.exit", "suspend" );
	doCommit();
}

function recuperaLMS() {
		var stringSegCurso = doGetValue('cmi.suspend_data'),
		objetoSegCurso = null;
	if(stringSegCurso != undefined && stringSegCurso != "" ){
		objetoSegCurso = JSON.parse(stringSegCurso.replace(/\*/g,'"'));;
	}
	return objetoSegCurso;
}


function guardaLMS(suspend, location, score, status) {
	doSetValue('cmi.suspend_data', suspend);
	doSetValue('cmi.core.lesson_location', location);
	doSetValue('cmi.core.score.raw', score);
	doSetValue('cmi.core.lesson_status', status);
	//doSetValue( "cmi.core.exit", "suspend" );
}



function terminarSesion() {
	doSetValue( "cmi.core.exit", "suspend" );
	computeTime();
	doTerminate();
}

function startTimer() {
    startDate = new Date().getTime();
}

function computeTime() {

    if ( startDate != 0 ) {
        var currentDate = new Date().getTime();
        var elapsedSeconds = ( (currentDate - startDate) / 1000 );
        var formattedTime = convertTotalSeconds( elapsedSeconds );

		    }
    else 	{
			

        formattedTime = "00:00:00.0";
    }

    if (_Debug == true) {
        alert("computeTime(): formattedTime == "+formattedTime);
			

    }
/*    console.log("computeTime(): cmi.core.session_time = "+formattedTime);*/
    doSetValue( "cmi.core.session_time", formattedTime );
    doCommit();
}
/*******************************************************************************
 ** this function will convert seconds into hours, minutes, and seconds in
 ** CMITimespan type format - HHHH:MM:SS.SS (Hours has a max of 4 digits &
 ** Min of 2 digits
 *******************************************************************************/
function convertTotalSeconds(ts) {
    var sec = (ts % 60);

    ts -= sec;
    var tmp = (ts % 3600);  //# of seconds in the total # of minutes
    ts -= tmp;              //# of seconds in the total # of hours

    // convert seconds to conform to CMITimespan type (e.g. SS.00)
    sec = Math.round(sec*100)/100;

    var strSec = new String(sec);
    var strWholeSec = strSec;
    var strFractionSec = "";

    if (strSec.indexOf(".") != -1) {
        strWholeSec =  strSec.substring(0, strSec.indexOf("."));
        strFractionSec = strSec.substring(strSec.indexOf(".")+1, strSec.length);
    }

    if (strWholeSec.length < 2) {
        strWholeSec = "0" + strWholeSec;
    }
    strSec = strWholeSec;

    if (strFractionSec.length) {
        strSec = strSec+ "." + strFractionSec;
    }


    if ((ts % 3600) != 0 )
        var hour = 0;
    else var hour = (ts / 3600);
    if ( (tmp % 60) != 0 )
        var min = 0;
    else var min = (tmp / 60);

    if ((new String(hour)).length < 2)
        hour = "0"+hour;
    if ((new String(min)).length < 2)
        min = "0"+min;

    var rtnVal = hour+":"+min+":"+strSec;

    if (_Debug == true) {
        alert("convertTotalSeconds(): rtnVal == "+rtnVal);
    }

    return rtnVal;

}

