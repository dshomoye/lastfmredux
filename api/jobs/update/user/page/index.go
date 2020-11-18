package page

import (
	"encoding/json"
	"github.com/dshomoye/lastfmredux/services/goservices"
	"log"
	"net/http"
	"strconv"
	"time"
)

type ErrorResponse struct {
	Message string
}

type ResponseData struct {
	Data string `json:"data"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	appDb, err := goservices.GetLfDb()
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(ErrorResponse{Message: "failed to get db"})
		return
	}
	username := r.URL.Query().Get("user")
	fromStr := r.URL.Query().Get("from")
	pageStr := r.URL.Query().Get("page")
	fromInt, fromErr := strconv.ParseInt(fromStr, 10, 0)
	page, pageErr := strconv.ParseInt(pageStr, 10, 0)
	if fromErr != nil {
		return
	}
	if pageErr != nil {
		return
	}
	from := time.Unix(fromInt, 0)
	scrobbles, sErr := goservices.GetUserScrobbles(username, from, page)
	if sErr != nil {
		// TODO
	}
	testData := []goservices.Scrobble{scrobbles[0]}
	saveErr := goservices.SaveUserScrobbles(appDb.DB, username, testData)
	if saveErr != nil {
		log.Println(saveErr)
	}
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(ResponseData{Data: "DONE"})
}
