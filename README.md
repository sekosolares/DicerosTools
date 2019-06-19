# Toolkit for Diceros to simplify tasks.

### Content:
- [hide_column(col_no,id_tabla)](#hide_column)
- [tooltip](#tooltip)
- [filter_combo](#filter_combo)
- [filter_table](#filter_table)
- [toggle_column](#toggle_column)
- [open_report](#open_report)
- [move_tabs](#move_tabs)
- [fAvisoNew](#fAvisoNew)

## hide_column:
Funcion llamada en el evento onClick de una etiqueta ```<th>``` para ocultar la columna del click.

Parametros:
- **col_no**: *integer* El numero de la columna que se oculta; la numeracion empieza desde 0.
- **id_tabla**: *String* Indica el id de la tabla que tendra esta accion de ocultar filas.

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
- **cells_array**: *Array* Este array contiene los numeros de las columnas que seran filtradas, iniciando desde cero. (e.g. [0, 2, 3] filtra la primera, tercera y cuarta columna. [0] solo filtra la primera columna).

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