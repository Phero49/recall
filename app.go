package main

import (
	"context"
	"recall/src/database"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// CreateLog creates a new log entry
func (a *App) CreateLog(name, description, dueDate string) (*database.Log, error) {
	return database.CreateLog(name, description, dueDate)
}

// GetLogs returns all logs with an optional duration filter
func (a *App) GetLogs(duration string) ([]database.Log, error) {
	return database.GetLogs(duration)
}

// AddLogItem adds a new item to a log
func (a *App) AddLogItem(logID int, title, details, status, sights, time, types string) (*database.LogItem, error) {
	return database.AddLogItem(logID, title, details, status, sights, time, types)
}

// GetLogItemsByDate returns all log items for a specific date
func (a *App) GetLogItemsByDate(date string) ([]database.LogItem, error) {
	return database.GetLogItemsByDate(date)
}

// SaveLogItem saves a log item (inserts if ID is 0, updates otherwise)
func (a *App) SaveLogItem(item database.LogItem) (*database.LogItem, error) {
	return database.SaveLogItem(item)
}

func (a *App) DeleteLogItem(id int) error {
	return database.DeleteLogItem(id)
}

func (a *App) GetAnalytics() (*database.Analytics, error) {
	return database.GetAnalytics()
}
