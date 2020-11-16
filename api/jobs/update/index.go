package update

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dshomoye/lastfmredux/services/goservices"
)

type ErrorResponse struct {
	Message string
}

type ResponseData struct {
	Data string `json:"data"`
}

// Handler receives requests and sends Response
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	log.Println("handler called!", time.Now())
	queryParams := r.URL.Query()
	username := queryParams.Get("user")
	if username == "" {
		handleRoot(w, r)
	} else if len(username) > 0 {
		handleUserUpdate(w, r)
	} else {
		handleUnrecognized(w, r)
	}
}

func handleRoot(w http.ResponseWriter, r *http.Request) {
	errorRes := ErrorResponse{Message: "Error occurred"}
	appDb, err := goservices.GetLfDb()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(errorRes)
		return
	}
	defer goservices.DisconnectClient(appDb.Client, appDb.Ctx)
	usernames, err := goservices.GetUsers(appDb.DB, appDb.Ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(errorRes)
		return
	}
	log.Println(usernames)
	apiHost := os.Getenv("API_HOST")
	for _, username := range usernames {
		// use goroutine to not wait for response
		go updateUser(apiHost+r.URL.Path, username)
		log.Println("after go routine")
	}
	_ = json.NewEncoder(w).Encode(ResponseData{Data: "DONE"})
}

func handleUnrecognized(w http.ResponseWriter, r *http.Request) {
	errorRes := ErrorResponse{Message: "Unrecognized query"}
	w.WriteHeader(http.StatusNotAcceptable)
	_ = json.NewEncoder(w).Encode(errorRes)
}

func handleUserUpdate(w http.ResponseWriter, r *http.Request) {
	log.Println("handling user update")
	errorRes := ErrorResponse{Message: "Update user here"}
	w.WriteHeader(http.StatusNotAcceptable)
	_ = json.NewEncoder(w).Encode(errorRes)
}

func updateUser(host string, username string) {
	resp, err := http.Get(host + "?user=" + username)
	if err != nil {
		log.Println(err)
	} else {
		log.Println(resp)
	}
}
