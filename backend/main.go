// Starts server and DB
package main

import (
	_ "database/sql"
	_ "fmt"
	_ "net/http"

	_ "github.com/lib/pq"
)

//starts server
func main() {
	/*connect to db
	  get db connection
	  register universal handler
	  		receives JSON requests
	  		unmarhshals
	  		switch
	  			depending on action:
	  			switches to one of the following
	  			hands it the unmarshalled struct
	  				new
	  					checks if it already exists
	  					if it does, for now throw error (overwrite? prompt back to client)
	  				delete
	  					checks if it already exists
	  					if it doesn't, throw error and delete confirmaion
	  					if it does
	  						tell db to delete page
	  						after no error,
	  							send confirmation to client
							after error,
								send did not delete response back
	  				edit
	  					write it to database
	  					if error, send could not save response
	  					no error, send edit confirmation to client
	  				all pages
	  					send query of hours
						if there are > 0 pages
							put into array, marhsall, send as json
	  				page
						send QueryRow
						if received,
							marshall and send json
						not received
							send error, page does not exist
	  start handle and serve
	*/
}
