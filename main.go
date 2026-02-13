package main

import (
	"context"
	"embed"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"recall/src/database"
	"recall/src/services"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//"github.com/gen2brain/beeep"

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()
	database.InitDB()
	database.AutoGenerateLogs()

	asService := flag.Bool("service", false, "start app as a service")
	flag.Parse()
	startHidden := *asService

	if *asService {
		startHidden = true

	}

	// Read icon
	icon, _ := os.ReadFile("./favicon-128x128.png")
	systemBinary := "./system-tray/system-tray-bin"

	// Now start Wails on the main goroutine
	err := wails.Run(&options.App{
		Title:             "Recall",
		Width:             1024,
		Height:            768,
		StartHidden:       startHidden,
		HideWindowOnClose: true,
		Linux: &linux.Options{
			Icon: icon,
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			build := runtime.Environment(ctx).BuildType

			if build == "production" {
				services.RegisterService() // only for prod builds

			}
			// Start internal IPC server
			go func() {
				mux := http.NewServeMux()
				mux.HandleFunc("/show", func(w http.ResponseWriter, r *http.Request) {
					runtime.WindowShow(ctx)
					w.WriteHeader(http.StatusOK)
				})
				mux.HandleFunc("/quit", func(w http.ResponseWriter, r *http.Request) {
					w.WriteHeader(http.StatusOK)
					runtime.WindowHide(ctx)
				})
				mux.HandleFunc("/exit", func(w http.ResponseWriter, r *http.Request) {
					w.WriteHeader(http.StatusOK)
					runtime.Quit(ctx)
				})
				// Listen on a fixed localhost port
				fmt.Println("Starting IPC server on 127.0.0.1:10555")
				server := &http.Server{
					Addr:    "127.0.0.1:10555",
					Handler: mux,
				}
				if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
					fmt.Printf("IPC server error: %v\n", err)
				}
			}()

			go func() {
				cmd := exec.Command(systemBinary)
				cmd.Stdout = os.Stdout
				cmd.Stderr = os.Stderr
				err := cmd.Run()
				if err != nil {
					fmt.Printf("error running system tray: %v\n", err)
				}
			}()
			app.startup(ctx)
		},
		Bind: []interface{}{app},
	})

	if err != nil {
		panic(err)
	}
	if err != nil {
		log.Fatal(err)
	}
}
