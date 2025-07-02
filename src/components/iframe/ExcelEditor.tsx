// src/components/iframe/ExcelEditor.tsx
import React, {useEffect, useState} from 'react'
import Spreadsheet, {CellBase, Matrix} from 'react-spreadsheet'
import Button from '../buttons/Button'

export interface ExcelEditorProps {
    data: any[][]
    onSave: (modifiedData: any[][]) => void
    isSaving?: boolean
}

const ExcelEditor: React.FC<ExcelEditorProps> = ({ data, onSave, isSaving = false }) => {
    const toGrid = (arr: any[][]): Matrix<CellBase<any>> =>
        arr.map(row => row.map(cell => ({ value: cell })))

    const [gridData, setGridData] = useState<Matrix<CellBase<any>>>(toGrid(data))

    useEffect(() => {
        setGridData(toGrid(data))
    }, [data])

    const handleChange = (newGrid: Matrix<CellBase<any>>) => {
        setGridData(newGrid)
    }

    const handleSave = () => {
        const raw = gridData.map(row =>
            row.map(cell => (cell?.value ?? ''))
        )
        onSave(raw)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto border rounded-md p-2">
                <Spreadsheet data={gridData} onChange={handleChange} />
            </div>
            <div className="sticky bottom-0 p-4 flex justify-end border-t bg-background">
                <Button
                    text={isSaving ? 'Saving...' : 'Save Changes'}
                    onClick={handleSave}
                    isSubmitting={isSaving}
                />
            </div>
        </div>
    )
}

export default ExcelEditor
