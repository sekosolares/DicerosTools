# DicerosTools js

Una librería de Javascript que permite simplificar tareas en el sistema *Diceros*.
Tareas como ocultar columnas de tablas, totalizar una tabla, filtrar dropdown lists, etc.

## Pre-requisitos:
- [jQuery V3.X](https://jquery.com/)

---

## Cómo instalar:
Sencillamente hay que copiar y pegar este código para incluir DicerosTools en el *html*:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/capulusnoctis/DicerosTools@1.0.0/diceros-tools.js"></script>
```

o bien:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/capulusnoctis/DicerosTools@1.0.0/diceros-tools.min.js"></script>
```

para la versión minificada.

---

## Indice de Funciones:

- [hide_column](#hide_column)
- [tooltip](#tooltip)
- [filter_combo](#filter_combo)
- [filter_table](#filter_table)
- [toggle_column](#toggle_column)
- [move_tabs](#move_tabs)
- [fAvisoNew](#fAvisoNew)
- [formatNumber](#formatNumber)
- [totalizarTabla](#totalizarTabla)
- [addBrowser](#addBrowser)


## hide_column
Funcion llamada en el evento onClick de una etiqueta `<th>` para ocultar la columna del click.

**Función**:
```javascript
hide_column(col_no,id_tabla)
```


**Parametros**:
- **col_no**: *integer* El numero de la columna que se oculta; la numeracion empieza desde 0.
- **id_tabla**: *String* Indica el id de la tabla que tendra esta accion de ocultar filas.


**Ejemplo**:
El siguiente ejemplo hará que se oculte la columna de **Código** cuando al encabezado (`<th>`) se le haga click.

```html
<table id="tabla1">
    <thead>
        <tr>
            <th onclick="hide_column(0, 'tabla1')"> Codigo </th>
            <th> Nombre </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>01</td>
            <td>Marco Antonio</td>
        </tr>
        <tr>
            <td>02</td>
            <td>Laura Larisa</td>
        </tr>
        <tr>
            <td>03</td>
            <td>Genesis Valeria</td>
        </tr>
    </tbody>
</table>
```

<a href="https://codepen.io/capulusnoctis/embed/povMGvN?height=265&theme-id=default&default-tab=html,result" style="padding:8px 10px;background:rgb(29, 135, 255);border:0;color:#fff;font-family:Arial,Helvetica,sans-serif;border-radius:4px;text-decoration:none;" target="_blank">Ver Ejemplo</a>

---

## tooltip
Esta funcion se llama desde el evento onMouseEnter de cualquier etiqueta del body del html en cuestión. Mostrará un pequeño texto de ayuda luego de cierto tiempo de que el usuairo puso el cursor sobre el elemento que hizo la llamada.

**Función**:
```javascript
tooltip(id,helpText)
```


**Parametros**:
- **id**: *String* Es el id del elemento al cual se le debe poner el cursor encima para que muestre el texto de ayuda.
- **helpText**: *String* Sera el texto que se mostrara al momento que entre el cursor al elemento con el id señalado en el parametro anterior.


**Ejemplo**:
Teniendo el siguiente bloque código, se mostrará la frase *Inserta tu nombre para continuar...* cuando el cursor se coloque en el input con id **nombre**.

```html
<label for="nombre">Nombre:</label>
<input type="text" id="nombre" placeholder=" Nombre" onMouseEnter="tooltip('nombre', 'Inserta tu nombre para continuar...')">
```

<a href="https://codepen.io/capulusnoctis/embed/bGNXzow?height=296&theme-id=default&default-tab=html,result" style="padding:8px 10px;background:rgb(29, 135, 255);border:0;color:#fff;font-family:Arial,Helvetica,sans-serif;border-radius:4px;text-decoration:none;" target="_blank">Ver Ejemplo</a>

---

## filter_combo
Esta funcion se utiliza en el evento de onKeyUp, onKeyPress o en onKeyDown del input que servirá como filtro. Basado en las coincidencias del filtro en el combo, las opciones que no cumplan con	el filtro van a desaparecer hasta que el input esté vacío de nuevo.


**Función**:
```html
filter_combo(filtro_id,combo_id)
```


**Parametros**:
- **filtro_id**: *String* Es el id del input que servira como filtro del combo.
- **combo_id**: *String* Es el combo que va a ser filtrado basado en lo que se coloque en el input de filtro.


**Ejemplo**:
En este código, se muestra un comboBox (dropdown list) el cual contiene países. Cuando se escriba en el input, este combo se filtrará seleccionando la opción que coincida con lo que se escribe en el input.

```html
<input type="text" id="filtro" onkeyup="filter_combo('filtro', 'combo')">
<select name="pais" id="combo">
    <option value="CN">China</option>
    <option value="CO">Colombia</option>
    <option value="GT">Guatemala</option>
    <option value="MX">Mexico</option>
    <option value="US">Estados Unidos</option>
</select>
```

<a href="https://codepen.io/capulusnoctis/embed/VwYogBo?height=265&theme-id=default&default-tab=html,result" style="padding:8px 10px;background:rgb(29, 135, 255);border:0;color:#fff;font-family:Arial,Helvetica,sans-serif;border-radius:4px;text-decoration:none;" target="_blank">Ver Ejemplo</a>

---

## filter_table
Funcion que se llama desde el evento onKeyUp, onKeyPress o en onKeyDown del input filtro. Evalua si lo que esta escrito en el filtro concuerda con algun elemento de la tabla que se desea filtrar.


**Función**:
```javascript
filter_table(filtro_id,table_id,cells_array)
```

**Parametros**:
- **filtro_id**: *String* Es el id del input que se utilizara como criterio para filtrar la tabla.
- **table_id**: *String* Id de la tabla cuyos elementos seran filtrados.
- **cells_array**: *Array* Este array contiene los numeros de las columnas que seran filtradas, iniciando desde cero. (e.g. [0, 2, 3] filtra la primera, tercera y cuarta columna. [ 0 ] solo filtra la primera columna).


**Ejemplo**:
Similar a la función de *filter_combo*, aquí se filtrarán los datos en la columna **Nombre** de la tabla basado en lo que se escriba en el input.

```html
<input type="text" id="filtro" onkeyup="filter_table('filtro', 'tabla1', [1])">
<table id="tabla1">
    <thead>
        <tr>
            <th> Codigo </th>
            <th> Nombre </th>
            <th> Apellido </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>01</td>
            <td>Marco Antonio</td>
            <td>Solis Gutierrez</td>
        </tr>
        <tr>
            <td>02</td>
            <td>Laura Larisa</td>
            <td>Garcia Lemus</td>
        </tr>
        <tr>
            <td>03</td>
            <td>Genesis Valeria</td>
            <td>Fernandez Sagastume</td>
        </tr>
    </tbody>
</table>
```

<a href="https://codepen.io/capulusnoctis/embed/qBEegGz?height=265&theme-id=default&default-tab=html,result" style="padding:8px 10px;background:rgb(29, 135, 255);border:0;color:#fff;font-family:Arial,Helvetica,sans-serif;border-radius:4px;text-decoration:none;" target="_blank">Ver Ejemplo</a>

---

## toggle_column
Funcion llamada en el evento onClick de algun boton que permita hacer un toggle de la columna especificada en el parametro col_no.


**Función**:
```javascript
toggle_column(col_no,id_tabla)
```


**Parametros**:
- **col_no**: *integer* El numero de la columna a la que se hace toggle; la numeracion empieza desde 0.
- **id_tabla**: *String* Indica el id de la tabla que tendra esta accion de ocultar y mostrar columnas.


**Ejemplo**:
En este ejemplo, el botón hará el toggle de la columna **Nombre**.

```html
<input type="button" id="toggle" onclick="toggle_column(1,'tabla1')" value="Ocultar/Mostrar Nombre">
<table id="tabla1">
    <thead>
        <tr>
            <th> Codigo </th>
            <th> Nombre </th>
            <th> Apellido </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>01</td>
            <td>Marco Antonio</td>
            <td>Solis Gutierrez</td>
        </tr>
        <tr>
            <td>02</td>
            <td>Laura Larisa</td>
            <td>Garcia Lemus</td>
        </tr>
        <tr>
            <td>03</td>
            <td>Genesis Valeria</td>
            <td>Fernandez Sagastume</td>
        </tr>
    </tbody>
</table>
```

<a href="https://codepen.io/capulusnoctis/embed/jOEgJOZ?height=265&theme-id=default&default-tab=html,result" style="padding:8px 10px;background:rgb(29, 135, 255);border:0;color:#fff;font-family:Arial,Helvetica,sans-serif;border-radius:4px;text-decoration:none;" target="_blank">Ver Ejemplo</a>

---

## move_tabs
Funcion que resuelve el problema de los forms con tabs. Mueve los tabs al lugar en el que deberian ir normalmente para no afectar el funcionamiento en los browsers Chrome, Opera, Firefox y Edge.


**Función**:
```javascript
move_tabs(do_it,tabs_id)
```

**Parametros**:
- **do_it**: *boolean* Determina si debe ejecutarse la funcion o no.
- **tabs_id**: *String* Se refiere al id del o los divs que contienen los tabs, a los cuales se le dara movimiento.

---

## fAvisoNew
Funcion que genera una ventana de aviso en tiempo de corrida. Una simple ventana con el mensaje que se quiere especificar.

**Función**:
```javascript
fAvisoNew(titulo,msg)
```

**Parametros**:
- **titulo**: *String* El titulo de la nueva ventana que se abrira.
- **msg**: *String* Mensaje que se quiere colocar en el cuerpo de la nueva ventana.

**Ejemplo**:
En este ejemplo, se invoca esta función desde un botón. El mensaje que se mostrará es *Este mensaje debe mostrar la funcionalidad de fAvisoNew(). Es simplemente útil para dar avisor*.

```html
<input type="button" id="muestraMsg" onclick="fAvisoNew('Titulo1', 'Este mensaje debe mostrar la funcionalidad de fAvisoNew(). Es simplemente útil para dar avisor')" value="Ver Mensaje">
```

<a href="https://codepen.io/capulusnoctis/embed/vYEoPgX?height=265&theme-id=default&default-tab=html,result" style="padding:8px 10px;background:rgb(29, 135, 255);border:0;color:#fff;font-family:Arial,Helvetica,sans-serif;border-radius:4px;text-decoration:none;" target="_blank">Ver Ejemplo</a>

---

## formatNumber
Esta funcion retorna el numero enviado como parametro con un formato de numero como currency. (e.g. 123,456,789.98).

**Función**:
```javascript
formatNumber(num)
```

**Parametro**:
- **num**: *number* Cualquier numero que se quiera formatear.

---

## totalizarTabla
Funcion que toma una tabla y totaliza las columnas que se especifiquen en el array de celdas el cual empieza desde indice 0.

**Función**:
```javascript
totalizarTabla(obj_tabla,celdas,clase)
```

**Parametros**:
- **obj_tabla**: *Object* El object que representa la tabla a la que se quiere agregar totales.
- **celdas**: *Array* Un array que contiene el numero de las columnas que se deben totalizar; empezando desde cero. (e.g. [1, 3] totaliza la columna 2 y 4 de la tabla especificada en el obj_tabla).
- **clase**: *String* *opcional* Especifica el nombre de la clase que deberia tener el tag ```<tr>``` que contiene los totales.

---

## addBrowser
Con esta funcion se agrega la funcionalidad de buscador a un campo en especifico. Llamando a una ventana que contiene la informacion solicitada. Para que la función trabaje correctamente, debe llamarse cuando todos los elementos del *html* ya están cargados, o por lo menos los elementos a los que se haga referencia al llamar la función.

**Función**:
```javascript
addBrowser(id_field,proyecto,objeto,where[,imgFile])
```

**Parametros**:
- **id_field**: *Array* Hace referencia al array formado por los *id*s de los campos a los que se les pondrán los datos que vengan del buscador. Estos *id*s, van acompañados de unos "indicadores" los cuales señalan qué *id* llevará el icono de buscador y cuál es el nombre de columna equivalente en el buscador para cada *id*. Esto se entiende mejor en el ejemplo.
- **proyecto**: *number* Representa el número de proyecto en el que se encuentra el reporte que sirve como buscador.
- **objeto**: *number* Es el objeto, dentro del proyecto especificado, que corresponde al reporte buscador.
- **where**: *String* Corresponde a la continuación de sentencia *Where* que se incluye en el SQL del buscador.
- **imgFile**: *String* *opcional* (**Default**: */fa-search.png*) Es la ruta de la imagen que servira como icono al que se le hará clic para hacer la llamada al buscador.

**Ejemplo**:
Para usar *addBrowser()*, ya debe existir el reporte que sirve como buscador en el sistema. Suponiendo que el reporte buscará códigos y nombres de clientes, y tiene sus valores *project=15* y *object=227*; para dos *input*s ( siendo uno el código y el otro el nombre del cliente ) la llamada será como sigue:

```html
<label for="codcliente">Cliente</label>
<input type="number" name="cliente" id="codcliente" placeholder="codigo">
<input type="text" id="nomcliente" placeholder="nombre">
<script>
  addBrowser(['codcliente--asCODCLIENTE', 'nomcliente--search--asNOMCLIENTE'], 15, 227, " and estadoCliente = 1" /* Agrega esta condicion en el "where" */, "https://cdn4.iconfinder.com/data/icons/6x16-free-application-icons/16/Find.png");
</script>
```
#### Observaciones en el primer parámetro:
En este caso, solo se tiene *codigo* y *nombre*, por lo que solo se usarán esos valores en el array del primer parámetro. De tal forma que el array queda escrito: *['**id-1**--as**NOMBRE-DE-COLUMNA**', '**id-2**--search--as**NOMBRE-DE-COLUMNA**']*. 


Es importante destacar los "indicadores":
* ***--search*** : Indica a cual *id* se le debe poner a la par el icono de buscador. **Solo debe estar en un *id* para que funcione correctamente**.
* ***--as*** : Es la forma de decir "este id (*nomCliente*) **es** (*--as*) esta columna en el reporte buscador (*NOMCLIENTE*)".
<br>
<br>
<a href="https://codepen.io/capulusnoctis/embed/PoqYmxZ?height=265&theme-id=light&default-tab=html,result" style="padding:8px 10px;background:rgb(29, 135, 255);border:0;color:#fff;font-family:Arial,Helvetica,sans-serif;border-radius:4px;text-decoration:none;" target="_blank">Ver Ejemplo</a>
