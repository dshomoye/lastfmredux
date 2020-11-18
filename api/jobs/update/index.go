package update

import (
	"context"
	"encoding/json"
	"github.com/dshomoye/lastfmredux/services/goservices"
	"log"
	"net/http"
	"os"
	"time"
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
	defer goservices.DisconnectClient(appDb.Client, context.TODO())
	usernames, userErr := goservices.GetUsers(appDb.DB, context.TODO())
	if userErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(errorRes)
		return
	}
	apiHost := os.Getenv("API_HOST")
	for _, username := range usernames {
		// use goroutine to not block for response
		go updateUser(apiHost+r.URL.Path, username)
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
	appDb, err := goservices.GetLfDb()
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(ErrorResponse{Message: "failed to get db"})
		return
	}
	defer goservices.DisconnectClient(appDb.Client, context.TODO())
	username := r.URL.Query().Get("user")
	lastUpdate, latestError := goservices.GetUserLastUpdate(appDb.DB, username)
	if latestError != nil {
		log.Println(err)
		w.WriteHeader(http.StatusNotAcceptable)
		_ = json.NewEncoder(w).Encode(ErrorResponse{Message: "failed to get latest"})
		return
	}
	lastUpdate = lastUpdate.Add(time.Minute)
	scrobbles, sError := goservices.GetUserScrobbles(username, lastUpdate, time.Now())
	if sError != nil {
		log.Println(err)
		w.WriteHeader(http.StatusNotAcceptable)
		_ = json.NewEncoder(w).Encode(ErrorResponse{Message: "failed to get latest"})
		return
	}
	savError := goservices.SaveUserScrobbles(appDb.DB, username, scrobbles)
	if savError != nil {
		log.Println("save failed: ", err)
	}
	w.WriteHeader(http.StatusNotAcceptable)
	_ = json.NewEncoder(w).Encode(errorRes)
}

func updateUser(host string, username string) {
	_, err := http.Get(host + "?user=" + username)
	if err != nil {
		log.Println(err)
	}
}
