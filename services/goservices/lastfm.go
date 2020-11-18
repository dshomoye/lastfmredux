package goservices

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"time"
)

type Scrobble struct {
	Time     time.Time `json:"time"`
	Username string    `json:"username"`
	Song     Song      `json:"song"`
}

type Song struct {
	Artist string `json:"artist"`
	Title  string `json:"title"`
	Album  string `json:"album"`
}

type lfRecentTracks struct {
	Track []lfRecentTrack `json:"track"`
}

type lfRecentTrack struct {
	Artist map[string]string `json:"artist"`
	Album  map[string]string `json:"album"`
	Name   string            `json:"name"`
	Date   lfDate            `json:"date"`
}

type lfResponse struct {
	Recenttracks lfRecentTracks    `json:"recenttracks"`
	Attr         map[string]string `json:"@attr"`
}

type lfDate struct {
	Uts string `json:"uts"`
}

var client = &http.Client{}

func GetUserTotalPages(username string, from time.Time) (int, error) {
	var result lfResponse
	err := fetchScrobbles(username, from, 0, &result)
	if err != nil {
		return 0, err
	}
	totalPages, parseErr := strconv.ParseInt(result.Attr["totalPages"], 10, 0)
	if parseErr != nil {
		return 0, parseErr
	}
	return int(totalPages), nil
}

func GetUserScrobbles(username string, from time.Time, page int64) ([]Scrobble, error) {
	var result lfResponse
	err := fetchScrobbles(username, from, page, &result)
	if err != nil {
		log.Println("error with json call")
		log.Println(err)
		return nil, err
	}
	var scrobbles []Scrobble
	tracks := result.Recenttracks.Track
	for _, track := range tracks {
		timeInt, err := strconv.ParseInt(track.Date.Uts, 0, 64)
		scrobbleTime := time.Unix(timeInt, 0)
		if err != nil {
			continue
		}
		scrobbles = append(scrobbles, Scrobble{
			Time:     scrobbleTime,
			Username: username,
			Song: Song{
				Title:  track.Name,
				Album:  track.Album["#text"],
				Artist: track.Artist["#text"],
			},
		})
	}
	sort.Slice(scrobbles, func(i int, j int) bool {
		return scrobbles[i].Time.Before(scrobbles[j].Time)
	})
	return scrobbles, nil

}

func jsonCall(req *http.Request, target interface{}) error {
	r, err := client.Do(req)
	if err != nil {
		return err
	}
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(target)
}

func fetchScrobbles(username string, from time.Time, page int64, result *lfResponse) error {
	var nilTime time.Time
	var nilPage int64
	lfKey := os.Getenv("LASTFM_KEY")
	req, err := http.NewRequest("GET", "http://ws.audioscrobbler.com/2.0", nil)
	if err != nil {
		return err
	}
	q := req.URL.Query()
	q.Add("method", "user.getRecentTracks")
	q.Add("api_key", lfKey)
	q.Add("format", "json")
	q.Add("limit", "1000")
	q.Add("user", username)
	if from != nilTime {
		q.Add("from", strconv.FormatInt(from.Unix(), 10))
	}
	if page != nilPage {
		q.Add("page", strconv.FormatInt(page, 10))
	}
	req.URL.RawQuery = q.Encode()
	log.Println(req.URL.String())
	err = jsonCall(req, result)
	if err != nil {
		log.Println("error with json call")
		log.Println(err)
		return err
	}
	return nil
}
