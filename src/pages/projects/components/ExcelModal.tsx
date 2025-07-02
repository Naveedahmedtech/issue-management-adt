// src/components/modal/ExcelModal.tsx
import React, {useEffect, useState} from 'react'
import * as XLSX from 'xlsx'
import {useTheme} from '../../../context/ThemeContext'
import {useUpdateFileMutation} from '../../../redux/features/projectsApi'
import {BASE_URL} from '../../../constant/BASE_URL'
import {DocumentDataRow} from '../../../types/types'
import LargeModal from '../../../components/modal/LargeModal'
import {toast} from 'react-toastify'
import ExcelEditor from '../../../components/iframe/ExcelEditor'

interface ExcelModalProps {
    selectedFile?: DocumentDataRow | null
    projectId?: string
    refetch?: () => void
    isModalOpen: boolean
    setIsModalOpen: (isOpen: boolean) => void
}

const ExcelModal: React.FC<ExcelModalProps> = ({
                                                   isModalOpen,
                                                   setIsModalOpen,
                                                   selectedFile,
                                                   projectId,
                                                   refetch
                                               }) => {
    const [excelData, setExcelData] = useState<any[][] | null>(null)
    const [loading, setLoading] = useState(false)
    const { theme } = useTheme()
    const [updateFile, { isLoading: isSaving }] = useUpdateFileMutation()

    useEffect(() => {
        if (!selectedFile?.filePath) {
            setExcelData(null)
            setLoading(false)
            setIsModalOpen(false)
            return
        }
        setExcelData(null)
        setLoading(true)
        fetch(`${BASE_URL}/${selectedFile.filePath}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.blob()
            })
            .then(blob => blob.arrayBuffer())
            .then(buffer => {
                const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' })
                const sheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 })
                setExcelData(jsonData)
                setIsModalOpen(true)
            })
            .catch(err => {
                console.error(err)
                toast.error('Failed to load the Excel file.')
                setIsModalOpen(false)
            })
            .finally(() => setLoading(false))
    }, [selectedFile])

    const saveExcelFile = async (modifiedData: any[][]) => {
        if (!selectedFile?.id) return
        try {
            const worksheet = XLSX.utils.aoa_to_sheet(modifiedData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
            const array = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
            const blob = new Blob([array], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            const formData = new FormData()
            formData.append('files', blob, selectedFile.fileName)
            if (selectedFile.type === 'issueFile' && selectedFile.issue?.id) {
                formData.append('issueId', selectedFile.issue.id)
            } else if (projectId) {
                formData.append('projectId', projectId)
            } else {
                throw new Error('Invalid target ID')
            }
            await updateFile({ fileId: selectedFile.id, formData }).unwrap()
            refetch?.()
            toast.success('Changes saved successfully!')
            setIsModalOpen(false)
        } catch {
            toast.error('Failed to save the file.')
        }
    }

    return (
        <LargeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Excel Viewer">
            <div className="h-[80vh] flex flex-col">
                {loading ? (
                    <div className="flex justify-center p-4 text-primary">Loading...</div>
                ) : excelData ? (
                    <ExcelEditor data={excelData} onSave={saveExcelFile} isSaving={isSaving} />
                ) : (
                    <div className="p-4 text-center text-textLight">No data to display.</div>
                )}
            </div>
        </LargeModal>
    )
}

export default ExcelModal
