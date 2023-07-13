/******************************************************************************
		Author: .asolares.
		Version: 1.2.2

		Este script contiene funciones con diferentes utilidades para
		diferentes eventos.
********************************************************************************/


/**** Variables para deteccion de browser en uso ****/

// Opera
const IS_OPERA = navigator.userAgent.includes("OPR");

// Firefox 1.0+
const IS_FIREFOX = navigator.userAgent.includes("Firefox");

// Safari
const IS_SAFARI = navigator.userAgent.includes("Safari");

// Internet Explorer < 11
const IS_IE = navigator.userAgent.includes("IE");

// Internet Explorer 11
const IS_IE11 = navigator.userAgent.includes("Trident");

// Edge
const IS_EDGE = navigator.userAgent.includes("Edge");

// Chrome 1+
const IS_CHROME = navigator.userAgent.includes("Chrome");

/**
* Esta funcion es una forma mas corta de llamar a document.querySelector().
Por lo tanto, retorna el elemento HTML del selector enviado como argumento.

* @param {string} str Es el string que iria en un document.querySelector(str) normal.
* @returns {Element|null} Elemento HTML del selector enviado como argumento.
*/
function get(str) {
	const element = document.querySelector(str);
	return element;
}

/**
 * Funcion llamada en el evento onClick de una etiqueta <th> para
	ocultar la columna del click.
 * @param {number} colIndex El indice de la columna que se oculta; la numeracion
	empieza desde 0.
 * @param {string} idTable Indica el id de la tabla que tendra esta accion de
	ocultar filas.
 */
function hide_column(colIndex, idTable) {
	const tabla  = document.getElementById(idTable);
	const rows = [...tabla.getElementsByTagName('tr')];

	rows.forEach(row => row.cells[colIndex].style.display = "none");

	const arrTHs = [...tabla.getElementsByTagName("th")];
	const arrTDs = [...tabla.getElementsByTagName("td")];

	const cellLength = arrTHs.length > 0 ? arrTHs.length : arrTDs.length;
	let anchoCols = 100 / cellLength;
	anchoCols = anchoCols.toFixed(2);
	arrTHs.forEach(th => th.style.width = `${anchoCols}%`);
	arrTDs.forEach(td => td.style.width = `${anchoCols}%`);
}
function hideColumn(colIndex, idTable) {
	hide_column(colIndex, idTable);
}


function checkClassExistence(className) {
	const exists = [...document.querySelectorAll('style')]
		.some(elem => elem.innerHTML.includes(className));
	return exists;
}

function insertTooltipStyling({fieldId, xPos, yPos}) {
	const TooltipStyle = `<style id="Tooltip_Style_${fieldId}">
		.tooltip-style-${fieldId} {
			left:${xPos}px;top:${yPos}px;
			font-family:Arial, sans-serif;
			border:1px solid gray;
			position:absolute;
			color:#888888;
			font-size:14px;
			background-color:#fff;
			width:auto;
			height:auto;
			padding:8px;
			border-radius:10px;
			box-shadow:0px 5px 15px gray;
			animation: linear fade-in .4s;
		}
		@keyframes fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
		.tooltip--inactive {
			display:none;
		}
	</style>`;
	if(checkClassExistence(`tooltip-style-${fieldId}`))
		get(`#Tooltip_Style_${fieldId}`).remove();
	get("body").insertAdjacentHTML('beforebegin', TooltipStyle);
}

/**
* Esta funcion se llama desde el evento onMouseEnter de cualquier etiqueta
del body del html en cuestion. Mostrara un pequeño texto de ayuda luego
de cierto tiempo de que el usuairo puso el cursor sobre el elemento que
hizo la llamada.

* @param {string} id Es el id del elemento al cual se le debe poner el cursor
encima para que muestre el texto de ayuda.
* @param {string} helpText Sera el texto que se mostrara al momento que
entre el cursor al elemento con el id señalado en el parametro anterior.
* @param {Event | undefined} [ev=event] Se refiere al evento del mouse del cual
se sacan las coordenadas del pointer.
*/
function tooltip( id, helpText, ev=event ) {
	const {clientX, clientY} = ev;

	insertTooltipStyling({ fieldId: id, xPos: clientX, yPos: clientY });

	get(`#${id}`).parentElement.insertAdjacentHTML('afterend',
		`<div
			id='tooltip${id}'
			class='tooltip tooltip--inactive tooltip-style-${id}'>${helpText}</div>`
	)

	// Al salir el cursor del elemento, remueve el <div> creado para que no existan stacks.
	get(`#${id}`).addEventListener('mouseleave', function() {
		get(`#tooltip${id}`) && get(`#tooltip${id}`).remove();
	});

	// Si el cursor permanecio adentro, se mostrara el <div> con el texto del parametro.
	get(`#tooltip${id}`).classList.remove("tooltip--inactive");
}

/**
 * Esta funcion se utiliza en el evento de onKeyUp, onKeyPress o en onKeyDown del input que servira
	como filtro. Basado en las coincidencias del filtro en el combo, las opciones que no cumplan con
	el filtro van a desaparecer para dejar solo lo que se esta filtrando.
 * @param {string} filtroId Es el id del input que servira como filtro del combo.
 * @param {string} comboId Es el id del combo que va a ser filtrado.
 */
function filter_combo(filtroId, comboId){
    let
		input = document.getElementById(filtroId),
    filterValue = input.value.toUpperCase(),
    combo = document.getElementById(comboId),
    options = [...combo.getElementsByTagName("option")];

    options.forEach(option => {
			if ( option.innerHTML.toUpperCase().includes(filterValue) ) {
				option.style.display = "";
				combo.selectedIndex = option.index;
			} else {
				option.style.display = "none";
			}
		});
}
function filterCombo(filtroId, comboId) {
	filter_combo(filtroId, comboId);
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
function filter_table(filtro_id, table_id, cells_array='all'){
	let input, filter, table, tr, i, j;

	input = document.getElementById(filtro_id);
	filter = input.value.toUpperCase();
	table = document.getElementById(table_id);
	tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		let coincide = false;
		let coincideAnt = true;

		if(cells_array === 'all') {
			cells_array = [];
			for(let i = 0; i < tr[i].cells.length; i++) {
				cells_array.push(i);
			}
		}

		for(j = 0; j < cells_array.length; j++) {
			let item = cells_array[j];
			let hasNextItem = (cells_array[j+1] != undefined);

			if(hasNextItem){
				let nextItem = cells_array[j+1];
				let td = tr[i].getElementsByTagName("td")[item];
				let td2 = tr[i].getElementsByTagName("td")[nextItem];
				if(td || td2){
					if((td.innerHTML.toUpperCase().indexOf(filter) > -1) ||
						(td2.innerHTML.toUpperCase().indexOf(filter) > -1) ){
						coincide = coincideAnt ?? true;
					}
				}
			} else {
				let td = tr[i].getElementsByTagName("td")[item];
				if(td){
					if( (td.innerHTML.toUpperCase().indexOf(filter) > -1) ){
						coincide = coincide || true;
					}
				}
			}
			coincideAnt = coincide;
		}

		let isTh = tr[i].getElementsByTagName("th");
		isTh = isTh.length;
		if(coincideAnt){
			tr[i].style.display = "";
		} else {
				if(isTh <= 0)
					tr[i].style.display = "none";
		}
	}
}

/**
 * Funcion llamada en el evento onClick de algun boton que permita hacer un toggle de la
	columna especificada en el parametro col_no.
 * @param {number} colIndex El indice de la columna a la que se hace toggle.
 * @param {string} id_tabla Indica el id de la tabla que tendra esta accion de ocultar y mostrar columnas.
 */
function toggle_column(colIndex, id_tabla) {
	let tbl  = document.getElementById(id_tabla);
	let rows = tbl.getElementsByTagName('tr');

	for (let row = 0; row < rows.length; row++) {
		let cels = "";
		if(row == 0 && rows[row].getElementsByTagName('th').length > 0) {
			cels = rows[row].getElementsByTagName('th');
		}else{
			cels = rows[row].getElementsByTagName('td');
		}
		if(cels[colIndex].style.display == "none"){
			cels[colIndex].style.display = "";
		}else{
			cels[colIndex].style.display = "none";
		}
	}
}

/**
 * Funcion que resuelve el problema de los forms con tabs. Mueve los tabs al lugar en el que
	deberian ir normalmente, para no afectar el funcionamiento en los browsers Chrome, Opera,
	Firefox y Edge.
 * @param {boolean} doIt Determina si debe ejecutarse la funcion o no.
 * @param {string} tabsId Se refiere al id del o los divs que contienen los tabs, a los cuales se le dara movimiento.
 */
function move_tabs(doIt, tabsId) {
	if(!doIt) {
		console.log("Not a tab form. Wont move any tabs.");
	} else {
		tabsId = `#${tabsId}`;
		let tabstop_cont = new Array();
		console.log("Execute tab movement.");
		const allTabs = [...document.querySelectorAll(tabsId)];

		allTabs.forEach(tab => {
			tab.style.position = "relative";
			tab.style.display = "inline-block";
			tab.style.width = "fit-content";
			tabstop_cont.push(tab);
		});

		console.log("Remove old tab divs...");
		allTabs.forEach(tab => tab.remove());

		console.log("Reposition tab divs.");
		tabstop_cont.forEach(tab => get("#T11").insertAdjacentElement('beforebegin', tab));

		console.info("Done move_tabs()");
	}
}

/**
 * Funcion que genera una ventana de aviso en tiempo de corrida.
	Una simple ventana con el mensaje que se quiere especificar.
 * @param {string} titulo El titulo de la nueva ventana que se abrira.
 * @param {string} msg Mensaje que se quiere colocar en el cuerpo de la nueva
 * ventana, al que se le puede colocar etiquetas html en el String.
 */
function fAvisoNew( titulo, msg ){
    let win = window.open('', titulo, 'menubar=0,titlebar=0,width=485,height=370,left=' + window.outerWidth/3 + ',top=' + window.outerHeight/3);
    win = win.document;
    const elemDiv = win.createElement("div");
    const elemP = win.createElement("p");
    const elemH1 = win.createElement("h1");
    const elemBr = win.createElement("br");
	// Def DIV:
    elemDiv.style = "margin:auto;width:auto;height:auto;color:rgb(17,18,12);text-align:left;padding:30px 20px;";
    // Def H1:
    elemH1.style = "font-size:2.25rem;font-family:Helvetica,Arial,sans-serif;margin:auto;text-align:center;border-bottom:2px solid rgb(17,18,12);";
    elemH1.innerText = titulo;
    // Def P:
    elemP.style = "font-size:1.25rem;font-family:Helvetica,Arial,sans-serif;padding:20px;";
    elemP.innerHTML = msg;
	// Agregar elementos:
	elemDiv.appendChild(elemH1);
	elemDiv.appendChild(elemBr);
	elemDiv.appendChild(elemBr);
	elemDiv.appendChild(elemP);
	// Agregarlos al body para que san visibles:
	win.body.style = "background-color:#FFFF54;";
	win.body.appendChild(elemDiv);

	console.log("Se ha generado un aviso del sistema!");
}

/**
 * Esta funcion retorna el numero enviado como argumento con un formato de
	numero como currency. (e.g. `123456789.98` -> `123,456,789.98`).
 * @param {number} num Cualquier numero que se quiera formatear.
 * @returns El argumento enviado en `num`, con un formato tipo currency.
 */
function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

/**
 * Funcion que toma una tabla y totaliza las columnas que se especifiquen en
	el array de celdas el cual empieza desde indice 0.

 * @param {object} objTabla El object que representa la tabla a la que se quiere agregar totales.
 * @param {object} celdas Un array que contiene el numero de las columnas que se deben
	totalizar; empezando desde cero. (e.g. [1, 3] totaliza la columna 2 y 4
	de la tabla especificada en el obj_tabla).
 * @param {string?} clase Especifica el nombre de la clase que deberia tener el tag <tr>
	que contiene los totales.
 */
function totalizarTabla(objTabla, celdas, clase = "noclass"){
    let posiciones = celdas;
    let tabla = objTabla; // Tabla a totalizar
    let filas = tabla.getElementsByTagName("tr"); // Filas de tabla
    let valores = []; // Valores de los totales

    let filaTotal = document.createElement("tr");
	filaTotal.classList.add(clase); // parametro clase

	// Eliminando <tr> totales para no hacer stack de totales.
	let trsTotales = tabla.querySelectorAll(`tr.${clase}`);

	for(let i = 0; i < trsTotales.length; ++i){
		console.log(`Eliminando total#${i} > ${trsTotales[i]}`);
		trsTotales[i].remove();
	}

	console.info(`Recibidos todos los parametros.
	tabla=${JSON.stringify(objTabla, null, 2)} | celdas=${JSON.stringify(celdas, null, 2)} | clase=${clase}`);

    for(let i = 0; i < posiciones.length; i++){
			valores[i] = 0;
    }

	console.debug(`Valores vs Posiciones: vals: ${valores} | pos: ${JSON.stringify(posiciones, null, 2)}`);

    for(let fila of filas) {
        let filaActual = fila;
        let celdas = filaActual.getElementsByTagName("td");

		if(filaActual.style.display != 'none'){ // Si todo el row no es visible, no se toma en cuenta.
			if( celdas.length == 0 )
				continue;

			for(let j = 0; j < posiciones.length; j++){
				let posAct = posiciones[j];
				posAct *= 1;
				if(celdas[posAct].style.display != 'none'){ // Si la celda no es visible, no se toma en cuenta
					let valAct = celdas[posAct].innerHTML;
					valAct = ( valAct.replace(/,/g, '') ) * 1;
					valores[j] = valores[j] + valAct;
				}
			}
		}
    }

	let tmpFila = filas[filas.length - 1];
    let cantCeldas = tmpFila.getElementsByTagName("td").length;

    for(let k = 0; k < cantCeldas; k++){
			let tmpCell = document.createElement("td");
			tmpCell.style.textAlign = 'right';
			filaTotal.append(tmpCell);
    }

	let celdasTotal = filaTotal.getElementsByTagName("td");
	// breakpoint si no hay celdas porque solo hay encabezados en la tabla.
	if( celdasTotal.length == 0 || celdasTotal === undefined ){
		console.log(`Finalizado el proceso de totalizar. Fila total: ${JSON.stringify(filaTotal, null, 2)}`);
		return;
	}
    celdasTotal[0].innerHTML = "TOTAL";

    for(let l = 0; l < posiciones.length; l++){
        let posAct = posiciones[l];
        posAct *= 1;
        celdasTotal[posAct].innerHTML = (valores[l].toFixed(2)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

	filas[filas.length - 1].parentElement.append(filaTotal);
	console.log(`Finalizado el proceso de totalizar. Fila total: ${JSON.stringify(filaTotal, null, 2)}`);
}


/**
 * Con esta funcion se agrega la funcionalidad de buscador a un campo
	en especifico. Llamando a una ventana que contiene la informacion
	solicitada.
 * @param {string|object} id_field Si es String, representa el id del campo al que
	se le agrega el buscador y al que se le insertara el valor. Si es un
	array, el primer elemento debe ser el id del campo al que se le
	agregara el buscador y los elementos que siguen, son en caso de que
	se desee insertar otros datos en otros campos. (e.g. ["CLIENTE", "NIT"]
	insertara un valor tanto en el id de CLIENTE como en el de NIT).
 * @param {number} proyecto Representa el numero de proyecto en el que se encuentra el
	reporte que sirve como dialogo.
 * @param {number} objeto Es el objeto dentro del proyecto especificado que corresponde
	al reporte.
 * @param {string} where Corresponde a la sentencia Where que se incluye en el SQL del
	reporte que sirve como dialogo.
 * @param {string?} imgFile Es la ruta de la imagen que servira para representar
	la accion de dialogo de busqueda.
 */
function addBrowser(id_field, proyecto, objeto, where, imgFile = "fa-search.png"){
    let headElem = document.getElementsByTagName("head")[0];
    let styleTag = headElem.getElementsByTagName("style")[0];
		const cssText = `div.fadedBehind {
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

    if( styleTag === undefined || styleTag.innerHTML.search("fadedBehind") == -1 ){
        let styleElem = document.createElement("style");
        styleElem.setAttribute("type", "text/css");
        styleElem.appendChild(document.createTextNode(cssText));
        headElem.appendChild(styleElem);
    }
    let isObject = (typeof id_field == "object");

		let refField = "";
		let searchField = "";
    // Campo que tendra busqueda
    if( !isObject ){
			refField = id_field;
			searchField = document.getElementById(refField);
    } else {
			for(let id of id_field){
				if(id.indexOf("--search") > -1){
					refField = id.substring(0, id.indexOf("--search"));
					break;
				} else
					refField = -1;
			}
			if(refField == -1) {
				refField = id_field[0];
			}

			searchField = document.getElementById(refField);
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
        document.querySelectorAll("div.fadedBehind")[0].style.display = "";
        this.parentElement.style.display = "none";
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

/**
 * Retorna la fecha de hoy con un formato de DD/MM/YYYY.

 * @returns {string} Fecha de hoy con el formato DD/MM/YYYY.
*/
const getToday = () => {
	let
		date = new Date(),
		day = date.getDate(),
		month = date.getMonth() + 1,
		year = date.getFullYear();
	const addLeftZeros = (num, zerosQty) => typeof num === 'number'
			? num.toString().padStart(num, '0')
			: num.padStart(num, '0');
	[day, month] = [addLeftZeros(day, 2), addLeftZeros(month, 2)];
	let todayDate = [day, month, year].join('/');
	return todayDate;
}

/**
 * La clase estatica `WB` modulariza y abstrae las funciones para ejecutar acciones
 * en la base de datos usando el servlet `/getdata`.
 */
class WB {
	static urlSistema = this.getSistemaURL();
	static urlGetdata = [this.urlSistema, 'getdata'].join('/');

	/**
	 * Obtiene y retorna la URL hasta `/Sistema` desde en la URL del browser.

	 * @returns {string} URL de la forma `http://<ip>:<puerto>/Sistema`
	*/
	static getSistemaURL() {
		const origin = document.location.origin;
		const pathname = document.location.pathname;
		const [, rutaSistema ,] = pathname.split('/');
		const sistemaURL = [origin, rutaSistema].join('/');
		return sistemaURL;
	};

	/**
	 * Con este metodo, se abstrae la funcionalidad de Select al servidor enviando
	 * solo un query como argumento.
	 * @param {string} sql Query que se va a mandar a ejecutar al servidor.
	 * @returns `Promise` que se produce al ejecutar un `fetch`.
	 */
	static dbSelect(sql) {
		let params = ['tp=3', 'sql=' + sql].join('&');
		let endpoint = [this.urlGetdata, params].join('?');
		endpoint = encodeURI(endpoint);
		return fetch(endpoint);
	}

	/**
	 * Con este metodo se ejecuta un request al servidor para ejecutar un update
	 * en la BD.
	 */
	static dbUpdate({table, arrColumns, arrWhere}) {
		const strSetColumnas = arrColumns.join('|');
		const strWhere = arrWhere.join(' and ');
		const params = [
			'tp=P', 'm=U', 't=' + table,
			'c=' + strSetColumnas, 'l=' + strWhere
		].join('&');
		let endpoint = [this.urlGetdata, params].join('?');
		endpoint = encodeURI(endpoint);
		return fetch(endpoint);
	}

	static dbInsert({table, arrColumns, arrValues}) {
			const columns = arrColumns.join("|");
			const values = arrValues.join("|");
			let params = [
				"tp=P",
				"m=I",
				"c=" + columns,
				"l=" + values,
				"t=" + table,
			].join("&");
			let endpoint = [this.urlGetdata, params].join('?');
			endpoint = encodeURI(endpoint);
			return fetch(endpoint);
	}
}

document.addEventListener('DOMContentLoaded', function(){
	// Field determines if is tab form or not.
	const tabValue = document.querySelector("input[name*='VO_TABS']")
		? Number(document.querySelector("input[name*='VO_TABS']").value)
		: 0;
	const isTabForm = (tabValue === 1);

	const doTabMovement = isTabForm && (IS_CHROME || IS_OPERA || IS_EDGE || IS_FIREFOX);

	// Al cargar la pagina, ejecutar la funcion para acomodar los tabs en caso de ser necesario.
	move_tabs(doTabMovement, "tabstop");
});