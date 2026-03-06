import fs from "fs/promises"
import path from "path"

export async function downloadImage(imageUrl: string): Promise<string | null> {

  try {

    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error("Failed to download image")
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    const uploadDir = path.join(
      process.cwd(),
      "public/images/products"
    )

    await fs.mkdir(uploadDir, { recursive: true })

    const contentType = response.headers.get("content-type") || "image/jpeg"

    let extension = "jpg"

    if (contentType.includes("png")) extension = "png"
    else if (contentType.includes("webp")) extension = "webp"
    else if (contentType.includes("gif")) extension = "gif"

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`

    const filePath = path.join(uploadDir, fileName)

    await fs.writeFile(filePath, buffer)

    return `/images/products/${fileName}`

  } catch (error) {

    console.error("Image download failed:", imageUrl, error)

    return null

  }

}