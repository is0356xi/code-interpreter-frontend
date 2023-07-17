import { type NextRequest, NextResponse } from "next/server"
import { components } from "../../types/api"

type ExecCodeRequest = components["schemas"]["ExecCodeRequest"]
type ExecCodeResponse = components["schemas"]["ExecCodeResponse"]

const url: string = process.env.API_URL || "http://127.0.0.1:5000"

export async function POST(req: NextRequest) {
  // リクエストボディを取得
  const body = await req.json() as ExecCodeRequest

  // バックエンドで処理を実行
  const res = await fetch(`${url}/api/exec-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })

  // 実行結果を取得
  const result = await res.json() as ExecCodeResponse

  console.log(result)

  // レスポンスを返却
  return NextResponse.json(result)
}
