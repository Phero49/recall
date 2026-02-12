package main

import (
	"fmt"
	"net"
	"net/http"
	"os"
	"os/exec"
	"time"

	"github.com/getlantern/systray"
)

const (
	ipcShowURL   = "http://127.0.0.1:10555/show"
	ipcHideURL   = "http://127.0.0.1:10555/quit" // User repurposed /quit for hide
	ipcExitURL   = "http://127.0.0.1:10555/exit"
	trayLockPort = "10556"
)

var isAppActive bool

func main() {
	// Single instance check
	ln, err := net.Listen("tcp", "127.0.0.1:"+trayLockPort)
	if err != nil {
		fmt.Println("Another instance of system tray is already running. Exiting.")
		os.Exit(0)
	}
	defer ln.Close()

	systray.Run(onReady, onExit)
}

func onReady() {
	fmt.Println("system tray is running")

	icon, err := os.ReadFile("./favicon-128x128.png")
	if err != nil {
		fmt.Printf("Error reading icon: %v\n", err)
	}

	systray.SetIcon(icon)
	systray.SetTitle("Recall")

	mShow := systray.AddMenuItem("Show Window", "Show the application window")
	mHide := systray.AddMenuItem("Hide Window", "Close the window but keep running in background")
	systray.AddSeparator()
	mExit := systray.AddMenuItem("Exit", "Completely close the application")

	go func() {
		for {
			select {
			case <-mShow.ClickedCh:
				sendCommand(ipcShowURL, "Showing app")
			case <-mHide.ClickedCh:
				sendCommand(ipcHideURL, "Hiding app")
			case <-mExit.ClickedCh:
				handleExitApp()
			}
		}
	}()
}

func sendCommand(url string, logMsg string) {
	fmt.Println(logMsg + "...")
	client := http.Client{Timeout: 1 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		if url == ipcShowURL {
			fmt.Println("App not reachable, attempting to launch...")
			launchApp()
		} else {
			fmt.Printf("App not reachable: %v\n", err)
		}
		return
	}
	defer resp.Body.Close()
	isAppActive = true
}

func handleExitApp() {
	fmt.Println("Exiting application completely...")
	client := http.Client{Timeout: 1 * time.Second}
	resp, err := client.Get(ipcExitURL)
	if err == nil {
		resp.Body.Close()
		fmt.Println("Exit command sent to main app")
	}
	systray.Quit()
}

func launchApp() {
	cmd := exec.Command("./recall")
	err := cmd.Start()
	if err != nil {
		fmt.Printf("Failed to launch app: %v\n", err)
		return
	}
	isAppActive = true
}

func onExit() {
	// Clean up here
}
