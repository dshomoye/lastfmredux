package goservices

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"time"
)

// AppDb stores ref to client and db
type AppDb struct {
	Client *mongo.Client
	DB     *mongo.Database
}

// GetLfDb returns the AppDb instance
func GetLfDb() (*AppDb, error) {
	DbUser := os.Getenv("DB_USER")
	DbPw := os.Getenv("DB_PASSWORD")
	connectionURL := fmt.Sprintf("mongodb+srv://%s:%s@lastfmredux.lwjai.gcp.mongodb.net/lastfmredux?retryWrites=true&w=majority", DbUser, DbPw)
	client, err := mongo.NewClient(options.Client().ApplyURI(connectionURL))
	if err != nil {
		return nil, err
	}
	err = client.Connect(context.TODO())
	if err != nil {
		return nil, err
	}
	db := client.Database("lastfmredux")
	return &AppDb{
		DB:     db,
		Client: client,
	}, nil
}

// DisconnectClient disconnects the provided Client using context
func DisconnectClient(client *mongo.Client, ctx context.Context) {
	log.Print("disconnecting DB ")
	err := client.Disconnect(ctx)
	if err != nil {
		log.Panic("Error closing DB")
	}
}

// GetUsers returns array all usernames in scrobbles collection
func GetUsers(db *mongo.Database, ctx context.Context) ([]string, error) {
	collection := db.Collection("scrobbles")
	groupStage := bson.D{
		{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$username"},
		}},
	}
	cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{groupStage})
	if err != nil {
		log.Println(err)
		log.Println("Aggregation Failed")
		return nil, err
	}
	var results []bson.M
	if err = cursor.All(ctx, &results); err != nil {
		log.Println(err)
		return nil, err
	}
	var r []string
	for _, result := range results {
		username := result["_id"].(string)
		r = append(r, username)
	}
	return r, nil
}

func GetUserLastUpdate(db *mongo.Database, username string) (time.Time, error) {
	collection := db.Collection("scrobbles")
	opts := options.FindOne().SetSort(bson.D{{Key: "time", Value: -1}})
	log.Println("getting latest scrobble for ", username)
	var result bson.M
	err := collection.FindOne(context.TODO(), bson.D{{Key: "username", Value: username}}, opts).Decode(&result)
	if err != nil {
		return time.Time{}, err
	}
	return result["time"].(primitive.DateTime).Time(), nil
}

func SaveUserScrobbles(db *mongo.Database, username string, scrobbles []Scrobble) error {
	collection := db.Collection("scrobbles")
	var bsonScrobbles []interface{}
	for _, scrobble := range scrobbles {
		bsonScrobbles = append(bsonScrobbles, bson.D{
			{Key: "time", Value: scrobble.Time},
			{Key: "username", Value: username},
			{Key: "song", Value: bson.D{
				{Key: "title", Value: scrobble.Song.Title},
				{Key: "artist", Value: scrobble.Song.Artist},
				{Key: "album", Value: scrobble.Song.Album},
			}},
		})
	}
	opts := options.InsertMany().SetOrdered(false)
	_, err := collection.InsertMany(context.TODO(), bsonScrobbles, opts)
	return err
}
