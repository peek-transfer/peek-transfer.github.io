import { VNode } from "vue"

type StringContent = { content: string }
type HtmlContent = { contentHtml: string }
type NodeContent = { contentNode: VNode }

export type Content = StringContent | HtmlContent | NodeContent

export type ContentProp = Partial<StringContent & HtmlContent & NodeContent>