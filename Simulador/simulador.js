angular.module('app').controller('SimuladorController', function($scope, $timeout, $resource){

	var inicioResource = $resource('http://localhost:9763/endpoints/XXXXXX');	// XXXXXX: URL do receiver de inicio	
	function sendInicioEvent(event) {
		inicioResource.save(event).$promise.then(function(event) {
    
    	});	
	}
	
	var fimResource = $resource('http://localhost:9763/endpoints/YYYYYY');	// YYYYYY: URL do receiver de inicio
	function sendFimEvent(event) {
		fimResource.save(event).$promise.then(function(event) {
    
    	});	
	}
			
	//{id: ID, type:???INICIO???, value: VALOR}
	function getNewEvent(id, type, value) {
		return event = {event:{
				payloadData:{					
					id: id,
					type: type,
					value: value
				}
			}
		};		 
	}

		
	function sendCorrectSequence(id, value) {
		var eventInicio = getNewEvent(id, 'INICO',value);
		if(value == "A") {
			$scope.values.totalA++; 
		} else {
			$scope.values.totalB++;
		}
		sendInicioEvent(event);
		eventInicio.valid = true;		
		eventInicio.startTimestamp = new Date();
		$scope.events.push(eventInicio);		
		setTimeout(function () {			
			var eventFim = getNewEvent(id, 'FIM',value);
			eventInicio.endTimestamp = new Date();
			$scope.events.push(eventFim);
			sendFimEvent(eventFim);	
		}, Math.floor((Math.random() *10) + 1) * 500);				
	}

	function sendIncorrectSequence(id, value) {
		var eventInicio = getNewEvent(id, 'INICO',value);
		sendInicioEvent(event);
		eventInicio.valid = false;		
		eventInicio.startTimestamp = new Date();
		$scope.events.push(eventInicio);
		if(value == "A") {
			$scope.values.totalAErro++; 
		} else {
			$scope.values.totalBErro++;
		}			
	}
			
	$scope.events = [];
		
			
	function sendNEvents(eventsQuantity) {
		for (var i = 0; i < eventsQuantity; i++) {
			var value = Math.floor((Math.random() * 2)) == 0 ? 'A' : 'B';
			if(Math.floor((Math.random() * 5)) == 0) {
				sendIncorrectSequence(i, value);
			} else {
				sendCorrectSequence(i, value);
			}	
		}
	}
	$scope.values = {total: 100, totalAErro: 0, totalBErro: 0, totalA: 0, totalB: 0};
	$scope.sendEvents = function() {
		sendNEvents($scope.values.total);
	}
		
});