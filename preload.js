const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  addAlarm : (data) => ipcRenderer.invoke("add-alarm", data),
  clearAlarms : (data) => ipcRenderer.invoke("clear-alarm",data),
  getAlarms : () => ipcRenderer.invoke("get-alarms"), 
});