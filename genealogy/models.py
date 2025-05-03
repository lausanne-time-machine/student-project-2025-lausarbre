from typing import TypedDict


class GenealogyNode(TypedDict):
    id: int
    is_husband: bool
    children: list["GenealogyNode"]
    leaf_children: list[str]


class TrackingChainRecord(TypedDict):
    frame_idx: int
    record_idx: int


TrackingChain = list[TrackingChainRecord]
