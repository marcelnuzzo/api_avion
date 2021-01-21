<?php

$db = new SQLite3('store.db');

$db->exec("CREATE TABLE airports(id INTEGER PRIMARY KEY, name TEXT, latitude TEXT, longitude TEXT)");
$db->exec("INSERT INTO airports(name, latitude, longitude) VALUES('Aéroport Charles de Gaulle - Roissy', '49.0066334', '2.5220051')");
$db->exec("INSERT INTO airports(name, latitude, longitude) VALUES('Hartsfield Airport - Atlanta', '39.9409909', '-58.9208728')");
$db->exec("INSERT INTO airports(name, latitude, longitude) VALUES('Hongqiao Airport - Shanghai', '34.3387052', '25.9320839')");

echo "airports table created";
