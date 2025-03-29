export const getImageDimensions = (file: any) => {
  const reader = new FileReader()

  reader.readAsDataURL(file)

  const promise = new Promise((resolve, reject) => {
    reader.onload = function (e) {
      const image = new Image()
      // @ts-ignore
      image.src = e.target.result

      image.onload = function () {
        // @ts-ignore
        const width = this.width
        // @ts-ignore
        const height = this.height

        resolve({ width, height })
      }

      image.onerror = reject
    }
  })

  return promise
}

export const getImageDimensionsFromUrl = async (url: string) => {
  const promise = new Promise<{ width: number; height: number }>(
    (resole: any, reject: any) => {
      const image = new Image()
      image.src = url

      image.onload = function () {
        const width = image.width
        const height = image.height

        resole({ width, height })
      }

      image.onerror = reject
    }
  )

  return promise
}

export const compressImageSize = async (
  file: any,
  width: number,
  height: number
) => {
  const imageDimensions = await getImageDimensions(file)

  // @ts-ignore
  const imgWidth = imageDimensions.width
  // @ts-ignore
  const imgHeight = imageDimensions.height

  return imgWidth >= width && imgHeight >= height
}

export class ImageUtils {
  async isSquare(file: any): Promise<boolean> {
    const imageDimen = await getImageDimensions(file)

    // @ts-ignore
    return imageDimen.width == imageDimen.height
  }

  async isLandscape(file: any): Promise<boolean> {
    const imageDimen = await getImageDimensions(file)

    // @ts-ignore
    return imageDimen.width > imageDimen.height
  }

  async isPortrait(file: any): Promise<boolean> {
    const imageDimen = await getImageDimensions(file)

    // @ts-ignore
    return imageDimen.width < imageDimen.height
  }
}

export class ImageUrlUtils {
  async isSquare(url: string): Promise<boolean> {
    const { width, height } = await getImageDimensionsFromUrl(url)
    return width === height
  }

  async isLandscape(url: string): Promise<boolean> {
    const { width, height } = await getImageDimensionsFromUrl(url)
    return width > height
  }

  async isPortrait(url: string): Promise<boolean> {
    const { width, height } = await getImageDimensionsFromUrl(url)
    return width < height
  }
}
