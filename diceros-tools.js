/******************************************************************************
		Author: .asolares.
		Version: 1.1.2

		Este script contiene funciones con diferentes utilidades para
		diferentes eventos.
		Content:
			> hide_column(col_no, id_tabla)
			> tooltip(id, helpText)
			> filter_combo(filtro_id, combo_id)
			> filter_table(filtro_id, table_id, cells_array)
			> toggle_column(col_no, id_tabla)
			> move_tabs(do_it, tabs_id)
			> fAvisoNew(titulo, msg)
			> formatNumber(num)
			> totalizarTabla(id_tabla, celdas, clase)
			> addBrowser(id_field, proyecto, objeto, where, imgFile)
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
		(doAlert)? console.warn("jQuery required so move_tabs can work!") : console.warn("jQuery is not included, so functions like tooltip() or move_tabs() cannot run properly.");
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
			console.info("Done move_tabs()");
		}
	} else {
		(doAlert)? console.warn("jQuery required so move_tabs can work!") : console.warn("jQuery is not included, so functions like tooltip() or move_tabs() cannot run properly.");
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
	eDiv.appendChild(eH1);
	eDiv.appendChild(eBr);
	eDiv.appendChild(eBr);
	eDiv.appendChild(eP);
	// Agregarlos al body para que san visibles:
	win.body.style = "background-color:#FFFF54;";
	win.body.appendChild(eDiv);
    
	console.log("Se ha generado un aviso del sistema!");
}

/*
	Esta funcion retorna el numero enviado como parametro con un formato de 
	numero como currency. (e.g. 123,456,789.98).
	Version:
		> 1.0
	Parametro:
		> num: [number] Cualquier numero que se quiera formatear.
*/
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}


/*
	Funcion que toma una tabla y totaliza las columnas que se especifiquen en 
	el array de celdas el cual empieza desde indice 0.
	Version:
		> 1.3
	Parametros:
		> obj_tabla: [Object] El object que representa la tabla a la que
					se quiere agregar totales.
		> celdas: [Array] Un array que contiene el numero de las columnas que se deben
					totalizar; empezando desde cero. (e.g. [1, 3] totaliza la columna 2 y 4
					de la tabla especificada en el obj_tabla).
		> clase: [String] [opcional] Especifica el nombre de la clase que deberia tener el tag <tr>
					que contiene los totales.
*/
function totalizarTabla(obj_tabla, celdas, clase = "noclass"){
    let posiciones = celdas;
    let tabla = obj_tabla; // Tabla a totalizar
    let filas = tabla.getElementsByTagName("tr"); // Filas de tabla
    let valores = []; // Valores de los totales
    
    let filaTotal = document.createElement("tr");
	filaTotal.classList.add(clase); // parametro clase

	// Eliminando <tr> totales para no hacer stack de totales.
	let trsTotales = document.querySelectorAll(`tr.${clase}`);

	for(let i = 0; i < trsTotales.length; ++i){
		console.log(`Eliminando total#${i} > ${trsTotales[i]}`);
		trsTotales[i].remove();
	}
	
	console.info(`Recibidos todos los parametros. tabla=${obj_tabla} | celdas=${celdas} | clase=${clase}`);
    
    
    for(let i = 0; i < posiciones.length; i++){
        //valores.push(0);
		valores[i] = 0;
    }
	
	console.debug(`Valores vs Posiciones: vals: ${valores} | pos: ${posiciones}`);
	
    for(var i = 0; i < filas.length; i++){
        let filaActual = filas[i];
        let celdas = filaActual.getElementsByTagName("td");
    
        if( celdas.length == 0 )
            continue;
    
        for(let j = 0; j < posiciones.length; j++){
            let posAct = posiciones[j];
            posAct *= 1;
            let valAct = celdas[posAct].innerHTML;
            valAct = ( valAct.replace(/,/g, '') ) * 1;
            valores[j] = valores[j] + valAct;
        }
    }
    
    
	let tmpFila = filas[filas.length - 1];
    let cantCeldas = tmpFila.getElementsByTagName("td");
	
    for(let k = 0; k < cantCeldas.length; k++){
        let tmpCell = document.createElement("td");
        tmpCell.style.textAlign = 'right';
        filaTotal.append(tmpCell);
    }
    
	let celdasTotal = filaTotal.getElementsByTagName("td");
	// breakpoint si no hay celdas porque solo hay encabezados en la tabla.
	if( celdasTotal.length == 0 || celdasTotal === undefined ){
		console.log(`Finalizado el proceso de totalizar. Fila total: ${filaTotal}`);
		return;
	}
    celdasTotal[0].innerHTML = "TOTAL";
    
    for(let l = 0; l < posiciones.length; l++){
        let posAct = posiciones[l];
        posAct *= 1;
        celdasTotal[posAct].innerHTML = (valores[l].toFixed(2)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    
	filas[filas.length - 1].parentElement.append(filaTotal);
	console.log(`Finalizado el proceso de totalizar. Fila total: ${filaTotal}`);
}


/* 
	Con esta funcion se agrega la funcionalidad de buscador a un campo
	 en especifico. Llamando a una ventana que contiene la informacion
	 solicitada.
	Version:
		> 1.2
	Parametros:
		> id_field: [String | Array] Si es String, representa el id del campo al que
					se le agrega el buscador y al que se le insertara el valor. Si es un
					array, el primer elemento debe ser el id del campo al que se le 
					agregara el buscador y los elementos que siguen, son en caso de que 
					se desee insertar otros datos en otros campos. (e.g. ["CLIENTE", "NIT"] 
					insertara un valor tanto en el id de CLIENTE como en el de NIT).
		> proyecto: [number] Representa el numero de proyecto en el que se encuentra el 
					reporte que sirve como dialogo.
		> objeto: [number] Es el objeto dentro del proyecto especificado que corresponde 
					al reporte.
		> where: [String] Corresponde a la sentencia Where que se incluye en el SQL del 
					reporte que sirve como dialogo.
		> imgFile: [String] [opcional] Es la ruta de la imagen que servira para representar 
					la accion de dialogo de busqueda.
*/
function addBrowser(id_field, proyecto, objeto, where, imgFile = "fa-search.png"){
    let headElem = document.getElementsByTagName("head")[0];
    let styleTag = headElem.getElementsByTagName("style")[0];

    if( styleTag === undefined ){
        let cssText = `div.fadedBehind {
            background-color:#000;
            opacity:0.5;
            position:fixed;
            display:none;
            width:100%;
            height:100%;
            z-index:9999;
            cursor:progress;
            top:0;
            left:0;
            right:0;
            bottom:0;
            text-align:center;
            padding-top:300px;
        }
        div.maxi{
            background-color: rgba(0, 0, 0, 0);
            padding-bottom: 0px;
            text-align: center;
            font-size: 1.5em;
            color: black;
            cursor: pointer;
            margin:0px;
			align-content: start;
			display: inline-block;
        }`;
        let styleElem = document.createElement("style");
        styleElem.type = "text/css";
        styleElem.appendChild(document.createTextNode(cssText));
        headElem.appendChild(styleElem);
    }else if( styleTag.innerHTML.search("fadedBehind") == -1 ){
        let cssText = `div.fadedBehind {
            background-color:#000;
            opacity:0.5;
            position:fixed;
            display:none;
            width:100%;
            height:100%;
            z-index:9999;
            cursor:progress;
            top:0;
            left:0;
            right:0;
            bottom:0;
            text-align:center;
            padding-top:300px;
        }
        div.maxi{
            background-color: rgba(0, 0, 0, 0);
            padding-bottom: 0px;
            text-align: center;
            font-size: 1.5em;
            color: black;
            cursor: pointer;
            margin:0px;
			align-content: start;
			display: inline-block;
        }`;
        let styleElem = document.createElement("style");
        styleElem.type = "text/css";
        styleElem.appendChild(document.createTextNode(cssText));
        headElem.appendChild(styleElem);
    }
    let isObject = (typeof id_field == "object");

    // Campo que tendra busqueda
    if( !isObject ){
        var refField = id_field;
        var searchField = document.getElementById(refField);
    }else{
		for(let iter = 0; iter < id_field.length; iter++){
			if(id_field[iter].indexOf("--search") > -1){
				var refField = id_field[iter].substring(0, id_field[iter].indexOf("--search"));
				break;
			} else
				var refField = -1;
		}
		if(refField === -1){
			refField = id_field[0];
		}
        var searchField = document.getElementById(refField);
    }

    // overlay listo para mostrar
    if(document.getElementsByClassName("fadedBehind").length == 0){
        let overlay = document.createElement("div");
        let body = document.getElementsByTagName("body")[0];
        overlay.classList.add("fadedBehind");
        body.append(overlay);
    }
    
    // Creando el elemento de busqueda
    let browserDiv = document.createElement("div");
    browserDiv.classList.add("maxi");
    browserDiv.id = "busc" + refField;

    // Inner div creado
    let innerDiv = document.createElement("div");
    innerDiv.id = "inBusc" + refField;
    innerDiv.addEventListener('mouseenter', function(){
        tooltip(this.id, 'Hacer click para iniciar dialogo de búsqueda...');
    });
    
    innerDiv.addEventListener('click', function(){
        window.open("rbplus?p=" + proyecto + "&o=" + objeto + "&w=" + where + "&VACAMPOS=" + id_field.toString().replace(/--search/g, ""),'', 'menubar=yes,resizable=yes,toolbar=yes,titlebar=yes,scrollbars=yes,left=300,top=150,width=1100,height=575');
        jQuery(document.querySelectorAll("div.fadedBehind")[0]).show(950);
        jQuery(this).parent().hide(950);
    });

    // Imagen de lupita
    let lupita = document.createElement("img");
    lupita.src = imgFile; // "fa-search.png"
    lupita.alt = "Busqueda";

    // Colocando el search en la pantalla
    innerDiv.append(lupita);
    browserDiv.append(innerDiv);
    searchField.parentElement.append(browserDiv);
}

document.addEventListener('DOMContentLoaded', function(){
	// Field determines if is tab form or not. 
	var tabValue = (document.querySelector("input[name*='VO_TABS']") != null)? document.querySelector("input[name*='VO_TABS']").value : 0;
	var isTabForm = (tabValue == 1);
	
	var do_tab_movement = isTabForm && (isChrome || isOpera || isEdge || isFirefox);
	
	// Al cargar la pagina, ejecutar la funcion para acomodar los tabs en caso de ser necesario.
	move_tabs(do_tab_movement, "tabstop");
});