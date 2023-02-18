export enum FileType {
    Image,
    Video,
    Audio,
    File,
    Other
}

const getFileTypeByAttribute = (type: string) => {
    if (type.startsWith('image/')) return FileType.Image
    if (type.startsWith('audio/')) return FileType.Audio
    if (type.startsWith('video/')) return FileType.Video
    return FileType.File
}

const IMAGE_ACCEPT = "image/*"
const VIDEO_ACCEPT = 'video/*'
// const AUDIO_SUFFIXES=''


export const gteFileType = (file: File) => getFileTypeByAttribute(file.type)

type FileChooseOption<multiple = false> = {
    // accept?: string;
    maxSize?: number;
    minSize?: number;
    multiple?: multiple;
    onChange?: (file: multiple extends true ? File[] : File) => void
}

export const createFileHandler = <T extends boolean = false>(option?: FileChooseOption<T>) => {

    const createEl = (accept: string, multiple = false) => {
        const picker = document.createElement('input')
        picker.type = 'file'
        picker.accept = accept
        picker.multiple = multiple
        picker.style.display = 'none'
        return picker
    }


    const showFilePicker = (accept = '*') => {
        const picker = createEl(accept, option?.multiple)
        return new Promise((res, rej) => {
            picker.addEventListener('change', () => {
                const files = picker.files;
                if (files && files.length > 0) {
                    const result = option?.multiple ? Array.from(files) : files.item(0)!
                    res(result)
                    option?.onChange?.(result as any)
                }
            }, { once: true });
            picker.addEventListener('error', rej, { once: true })
            picker.click()
        })
    }
    const handleFileDrop = (evt: DragEvent) => {
        const files = evt.dataTransfer!.files
        const result = option?.multiple ? Array.from(files) : files.item(0)
        option?.onChange?.(result as any)

    }

    const showThumbPicker = () => showFilePicker([IMAGE_ACCEPT, VIDEO_ACCEPT].join(','))

    return {
        showFilePicker, showImagePicker: showThumbPicker, handleFileDrop
    }
}


