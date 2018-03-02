$(document).ready( function () {
	getClients();
	$('#telefone').mask('(99) 9999-9999?9');

	$('.btn-add-client').on('click', function (e) {
		e.preventDefault();
		$('.listagem').hide();
		$('.cadastro').show();
	});

	$('.cancel').on('click', function (e) {
		e.preventDefault();
		$('.listagem').show();
		$('.cadastro').hide();
	});

});
function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
      	zoom: 4,
      	center: uluru
    });
    var marker = new google.maps.Marker({
    	position: uluru,
      	map: map
    });
}


function getClients () {
	$('.listagem table tbody').html('');
	var url = 'http://app.digicade-hml.com.br/frontend-api/clientes';
	$.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json',
        processData: false,
        success: function (data) {
        	var clientes = data._embedded.clientes;
        	$.each(clientes, function (i, val) {
        		var clientId = val._links.cliente.href.replace('http://app.digicade-hml.com.br/frontend-api/clientes/', '');
            	$('.listagem table tbody').append('<tr><td><a id="'+clientId+'" href="'+ val._links.cliente.href +'" onclick="return editClient(event)">'+ val.nome +'</a></td><td>'+ val.telefone +'</td><td><a onclick="return deleteClient(event)" href="'+ val._links.cliente.href +'" class="btn-delete">x</a></td></tr>');
        	})
        },
        error: function (request, status, error) {
	        console.log(request.responseText);
	    }
    });
}

function addClient () {
    var data = {
		"nome"      : $('#nome').val(),
		"cpf"       : $('#cpfcnpj').val(),
		"telefone"  : $('#telefone').val(),
		"email"     : $('#email').val(),
		"latitude"  : $('#latitude').val(),
		"longitude" : $('#longitude').val()
	}
	var clientId = $('input[name=clientId]').val();
	if (clientId) {
    	var url = 'http://app.digicade-hml.com.br/frontend-api/clientes/' + clientId;
    	var type = 'PUT';
	} else {
		var url = 'http://app.digicade-hml.com.br/frontend-api/clientes/';
		var type = 'POST';
	}
    $.ajax({
        type: type,
        url: url,
        contentType: 'application/json',
        processData: false,
        enctype: 'multipart/form-data',
        data: JSON.stringify(data),
        success: function (data) {
            $('.listagem').show();
			$('.cadastro').hide();
			getClients();
        },
        error: function (request, status, error) {
	        console.log(request.responseText);
	    }
    });
}

function editClient (client) {
	var url = client.target.href;
	var id = client.target.id;
	console.log(id);
	$.ajax({
		type: 'GET',
		url: url,
		success: function (data) {
			$('.listagem').hide();
			$('.cadastro').show();
			$('#formClientes').append('<input name="clientId" type="hidden" value="'+id+'" />')
            $.each(data, function (i, val) {
            	$('input#' + i).val(val);
            });
        },
        error: function (request, status, error) {
	        console.log(request.responseText);
	    }
	});
	return false;
}

function deleteClient (client) {
	var url = client.target.href;
	$.ajax({
		type: 'DELETE',
		url: url,
		success: function (data) {
            getClients();
        },
        error: function (request, status, error) {
	        console.log(request.responseText);
	    }
	});
	return false;
}