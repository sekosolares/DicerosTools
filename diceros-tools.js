/******************************************************************************
		Author: .asolares.
		Version: 8.2018.1

		Este script contiene funciones con diferentes utilidades para
		diferentes eventos.
		Content:
			> hide_column(col_no, id_tabla)
			> tooltip(id, helpText)
			> filter_combo(filtro_id, combo_id)
			> filter_table(filtro_id, table_id, cells_array)
			> toggle_column(col_no, id_tabla)
			> open_report(project, object, template, params)
********************************************************************************/


/**** Variables para deteccion de browser en uso ****/

// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

/*
	Funcion llamada en el evento onClick de una etiqueta <th> para
	ocultar la columna del click.
	Parametros:
		> col_no: [integer] El numero de la columna que se oculta; la numeracion
							empieza desde 0.
		> id_tabla: [String] Indica el id de la tabla que tendra esta accion de
							ocultar filas.
*/
function hide_column(col_no, id_tabla) {
	var tbl  = document.getElementById(id_tabla);
	var rows = tbl.getElementsByTagName('tr');

	for (var row=0;row < rows.length;row++) {
		if(row == 0 && rows[row].getElementsByTagName('th').length > 0) {
			var cels = rows[row].getElementsByTagName('th');
		}else{
			var cels = rows[row].getElementsByTagName('td');
		}
		cels[col_no].style.display = "none";
		cels[col_no].style.width = "0%";
	}

	var countH = document.getElementsByTagName("th");
	countH = countH.length;

	var col_style;
	var visibles = 0;
	for(var i = 0; i < countH; i++){
		col_style = document.getElementsByTagName("th")[i].style.display;
		if(col_style != "none"){
			visibles++;
		}
	}

	anchoCols = 100 / visibles;
	anchoCols = anchoCols.toFixed(2);

	for(i = 0; i < countH; i++){
		if( tbl.getElementsByTagName("th")[i].style.display != "none"){
			tbl.getElementsByTagName("th")[i].style.width = anchoCols+"%";
		}
	}

	var countD = tbl.getElementsByTagName("td");
	countD = countD.length;
	for(var k = 0; k < countD; k++){
		if( tbl.getElementsByTagName("td")[k].style.display != "none"){
			tbl.getElementsByTagName("td")[k].style.width = anchoCols+"%";
		}
	}
}


/*
	Esta funcion se llama desde el evento onMouseEnter de cualquier etiqueta
	del body del html en cuestion. Mostrara un pequeño texto de ayuda luego
	de cierto tiempo de que el usuairo puso el cursor sobre el elemento que
	hizo la llamada.
	Parametros:
		> id: [String] Es el id del elemento al cual se le debe poner el cursor encima
					para que muestre el texto de ayuda.
		> helpText: [String] Sera el texto que se mostrara al momento que entre el cursor
								al elemento con el id señalado en el parametro anterior.
*/
var doAlert = true;
function tooltip( id, helpText ) {
	if(window.jQuery){
		var posElem = $("#"+id).position();
		var ancho = $("#"+id).width();
		var alto = $("#"+id).height();
		var yPos = posElem.top + alto;
		var xPos = posElem.left + ancho;

		// Genera el elemento (un <div>) con el texto en tiempo de corrida.
		$("body").append("<div id='tooltip"+id+"' class='tooltip' style='display:none;left:"+xPos+"px;top:"+yPos+"px;font-family:Arial, sans-serif;border:1px solid gray;position:absolute;color:#888888;font-size:14px;background-color:#fff;width:auto;height:auto;padding:8px;border-radius:10px;box-shadow:0px 5px 15px gray;'> " + helpText + " </div>");

		// Al salir el cursor del elemento, remueve el <div> creado para que no existan stacks.
		$("#"+id).mouseleave(function(){
			$("#tooltip"+id).remove();
		});

		// Si el cursor permanecio adentro, se mostrara el <div> con el texto del parametro.
		$("#tooltip"+id).delay(900).fadeIn(500);
	} else {
		(doAlert)? alert("jQuery required so tooltip can work!") : console.warn("jQuery is not included, so function tooltip() cannot run properly.");
		doAlert = false;
	}
}

/*
	Esta funcion se utiliza en el evento de onKeyUp, onKeyPress o en onKeyDown del input que servira
	como filtro. Basado en las coincidencias del filtro en el combo, las opciones que no cumplan con
	el filtro van a desaparecer temporalmente.
	Parametros:
		> filtro_id: [String] Es el id del input que servira como filtro del combo.
		> combo_id: [String] Es el combo que va a ser filtrado basado en lo que se coloque en el input
								de filtro.
*/
function filter_combo(filtro_id, combo_id){
    var input, filter, combo, opt, actual_opt, i;

    input = document.getElementById(filtro_id);
    filter = input.value.toUpperCase();
    combo = document.getElementById(combo_id);
    opt = combo.getElementsByTagName("option");
		//Ciclo que hace el trabajo de esconder lo que no cumpla con el filtro.
    for (i = 0; i < opt.length; i++) {
			actual_opt = opt[i];
			if (actual_opt) {
				if ( (actual_opt.innerHTML.toUpperCase().indexOf(filter) > -1) ) {
					opt[i].style.display = "";
					combo.selectedIndex = combo.options[i].index;
				} else {
					opt[i].style.display = "none";
				}
			}
    }
}

/*
	Funcion que se llama desde el evento onKeyUp, onKeyPress o en onKeyDown del input filtro. Evalua
	si lo que esta escrito en el filtro concuerda con algun elemento de la tabla que se desea filtrar.
	Parametros:
		> filtro_id: [String] Es el id del input que se utilizara como criterio para filtrar la tabla.
		> table_id: [String] Id de la tabla cuyos elementos seran filtrados.
		> cells_array: [Array] Este array contiene los numeros de las columnas que seran filtradas,
									iniciando desde cero. (e.g. [0, 2, 3] filtra la primera, tercera y cuarta columna.
									[0] solo filtra la primera columna).
*/
function filter_table(filtro_id, table_id, cells_array){
	var input, filter, table, tr, tds, i, j;

	input = document.getElementById(filtro_id);
	filter = input.value.toUpperCase();
	table = document.getElementById(table_id);
	tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		var coincide = false;
		var coincideAnt = true;

		for(j = 0; j < cells_array.length; j++) {
			var item = cells_array[j];
			var hasNextItem = (cells_array[j+1] != undefined);

			if(hasNextItem){
				var nextItem = cells_array[j+1];
				td = tr[i].getElementsByTagName("td")[item];
				td2 = tr[i].getElementsByTagName("td")[nextItem];
				if(td || td2){
					if((td.innerHTML.toUpperCase().indexOf(filter) > -1) ||
						(td2.innerHTML.toUpperCase().indexOf(filter) > -1) ){
						coincide = true || coincideAnt;
					}
				}
			} else {
				td = tr[i].getElementsByTagName("td")[item];
				if(td){
					if( (td.innerHTML.toUpperCase().indexOf(filter) > -1) ){
						coincide = coincide || true;
					}
				}
			}
			coincideAnt = coincide;
		}

		var isTh = tr[i].getElementsByTagName("th");
		isTh = isTh.length;
		if(coincideAnt){
			tr[i].style.display = "";
		} else {
        if(isTh <= 0)
					tr[i].style.display = "none";
		}
	}
}

/*
	Funcion llamada en el evento onClick de algun boton que permita hacer un toggle de la
	columna especificada en el parametro col_no.
	Parametros:
		> col_no: [integer] El numero de la columna a la que se hace toggle; la numeracion
							empieza desde 0.
		> id_tabla: [String] Indica el id de la tabla que tendra esta accion de
							ocultar y mostrar columnas.
*/
function toggle_column(col_no, id_tabla) {
	var tbl  = document.getElementById(id_tabla);
	var rows = tbl.getElementsByTagName('tr');

	for (var row=0;row < rows.length;row++) {
		if(row == 0 && rows[row].getElementsByTagName('th').length > 0) {
			var cels = rows[row].getElementsByTagName('th');
		}else{
			var cels = rows[row].getElementsByTagName('td');
		}
		if(cels[col_no].style.display == "none"){
			cels[col_no].style.display = "";
		}else{
			cels[col_no].style.display = "none";
		}
	}
}


/*
	Funcion pensada para que sea la que se llame desde los botones de impresion de reportes.
	Version de Funcion:
		> 1.0
	Parametros:
		> project: [integer] El id del proyecto en el que se encuentra el reporte que se llama.
		> object: [integer] Id del objeto correspondiente al objeto que tiene el reporte.
		> template: [String] [opcional] Especifica si hay que utilizar algun template en particular.
		> params: [String] [opcional] En el caso de que haya que llenar parametros del lado del
				  objeto en donde esta el reporte, se debe especificar aqui.
				  e.g.  "&VACAMPO=1&VACAMPO2=2"
*/
function open_report(project, object, template=0, params=0){
	var url = 'rbplus?p=' + project + '&o=' + object;
	var props = 'dependent:yes,directories:no,location:no,menubar,resizable,toolbar:yes,titlebar:no,scrollbars';
	url = url + (template == 0)? '&detalle=N' : '&Template=' + template + '&detalle=N';
	url = url + (params == 0)? '' : params;
	console.log("URL to be called: " + url);
	this.form.recargar.value='M';
    	this.form.action='mantenimiento';
	void( fsubmit());
	window.open(url,'', props);
}
