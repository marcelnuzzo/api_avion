<?php

include('headers.php');
include('../db/airports-class.php');

$db = new SQLite3('../db/store.db');
$airports = new AirportsClass($db);


switch ( $_SERVER['REQUEST_METHOD'] ) {

	case "GET" :

		// Envoi au client un tableau JSON avec tous les aeroports
		$all_airports = $airports->read();

		http_response_code(200);
		echo json_encode( $all_airports );

		break;

	case "POST" :

		// recupere l'input du client
		$data = json_decode(file_get_contents("php://input"));

		// assigne les valeurs à la classe airports
		$airports->name = $data->name;
		$airports->latitude = $data->latitude;
		$airports->longitude = $data->longitude;

		// si la creation est reussie
		if ( $airports->create() ) {

			http_response_code(201);
			echo json_encode(["message" => "airport was created."]);

		// s'il y'a une erreur lors de la creation
		} else {

			http_response_code(503);
			echo json_encode(["message" => "Something went wrong with the creation"]);
		}

		break;

	case "PUT" :

		// recupere l'input du client
		$data = json_decode(file_get_contents("php://input"));

		// assigne les valeurs à la classe airports
		$airports->id = $data->id;
		$airports->name = $data->name;
		$airports->latitude = $data->latitude;
		$airports->longitude = $data->longitude;

		// si la mise a jour est reussie
		if ( $airports->update() ) {

			http_response_code(200);
			echo json_encode(["message" => "airport was updated."]);

		// s'il y'a une erreur lors de la mise a jour
		} else {

			http_response_code(503);
			echo json_encode(["message" => "Something went wrong with the update"]);
		}

		break;

	case "DELETE" :

		// recupere l'input du client
		$data = json_decode(file_get_contents("php://input"));

		// assigne l'id à la classe airports
		$airports->id = $data->id;

		// si le delete est reussi
		if ( $airports->delete() ) {

			http_response_code(204);
			echo json_encode(["message" => "airport was deleted."]);

		// s'il y'a une erreur lors du delete
		} else {

			http_response_code(503);
			echo json_encode(["message" => "Something went wrong with the deletion"]);
		}

		break;

	default :

		http_response_code(405);
		echo json_encode(["message" => "method not allowed."]);

		break;
}
