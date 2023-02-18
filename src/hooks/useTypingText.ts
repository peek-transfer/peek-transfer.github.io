import { getCurrentInstance, onBeforeUnmount, ref } from "vue"

const createSleeper = () => {
    let _rej: () => void
    const sleep = (ms: number) => new Promise<void>((res, rej) => {
        _rej = rej
        setTimeout(() => {
            res()
        }, ms)
    })
    const stop = () => {
        _rej?.()
    }
    return {
        sleep, stop
    }
}
export type TypingOption = {
    splitter?: (text: string) => string[],
    charGapTime?: number,
    lineGapTime?: number,
    replayGapTime?: number
}
export const useTypingText = (paragraph: string[], option?: TypingOption) => {
    const actText = ref('')
    const { splitter, charGapTime, lineGapTime, replayGapTime }: Required<TypingOption> = {
        ...{
            splitter: (str) => str.split(''),
            charGapTime: 500,
            lineGapTime: 1000,
            replayGapTime: 2000
        }, ...option
    }

    const { sleep, stop: wake } = createSleeper()
    const run = async () => {
        for await (const line of paragraph) {
            let last = ''
            for await (const { char, index } of splitter(line).map((char, index) => ({ char, index }))) {
                actText.value = `${last}${char}`
                await sleep(charGapTime)
                last = actText.value
            }
            await sleep(lineGapTime)
        }
        await sleep(replayGapTime)
        start()
    }

    const start = () => {
        run().catch(() => {
        })
    }




    const stop = () => {
        wake()
        actText.value = ''
    }
    if (getCurrentInstance()) {
        onBeforeUnmount(() => {
            stop()
        })
    }
    return {
        actText,
        stop,
        start,
    }
}