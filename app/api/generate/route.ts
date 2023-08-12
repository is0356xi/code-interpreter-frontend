import { type NextRequest, NextResponse} from "next/server"

import { components } from "../../types/api"

type GenerateRequest = components["schemas"]["GenerateRequest"]
type GenerateResponse = components["schemas"]["GenerateResponse"]

const url:string = process.env.API_URL || "http://127.0.0.1:5000"

export async function POST(req: NextRequest) {
    // リクエストボディを取得
    const body = await req.json() as GenerateRequest

    // バックエンドで処理を実行
    const res = await fetch(`${url}/api/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })


    // 実行結果を取得
    const result = await res.json() as GenerateResponse
    
    // レスポンスを返却
    return NextResponse.json(result)
}
