import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate'
import SSF from 'ssf'
import { useUpdateFileMutation } from '../../../redux/features/projectsApi'
import { BASE_URL } from '../../../constant/BASE_URL'
import LargeModal from '../../../components/modal/LargeModal'
import { DocumentDataRow } from '../../../types/types'
import { toast } from 'react-toastify'
import ExcelEditor from '../../../components/iframe/ExcelEditor'

type CellType = 's' | 'n' | 'b' | 'd' | 'z'
export interface CellModel {
  r: number; c: number
  v?: any; f?: string | null; t?: CellType; z?: string | null; w?: string | null
  readOnly?: boolean
}
export interface SheetModel {
  name: string; rows: number; cols: number
  cells: CellModel[][]
  merges: Array<{ s: { r: number, c: number }, e: { r: number, c: number } }>
  colWidths?: number[]; rowHeights?: number[]; hiddenCols?: boolean[]; hiddenRows?: boolean[]
  protected?: boolean
}
type WorkbookState = { buf: ArrayBuffer; sheetjs: XLSX.WorkBook; xpop: any; sheets: SheetModel[] }

const isDateLike = (v: any) => v instanceof Date || (typeof v === 'string' && !isNaN(Date.parse(v)))
const coerceType = (raw: any): { t: CellType, v: any } => {
  if (raw === '' || raw == null) return { t: 'z', v: null }
  if (raw === true || raw === false) return { t: 'b', v: !!raw }
  if (raw instanceof Date) return { t: 'd', v: raw }
  if (typeof raw === 'number' && isFinite(raw)) return { t: 'n', v: raw }
  if (typeof raw === 'string' && raw.trim() && !isNaN(Number(raw))) return { t: 'n', v: Number(raw) }
  if (typeof raw === 'string' && isDateLike(raw)) return { t: 'd', v: new Date(raw) }
  return { t: 's', v: String(raw) }
}
const formatDisplay = (val: any, z?: string | null, w?: string | null) => {
  if (w != null) return w
  if (val == null) return ''
  if (!z) return String(val)
  try {
    if (val instanceof Date) {
      const epoch = new Date(Date.UTC(1899, 11, 30))
      const serial = (val.getTime() - epoch.getTime()) / (86400000)
      return SSF.format(z, serial)
    }
    return SSF.format(z, val)
  } catch { return String(val) }
}
const buildSheetModel = (wb: XLSX.WorkBook, sheetName: string): SheetModel => {
  const ws = wb.Sheets[sheetName]
  const ref = ws['!ref'] || 'A1:A1'
  const range = XLSX.utils.decode_range(ref)
  const rows = Math.max(range.e.r - range.s.r + 1, 1)
  const cols = Math.max(range.e.c - range.s.c + 1, 1)
  const merges = (ws['!merges'] || []) as any[]
  const rawCols = (ws['!cols'] || []) as any[]
  const rawRows = (ws['!rows'] || []) as any[]
  const colWidths = Array.from({ length: cols }, (_, i) => rawCols[i]?.wpx ?? undefined)
  const rowHeights = Array.from({ length: rows }, (_, i) => rawRows[i]?.hpx ?? undefined)
  const hiddenCols = Array.from({ length: cols }, (_, i) => !!rawCols[i]?.hidden)
  const hiddenRows = Array.from({ length: rows }, (_, i) => !!rawRows[i]?.hidden)

  const cells: CellModel[][] = []
  for (let r = 0; r < rows; r++) {
    const row: CellModel[] = []
    for (let c = 0; c < cols; c++) {
      const rr = r + range.s.r, cc = c + range.s.c
      const addr = XLSX.utils.encode_cell({ r: rr, c: cc })
      const cell: XLSX.CellObject | undefined = (ws as any)[addr]
      row.push({ r, c, v: cell?.v, f: (cell as any)?.f ?? null, t: (cell as any)?.t as CellType, z: (cell as any)?.z ?? null, w: (cell as any)?.w ?? null, readOnly: false })
    }
    cells.push(row)
  }
  for (const m of merges) {
    const rs = m.s.r - range.s.r, cs = m.s.c - range.s.c, re = m.e.r - range.s.r, ce = m.e.c - range.s.c
    for (let r = rs; r <= re; r++) for (let c = cs; c <= ce; c++) if (!(r === rs && c === cs)) cells[r]?.[c] && (cells[r][c].readOnly = true)
  }
  return {
    name: sheetName, rows, cols, cells,
    merges: merges.map(m => ({ s: { r: m.s.r - range.s.r, c: m.s.c - range.s.c }, e: { r: m.e.r - range.s.r, c: m.e.c - range.s.c } })),
    colWidths, rowHeights, hiddenCols, hiddenRows, protected: false
  }
}

interface ExcelModalProps { selectedFile?: DocumentDataRow | null; projectId?: string; refetch?: () => void; isModalOpen: boolean; setIsModalOpen: (isOpen: boolean) => void }

const ExcelModal: React.FC<ExcelModalProps> = ({ isModalOpen, setIsModalOpen, selectedFile, projectId, refetch }) => {
  const [state, setState] = useState<WorkbookState | null>(null)
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [updateFile] = useUpdateFileMutation()

  useEffect(() => {
    const load = async () => {
      setError(null); setState(null); setDirty(false)
      if (!selectedFile?.filePath) { setIsModalOpen(false); return }
      setLoading(true)
      try {
        const res = await fetch(`${BASE_URL}/${selectedFile.filePath}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const buf = await res.arrayBuffer()
        try { XLSX.read(buf, { type: 'array' }) } catch { throw new Error('This workbook appears to be password-protected or corrupted.') }
        const sheetjs = XLSX.read(buf, { type: 'array', cellDates: true, cellNF: true, cellStyles: true })
        const xpop = await XlsxPopulate.fromDataAsync(buf)
        const sheets = sheetjs.SheetNames.map(n => buildSheetModel(sheetjs, n))
        setState({ buf, sheetjs, xpop, sheets }); setIsModalOpen(true)
      } catch (e: any) {
        console.error(e); setError(e?.message || 'Failed to load the Excel file.'); toast.error(e?.message || 'Failed to load the Excel file.'); setIsModalOpen(false)
      } finally { setLoading(false) }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile])

  const activeSheet = useMemo(() => state?.sheets[active], [state, active])

  const onEditCell = useCallback((r: number, c: number, input: string | number | boolean | Date) => {
    if (!state) return
    const sheets = state.sheets.map(s => ({ ...s, cells: s.cells.map(row => row.map(cell => ({ ...cell }))) }))
    const sh = sheets[active]; const cell = sh.cells[r][c]
    if (cell.readOnly || sh.protected) return
    cell.f = null // overwrite formulas with literal values (we hide formulas)
    const { t, v } = coerceType(input); cell.t = t; cell.v = v; cell.w = null
    setState(prev => prev ? ({ ...prev, sheets }) : prev); setDirty(true)
  }, [state, active])

  const onSave = useCallback(async () => {
    if (!state || !selectedFile?.id) return
    setSaving(true)
    try {
      for (const sh of state.sheets) {
        const ws = state.xpop.sheet(sh.name)
        for (let r = 0; r < sh.rows; r++) for (let c = 0; c < sh.cols; c++) {
          const cell = sh.cells[r][c]; const xp = ws.cell(r + 1, c + 1)
          if (cell.f) xp.formula(cell.f)
          else if (cell.t === 'd' && cell.v instanceof Date) xp.value(cell.v)
          else xp.value(cell.v == null ? null : cell.v)
        }
      }
      const blob: Blob = await state.xpop.outputAsync({ type: 'blob' })
      const formData = new FormData()
      formData.append('files', blob, selectedFile.fileName)
      if (selectedFile.type === 'issueFile' && selectedFile.issue?.id) formData.append('issueId', selectedFile.issue.id)
      else if (projectId) formData.append('projectId', projectId)
      else throw new Error('Invalid target ID')
      // @ts-ignore
      await (updateFile as any)({ fileId: selectedFile.id, formData }).unwrap()
      toast.success('Changes saved successfully!'); setDirty(false); setIsModalOpen(false); refetch?.()
    } catch (e: any) { console.error(e); toast.error(e?.message || 'Failed to save the file.') }
    finally { setSaving(false) }
  }, [state, selectedFile?.id, projectId, refetch, setIsModalOpen, updateFile])

  const sheetTabs = useMemo(() => state?.sheets.map(s => s.name) ?? [], [state])
  const view = useMemo(() => {
    if (!activeSheet) return null
    const rows: (string | number | boolean | Date)[][] = []
    for (let r = 0; r < activeSheet.rows; r++) {
      const row: any[] = []
      for (let c = 0; c < activeSheet.cols; c++) {
        const cell = activeSheet.cells[r][c]
        row.push(formatDisplay(cell.v, cell.z, cell.w))
      }
      rows.push(row)
    }
    return { rows, meta: activeSheet }
  }, [activeSheet])

  return (
    <LargeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Excel Viewer${dirty ? ' • (unsaved)' : ''}`}>
      <div className="h-[80vh] flex flex-col gap-2">
        {loading && <div className="flex justify-center p-4 text-primary">Loading…</div>}
        {error && <div className="p-4 text-red-600">{error}</div>}
        {!loading && !error && !state && <div className="p-4 text-center text-textLight">No data to display.</div>}
        {state && view && (
          <>
            <div className="flex flex-wrap gap-2 px-2">
              {sheetTabs.map((n, i) => (
                <button key={n} onClick={() => setActive(i)} 
                // className={`px-3 py-1 rounded-md border ${i === active ? 'bg-primary text-white' : 'bg-background'}`}
                className={`mt-3 px-3 py-1 rounded-md border font-semibold ${i === active ? 'bg-primary text-white' : 'border-primary text-textDark'}`}
                >{n}</button>
              ))}
            </div>
            <div className="flex-1 min-h-0">
              <ExcelEditor sheet={view.meta} data={view.rows} onEditCell={onEditCell} onSave={onSave} isSaving={saving} />
            </div>
          </>
        )}
      </div>
    </LargeModal>
  )
}

export default ExcelModal
