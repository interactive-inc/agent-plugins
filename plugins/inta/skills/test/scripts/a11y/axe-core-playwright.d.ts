declare module "@axe-core/playwright" {
  import type { Page } from "playwright"

  type ImpactValue = "minor" | "moderate" | "serious" | "critical"

  export type NodeResult = {
    readonly html: string
    readonly target: string[]
    readonly failureSummary?: string
  }

  export type Result = {
    readonly id: string
    readonly impact?: ImpactValue
    readonly description: string
    readonly help: string
    readonly helpUrl: string
    readonly tags: string[]
    readonly nodes: NodeResult[]
  }

  export type AxeResults = {
    readonly violations: Result[]
    readonly passes: Result[]
    readonly incomplete: Result[]
    readonly inapplicable: Result[]
  }

  type AxeBuilderOptions = {
    page: Page
  }

  export default class AxeBuilder {
    constructor(options: AxeBuilderOptions)

    withTags(tags: string | string[]): AxeBuilder
    include(selector: string): AxeBuilder
    exclude(selector: string): AxeBuilder
    analyze(): Promise<AxeResults>
  }
}
