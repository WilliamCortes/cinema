$(document).ready( function () {

    // Crear instancia de DataTable
    tabla = $('#tabla_cines').DataTable({
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

    // Llamado a función mostrar_cines()
    mostrar_cines();
} );

/*
* mostrar_cines() 
* Función que llama método API GET a utilizar
* @param url_pet, la dirección del api a utilizar
* @return Response, devuelve la respuesta del método API, Listado de cinemas
*/
function mostrar_cines(){

    tabla.clear().draw();

    clear_formulario();

    $.ajax({
        method: "GET",
        url: url_pet+"/api/Cinema/all",
        success: function(response){
            console.log(response);
            if(response.length > 0){
                for (var a = 0; a < response.length; a++) {
                    tabla.row.add([
                        response[a]['id'],
                        response[a]['name'],
                        response[a]['owner'],
                        response[a]['capacity'],
                        response[a]['category']['name'],
                        response[a]['description'],                                
                        '<a class="btn btn-info text-center text-white" style="cursor: pointer;" onclick="javascript:ver_detalle('+response[a]['id']+')">Ver</a>',
                        '<a class="btn btn-danger text-center text-white" style="cursor: pointer;" onclick="javascript:eliminar_cine('+response[a]['id']+')">Eliminar</a>'
                    ]).draw();
                }
            }
        }
    });

    // Función que llama método API GET a utilizar, listado de categorías
    $.ajax({
        method: "GET",
        url: url_pet + "/api/Category/all",
        success: function(response){
            if(response.length > 0){
                document.getElementById("id_categ_cin").html = "";
                $("#id_categ_cin").html("<option value=''>Seleccionar categoria</option>");
                for (let a = 0; a < response.length; a++) {
                    $("#id_categ_cin").append("<option value='"+response[a].id+"'>"+response[a].name+"</option>");                       
                }
            }
        }
    });
}

/*
* ver_detalle(id) 
* Función que llama método API GET a utilizar
* @param id, El id del cinema a consultar
* @param url_pet, la dirección del api a utilizar
* @return Response, devuelve la respuesta del método API, Información del cinema
*/
function ver_detalle(id){
    $.ajax({
        method: "GET",
        url: url_pet+"/api/Cinema/"+id,
        contentType: "application/JSON",
        dataType: "JSON",
        success: function(response){
            console.log(response);
            
            $("#tit").text("Información Cinema");

            $("#id_cin").val(response['id']);
            $("#id_cin").attr('readonly', 'readonly');
            $("#id_cin").attr('required', true);
            $(".idCin").css('display','block');

            $("#btn").text("Actualizar");

            $("#form_cinemas").removeAttr("action");
            $("#form_cinemas").attr("action", "javascript:actualizar_cine()");

            $("#own_cin").val(response['owner']);
            $("#cap_cin").val(response['capacity']);
            $("#id_categ_cin").val(response['category_id']);                    
            $("#nom_cin").val(response['name']);                 
            $("#des_cin").val(response['description']);      
            
            $("#id_categ_cin option[value="+ response['category']['id'] +"]").attr("selected",true);
        }
    });
}

/*
* registrar_cines() 
* Función que llama método API POST a utilizar
* @param owner_cin, Dueño del cinema
* @param capacity_cin, Capacidad del cinema
* @param category_id_cin, Id de la categoría
* @param name_cin, Nombre del cinema
* @param desc_cin, Descripción del cinema
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function registrar_cines(){

    var owner_cin = $("#own_cin").val();
    var capacity_cin = $("#cap_cin").val();
    var category_id_cin = $("#id_categ_cin").val();
    var name_cin = $("#nom_cin").val();
    var desc_cin = $("#des_cin").val();

    let datos  = {
        owner: owner_cin, 
        capacity: capacity_cin, 
        category: {
            id: category_id_cin
        }, 
        name: name_cin,
        description: desc_cin
    };

    $.ajax({
        method: "POST",
        url: url_pet+"/api/Cinema/save",
        data: JSON.stringify(datos),
        contentType: "application/JSON",
        dataType: "JSON",
        data: JSON.stringify(datos),
        statusCode: {
            201: function() {      
                alert("Se registró correctamente el cinema");                  
                mostrar_cines();
            }
        }
    });
}        

/*
* actualizar_cine() 
* Función que llama método API PUT a utilizar
* @param id_cin, Id del cinema
* @param owner_cin, Dueño del cinema
* @param capacity_cin, Capacidad del cinema
* @param category_id_cin, Id de la categoría
* @param name_cin, Nombre del cinema
* @param desc_cin, Descripción del cinema
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function actualizar_cine(){

    var id_cin = $("#id_cin").val();
    var owner_cin = $("#own_cin").val();
    var capacity_cin = $("#cap_cin").val();
    var category_id_cin = $("#id_categ_cin").val();
    var name_cin = $("#nom_cin").val();
    var desc_cin = $("#des_cin").val();

    let datos  = {
        id: id_cin, 
        owner: owner_cin, 
        capacity: capacity_cin, 
        category: {
            id: category_id_cin
        }, 
        name: name_cin,
        description: desc_cin
    };

    $.ajax({
        type: "PUT",
        url: url_pet+"/api/Cinema/update",
        contentType: "application/JSON",
        dataType: "JSON",
        data: JSON.stringify(datos),
        statusCode: {
            201: function() {      
                alert("Se actualizó correctamente el cinema");                  
                mostrar_cines();
            }
        }
    });
}

/*
* eliminar_cine(id_cin) 
* Función que llama método API DELETE a utilizar
* @param id_cin, Id del cinema
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function eliminar_cine(id_cin){

    $.ajax({
        type: "DELETE",
        url: url_pet+"/api/Cinema/"+id_cin,
        contentType: "application/JSON",
        dataType: "JSON",
        statusCode: {
            204: function() {
                alert("Se eliminó correctamente el cinema");
                mostrar_cines();
            }
        }
    });
}

/*
* clear_formulario() 
* @return, No retorna nada, solo limpia el formulario
*/
function clear_formulario(){
    $('#form_cinemas')[0].reset();

    $("#tit").text("Registro de Cinemas");
    $("#id_cin").removeAttr('required');
    $(".idCin").css('display','none');

    $("#form_cinemas").removeAttr("action");
    $("#form_cinemas").attr("action", "javascript:registrar_cines()");

    $("#btn").text("Registrar");
}