package goservices

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"time"
)

type AppDb struct {
	Client *mongo.Client
	DB     *mongo.Database
	Ctx    context.Context
}

// GetLfDb returns the AppDb instance
func GetLfDb() (*AppDb, error) {
	DbUser := os.Getenv("DB_USER")
	DbPw := os.Getenv("DB_PASSWORD")
	connectionUrl := fmt.Sprintf("mongodb+srv://%s:%s@lastfmredux.lwjai.gcp.mongodb.net/lastfmredux?retryWrites=true&w=majority", DbUser, DbPw)
	client, err := mongo.NewClient(options.Client().ApplyURI(connectionUrl))
	if err != nil {
		return nil, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		return nil, err
	}
	db := client.Database("lastfmredux")
	return &AppDb{
		DB:     db,
		Client: client,
		Ctx:    ctx,
	}, nil
}

// DisconnectClient disconnects the provided Client using context
func DisconnectClient(client *mongo.Client, ctx context.Context) {
	log.Print("disconnecting DB ", time.Now())
	err := client.Disconnect(ctx)
	if err != nil {
		log.Panic("Error closing DB")
	}
}

// GetUsers returns array all usernames in scrobbles collection
func GetUsers(db *mongo.Database, ctx context.Context) ([]string, error) {
	log.Println("getting users")
	collection := db.Collection("scrobbles")
	groupStage := bson.D{
		{"$group", bson.D{
			{"_id", "$username"},
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
