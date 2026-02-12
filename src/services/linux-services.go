package services

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func generateServiceContent() string {
	// Get the full path to the running binary
	exePath, err := os.Executable()
	if err != nil {
		log.Println("Failed to get executable path:", err)
		exePath = "/usr/local/bin/recall" // fallback, just in case
	}

	// Optional: get directory
	exeDir := filepath.Dir(exePath)

	return fmt.Sprintf(`[Unit]
Description=Recall Task & Journal App
After=network.target

[Service]
Type=simple
ExecStart=%s --service
Restart=always
WorkingDirectory=%s
User=%s

[Install]
WantedBy=default.target
`, exePath, exeDir, os.Getenv("USER"))
}

func RegisterService() {
	const serviceName = "recall-app.service"
	servicePath := "/etc/systemd/system/" + serviceName

	if _, err := os.Stat(servicePath); err == nil {
		log.Println("Service already registered:", serviceName)
		return
	}

	serviceContent := generateServiceContent()

	if err := os.WriteFile(servicePath, []byte(serviceContent), 0644); err != nil {
		log.Println("Failed to write service file:", err)
		return
	}

	// Reload, enable, start
	for _, cmdArgs := range [][]string{
		{"systemctl", "daemon-reload"},
		{"systemctl", "enable", serviceName},
		{"systemctl", "start", serviceName},
	} {
		cmd := exec.Command(cmdArgs[0], cmdArgs[1:]...)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			log.Println("Error running command:", cmdArgs, err)
		}
	}

	log.Println("Service registered and started:", serviceName)
}
