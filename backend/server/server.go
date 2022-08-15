// Starts server and DB
package server

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

// noRowsWritten defines error for error checking
var noRowsWritten = errors.New("No rows written")

//table HasItem checks that at least item is present of struct have content
func (f *formContent) hasElement() bool {
	if len(f.Table) > 0 {
		return true
	}
	return false
}

//hasDate checks if date field is empty and returns true or false
func (f *formContent) hasDate() bool {
	if len(f.Date) > 0 {
		return true
	}
	return false
}

//add inserts row into hours table with the given json stored in hours row and date stored in date row
func add(json []byte, date string) error {
	query, err := db.Prepare("INSERT INTO HOURS (date, hours) VALUES(?,?)")
	defer query.Close()
	if err != nil {
		return errors.Errorf("err prepare: %v", err)
	}
	result, err := query.Exec(date, json, date)
	fmt.Printf("querry result: %v \n", result)

	if err != nil {
		errors.Errorf("err exec: %v\n", err, err)
	}
	if result == nil {
		return noRowsWritten
	}

	return nil
}

// update updates row in DB with given date string and json data
func update(json []byte, date string) error {
	fmt.Printf("DBUpdate: ")
	query, err := db.Prepare("UPDATE hours SET date = ?, hours = ? WHERE date = ?")
	defer query.Close()
	if err != nil {
		return errors.Errorf("err prepare: %v\n", err)
	}
	result, err := query.Exec(date, json, date)
	if err != nil {
		errors.Errorf("err exec: %v\n", err, err)
	}
	fmt.Printf("querry result: %v \n", result)

	return nil
}

// getAll queries database for all rows in hours table and returns rows as array. Returns error and nil array if error
func getAll() ([][]byte, error) {
	QResult, err := db.Query("select * from hours")
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

//delete deletes row specified by date param
func delete(date string) {

}

//handleUpdate handles updates to the hours table. It received PUT and POST requests. The former updates a row and the latter inserts a row
var handleUpdate = func(resp http.ResponseWriter, req *http.Request) {
	body := make([]byte, 2000)
	n, err := req.Body.Read(body)
	if err != nil && err.Error() != "EOF" {
		fmt.Println("/update/ handler: " + err.Error())
	}
	form, err := parseJSON(body[:n])

	if err != nil {
		str := fmt.Sprintf("/update/ handler: getJason: %s", err)
		log.Println(str)
		fmt.Println(body[:n])
		http.Error(resp, str, 404)
		return
	}
	if !form.hasDate() {
		http.Error(resp, "No date specified for form, add date then submit again", http.StatusExpectationFailed)
	}

	if req.Method == "POST" {
		if !form.hasElement() {
			http.Error(resp, "activity table is empty", http.StatusExpectationFailed)
			return
		}
		err = add(body[:n], form.Date)
		if err != nil {
			if err == noRowsWritten {
				http.Error(resp, "entry already exists", http.StatusConflict)
				return
			}
			str := fmt.Sprintf("DBAdd: %v", err)
			fmt.Println(str)
			http.Error(resp, str, 500)
			return
		}
		fmt.Printf("Date: %s Content: %v\n", form.Date, form)
		resp.Write([]byte(fmt.Sprint(form)))
		return
	}
	if req.Method == "PUT" {
		err = update(body[:n], form.Date)
		if err != nil {
			str := fmt.Sprintf("DBUpdate: %v\n", err)
			fmt.Println(str)
			http.Error(resp, str, 500)
			return
		}
		fmt.Printf("Update:: Date: %s Content: %v\n", form.Date, form)
		fmt.Printf("Update:: Date: %s RawData: %s\n", form.Date, body[:n])

		resp.Write([]byte(fmt.Sprint(form)))
		// change existing message
	}
}

//db holds sqlite3 database connection
var db *sql.DB

//serveAll sends all rows from hours table as json array
func serveAll(w http.ResponseWriter, r *http.Request) {
	rows, err := getAll()
	if err != nil {
		fmt.Println(err)
	}
	b := []byte(`{"data": [`)
	for i, e := range rows {
		b = append(b, e...)
		if i < len(rows)-1 {
			b = append(b, ',')
		}
	}
	b = append(b, ']', '}')
	w.Header().Add("Content-Type", "application/json")
	fmt.Printf("getAll: response: %s\n", b)
	// b = []byte("test")
	w.Write(b)
}

//StartServer intializes and starts server
func StartServer() {
	var err error
	db, err = sql.Open("sqlite", "/home/daniel/Documents/hourLogger/hourLogger.db")
	if err != nil {
		fmt.Println("connectDB:" + err.Error())
		return
	}
	conf, err := getConf()
	if err != nil {
		fmt.Printf("getConf: %s", err)
		return
	}
	fmt.Print(conf)

	if err != nil {
		fmt.Println(err)
	}
	http.HandleFunc("/update/", handleUpdate)
	http.HandleFunc("/getall", serveAll)

	fs := http.FileServer(http.Dir("../my-app/build"))
	http.Handle("/", fs)
	http.HandleFunc("/dayview/", func(w http.ResponseWriter, r *http.Request) {
		template.ParseFiles()
		f, err := os.ReadFile("../my-app/build/index.html")
		if err != nil {
			fmt.Println(err)
		}
		w.Header().Add("content-type", "text/html")
		w.Write(f)
	})
	fmt.Println(http.ListenAndServe(":"+conf.Database.Port, nil))
}

//config is used to contain and thus access config.json data
type config struct {
	Database struct {
		Ip       string `json:"ip"`
		Port     string `json:"port"`
		Username string `json:"username"`
		Password string `json:"password"`
	} `json:"database"`
	PasswordRoot string `json:"serverRoot"`
}

//getConf reads config json file stored at current directory and resturns
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

//row is used in formContent struct
type row struct {
	Id       int     `json:"id"`
	Hrs      float64 `json:"hrs"`
	Activity string  `json:"activity"`
}

//formContent is used to ingest json object and check certain properties after ingested
type formContent struct {
	Goals string `json:"goals"`
	Table []row  `json:"table"`
	Date  string `json:"date"`
}

//parseJSON parses raw bytes as pre-defined struct object
func parseJSON(raw []byte) (*formContent, error) {
	var form = new(formContent)
	err := json.Unmarshal(raw, &form)
	return form, err
}
