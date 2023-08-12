import { type NextRequest, NextResponse} from "next/server"
import { components } from "../../types/api"

type UploadFileResponse = components["schemas"]["UploadFileResponse"]

const url:string = process.env.API_URL || "http://127.0.0.1:5000"

export async function POST(req: NextRequest) {
    // リクエストボディからファイルを取得
    const body = await req.formData()

    // バックエンドで処理を実行
    const res = await fetch(`${url}/api/upload-file`, {
        method: "POST",
        body: body
    })

    // 実行結果を取得
    const result = await res.json() as UploadFileResponse

    // レスポンスを返却
    return NextResponse.json(result)
}
