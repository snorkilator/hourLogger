// Starts server and DB
package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	_ "net/http"
	"os"

	"html/template"

	"github.com/pkg/errors"
	_ "modernc.org/sqlite"
)

// save page command comes in
/*
validate that it fits the JSON object struct
	if it doesn't: send failed to save error ** need error type for api
	it does: send query to save to database
		if received confirmed, send happy message to client
		if not received confirmed, send "could not save to client"

*/

//starts server

type dbError interface {
	Error() string
}

//checks that at least item is present of struct have content
func (f *formContent) tableHasItem() bool {
	if len(f.State.Table) > 0 {
		return true
	}
	return false
}
func (f *formContent) hasDate() bool {
	if len(f.Date) > 0 {
		return true
	}
	return false
}

func DBAdd(json []byte, date string) error {
	query, err := DB.Prepare("insert into hours (date, hours) values(?,?)")
	defer query.Close()
	if err != nil {
		return errors.Errorf("err prepare: %v", err)
	}
	result, err := query.Exec(date, json)
	if err != nil {
		errors.Errorf("err exec: %v\n", err, err)
	}
	fmt.Printf("querry result: %v \n", result)

	return nil
}

func DBGetAll() ([][]byte, error) {
	QResult, err := DB.Query("select * from hours")
	if err != nil {
		return nil, err
	}
	rows := make([][]byte, 0)
	for QResult.Next() {
		slc := []byte{}
		err = QResult.Scan(&[]byte{}, &slc, &[]byte{})
		rows = append(rows, slc)
		if err != nil {
			return nil, err
		}
	}
	return rows, nil

}

func connectDB() (*sql.DB, error) {
	return sql.Open("sqlite", "/home/daniel/Documents/hourLogger/hourLogger.db")
}

//add page id as parameter and mdoify query string !!
func getPage(con *sql.DB) {
	r := con.QueryRow("select * from hours")
	var first string
	var second string
	var third string
	err := r.Scan(&first, &second, &third)
	if err != nil {
		fmt.Println(err)
	}
}

var update = func(resp http.ResponseWriter, req *http.Request) {
	body := make([]byte, 2000)
	n, err := req.Body.Read(body)
	if err != nil && err.Error() != "EOF" {
		fmt.Println("/update/ handler: " + err.Error())
	}
	form, err := getJason(body[:n])

	if err != nil {
		str := fmt.Sprintf("/update/ handler: getJason: %s", err)
		log.Println(str)
		http.Error(resp, str, 404)
		return
	}
	if !form.hasDate() {
		http.Error(resp, "No date specified for form, add date then submit again", http.StatusExpectationFailed)
	}
	if !form.tableHasItem() {
		http.Error(resp, "activity table is empty", http.StatusExpectationFailed)
		return
	}
	err = DBAdd(body[:n], form.Date)
	if err != nil {
		str := fmt.Sprintf("DBAdd: %v", err)
		fmt.Println(str)
		http.Error(resp, str, 500)
	}
	fmt.Printf("Date: %s Content: %v\n", form.Date, form)
	resp.Write([]byte(fmt.Sprint(form)))
}

var DB *sql.DB

func getAll(w http.ResponseWriter, r *http.Request) {
	rows, err := DBGetAll()
	if err != nil {
		fmt.Println(err)
	}
	b := []byte("[")
	for i, e := range rows {
		b = append(b, e...)
		if i < len(rows)-1 {
			b = append(b, ',')
		}
	}
	b = append(b, ']')
	w.Header().Add("Content-Type", "application/json")
	w.Write(b)
}

func main() {
	var err error
	DB, err = connectDB()
	if err != nil {
		fmt.Println("connectDB:" + err.Error())
	}
	conf, err := getConf()
	if err != nil {
		fmt.Printf("getConf: %s", err)
	}
	fmt.Print(conf)

	if err != nil {
		fmt.Println(err)
	}
	http.HandleFunc("/update/", update)
	http.HandleFunc("/getall", getAll)

	fs := http.FileServer(http.Dir("../my-app/build"))
	http.Handle("/", fs)
	http.HandleFunc("/dayview", func(w http.ResponseWriter, r *http.Request) {
		template.ParseFiles()
		f, err := os.ReadFile("../my-app/build/index.html")
		if err != nil {
			fmt.Println(err)
		}
		w.Write(f)
	})
	fmt.Println(http.ListenAndServe(":"+conf.Database.Port, nil))

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

func getConf() (config, error) {
	var conf = new(config)
	f, err := os.ReadFile("./config.json")
	if err != nil {
		return config{}, err
	}
	if err = json.Unmarshal(f, &conf); err != nil {
		return config{}, err
	}
	return *conf, nil
}

type Row struct {
	Id       int     `json:"id"`
	Hrs      float32 `json:"hrs"`
	Activity string  `json:"activity"`
}

type State struct {
	Table    []Row  `json:"table"`
	Hrs      string `json:"hrs"`
	Activity string `json:"activity"`
}
type formContent struct {
	Goals string `json:"goals"`
	State State  `json:"state"`
	Date  string `json:"date"`
}

func getJason(raw []byte) (*formContent, error) {
	var form = new(formContent)
	err := json.Unmarshal(raw, &form)
	return form, err
}
