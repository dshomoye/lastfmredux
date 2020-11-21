package goservices

// ErrorResponse is the shape of JSON response on error
type ErrorResponse struct {
	Message string
}

// ResponseData for JSON resposne data
type ResponseData struct {
	Data string `json:"data"`
}