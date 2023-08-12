import {useRef, useState} from 'react'

import styles from "./Input.module.css"

import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendIcon from "@mui/icons-material/Send";

import TextareaAutosize from "react-textarea-autosize";

export default function Input(
    props: {
        onSendMessage: any, 
        onUploadComplete: any
    }
)
{
    const [input, setInput] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null);


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

    const handleFileChange = async (e:any) => {
        if (e.target.files.length > 0) {
            // フォームデータを作成する
            const file = e.target.files[0];

            // ハイフンを除去したファイル名を生成
            const newFileName = file.name.replace(/-/g, '_');

            // 新しいファイルオブジェクトを作成
            const newFile = new File([file], newFileName, { type: file.type });
            
            // フォームデータを作成する
            const formData = new FormData();
            formData.append("file", newFile);

            // フォームデータをバックエンドに送信する
            const response = await fetch("/api/upload-file", {
                method: "POST",
                body: formData,
            });

            // バックエンドからのレスポンスを受け取る
            const data = await response.json();
            console.log(data);

            // バックエンドからのレスポンスを処理する
            props.onUploadComplete(data.file_name, data.financial_data);
        }
    }

    const handleUpload = (e: any) => {
        e.preventDefault();
        fileInputRef.current?.click();
    };

  return (
    <div className={styles.InputParent}>
        <div className={`${styles.InputHolder}`}>
            <form className={styles.FileUpload}>
                <input
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{display: "none"}}
                    type="file"
                >
                </input>
                <button type='button' onClick={handleUpload}>
                    <FileUploadIcon />
                </button>
            </form>
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
