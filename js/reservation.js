$(document).ready( function () {

    // Crear instancia de DataTable
    tabla = $('#tabla_reservaciones').DataTable({
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

    // Llamado a función mostrar_reservaciones()
    mostrar_reservaciones();
} );

/*
* mostrar_reservaciones() 
* Función que llama método API GET a utilizar
* @param url_pet, la dirección del api a utilizar
* @return Response, devuelve la respuesta del método API, Listado de reservaciones
*/
function mostrar_reservaciones(){

    tabla.clear().draw();

    clear_formulario();

    $.ajax({
        method: "GET",
        url: url_pet+"/api/Reservation/all",
        success: function(response){
            if(response.length > 0){
                for (var a = 0; a < response.length; a++) {
                    tabla.row.add([
                        response[a]['idReservation'],
                        response[a]['startDate'],
                        response[a]['devolutionDate'],
                        response[a]['status'],
                        response[a]['cinema']['name'],
                        response[a]['client']['name'],
                        response[a]['score'],
                        '<a class="btn btn-info text-center text-white" style="cursor: pointer;" onclick="javascript:ver_detalle('+response[a]['idReservation']+')">Ver</a>',
                        '<a class="btn btn-danger text-center text-white" style="cursor: pointer;" onclick="javascript:eliminar_reservacion('+response[a]['idReservation']+')">Eliminar</a>'
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
* @param id, El id de la reserva a consultar
* @param url_pet, la dirección del api a utilizar
* @return Response, devuelve la respuesta del método API, Información de la reserva
*/
function ver_detalle(id){
    $.ajax({
        method: "GET",
        url: url_pet+"/api/Reservation/"+id,
        contentType: "application/JSON",
        dataType: "JSON",
        success: function(response){

            $("#tit").text("Información Cliente");

            $("#id_res").val(response['idReservation']);
            $("#id_res").attr('readonly', 'readonly');
            $("#id_res").attr('required', true);
            $(".idRes").css('display','block');

            $("#btn").text("Actualizar");

            $("#form_reservaciones").removeAttr("action");
            $("#form_reservaciones").attr("action", "javascript:actualizar_reservacion()");

            var fec_reg = response['startDate'];
            var fec_dev = response['devolutionDate'];

            let dateFR = fec_reg.split('T');
            let dateFD = fec_reg.split('T');

            $("#fec_res").val(dateFR[0]);
            $("#fec_dev").val(dateFD[0]);

            document.getElementById("est_res").html = "";
            $("#est_res").html("");
            $("#est_res").append("<option value=''>Seleccionar cliente</option>");
            $("#est_res").append("<option value='created'>Created</option>");                       
            $("#est_res").append("<option value='completed'>Completed</option>");                       
            $("#est_res").append("<option value='cancelled'>Cancelled</option>");                       

            $("#id_cinema option[value="+ response['cinema']['id'] +"]").attr("selected",true);
            $("#id_client option[value="+ response['client']['idClient'] +"]").attr("selected",true);
            $("#est_res option[value="+ response['status'] +"]").attr("selected",true);
        }
    });
}

/*
* registrar_reservaciones() 
* Función que llama método API POST a utilizar
* @param fec_dev, Fecha de la reserva
* @param fec_dat, Fecha de devolución de la reserva
* @param id_cin, Id del cinema
* @param id_clin, Id del cliente
* @param est_res, Estado de la reserva
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function registrar_reservaciones(){

    var fec_dat = $("#fec_res").val();
    var fec_dev = $("#fec_dev").val();
    var id_cin = $("#id_cinema").val();
    var id_clin = $("#id_client").val();
    var est_res = "created";

    let datos  = {
        startDate: fec_dat, 
        devolutionDate: fec_dev, 
        status: est_res,
        cinema: {
            id: id_cin
        },
        client: {
            idClient: id_clin
        },
        score: null
    };

    $.ajax({
        method: "POST",
        url: url_pet+"/api/Reservation/save",
        contentType: "application/JSON",
        dataType: "JSON",
        data: JSON.stringify(datos),
        statusCode: {
            201: function() {
                alert("Se registró correctamente la reserva");
                mostrar_reservaciones();                        
            }
        }
    });
} 

/*
* actualizar_reservacion() 
* Función que llama método API PUT a utilizar
* @param id_res, Id de la reserva
* @param fec_dat, Fecha de la reserva
* @param fec_dev, Fecha de devolución de la reserva
* @param id_cin, Id del cinema
* @param id_clin, Id del cliente
* @param est_res, Estado de la reserva
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function actualizar_reservacion(){

    var id_res = $("#id_res").val();
    var fec_dat = $("#fec_res").val();
    var fec_dev = $("#fec_dev").val();
    var id_cin = $("#id_cinema").val();
    var id_clin = $("#id_client").val();
    var est_res = $("#est_res").val();

    let datos  = {
        idReservation: id_res, 
        startDate: fec_dat, 
        devolutionDate: fec_dev, 
        status: est_res,
        cinema: {
            id: id_cin
        },
        client: {
            idClient: id_clin
        },
        score: null
    };

    $.ajax({
        type: "PUT",
        url: url_pet+"/api/Reservation/update",
        contentType: "application/JSON",
        dataType: "JSON",
        data: JSON.stringify(datos),
        statusCode: {
            201: function() {      
                alert("Se actualizó correctamente la reserva");                  
                mostrar_reservaciones();
            }
        }
    });
}

/*
* eliminar_reservacion(id_res) 
* Función que llama método API DELETE a utilizar
* @param id_res, Id de la reserva
* @param url_pet, la dirección del api a utilizar
* @return statusCode, devuelve la respuesta del método API
*/
function eliminar_reservacion(id_res){

    $.ajax({
        type: "DELETE",
        url: url_pet+"/api/Reservation/"+id_res,
        contentType: "application/JSON",
        dataType: "JSON",
        statusCode: {
            204: function() {
                alert("Se eliminó correctamente la reserva");
                mostrar_reservaciones();
            }
        }
    });
}

/*
* clear_formulario() 
* @return, No retorna nada, solo limpia el formulario
*/
function clear_formulario(){
    $('#form_reservaciones')[0].reset();

    $("#tit").text("Registro de Reservaciones");
    $("#id_res").removeAttr('readonly');
    $("#id_res").removeAttr('required');
    $(".idRes").css('display','none');

    $("#form_reservaciones").removeAttr("action");
    $("#form_reservaciones").attr("action", "javascript:registrar_reservaciones()");

    $("#btn").text("Registrar");
}