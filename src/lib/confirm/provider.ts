import { nextTick } from "vue"
import type { Content } from "../content";
import { Binding, createProvider } from "../overlay"


export type Selections<V = any> = (readonly string[]) | (readonly { label: string, value: V, entering?: () => Promise<any> }[])


export type ConfirmOption<V extends any = any, CustomSelections extends Selections<V> = string[]> = {
    customClass?: string;
    customContentClass?: string;
    selections?: CustomSelections;
    showClose?: boolean
    modalClose?: boolean
} & Content

export type ConfirmProps = ConfirmOption<any, any> & { onSelect: (selection: any) => void }

export type ConfirmVueProps = {
    customClass?: string;
    customContentClass?: string;
    selections?: any[];
    showClose?: boolean
    modalClose?: boolean
    onSelect: (selection: any) => void

}


export const UNSELECT_CLOSE = Symbol('UNSELECT_CLOSE')


export const useConfirmProvider = () => {
    const { bindings, push, remove } = createProvider<ConfirmOption>()

    const closeConfirm = (id: number, selection: any) => {
        const index = bindings.value.findIndex(c => c.key === id)
        if (index == -1) return
        nextTick(() => {
            remove(id)
        })
    }

    const showConfirm = <V extends any = any, CustomSelections extends Selections<V> = string[]>(option: ConfirmOption<V, CustomSelections>) => {

        return new Promise<CustomSelections[number] extends object ? CustomSelections[number]['value'] : CustomSelections[number]>((res, rej) => {
            const mergedOption: ConfirmProps = {
                ...{ selections: ['Cancel', 'Ok'] }, ...option, onSelect: (select) => {
                    if (select === UNSELECT_CLOSE) {
                        rej('confirm closed without selection')
                    }
                    else if (select !== undefined) {
                        res(select)
                    }
                    closeConfirm(cId, select)
                    return
                }
            }
            const cId = push(mergedOption as any)
        })
    }

    return { bindings: bindings as unknown as Binding<Required<ConfirmProps>>[], showConfirm }
}