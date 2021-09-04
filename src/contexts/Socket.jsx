import React, { Children, createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const WebsocketContext = createContext(null);

const WebSocketProvider = () => {
  const [conection, setConnection] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      const options = { auth: { token } };
      const socketConnection = io("http://localhost/chat", options);
      setConnection(socketConnection);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <WebsocketContext.Provider value={conection}>
      {Children}
    </WebsocketContext.Provider>
  );
};

export default WebSocketProvider;
