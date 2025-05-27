export type ID = number

export type RawElement = string | number | string[]

export type RawRecord = Record<string, RawElement[]>
export type RawDataframes = RawRecord[]

export interface GenealogyNode {
    id: ID,
    is_husband: boolean,
    children: GenealogyNode[],
    leaf_children: string[]
}

export type GenealogyData = GenealogyNode[]

export interface TrackingChainNode {
    frame_idx: number
    record_idx: number
}

export type RawTrackingChain = Record<ID, TrackingChainNode[]>

export type RRecord = Map<string, RawElement[]>
export type Dataframes = RRecord[]

export type TrackingChain = Map<ID, TrackingChainNode[]>

export interface FeatureValue {
    feature: string,
    value: string
}

export type TrackerIDMemory = Map<ID, RawElement[]>

export interface DisplayPeopleProps {
    data: TrackerIDMemory | null
    searching: boolean
}

export interface GenealogyTreeProps {
    id: ID
}

export interface OnePersonInfoProps {
    id: ID
}

export interface TopBarProps {
    title: string
}
