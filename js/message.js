$(document).ready( function () {

    // Crear instancia de DataTable
    tabla = $('#tabla_mensajes').DataTable({
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

    // Llamado a función mostrar_mensajes()
    mostrar_mensajes();
} );

/*
* mostrar_mensajes() 
* Función que llama método API GET a utilizar
* @param url_pet, la dirección del api a utilizar
* @return Response, devuelve la respuesta del método API, Listado de mensajes
*/
function mostrar_mensajes(){

    tabla.clear().draw();

    clear_formulario();

    $.ajax({
        method: "GET",
        url: url_pet+"/api/Message/all",
        success: function(response){
            console.log(response);
            if(response.length > 0){
                for (var a = 0; a < response.length; a++) {
                    tabla.row.add([
                        response[a]['idMessage'],
                        response[a]['messageText'],
                        response[a]['cinema']['name'],
                        response[a]['client']['name'],
                        '<a class="btn btn-info text-center text-white" style="cursor: pointer;" onclick="javascript:ver_detalle('+response[a]['idMessage']+')">Ver</a>',
                        '<a class="btn btn-danger text-center text-white" style="cursor: pointer;" onclick="javascript:eliminar_mensaje('+response[a]['idMessage']+')">Eliminar</a>'
                    ]).draw();
                }
            }
        }
    });

    // Función que llama método API GET a utilizar, listado de cinemas
    $.ajax({
        method: "GET",
        url: url_pet+"/api/Cinema/all",
        success: function(response){
            if(response.length > 0){
                document.getElementById("id_cinema").html = "";
                $("#id_cinema").html("<option value=''>Seleccionar cinema</option>");
                for (let a = 0; a < response.length; a++) {
                    $("#id_cinema").append("<option value='"+response[a].id+"'>"+response[a].name+"</option>");                       
                }
            }
        }
    });

    // Función que llama método API GET a utilizar, listado de clientes
    $.ajax({
        method: "GET",
        url: url_pet+"/api/Client/all",
        success: function(response){
            if(response.length > 0){
                document.getElementById("id_client").html = "";
                $("#id_client").html("<option value=''>Seleccionar cliente</option>");
                for (let a = 0; a < response.length; a++) {
                    $("#id_client").append("<option value='"+response[a].idClient+"'>"+response[a].name+"</option>");                       
                }
            }
        }
    });            
}

/*
* ver_detalle(id) 
* Función que llama método API GET a utilizar
* @param id, El id del mensaje a consultar
* @param url_pet, la dirección del api a utilizar
* @return Response, devuelve la respuesta del método API, Información del mensaje
*/
function ver_detalle(id){
    $.ajax({
        method: "GET",
        url: url_pet+"/api/Message/"+id,
        contentType: "application/JSON",
        dataType: "JSON",
        success: function(response){
            console.log(response);
            $("#tit").text("Información Mensaje");

            $("#id_mes").val(response['idMessage']);
            $("#id_mes").attr('readonly', 'readonly');
            $("#id_mes").attr('required', true);
            $(".idMes").css('display','block');

            $("#btn").text("Actualizar");

            $("#form_mensajes").removeAttr("action");
            $("#form_mensajes").attr("action", "javascript:actualizar_mensaje()");

            $("#mensaj").val(response['messagetext']);   

            $("#id_cinema option[value="+ response['cinema']['id'] +"]").attr("selected",true);
            $("#id_client option[value="+ response['client']['idClient'] +"]").attr("selected",true);
        }
    });
}

/*
* registrar_mensajes() 
* Función que llama método API POST a utilizar
* @param mess_tex, Mensaje
* @param id_cin, Id del cinema
* @param id_clin, Id del cliente
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function registrar_mensajes(){

    var mess_tex = $("#mensaj").val();
    var id_cin = $("#id_cinema").val();
    var id_clin = $("#id_client").val();

    let datos  = {
        messageText: mess_tex,
        cinema: {
            id: id_cin
        },
        client: {
            idClient: id_clin
        }
    };

    $.ajax({
        method: "POST",
        url: url_pet+"/api/Message/save",
        contentType: "application/JSON",
        dataType: "JSON",
        data: JSON.stringify(datos),
        statusCode: {
            201: function() {      
                alert("Se registró correctamente el mensaje");                  
                mostrar_mensajes();
            }
        }
    });
}

/*
* actualizar_mensaje() 
* Función que llama método API PUT a utilizar
* @param id_mess, Id del mensaje
* @param mess_tex, Mensaje
* @param id_cin, Id del cinema
* @param id_clin, Id del cliente
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function actualizar_mensaje(){

    var id_mess = $("#id_mes").val();
    var mess_tex = $("#mensaj").val();
    var id_cin = $("#id_cinema").val();
    var id_clin = $("#id_client").val();

    let datos  = {
        idMessage: id_mess, 
        messageText: mess_tex,
        cinema: {
            id: id_cin
        },
        client: {
            idClient: id_clin
        }
    };

    $.ajax({
        type: "PUT",
        url: url_pet+"/api/Message/update",
        contentType: "application/JSON",
        dataType: "JSON",
        data: JSON.stringify(datos),
        statusCode: {
            201: function() {      
                alert("Se actualizó correctamente el mensaje");                  
                mostrar_mensajes();
            }
        }
    });
}

/*
* eliminar_mensaje(id_men) 
* Función que llama método API DELETE a utilizar
* @param id_men, Id del mensaje
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function eliminar_mensaje(id_men){

    $.ajax({
        type: "DELETE",
        url: url_pet+"/api/Message/"+id_men,
        contentType: "application/JSON",
        dataType: "JSON",
        statusCode: {
            204: function() {
                alert("Se eliminó correctamente el mensaje");
                mostrar_mensajes();
            }
        }
    });
}

/*
* clear_formulario() 
* @return, No retorna nada, solo limpia el formulario
*/
function clear_formulario(){
    $('#form_mensajes')[0].reset();

    $("#tit").text("Registro de Mensajes");
    $("#id_mes").removeAttr('required');
    $(".idMes").css('display','none');

    $("#form_mensajes").removeAttr("action");
    $("#form_mensajes").attr("action", "javascript:registrar_mensajes()");

    $("#btn").text("Registrar");
}