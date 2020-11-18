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
	Recenttracks lfRecentTracks `json:"recenttracks"`
}

type lfDate struct {
	Uts string `json:"uts"`
}

var client = &http.Client{}

func GetUserScrobbles(username string, from time.Time, to time.Time) ([]Scrobble, error) {
	lfKey := os.Getenv("LASTFM_KEY")
	req, err := http.NewRequest("GET", "http://ws.audioscrobbler.com/2.0", nil)
	var scrobbles []Scrobble
	if err != nil {
		return nil, err
	}
	fromTimeStamp := from.Unix()
	toTimeStamp := to.Unix()
	q := req.URL.Query()
	q.Add("method", "user.getRecentTracks")
	q.Add("api_key", lfKey)
	q.Add("format", "json")
	q.Add("limit", "1000")
	q.Add("user", username)
	q.Add("from", strconv.FormatInt(fromTimeStamp, 10))
	q.Add("to", strconv.FormatInt(toTimeStamp, 10))
	req.URL.RawQuery = q.Encode()
	var result lfResponse
	log.Println(req.URL.String())
	err = jsonCall(req, &result)
	if err != nil {
		log.Println("error with json call")
		log.Println(err)
		return nil, err
	}
	tracks := result.Recenttracks.Track
	for _, track := range tracks {
		timeInt, err := strconv.ParseInt(track.Date.Uts, 0, 0)
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
