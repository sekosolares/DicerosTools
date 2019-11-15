# Toolkit for Diceros to simplify tasks.

## Pre-requisitos:
- [jQuery V3.X](https://jquery.com/)


## Como instalar:
Sencillamente hay que copiar y pegar este codigo para incluir DicerosTools en el html:

    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/capulusnoctis/DicerosTools@1.0.0/diceros-tools.js"></script>

o bien:

    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/capulusnoctis/DicerosTools@1.0.0/diceros-tools.min.js"></script>

para la version minificada.


### Functions:
- [hide_column(col_no,id_tabla)](#hide_column)
- [tooltip(id,helpText)](#tooltip)
- [filter_combo(filtro_id,combo_id)](#filter_combo)
- [filter_table(filtro_id,table_id,cells_array)](#filter_table)
- [toggle_column(col_no,id_tabla)](#toggle_column)
- [open_report(project,object,template,params)](#open_report)
- [move_tabs(do_it,tabs_id)](#move_tabs)
- [fAvisoNew(titulo,msg)](#fAvisoNew)
- [formatNumber(num)](#formatNumber)
- [totalizarTabla(obj_tabla,celdas,clase)](#totalizarTabla)
- [addBrowser(id_field,proyecto,objeto,where,imgFile)](#addBrowser)


## hide_column:
Funcion llamada en el evento onClick de una etiqueta ```<th>``` para ocultar la columna del click.

**Parametros**:
- **col_no**: *integer* El numero de la columna que se oculta; la numeracion empieza desde 0.
- **id_tabla**: *String* Indica el id de la tabla que tendra esta accion de ocultar filas.

**Ejemplo**:


## tooltip:
Esta funcion se llama desde el evento onMouseEnter de cualquier etiqueta del body del html en cuestion. Mostrara un pequeño texto de ayuda luego de cierto tiempo de que el usuairo puso el cursor sobre el elemento que hizo la llamada.

Parametros:
- **id**: *String* Es el id del elemento al cual se le debe poner el cursor encima para que muestre el texto de ayuda.
- **helpText**: *String* Sera el texto que se mostrara al momento que entre el cursor al elemento con el id señalado en el parametro anterior.


## filter_combo:
Esta funcion se utiliza en el evento de onKeyUp, onKeyPress o en onKeyDown del input que servira como filtro. Basado en las coincidencias del filtro en el combo, las opciones que no cumplan con	el filtro van a desaparecer temporalmente.

Parametros:
- **filtro_id**: *String* Es el id del input que servira como filtro del combo.
- **combo_id**: *String* Es el combo que va a ser filtrado basado en lo que se coloque en el input de filtro.


## filter_table:
Funcion que se llama desde el evento onKeyUp, onKeyPress o en onKeyDown del input filtro. Evalua si lo que esta escrito en el filtro concuerda con algun elemento de la tabla que se desea filtrar.

Parametros:
- **filtro_id**: *String* Es el id del input que se utilizara como criterio para filtrar la tabla.
- **table_id**: *String* Id de la tabla cuyos elementos seran filtrados.
- **cells_array**: *Array* Este array contiene los numeros de las columnas que seran filtradas, iniciando desde cero. (e.g. [0, 2, 3] filtra la primera, tercera y cuarta columna. [ 0 ] solo filtra la primera columna).


## toggle_column:
Funcion llamada en el evento onClick de algun boton que permita hacer un toggle de la columna especificada en el parametro col_no.

Parametros:
- **col_no**: *integer* El numero de la columna a la que se hace toggle; la numeracion empieza desde 0.
- **id_tabla**: *String* Indica el id de la tabla que tendra esta accion de ocultar y mostrar columnas.


## open_report:
Funcion pensada para que sea la que se llame desde los botones de impresion de reportes.

Parametros:
- **project**: *integer* El id del proyecto en el que se encuentra el reporte que se llama.
- **object**: *integer* Id del objeto correspondiente al objeto que tiene el reporte.
- **template**: *String* *opcional* Especifica si hay que utilizar algun template en particular.
- **params**: *String* *opcional* En el caso de que haya que llenar parametros del lado del objeto en donde esta el reporte, se debe especificar aqui. e.g. "&VACAMPO=1&VACAMPO2=2"


## move_tabs:
Funcion que resuelve el problema de los forms con tabs. Mueve los tabs al lugar en el que deberian ir normalmente para no afectar el funcionamiento en los browsers Chrome, Opera, Firefox y Edge.

Parametros:
- **do_it**: *boolean* Determina si debe ejecutarse la funcion o no.
- **tabs_id**: *String* Se refiere al id del o los divs que contienen los tabs, a los cuales se le dara movimiento.


## fAvisoNew:
Funcion que genera una ventana de aviso en tiempo de corrida. Una simple ventana con el mensaje que se quiere especificar.

Parametros:
- **titulo**: *String* El titulo de la nueva ventana que se abrira.
- **msg**: *String* Mensaje que se quiere colocar en el cuerpo de la nueva ventana, al que se le puede colocar etiquetas html en el String.


## formatNumber:
Esta funcion retorna el numero enviado como parametro con un formato de numero como currency. (e.g. 123,456,789.98).

Parametro:
- **num**: *number* Cualquier numero que se quiera formatear.


## totalizarTabla:
Funcion que toma una tabla y totaliza las columnas que se especifiquen en el array de celdas el cual empieza desde indice 0.

Parametros:
- **obj_tabla**: *Object* El object que representa la tabla a la que se quiere agregar totales.
- **celdas**: *Array* Un array que contiene el numero de las columnas que se deben totalizar; empezando desde cero. (e.g. [1, 3] totaliza la columna 2 y 4 de la tabla especificada en el obj_tabla).
- **clase**: *String* *opcional* Especifica el nombre de la clase que deberia tener el tag ```<tr>``` que contiene los totales.


## addBrowser:
Con esta funcion se agrega la funcionalidad de buscador a un campo en especifico. Llamando a una ventana que contiene la informacion solicitada.

Parametros:
- **id_field**: *String* ```|``` *Array* Si es String, representa el id del campo al que se le agrega el buscador y al que se le insertara el valor. Si es un array, el primer elemento debe ser el id del campo al que se le agregara el buscador y los elementos que siguen, son en caso de que  se desee insertar otros datos en otros campos. (e.g. ["CLIENTE", "NIT"] insertara un valor tanto en el id de CLIENTE como en el de NIT).
- **proyecto**: *number* Representa el numero de proyecto en el que se encuentra el reporte que sirve como dialogo.
- **objeto**: *number* Es el objeto dentro del proyecto especificado que corresponde al reporte.
- **where**: *String* Corresponde a la sentencia Where que se incluye en el SQL del reporte que sirve como dialogo.
- **imgFile**: *String* *opcional* Es la ruta de la imagen que servira para representar la accion de dialogo de busqueda.