package updateall

import (
	"context"
	"encoding/json"
	"github.com/dshomoye/lastfmredux/services/goservices"
	"log"
	"net/http"
	"os"
)


// Handler receives requests and sends Response
func Handler(w http.ResponseWriter, r *http.Request) {
	log.Println("Update all request handlers")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	errorRes := goservices.ErrorResponse{Message: "Error occurred"}
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
	var host string
	apiHost := os.Getenv("API_HOST")
	vercelURL := os.Getenv("VERCEL_URL")
	if vercelURL != "" {
		host = "https://" + vercelURL
	} else if apiHost != "" {
		host = apiHost
	} else {
		log.Panic("uanbel to fetch host for environment")
	}
	for _, username := range usernames {
		log.Println("updating user ", username)
		// use goroutine to not block for response
		go updateUser(host, username)
	}
	_ = json.NewEncoder(w).Encode(goservices.ResponseData{Data: "DONE"})
}

func updateUser(host string, username string) {
	_, err := http.Get(host + "/api/updateuser?user=" + username)
	if err != nil {
		log.Println(err)
	}
}
