from pydantic import BaseModel


class TrackingHistoryConfig(BaseModel):
    max_num_value_to_score: int
    """
    The maximum number of history values against which a value can be
    scored.
    """


class TrackingConfig(BaseModel):
    threshold_mismatch: float
    """
    Threshold on score, a value whose score is below the threshold is
    considered a mismatch.
    """

    history: TrackingHistoryConfig
