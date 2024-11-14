// signalRConnection.jsx
import { HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";
import API_ENDPOINTS from "../constant/linkapi";
let connection;

export function getConnection() {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(API_ENDPOINTS.HUB_URL, {
        transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();
      
    // Set server timeout to 2 minutes (in milliseconds)
    connection.serverTimeoutInMilliseconds = 2 * 60 * 1000;
  }
  return connection;
}

export default getConnection;
