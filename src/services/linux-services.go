package services

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

// generateServiceContent creates a user-level systemd service unit
func generateServiceContentLinux() string {
	exePath, err := os.Executable()
	if err != nil {
		log.Println("Failed to get executable path:", err)
		exePath = "/usr/local/bin/recall" // fallback
	}

	exeDir := filepath.Dir(exePath)

	// User-level service: no 'User=' needed
	// Restart=on-failure with 1-hour delay
	return fmt.Sprintf(`[Unit]
Description=Recall Task & Journal App
After=graphical.target

[Service]
Type=simple
ExecStart=%s --service
Restart=on-failure
RestartSec=2400
WorkingDirectory=%s

[Install]
WantedBy=default.target
`, exePath, exeDir)
}

// RegisterService installs and enables the user-level systemd service
func RegisterService() {
	const serviceName = "recall-app.service"

	homeDir, err := os.UserHomeDir()
	if err != nil {
		log.Println("Failed to get home directory:", err)
		return
	}

	userSystemdDir := filepath.Join(homeDir, ".config", "systemd", "user")
	servicePath := filepath.Join(userSystemdDir, serviceName)

	// Ensure user systemd directory exists
	if err := os.MkdirAll(userSystemdDir, 0755); err != nil {
		log.Println("Failed to create systemd user directory:", err)
		return
	}

	// Check if service file already exists
	if _, err := os.Stat(servicePath); err == nil {
		log.Println("Service already registered:", serviceName)
		return
	}

	// Write the service file
	serviceContent := generateServiceContentLinux()
	if err := os.WriteFile(servicePath, []byte(serviceContent), 0644); err != nil {
		log.Println("Failed to write service file:", err)
		return
	}

	// Reload user systemd, enable, and start service
	commands := [][]string{
		{"systemctl", "--user", "daemon-reload"},
		{"systemctl", "--user", "enable", serviceName},
		{"systemctl", "--user", "start", serviceName},
	}

	for _, cmdArgs := range commands {
		cmd := exec.Command(cmdArgs[0], cmdArgs[1:]...)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			log.Println("Error running command:", cmdArgs, err)
		}
	}

	log.Println("User service registered and started:", serviceName)
}
