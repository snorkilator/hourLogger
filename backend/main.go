// Starts server and DB
package main

import (
	_ "database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	_ "net/http"
	"os"
	// _ "github.com/lib/pq"
)

//starts server
func main() {
	conf := getConf()
	fmt.Print(conf)
	http.HandleFunc("/update/", func(resp http.ResponseWriter, req *http.Request) {
		body := make([]byte, 2000)
		req.Body.Read(body)
		fmt.Println(string(body))
		fmt.Println(getJason(body).state.Table)
		resp.Write(body)
	})

	fs := http.FileServer(http.Dir("../my-app/build"))
	http.Handle("/", fs)
	fmt.Println(http.ListenAndServe(":3000", nil))

	/*
		read from config file
		connect to db
		get db connection
		register universal handler
			receives JSON requests
			unmarhshals
			switch
				depending on action:
				switches to one of the following
				hands it the unmarshalled struct
					new
						validate the date
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
						validate the date
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

type config struct {
	Database struct {
		Ip       string `json:"ip"`
		Port     string `json:"port"`
		Username string `json:"username"`
		Password string `json:"password"`
	} `json:"database"`
}

func getConf() config {
	var conf = new(config)
	f, _ := os.ReadFile("./config.json")
	fmt.Println(f)
	if err := json.Unmarshal(f, &conf); err != nil {
		fmt.Print(err)
	}
	return *conf
}

type state struct {
	Table    []string `json:"table"`
	Hrs      string   `json:"hrs"`
	Activity string   `json:"activity"`
}
type formContent struct {
	Summary string `json:"summary"`
	Goals   string `json:"goals"`
	state   state  `json:"goals"`
}

func getJason(raw []byte) *formContent {
	var form = new(formContent)

	if err := json.Unmarshal(raw, &form); err != nil {
		log.Println("error", err)
	}
	return form
}
