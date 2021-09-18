import { useApolloClient, gql } from "@apollo/client";
import { Input, Upload } from "antd";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router";
import styled from "styled-components";
import useSocket from "../../hooks/useSocket";
import { GET_ME } from "../../queries/user";
import { uploadToServer } from "../../utils";
import FilePreview from "./FilePreview";
import { GET_MESSAGES } from "../../queries/conversation";
import { ClipOutlined, ImageOutlined, Send } from "../Icon";
import EmojiPicker from "../EmojiPicker";

const Wrapper = styled.div`
  width: 100%;
  .chat__input {
    padding: 1rem;
    /* background-color: aliceblue; */
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .chat__input--left {
    display: flex;
    gap: 0.3rem;
    align-items: center;
  }
  .chat__input--left svg {
    fill: ${(props) => props.theme.onMessage};
  }
  .chat__input--body {
    flex-grow: 1;
  }
  .inner__input {
    background-color: ${(props) => props.theme.messageBg};
    color: ${(props) => props.theme.onMessage};
  }
  .inner__file {
    /* padding: 0.7rem; */
    display: flex;
    gap: 0.6rem;
    overflow-x: auto;
  }
  .inner__file > * {
    margin: 0.7rem 0 0.7rem 0.7rem;
  }
  textarea {
    width: 100%;
    outline: none;
    border: none;
    background-color: inherit;
    color: inherit;
  }
  textarea:focus {
    box-shadow: none;
    outline: 0;
  }
`;

const ChatInput = ({ data }) => {
  const [fileList, setFileList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [messageValue, setMessageValue] = useState("");
  const [messageType, setMessageType] = useState("text");
  const { conversationId } = useParams();
  console.log(conversationId);
  const socket = useSocket();
  const client = useApolloClient();
  const { me } = client.readQuery({ query: GET_ME });

  const handleFileChange = (info, setDataList) => {
    if (info.file.type.includes("image")) {
      // console.log(info.file);
      const fileObjectUrl = URL.createObjectURL(info.file);
      info.fileList.forEach((file) => {
        if (file.uid === info.file.uid) {
          file.imageSrc = fileObjectUrl;
        }
      });
    }
    setDataList(info.fileList);
  };

  const handleSendMessage = async () => {
    if (!messageValue && !fileList.length && !imageList.length) return;

    const createdAt = new Date().getTime();
    console.log(createdAt);

    const newCacheMessage = {
      __typename: "Message",
      _id: createdAt,
      isMine: true,
      files: [],
      images: [],
      type: messageType,
      conversationId,
      createdAt,
      message: "",
      sender: {
        __ref: `User:${me._id}`,
        ...me,
      },
    };
    switch (messageType) {
      case "text":
        newCacheMessage.message = messageValue;
        break;

      case "image":
        const cacheImages = imageList.map((files) => {
          return files.imageSrc;
        });

        newCacheMessage.images = cacheImages;
        break;
      case "file":
        const cacheFiles = fileList.map((files) => ({
          name: files.name,
          path: "",
        }));
        newCacheMessage.files = cacheFiles;
        break;
      default:
        return null;
    }

    const newMessRef = client.writeFragment({
      data: newCacheMessage,
      fragment: gql`
        fragment newMessage on Message {
          _id
          message
          images
          files {
            path
            name
          }
          type
          isMine
          sender {
            __ref
          }
        }
      `,
    });

    // client.cache.modify({
    //   id: "ROOT_QUERY",
    //   fields: {
    //     getMessages(exist) {
    //       return {
    //         paging: exist.paging,
    //         messages: [
    //           ...exist.messages,
    //           { __ref: `Message:${newMessCache._id}` },
    //         ],
    //       };
    //     },
    //   },
    // });

    // const data = client.readQuery({
    //   query: GET_MESSAGES,
    //   variables: { conversationId, limit: 20 },
    // });
    // console.log(data)

    client.writeQuery({
      query: GET_MESSAGES,
      variables: { conversationId, limit: 20 },
      data: {
        getMessages: {
          ...data.getMessages,
          messages: [...data.getMessages.messages, newCacheMessage],
        },
      },
      overwrite: true,
    });

    client.cache.modify({
      id: `Conversation:${conversationId}`,
      fields: {
        lastMessage() {
          return { __ref: `Message:${newCacheMessage._id}` };
        },
      },
    });
    client.cache.modify({
      id: "ROOT_QUERY",
      fields: {
        getConversations(exist, { readField }) {
          const isExist = exist.conversations.find((cvs) => {
            return readField("_id", cvs) === conversationId;
          });
          if (isExist)
            return {
              paging: exist.paging,
              conversations: [
                {
                  __ref: `Conversation:${conversationId}`,
                },
                ...exist.conversations.filter(
                  (cvs) => readField("_id", cvs) !== conversationId
                ),
              ],
            };
          return {
            paging: exist.paging,
            conversations: [
              {
                __ref: `Conversation:${conversationId}`,
              },
              ...exist.conversations,
            ],
          };
        },
      },
    });
    await handleEmitMessage();
  };

  const handleEmitMessage = async () => {
    const message = {
      type: messageType,
      conversationId,
      createdAt: new Date().getTime(),
      message: "",
      files: [],
      images: [],
    };
    switch (messageType) {
      case "text":
        message.message = messageValue;
        setMessageValue("");
        break;
      case "image":
        const storeImages = await uploadToServer(imageList);
        message.images = storeImages.map((image) => image.path);
        setImageList([]);
        break;
      case "file":
        const storeFiles = await uploadToServer(fileList);
        message.files = storeFiles;
        setFileList([]);
        break;
      default:
        return;
    }
    socket.emit("new-message", message);
  };

  return (
    <Wrapper>
      <div className="chat__input">
        <div className="chat__input--left">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            listType="picture"
            onChange={(info) => handleFileChange(info, setFileList)}
            showUploadList={false}
          >
            <ClipOutlined onClick={() => setMessageType("file")} />
          </Upload>
          <Upload
            beforeUpload={() => false}
            fileList={imageList}
            listType="picture"
            onChange={(info) => handleFileChange(info, setImageList)}
            showUploadList={false}
            multiple={true}
            accept="image/*"
            maxCount={8}
          >
            <ImageOutlined onClick={() => setMessageType("image")} />
          </Upload>
          <EmojiPicker
            setValue={setMessageValue}
            pickerStyle={{ bottom: "2rem" }}
          />
        </div>
        <div className="chat__input--body">
          <div className="inner__input">
            <div className="inner__file">
              {fileList.map((file, index) => (
                <FilePreview
                  key={index}
                  file={file}
                  setFileList={setFileList}
                />
              ))}
              {imageList.map((file, index) => (
                <FilePreview
                  key={index}
                  file={file}
                  setFileList={setImageList}
                />
              ))}
            </div>
            <Input.TextArea
              autoSize={true}
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              rows={1}
              onFocus={() => setMessageType("text")}
            />
          </div>
        </div>
        <div className="chat__input--right">
          <Send onClick={handleSendMessage} />
        </div>
      </div>
    </Wrapper>
  );
};

export default ChatInput;
