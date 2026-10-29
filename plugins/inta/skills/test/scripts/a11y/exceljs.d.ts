declare module "exceljs" {
  namespace ExcelJS {
    type Argb = { argb: string }

    type BorderStyle = "thin" | "medium" | "thick" | "dotted" | "dashed" | "double" | "hair"

    type Border = {
      style: BorderStyle
      color?: Argb
    }

    type Borders = {
      top: Border
      left: Border
      bottom: Border
      right: Border
    }

    type Font = {
      name: string
      size: number
      bold: boolean
      italic: boolean
      underline: boolean
      color: Argb
    }

    type FillPattern = {
      type: "pattern"
      pattern: "solid"
      fgColor?: Argb
      bgColor?: Argb
    }

    type Alignment = {
      vertical?: "top" | "middle" | "bottom"
      horizontal?: "left" | "center" | "right"
      wrapText?: boolean
    }

    type CellHyperlinkValue = {
      text: string
      hyperlink: string
    }

    type CellValue = string | number | boolean | Date | CellHyperlinkValue | null | undefined

    type AutoFilterRef = {
      from: { row: number; column: number }
      to: { row: number; column: number }
    }

    type Cell = {
      value: CellValue
      font: Partial<Font>
      fill: FillPattern
      border: Partial<Borders>
      alignment: Partial<Alignment>
    }

    type Row = {
      readonly number: number
      getCell(index: number | string): Cell
      eachCell(callback: (cell: Cell, colNumber: number) => void): void
    }

    type Column = {
      width: number
    }

    type Worksheet = {
      autoFilter: AutoFilterRef | string
      addRow(values?: CellValue[]): Row
      getRow(index: number): Row
      getColumn(index: number | string): Column
    }

    class Workbook {
      creator: string
      created: Date

      readonly xlsx: {
        writeFile(path: string): Promise<void>
        readFile(path: string): Promise<Workbook>
      }

      addWorksheet(name?: string): Worksheet
      getWorksheet(name: string | number): Worksheet | undefined
    }
  }

  export default ExcelJS
}
