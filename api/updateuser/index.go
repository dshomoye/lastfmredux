package updateuser

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/dshomoye/lastfmredux/services/goservices"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)


func Handler(w http.ResponseWriter, r *http.Request) {
	log.Println("handling user update")
	errorRes := goservices.ErrorResponse{Message: "Update user here"}
	appDb, err := goservices.GetLfDb()
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(goservices.ErrorResponse{Message: "failed to get db"})
		return
	}
	defer goservices.DisconnectClient(appDb.Client, context.TODO())
	username := r.URL.Query().Get("user")
	lastUpdate, latestError := goservices.GetUserLastUpdate(appDb.DB, username)
	if latestError != nil {
		log.Println(err)
		w.WriteHeader(http.StatusNotAcceptable)
		_ = json.NewEncoder(w).Encode(goservices.ErrorResponse{Message: "failed to get latest"})
		return
	}
	lastUpdate = lastUpdate.Add(time.Minute)
	totalPages, pagesErr := goservices.GetUserTotalPages(username, lastUpdate)
	if pagesErr != nil {
		log.Println(err)
		w.WriteHeader(http.StatusNotAcceptable)
		_ = json.NewEncoder(w).Encode(goservices.ErrorResponse{Message: "failed to get total pages"})
		return
	}
	apiHost := os.Getenv("API_HOST")
	for i := 1; i <= totalPages; i++ {
		go savePageScrobbles(apiHost, username, lastUpdate, i)
	}
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(errorRes)
}

func savePageScrobbles(host string, username string, from time.Time, page int) {
	fromStr := strconv.Itoa(int(from.Unix()))
	callURL := fmt.Sprintf("%s/api/updateuserpage?user=%s&from=%s&page=%d", host, username, fromStr, page)
	resp, err := http.Get(callURL)
	if err != nil {
		log.Println(err)
	}
	log.Println(resp)
}
