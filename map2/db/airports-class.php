<?php

class AirportsClass {

	// table
	private $db;
    private $table = "airports";

    // object properties
    public $id;
    public $name;
    public $latitude;
    public $longitude;

    /**
     * Constructor with $db
     *
     * @param $db
     */
    public function __construct($db){
        $this->db = $db;
    }


    /**
     * Create airport
     *
     * @return boolean
     */
	public function create () {

        $sql = 'INSERT INTO airports(name, latitude, longitude) VALUES(:name, :latitude, :longitude)';

        $query = $this->db->prepare($sql);
        $query->bindValue( ':name', $this->name );
        $query->bindValue( ':latitude', $this->latitude );
        $query->bindValue( ':longitude', $this->longitude );

        if ( $query->execute() ) {
            return true;
        }

        return false;

	}

    /**
     * Read all airports
     *
     * @return array
     */
	public function read() {
		
        $sql = 'SELECT * FROM airports';
        $query = $this->db->query($sql);

        $jsonArray = array();
        
        while( $row = $query->fetchArray(SQLITE3_ASSOC) ) {

            $jsonArray[] = $row;
        }

        // print_r( $jsonArray );

        return $jsonArray;
	}

    /**
     * Update airport
     *
     * @return boolean
     */
	public function update() {

        $sql = 'UPDATE airports SET name = :name, latitude = :latitude, longitude = :longitude WHERE id = :id';

        $query = $this->db->prepare($sql);
        $query->bindValue( ':id', $this->id );
        $query->bindValue( ':name', $this->name );
        $query->bindValue( ':latitude', $this->latitude );
        $query->bindValue( ':longitude', $this->longitude );

        if ( $query->execute() ) {
            return true;
        }

        return false;
	}

    /**
     * Delete airport
     *
     * @return boolean
     */
	public function delete () {

        $sql = 'DELETE FROM airports WHERE id = :id';

        $query = $this->db->prepare($sql);
        $query->bindValue( ':id', $this->id );

        if ( $query->execute() ) {
            return true;
        }

        return false;
	}
}

?>
