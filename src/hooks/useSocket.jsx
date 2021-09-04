import { useContext } from "react";

import { WebsocketContext } from "../contexts/Socket";

const useSocket = () => {
  const ctx = useContext(WebsocketContext);
  if (ctx === undefined)
    throw new Error("useSocket can only be used inside WebsocketContext");
  return ctx;
};

export default useSocket;
