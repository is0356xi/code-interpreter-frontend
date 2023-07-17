import {useRef, useState} from 'react'

import styles from "./Input.module.css"

import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendIcon from "@mui/icons-material/Send";

import TextareaAutosize from "react-textarea-autosize";

export default function Input(props:
    {onSendMessage: any}
)
{
    const [input, setInput] = useState<string>("")


    const handleInputChange = (e: any) => {
        setInput(e.target.value)
    }

    const handleSendMessage = () => {
        props.onSendMessage(input)
        setInput("")
    }

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter" && e.shiftKey === false) {
            e.preventDefault();
            handleSendMessage();
        }
    };

  return (
    <div className={styles.InputParent}>
        <div className={`${styles.InputHolder}`}>
            <TextareaAutosize
                className={styles.textarea}
                rows={1}
                placeholder='Type your message here...'
                value={input}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
            />
            <button className={styles.send} onClick={handleSendMessage}>
                <SendIcon />
            </button>
        </div>
    </div>
  )
}
