package update

import (
	"context"
	"encoding/json"
	"github.com/dshomoye/lastfmredux/services/goservices"
	"log"
	"net/http"
	"os"
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

func updateUser(host string, username string) {
	_, err := http.Get(host + "/user?user=" + username)
	if err != nil {
		log.Println(err)
	}
}
