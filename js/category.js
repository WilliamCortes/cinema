$(document).ready( function () {

    // Crear instancia de DataTable
    tabla = $('#tabla_categorias').DataTable({
        dom: 'Bfrtip',
        "language": {
            "sProcessing":     "Procesando...",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sZeroRecords":    "No se encontraron resultados",
            "sEmptyTable":     "Ningún dato disponible en esta tabla",
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":    "",
            "sSearch":         "Buscar:",
            "sUrl":            "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst":    "Primero",
                "sLast":     "Último",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });

    // Llamado a función mostrar_categorias()
    mostrar_categorias();
} );

/*
* mostrar_categorias() 
* Función que llama método API GET a utilizar
* @param url_pet, la dirección del api a utilizar
* @return Response, devuelve la respuesta del método API, Listado de Categorías
*/
function mostrar_categorias(){

    tabla.clear().draw();

    clear_formulario();

    $.ajax({
        method: "GET",
        url: url_pet+"/api/Category/all",
        success: function(response){
            if(response.length > 0){
                for (var a = 0; a < response.length; a++) {
                    tabla.row.add([
                        response[a]['id'],
                        response[a]['name'],
                        response[a]['description'],
                        '<a class="btn btn-info text-center text-white" style="cursor: pointer;" onclick="javascript:ver_detalle('+response[a]['id']+')">Ver</a>',
                        '<a class="btn btn-danger text-center text-white" style="cursor: pointer;" onclick="javascript:eliminar_categoria('+response[a]['id']+')">Eliminar</a>'
                    ]).draw();
                }
            }
        }
    });
}               

/*
* ver_detalle(id) 
* Función que llama método API GET a utilizar
* @param id, El id de la categoría a consultar
* @param url_pet, la dirección del api a utilizar
* @return Response, devuelve la respuesta del método API, Información de la categoría
*/
function ver_detalle(id){
    $.ajax({
        method: "GET",
        url: url_pet+"/api/Category/"+id,
        contentType: "application/JSON",
        dataType: "JSON",
        success: function(response){
            console.log(response);
            $("#tit").text("Información Categoria");

            $("#id_cat").val(response['id']);
            $("#id_cat").attr('readonly', 'readonly');
            $("#id_cat").attr('required', true);
            $(".idCat").css('display','block');

            $("#btn").text("Actualizar");

            $("#form_categorias").removeAttr("action");
            $("#form_categorias").attr("action", "javascript:actualizar_categoria()");

            $("#nom_cat").val(response['name']);
            $("#des_cat").val(response['description']);
        }
    });
}

/*
* registrar_categorias() 
* Función que llama método API POST a utilizar
* @param name_cat, Nombre de la categoría
* @param desc_cat, Descripción de la categoría
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function registrar_categorias(){

    var name_cat = $("#nom_cat").val();
    var desc_cat = $("#des_cat").val();

    let datos  = {
        name: name_cat, 
        description: desc_cat
    };

    $.ajax({
        method: "POST",
        url: url_pet+"/api/Category/save",
        contentType: "application/JSON",
        dataType: "JSON",
        data: JSON.stringify(datos),
        statusCode: {
            201: function() {
                alert("Se registró correctamente la categoria");
                mostrar_categorias();                        
            }
        }
    });
} 

/*
* actualizar_categoria() 
* Función que llama método API PUT a utilizar
* @param id_cat, Id de la categoría
* @param name_cat, Nombre de la categoría
* @param desc_cat, Descripción de la categoría
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function actualizar_categoria(){

    var id_cat = $("#id_cat").val();
    var name_cat = $("#nom_cat").val();
    var desc_cat = $("#des_cat").val();

    let datos  = {
        id: id_cat, 
        name: name_cat, 
        description: desc_cat
    };

    $.ajax({
        type: "PUT",
        url: url_pet+"/api/Category/update",
        contentType: "application/JSON",
        dataType: "JSON",
        data: JSON.stringify(datos),
        statusCode: {
            201: function() {      
                alert("Se actualizó correctamente la categoria");                  
                mostrar_categorias();
            }
        }
    });
}

/*
* eliminar_categoria(id_cat) 
* Función que llama método API DELETE a utilizar
* @param id_cat, Id de la categoría
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function eliminar_categoria(id_cat){

    $.ajax({
        type: "DELETE",
        url: url_pet+"/api/Category/"+id_cat,
        contentType: "application/JSON",
        dataType: "JSON",
        statusCode: {
            204: function() {
                alert("Se eliminó correctamente la categoria");
                mostrar_categorias();
            }
        }
    });
}

/*
* clear_formulario() 
* @return, No retorna nada, solo limpia el formulario
*/
function clear_formulario(){
    $('#form_categorias')[0].reset();

    $("#tit").text("Registro de Categorias");
    $("#id_cat").removeAttr('required');
    $(".idCat").css('display','none');

    $("#form_categorias").removeAttr("action");
    $("#form_categorias").attr("action", "javascript:registrar_categorias()");

    $("#btn").text("Registrar");
}