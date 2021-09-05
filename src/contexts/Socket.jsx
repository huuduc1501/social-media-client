import React, { children, createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const WebsocketContext = createContext(null);

const WebSocketProvider = ({ children }) => {
  const [conection, setConnection] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      const options = { auth: { token }, path: "/chat" };
      const socketConnection = io("http://localhost:5000", options);
      setConnection(socketConnection);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <WebsocketContext.Provider value={conection}>
      {children}
    </WebsocketContext.Provider>
  );
};

export default WebSocketProvider;
