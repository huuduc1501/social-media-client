import { useApolloClient, useQuery, gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import styled from "styled-components";

import PreviewConversation from "../components/conversation/PreviewConversation";
import { GET_CONVERSATIONS, GET_ME } from "../queries/user";
import ChatLog from "../components/conversation/ChatLog";
import useSocket from "../hooks/useSocket";
import { GET_SPECIFY_CONVERSATION } from "../queries/conversation";
import { Route } from "react-router";
import { Avatar } from "antd";
import { EditOutlined } from "../components/Icon";

const Wrapper = styled.div`
  height: 80vh;
  background-color: ${(props) => props.theme.primaryColor};

  .sidebar-header {
    padding: 0.3rem 1.2rem;
    display: flex;
    gap: 0.2rem;
    align-items: center;
  }

  .sidebar-header .background-icon {
    padding: 0.5rem;
    border-radius: 50%;
    background-color: ${(props) => props.theme.bg};
    width: 36px;
    height: 36px;
    margin-left: auto;
  }
  .sidebar-header h2 {
    margin: 0;
    color: inherit;
  }

  .specific-chat {
    height: 80vh;
  }

  .sidebar {
    position: relative;
    color: ${(props) => props.theme.onPrimary};
    width: calc(100vh / 3.3);
  }
  .sidebar-body {
    position: absolute;
    height: calc(100% - 60px);
    overflow: auto;
    width: 100%;
    padding: 0.4rem;
  }
  .sidebar-body::-webkit-scrollbar {
    background-color: transparent;
    width: 6px;
    visibility: hiden;
  }

  .sidebar-body::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.secondaryColor};
    border-radius: 10px;
  }
  .content {
    display: grid;
    grid-template-columns: auto 1fr;
    height: 100%;
  }
  svg {
    width: 20px;
    height: 20px;
  }
  @media (max-width: 600px) {
    .sidebar {
      max-width: 85px;
    }
    .sidebar-header h2 {
      display: none;
    }
  }
`;

const ChatPage = () => {
  const { loading, data } = useQuery(GET_CONVERSATIONS, {
    variables: { limit: 5 },
    fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-only",
  });
  const client = useApolloClient();
  const { me } = client.readQuery({ query: GET_ME });
  const [getConversationLazy, { data: newConversation }] = useLazyQuery(
    GET_SPECIFY_CONVERSATION,
    {
      fetchPolicy: "cache-first",
    }
  );
  const socket = useSocket();

  useEffect(() => {
    if (!loading && socket) {
      socket.on("new-message", (commingMessage) => {
        console.log("onnnn");
        const isMine =
          commingMessage.sender._id.toString() === me._id.toString();

        if (isMine) return;

        const isExist = data.getConversations?.conversations.find(
          (conversation) => {
            return (
              conversation?._id.toString() ===
              commingMessage.conversation.toString()
            );
          }
        );

        if (isExist) {
          const newCacheMess = {
            __typename: "Message",
            ...commingMessage,
            isMine: false,
            sender: {
              __typename: "User",
              ...commingMessage.sender,
            },
          };

          client.writeFragment({
            // id: `Message:${commingMessage._id}`,
            fragment: gql`
              fragment newMessage on Message {
                _id
                message
                type
                isMine
                sender {
                  _id
                  username
                  avatar
                }
              }
            `,
            data: { ...newCacheMess },
          });

          client.cache.modify({
            id: `Conversation:${commingMessage.conversation}`,
            fields: {
              lastMessage() {
                return { __ref: `Message:${commingMessage._id}` };
              },
            },
          });
          client.cache.modify({
            id: "ROOT_QUERY",
            fields: {
              getConversations(exist, { readField }) {
                return {
                  paging: exist.paging,
                  conversations: [
                    {
                      __ref: `Conversation:${commingMessage.conversation}`,
                    },
                    ...exist.conversations.filter(
                      (cvs) =>
                        readField("_id", cvs) !== commingMessage.conversation
                    ),
                  ],
                };
              },
            },
          });
        } else {
          getConversationLazy({
            variables: {
              conversationId: commingMessage.conversation,
            },
          });
          // console.log(newConversation);
        }
      });
    }
  }, [
    client.cache,
    loading,
    socket,
    data?.getConversations.conversations,
    client,
    me._id,
    getConversationLazy,
    newConversation,
  ]);

  useEffect(() => {
    const conversationId = newConversation?.getSpecifyConversation._id;

    const isExist = data?.getConversations.conversations.find(
      (conversation) => {
        return conversation?._id.toString() === conversationId;
      }
    );

    if (isExist) return;

    if (newConversation?.getSpecifyConversation._id) {
      client.cache.modify({
        id: "ROOT_QUERY",
        fields: {
          getConversations(exist) {
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
    }
  }, [client.cache, newConversation, data?.getConversations.conversations]);

  if (loading) return "loading...";

  return (
    <Wrapper>
      <div className="content">
        <div className="sidebar">
          <div className="sidebar-header">
            <div>
              <Avatar src={me.avatar} />
            </div>
            <h2>Chat</h2>
            {/* <div className="background-icon">
              <EditOutlined />
            </div> */}
          </div>
          <div className="sidebar-body">
            {data?.getConversations.conversations.map((conversation, index) => {
              return (
                <PreviewConversation key={index} conversation={conversation} />
              );
            })}
          </div>
        </div>
        <div className="specific-chat">
          <Route path="/chat/:conversationId">
            <ChatLog />
          </Route>
        </div>
      </div>
    </Wrapper>
  );
};

export default ChatPage;
