"use client"

import * as React from "react"
import Image from "next/image"
import type { SetState } from "@/types"
import { UploadCloud } from "lucide-react"
import {
  useDropzone,
  type Accept,
  type ErrorCode,
  type FileRejection,
} from "react-dropzone"
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form"
import { toast } from "react-hot-toast"
import { twMerge } from "tailwind-merge"

import { Progress } from "@/components/ui/progress"

interface FileInputProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
  name: Path<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  accept?: Accept
  maxSize: number
  maxFiles?: number
  selectedFile: File | null
  setSelectedFile: SetState<File | null>
  cropData?: string | null
  setCropData?: SetState<string | null>
  previewType?: "image" | "name"
  isUploading?: boolean
  disabled?: boolean
}

const FileInput = <TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/png": [],
    "image/jpeg": [],
  },
  maxSize,
  maxFiles = 1,
  selectedFile,
  setSelectedFile,
  cropData,
  setCropData,
  previewType = "image",
  isUploading = false,
  disabled = false,
  className,
  ...props
}: FileInputProps<TFieldValues>) => {
  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        if (!file) return
        setValue(name, file as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
        })
        setCropData?.(null)
        setSelectedFile(file)
      })
      rejectedFiles.forEach((file) => {
        setValue(name, null as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
        })
        setSelectedFile(null)
        switch (file.errors[0]?.code as ErrorCode) {
          case "file-invalid-type":
            toast.error("File type not supported")
            break
          case "file-too-large":
            const size = (file.file.size / 1024 / 1024).toFixed(2)
            toast.error(
              `Please select a file smaller than ${
                maxSize / 1024 / 1024
              }MB. Current size: ${size}MB`
            )
            break
          case "too-many-files":
            toast.error("Please select only one file")
            break
          default:
            toast.error(file.errors[0]?.message ?? "Error uploading file")
            break
        }
      })
    },
    [maxSize, name, setCropData, setSelectedFile, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  })

  // mock progress bar
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    if (!isUploading) return
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 400)
    return () => clearInterval(interval)
  }, [isUploading])

  // revoke object URL when component unmounts
  React.useEffect(() => {
    if (!selectedFile) return
    return () => URL.revokeObjectURL(selectedFile.name)
  }, [selectedFile])

  return (
    <div
      {...getRootProps()}
      className={twMerge(
        "group relative grid h-60 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition hover:bg-slate-200/25 dark:hover:bg-slate-700/25 ",
        "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
        isDragActive
          ? "border-slate-900 dark:border-slate-400"
          : "border-slate-500",
        selectedFile && previewType === "image"
          ? "h-full border-none p-0"
          : "h-60",
        disabled
          ? "pointer-events-none opacity-60"
          : "pointer-events-auto opacity-100",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="group grid w-full place-items-center gap-1 sm:px-10">
          <UploadCloud
            className="h-10 w-10 animate-pulse text-slate-700 dark:text-slate-400"
            aria-hidden="true"
          />
          <p className="line-clamp-2 text-sm text-slate-950 dark:text-slate-50">
            {selectedFile ? selectedFile.name : "Uploading file..."}
          </p>
          <Progress className="mt-5 w-full" value={progress} />
        </div>
      ) : selectedFile ? (
        previewType === "image" ? (
          <div className="group relative aspect-square h-full max-h-[420px] w-full overflow-hidden rounded-lg">
            {isDragActive ? (
              <div className="absolute inset-0 grid h-full w-full place-items-center bg-slate-950/70">
                <DragActive isDragActive={isDragActive} />
              </div>
            ) : null}
            <Image
              src={cropData ? cropData : URL.createObjectURL(selectedFile)}
              alt={selectedFile.name ?? "preview"}
              fill
              className="absolute inset-0 -z-10 rounded-lg object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full rounded-lg">
            {isDragActive ? (
              <DragActive isDragActive={isDragActive} />
            ) : (
              <p className="line-clamp-3 text-base font-medium text-slate-950 dark:text-slate-50 sm:text-lg">
                {selectedFile.name}
              </p>
            )}
          </div>
        )
      ) : isDragActive ? (
        <DragActive isDragActive={isDragActive} />
      ) : (
        <div className="grid place-items-center gap-1 sm:px-10">
          <UploadCloud
            className="h-10 w-10 text-slate-700 dark:text-slate-400"
            aria-hidden="true"
          />
          <p className="mt-2 text-base font-medium text-slate-700 dark:text-slate-400 sm:text-lg">
            Drag {`'n'`} drop file here, or click to select file
          </p>
          <p className="text-sm text-slate-500 sm:text-base">
            Please upload file with size less than{" "}
            {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      )}
    </div>
  )
}

export default FileInput

const DragActive = ({ isDragActive }: { isDragActive: boolean }) => {
  return (
    <div className="grid place-items-center gap-2 text-slate-700 dark:text-slate-400 sm:px-10">
      <UploadCloud
        className={twMerge("h-10 w-10", isDragActive ? "animate-bounce" : "")}
        aria-hidden="true"
      />
      <p className="text-base font-medium sm:text-lg">Drop the file here</p>
    </div>
  )
}
