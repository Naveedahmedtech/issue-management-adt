import React, { useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  ColDef,
  CellValueChangedEvent,
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule,
} from 'ag-grid-community'

// Register AG Grid Community features (v34+ requires this)
ModuleRegistry.registerModules([AllCommunityModule])

// Theme CSS — import here or once in your app entry
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import Button from '../buttons/Button'

// Local shapes (avoid circular imports)
export interface CellModel {
  r: number; c: number
  v?: any
  f?: string | null
  t?: 's' | 'n' | 'b' | 'd' | 'z'
  z?: string | null
  w?: string | null
  readOnly?: boolean
}
export interface SheetModel {
  name: string
  rows: number
  cols: number
  cells: CellModel[][]
  merges: Array<{ s: { r: number, c: number }, e: { r: number, c: number } }>
  colWidths?: number[]
  rowHeights?: number[]
  hiddenCols?: boolean[]
  hiddenRows?: boolean[]
  protected?: boolean
}

type CellInput = string | number | boolean | Date

export interface ExcelEditorProps {
  sheet: SheetModel
  data: any[][]                    // formatted display values
  onEditCell: (r: number, c: number, value: CellInput) => void
  onSave: () => void
  isSaving?: boolean
}

const defaultColDef: ColDef = {
  sortable: false,
  filter: false,
  resizable: true,
  headerClass: 'ag-bold-header'
}

const ExcelEditor: React.FC<ExcelEditorProps> = ({ sheet, data, onEditCell, onSave, isSaving }) => {
  const gridRef = useRef<AgGridReact>(null)

  const rowData = useMemo(() => {
    const rows: Record<string, any>[] = []
    const rCount = Math.max(1, sheet.rows)
    const cCount = Math.max(1, sheet.cols)
    for (let r = 0; r < rCount; r++) {
      const obj: Record<string, any> = {}
      for (let c = 0; c < cCount; c++) obj[`C${c}`] = data?.[r]?.[c] ?? ''
      rows.push(obj)
    }
    return rows
  }, [data, sheet.rows, sheet.cols])

  const columnDefs: ColDef[] = useMemo(() => {
    const defs: ColDef[] = []
    const cCount = Math.max(1, sheet.cols)
    for (let c = 0; c < cCount; c++) {
      const field = `C${c}`
      defs.push({
        headerName: colName(c),
        field,
        editable: params => {
          const r = params.node.rowIndex ?? 0
          const ro = sheet.protected || !!sheet.cells[r]?.[c]?.readOnly
          return !ro
        },
        width: Math.max(60, sheet.colWidths?.[c] ?? 120),
        resizable: true
      })
    }
    return defs
  }, [sheet])

  const defaultColDef: ColDef = useMemo(() => ({
    sortable: false,
    filter: false,
    resizable: true
  }), [])

  const onGridReady = (e: GridReadyEvent) => {
    setTimeout(() => e.api.sizeColumnsToFit(), 0)
  }

  const onCellValueChanged = (e: CellValueChangedEvent) => {
    const r = e.node.rowIndex ?? 0
    const field = e.colDef.field as string // "C0"
    const c = Number(field.slice(1))
    onEditCell(r, c, e.newValue as CellInput)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            headerHeight={34}
            rowHeight={32}
            singleClickEdit={true}
            suppressClickEdit={false}
            stopEditingWhenCellsLoseFocus={true}
            ensureDomOrder={true}
            onGridReady={onGridReady}
            onFirstDataRendered={params => params.api.sizeColumnsToFit()}
            onCellValueChanged={onCellValueChanged}
            overlayNoRowsTemplate="<span style='padding:8px;display:block'>No rows</span>"
            theme="legacy"
          />
        </div>
      </div>

      <div className="sticky bottom-0 p-4 flex justify-end border-t gap-2">
        {sheet.protected && <div className="text-xs text-amber-600 mr-auto">Sheet is protected (read-only)</div>}
        <Button text={isSaving ? 'Saving…' : 'Save Changes'} onClick={onSave} isSubmitting={!!isSaving} />
      </div>
    </div>
  )
}

export default ExcelEditor

function colName(c: number) {
  let s = '', n = c + 1
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m) / 26 | 0 }
  return s
}
