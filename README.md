# Tools for Diceros System

### Content:
- [hide_column(col_no, id_tabla)](#hide_column)
- [tooltip(id, helpText)](#tooltip)
- [filter_combo(filtro_id, combo_id)](#filter_combo)
- [filter_table(filtro_id, table_id, cells_array)](#filter_table)
- [toggle_column(col_no, id_tabla)](#toggle_column)
- [open_report(project, object, template, params)](#open_report)
- [move_tabs(do_it, tabs_id)](#move_tabs)
- [fAvisoNew(titulo, msg)](#fAvisoNew)

## hide_column:
    Funcion llamada en el evento onClick de una etiqueta <th> para ocultar la columna del click.

## tooltip:
    Esta funcion se llama desde el evento onMouseEnter de cualquier etiqueta del body del html en cuestion. Mostrara un pequeño texto de ayuda luego de cierto tiempo de que el usuairo puso el cursor sobre el elemento que hizo la llamada.

## filter_combo:
    Esta funcion se utiliza en el evento de onKeyUp, onKeyPress o en onKeyDown del input que servira como filtro. Basado en las coincidencias del filtro en el combo, las opciones que no cumplan con	el filtro van a desaparecer temporalmente.

## filter_table:
    Funcion que se llama desde el evento onKeyUp, onKeyPress o en onKeyDown del input filtro. Evalua si lo que esta escrito en el filtro concuerda con algun elemento de la tabla que se desea filtrar.

## toggle_column:
    Funcion llamada en el evento onClick de algun boton que permita hacer un toggle de la columna especificada en el parametro col_no.

## open_report:
    Funcion pensada para que sea la que se llame desde los botones de impresion de reportes.

## move_tabs:
    Funcion que resuelve el problema de los forms con tabs. Mueve los tabs al lugar en el que deberian ir normalmente para no afectar el funcionamiento en los browsers Chrome, Opera, Firefox y Edge.

## fAvisoNew:
    Funcion que genera una ventana de aviso en tiempo de corrida. Una simple ventana con el mensaje que se quiere especificar.