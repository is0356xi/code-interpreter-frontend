"use client"

import { useState, useEffect, useRef } from "react"
import styles from "./page.module.css"

import Chat from "./components/Chat/Chat"
import Input from "./components/Input/Input"

import type { MessageDict } from "./types/type"
import { components } from "./types/api"

type GenerateRequest = components["schemas"]["GenerateRequest"]
type GenerateResponse = components["schemas"]["GenerateResponse"]
type ExecCodeRequest = components["schemas"]["ExecCodeRequest"]
type ExecCodeResponse = components["schemas"]["ExecCodeResponse"]

export default function Home() {
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const COMMANDS = ["reset"];
  const [messages, setMessages] = useState<Array<MessageDict>>([
    {
      text: "こんにちは！私はGPTコードアシスタントです。何かお手伝いできることはありますか？ちなみに、ファイルをアップロードしていただければ、そのファイルを使用することもできます。どのようなご質問でもお気軽にどうぞ！",
      role: "system",
      type: "message",
    },
    {
      text: "もし何か問題が発生した場合は、`reset`と入力してください。その際、私はカーネルを再起動します。",
      role: "system",
      type: "message",
    },
  ])


  // 特定のコマンドを処理する
  const handleCommand = (command: string) => {
    return "WIP"
  }

  // 状態にメッセージを追加する
  const addMessage = (message: MessageDict) => {
    setMessages((prevMessages:any) => {
      return [...prevMessages, message];
    });
  }

  // チャットメッセージが追加されたら一番下までスクロールする
  useEffect(() => {
    if(chatScrollRef.current){
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatScrollRef, messages])


  const GenerateCode = async (request: GenerateRequest): Promise<GenerateResponse> => {
    // ユーザーの入力をバックエンドに送信する
    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify(request),
    })
    
    // バックエンドからのレスポンスを受け取る
    const data = await response.json() as GenerateResponse;

    return data;
  }

  const ExecuteCode = async (request: ExecCodeRequest): Promise<ExecCodeResponse> => {
    // 生成済みコードをバックエンドに送信する
    const response = await fetch("/api/exec-code", {
      method: "POST",
      body: JSON.stringify(request),
    })

    // バックエンドからのレスポンスを受け取る
    const data = await response.json() as ExecCodeResponse;

    return data;
  }

  // ユーザーの入力を受け取り処理する
  const sendMessage =  async (userInput: string) => {
    try{
      if(COMMANDS.includes(userInput)){
        handleCommand(userInput);
        return;
      }

      if(userInput === ""){
        return;
      }

      addMessage({
        text: userInput,
        role: "user",
        type: "message",
      })
      
      // ユーザーの入力をバックエンドに送信し、コードを生成してもらう
      const code_result = await GenerateCode({user_input: userInput})    

      // バックエンドからのレスポンスを状態に追加する
      addMessage({
        text: code_result.generated_code!,
        role: "system",
        type: "code",
      });

      // 生成したコードをバックエンドで実行してもらい、結果を取得
      const exec_result = await ExecuteCode({code: code_result.generated_code!})

      // バックエンドからのレスポンスを状態に追加する
      addMessage({
        text: exec_result.output!,
        role: "system",
        type: exec_result.message_type!,
      });

    }catch(e){
      console.error(e)
    }
  }

  return (
    <div className={styles.main}>
      <Chat
        chatScrollRef={chatScrollRef} // チャットメッセージが追加された時のスクロール用 
        messages={messages}
      />
      <Input 
        onSendMessage={sendMessage}
      />
    </div>
  )
}
