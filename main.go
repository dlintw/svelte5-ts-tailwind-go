package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
)

//go:embed dist/*
var staticFiles embed.FS

func main() {
	// Use the embedded filesystem for the "dist" directory
	distFS, err := fs.Sub(staticFiles, "dist")
	if err != nil {
		log.Fatalf("Failed to create sub filesystem: %v", err)
	}

	// Serve the embedded files
	http.Handle("/", http.FileServer(http.FS(distFS)))

	// Start the server
	log.Println("Server is running on http://localhost:3000")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
