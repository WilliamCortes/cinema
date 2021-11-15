$(document).ready( function () {

    // Crear instancia de DataTable
    tabla = $('#tabla_clientes').DataTable({
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

    // Llamado a función mostrar_clientes()
    mostrar_clientes();
} );

/*
* mostrar_clientes() 
* Función que llama método API GET a utilizar
* @param url_pet, la dirección del api a utilizar
* @return Response, devuelve la respuesta del método API, Listado de clientes
*/
function mostrar_clientes(){

    tabla.clear().draw();

    clear_formulario();

    $.ajax({
        method: "GET",
        url: url_pet+"/api/Client/all",
        success: function(response){
            if(response.length > 0){
                for (var a = 0; a < response.length; a++) {
                    tabla.row.add([
                        response[a]['idClient'],
                        response[a]['name'],
                        response[a]['email'],
                        response[a]['password'],
                        response[a]['age'],
                        '<a class="btn btn-info text-center text-white" style="cursor: pointer;" onclick="javascript:ver_detalle('+response[a]['idClient']+')">Ver</a>',
                        '<a class="btn btn-danger text-center text-white" style="cursor: pointer;" onclick="javascript:eliminar_cliente('+response[a]['idClient']+')">Eliminar</a>'
                    ]).draw();
                }
            }
        }
    });
}               

/*
* ver_detalle(id) 
* Función que llama método API GET a utilizar
* @param id, El id del cliente a consultar
* @param url_pet, la dirección del api a utilizar
* @return Response, devuelve la respuesta del método API, Información del cliente
*/
function ver_detalle(id){
    $.ajax({
        method: "GET",
        url: url_pet+"/api/Client/"+id,
        contentType: "application/JSON",
        dataType: "JSON",
        success: function(response){

            $("#tit").text("Información Cliente");

            $("#id_cli").val(response['idClient']);
            $("#id_cli").attr('readonly', 'readonly');
            $("#id_cli").attr('required', true);
            $(".idCli").css('display','block');

            $("#btn").text("Actualizar");

            $("#form_clientes").removeAttr("action");
            $("#form_clientes").attr("action", "javascript:actualizar_cliente()");

            $("#nom_cli").val(response['name']);
            $("#email_cli").val(response['email']);
            $("#pass_cli").val(response['password']);
            $("#edad_cli").val(response['age']);                    
        }
    });
}

/*
* registrar_clientes() 
* Función que llama método API POST a utilizar
* @param name_cl, Nombre del cliente
* @param email_cl, Correo del cliente
* @param pass_cl, Password del cliente
* @param age_cl, Edad del cliente
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function registrar_clientes(){

    var name_cl = $("#nom_cli").val();
    var email_cl = $("#email_cli").val();
    var pass_cl = $("#pass_cli").val();
    var age_cl = $("#edad_cli").val();

    let datos  = {
        name: name_cl, 
        email: email_cl, 
        password: pass_cl, 
        age: age_cl
    };

    $.ajax({
        method: "POST",
        url: url_pet+"/api/Client/save",
        contentType: "application/JSON",
        dataType: "JSON",
        data: JSON.stringify(datos),
        statusCode: {
            201: function() {
                alert("Se registró correctamente el cliente");
                mostrar_clientes();                        
            }
        }
    });
} 

/*
* actualizar_cliente() 
* Función que llama método API PUT a utilizar
* @param id_cl, Id del cliente
* @param name_cl, Nombre del cliente
* @param email_cl, Correo del cliente
* @param pass_cl, Password del cliente
* @param age_cl, Edad del cliente
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function actualizar_cliente(){

    var id_cl = $("#id_cli").val();
    var name_cl = $("#nom_cli").val();
    var email_cl = $("#email_cli").val();
    var pass_cl = $("#pass_cli").val();
    var age_cl = $("#edad_cli").val();

    let datos  = {
        idClient: id_cl, 
        name: name_cl, 
        email: email_cl, 
        password: pass_cl, 
        age: age_cl
    };

    $.ajax({
        type: "PUT",
        url: url_pet+"/api/Client/update",
        contentType: "application/JSON",
        dataType: "JSON",
        data: JSON.stringify(datos),
        statusCode: {
            201: function() {      
                alert("Se actualizó correctamente el cliente");                  
                mostrar_clientes();
            }
        }
    });
}

/*
* eliminar_cliente(id_cl) 
* Función que llama método API DELETE a utilizar
* @param id_cl, Id del cliente
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function eliminar_cliente(id_cl){

    $.ajax({
        type: "DELETE",
        url: url_pet+"/api/Client/"+id_cl,
        contentType: "application/JSON",
        dataType: "JSON",
        statusCode: {
            204: function() {
                alert("Se eliminó correctamente el cliente");
                mostrar_clientes();
            }
        }
    });
}

/*
* clear_formulario() 
* @return, No retorna nada, solo limpia el formulario
*/
function clear_formulario(){
    $('#form_clientes')[0].reset();

    $("#tit").text("Registro de Clientes");
    $("#id_cli").removeAttr('required');
    $(".idCli").css('display','none');

    $("#form_clientes").removeAttr("action");
    $("#form_clientes").attr("action", "javascript:registrar_clientes()");

    $("#btn").text("Registrar");
}