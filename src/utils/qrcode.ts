import { QRCodeRenderersOptions } from 'qrcode';

export const createQrCodeOnCanvas = async (text: string, canvasEl: HTMLCanvasElement, options: QRCodeRenderersOptions = {}) => {
    const QrCode = await import('qrcode');
    QrCode.toCanvas(canvasEl, text, options, (err) => { throw err })
}