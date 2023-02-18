import { randomVideoStream } from "./random";

export const asyncGetUserMedia = navigator.mediaDevices?.getUserMedia ||
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia

export const userMediaAvailable = Boolean(asyncGetUserMedia)

export const displayMediaAvailable = Boolean(navigator.mediaDevices.getDisplayMedia)

export const stopMediaStream = (stream: MediaStream) => {
    stream.getTracks().forEach(track => track.stop())
}

export enum VideoSource {
    Facial = 'facial',
    Env = 'env',
    Display = 'display'
}

const getStream = (getter: () => Promise<MediaStream>) => {
    let stream: MediaStream | undefined;
    return async <T extends boolean = true>(create: T = true as any): Promise<T extends true ? MediaStream : (MediaStream | undefined)> => {
        console.log('get bstream')
        if (stream && stream.active) return stream;
        if (!create) return stream as any;
        try {
            stream = await getter()
        } catch (error) {
            stream = new MediaStream()
        }
        // stream = randomVideoStream()
        // const el = document.createElement('video')
        // el.srcObject = stream;
        // document.body.appendChild(el)
        // console.log('append video')
        return stream
    }
}

export const createUserMedia = async (videoSource?: VideoSource, mute = false) => {

    const getMicrophoneStream = getStream(() => asyncGetUserMedia({ video: false, audio: true }))

    const getFacialCameraStream = getStream(() => asyncGetUserMedia({ video: { facingMode: 'user' }, audio: false, }));

    const getEnvironmentCameraStream = getStream(() => asyncGetUserMedia({ video: { facingMode: 'environment' }, audio: false, }));

    const getDisplayStream = getStream(() => navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }))

    // const getScreenVideoStream = getStream(() => navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }))

    // const getScreenAudioStream = getStream(() => navigator.mediaDevices.getDisplayMedia({ video: false, audio: true }))

    const baseStream = new MediaStream();
    const record = {
        audio: undefined as MediaStream | undefined,
        video: undefined as MediaStream | undefined
    }

    const switchVideoSource = async (source: VideoSource | undefined) => {
        const clearVideoTrack = () => record.video?.getTracks().forEach(t => { baseStream.removeTrack(t); t.stop() }, record.video = undefined)
        const setVideoTrack = (stream: MediaStream) => { record.video = stream; stream.getTracks().forEach(t => baseStream.addTrack(t)) }
        clearVideoTrack()
        if (!source) {
            return
        }
        switch (source) {
            case VideoSource.Env:
                setVideoTrack(await getEnvironmentCameraStream(true))
                return;
            case VideoSource.Facial:
                setVideoTrack(await getFacialCameraStream(true))
                return;
            case VideoSource.Display:
                setVideoTrack(await getDisplayStream(true))
                return;
            default:
                break;
        }
    }

    const addAudioSource = async () => {
        if (record.audio) return
        record.audio = await getMicrophoneStream(true)
        record.audio.getTracks().forEach(t => baseStream.addTrack(t))
    }

    const removeAudioSource = () => {
        if (!record.audio) return
        record.audio.getTracks().forEach(t => baseStream.removeTrack(t))
        record.audio = undefined
    }
    const switchAudioSource = (mute: boolean) => {
        if (!mute) {
            return addAudioSource()
        } else {
            return removeAudioSource()
        }
    }

    await switchVideoSource(videoSource)
    await switchAudioSource(mute)

    return {
        stream: baseStream,
        switchVideo: switchVideoSource,
        switchAudio: switchAudioSource
    }
}
export type UserMediaMixer = Awaited<ReturnType<typeof createUserMedia>>