import {RefObject} from 'react'
import styles from './Chat.module.css'
import type { MessageDict } from "../../types/type"
import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import PersonIcon from "@mui/icons-material/Person";
import SyntaxHighlighter from "react-syntax-highlighter";

function Messages(props: {
    text: string;
    role: string;
    type: string;
})
{
    return (
        // ロールごとにメッセージを表示
        <div className={`${styles.message} ${props.role=="system"? styles.system: styles.user}`}>
            {/* ロールごとにアイコンを表示 */}
            <div className="avatar-holder">
                <div className={styles.avatar}>
                    {props.role=="system"? <VoiceChatIcon/>: <PersonIcon/>}
                </div>
            </div>

            {/* タイプごとにメッセージ内容を表示 */}
            <div className={styles.MessageBody}>
                {props.type=="code" && (
                    <div>
                        Generated Code:
                        <SyntaxHighlighter wrapLongLines={true} language="python">
                            {props.text}
                        </SyntaxHighlighter>
                    </div>
                )}

                {props.type=="message" && (
                    <div>
                        {props.text}
                    </div>
                )}

                {props.type=="image/png" && (
                    <div
                        className='image' 
                        dangerouslySetInnerHTML={{ __html: `<img src='data:image/png;base64,${props.text}' />`}}
                    >
                    </div>
                )}
            </div>
        </div>
    )
}


export default function Chat(props: {
    chatScrollRef: RefObject<HTMLDivElement>;
    messages: Array<MessageDict>
})
{
  return (
    <div className={styles.ChatMessages} ref={props.chatScrollRef}>
        {props.messages.map((message, index) => {
            return(
                <Messages
                    key={index}
                    text={message.text}
                    role={message.role}
                    type={message.type} 
                />
            )
        })}
    </div>
  )
}
