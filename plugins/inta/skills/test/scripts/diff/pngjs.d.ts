declare module "pngjs" {
  import type { Buffer } from "node:buffer"

  type PngOptions = {
    width: number
    height: number
  }

  export class PNG {
    constructor(options: PngOptions)

    readonly width: number
    readonly height: number
    readonly data: Buffer

    static readonly sync: {
      read(buffer: Buffer): PNG
      write(png: PNG): Buffer
    }
  }
}
