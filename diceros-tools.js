/******************************************************************************
		Author: .asolares.
		Version: 6.2019.1

		Este script contiene funciones con diferentes utilidades para
		diferentes eventos.
		Content:
			> hide_column(col_no, id_tabla)
			> tooltip(id, helpText)
			> filter_combo(filtro_id, combo_id)
			> filter_table(filtro_id, table_id, cells_array)
			> toggle_column(col_no, id_tabla)
			> open_report(project, object, template, params)
			> move_tabs(do_it, tabs_id)
			> fAvisoNew(titulo, msg)
********************************************************************************/


/**** Variables para deteccion de browser en uso ****/

// Opera
var isOpera = ( (navigator.userAgent).indexOf("OPR") > -1 );

// Firefox 1.0+
var isFirefox = ( (navigator.userAgent).indexOf("Firefox") > -1 );

// Safari
var isSafari = ( (navigator.userAgent).indexOf("Safari") > -1 );

// Internet Explorer < 11
var isIE = ( (navigator.userAgent).indexOf("IE") > -1 );

// Internet Explorer 11
var isIE11 = ( (navigator.userAgent).indexOf("Trident") > -1 );

// Edge
var isEdge = ( (navigator.userAgent).indexOf("Edge") > -1 );

// Chrome 1+
var isChrome = ( (navigator.userAgent).indexOf("Chrome") > -1 );

/*
	Funcion llamada en el evento onClick de una etiqueta <th> para
	ocultar la columna del click.
	Version:
		> 1.0
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
	Version:
		> 1.0
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
		(doAlert)? alert("jQuery required so move_tabs can work!") : console.warn("jQuery is not included, so functions like tooltip() or move_tabs() cannot run properly.");
		doAlert = false;
	}
}

/*
	Esta funcion se utiliza en el evento de onKeyUp, onKeyPress o en onKeyDown del input que servira
	como filtro. Basado en las coincidencias del filtro en el combo, las opciones que no cumplan con
	el filtro van a desaparecer temporalmente.
	Version:
		> 1.0
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
	Version:
		> 1.0
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
	Version:
		> 1.0
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
	void( fsubmit() );
	window.open(url,'', props);
}


/*
	Funcion que resuelve el problema de los forms con tabs. Mueve los tabs al lugar en el que 
	deberian ir normalmente para no afectar el funcionamiento en los browsers Chrome, Opera,
	Firefox y Edge.
	Version:
		> 1.0
	Parametros:
		> do_it: [boolean] Determina si debe ejecutarse la funcion o no.
		> tabs_id: [String] Se refiere al id del o los divs que contienen los tabs, a los cuales
				   se le dara movimiento.
*/
var doAlert = true;
function move_tabs(do_it, tabs_id){
	if(window.jQuery){
		if(!do_it){
			console.log("Not a tab form. Wont move any tabs.");
		}else{
			tabs_id = "#" + tabs_id;
			let tabstop_cont = new Array();
			console.log("Execute tab movement.");
			document.querySelectorAll(tabs_id);
			var i;
			for(i = 0; i < document.querySelectorAll(tabs_id).length; i++){
				document.querySelectorAll(tabs_id)[i].style.position = "relative";
				document.querySelectorAll(tabs_id)[i].style.display = "block";
				tabstop_cont.push(document.querySelectorAll(tabs_id)[i]);
			}
			console.log("Remove old tab divs...");
			for(i = 0; i < document.querySelectorAll(tabs_id).length; i++){
				document.querySelectorAll(tabs_id)[0].remove();
			}
			
			console.log("Reposition tab divs.");
			for(i = 0; i < tabstop_cont.length; i++){
				$("#T11").before(tabstop_cont[i]);
			}
			console.log("Done move_tabs()");
		}
	} else {
		(doAlert)? alert("jQuery required so move_tabs can work!") : console.warn("jQuery is not included, so functions like tooltip() or move_tabs() cannot run properly.");
		doAlert = false;
	}
}


/*
	Funcion que genera una ventana de aviso en tiempo de corrida. 
	Una simple ventana con el mensaje que se quiere especificar.
	Version:
		> 1.2
	Parametros:
		> titulo: [String] El titulo de la nueva ventana que se abrira.
		> msg: [String] Mensaje que se quiere colocar en el cuerpo de la nueva ventana,
				al que se le puede colocar etiquetas html en el String.
*/
function fAvisoNew( titulo, msg ){
    var win = window.open('', titulo, 'menubar=0,titlebar=0,width=485,height=370,left=' + window.outerWidth/3 + ',top=' + window.outerHeight/3);
    win = win.document;
    var eDiv = win.createElement("div");
    var eP = win.createElement("p");
    var eH1 = win.createElement("h1");
    var eBr = win.createElement("br");
	// Def DIV:
    eDiv.style = "margin:auto;width:auto;height:auto;color:rgb(17,18,12);text-align:left;padding:30px 20px;";
    // Def H1:
    eH1.style = "font-size:2.25rem;font-family:Helvetica,Arial,sans-serif;margin:auto;text-align:center;border-bottom:2px solid rgb(17,18,12);";
    eH1.innerText = titulo;
    // Def P:
    eP.style = "font-size:1.25rem;font-family:Helvetica,Arial,sans-serif;padding:20px;";
    eP.innerText = msg;
	// Agregar elementos:
	if(isIE11 || isIE){
		console.log("Internet Explorer detected! Using alternative methods.");
		eDiv.appendChild(eH1);
		eDiv.appendChild(eBr);
		eDiv.appendChild(eBr);
		eDiv.appendChild(eP);
		// Agregarlos al body para que san visibles:
		win.body.style = "background-color:#FFFF54;";
		win.body.appendChild(eDiv);
	}else{
		eDiv.append(eH1);
		eDiv.append(eBr);
		eDiv.append(eBr);
		eDiv.append(eP);
		// Agregarlos al body para que san visibles:
		win.body.style = "background-color:#FFFF54;";
		win.body.append(eDiv);
	}
    
	console.log("Se ha generado un aviso del sistema!");
}


document.addEventListener('DOMContentLoaded', function(){
	// Field determines if is tab form or not. 
	var tabValue = (document.querySelector("input[name*='VO_TABS']") != null)? document.querySelector("input[name*='VO_TABS']").value : 0;
	var isTabForm = (tabValue == 1);
	
	var do_tab_movement = isTabForm && (isChrome || isOpera || isEdge || isFirefox);
	
	// Al cargar la pagina, ejecutar la funcion para acomodar los tabs en caso de ser necesario.
	move_tabs(do_tab_movement, "tabstop");
});

