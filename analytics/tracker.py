from abc import ABC, abstractmethod
import pandas as pd
import numpy as np

from .scorer import Scorer, BasicScorer


class Tracker(ABC):

    def __init__(
        self, columns: list[str], scorers: list[Scorer], baseline_record: list
    ) -> None:
        self.columns = columns
        self.scorers = scorers
        self.baseline = baseline_record
        self.record_history = []

        for scorer, baseline_value in zip(self.scorers, baseline_record):
            scorer.set_baseline(baseline_value)

    @abstractmethod
    def compute_record_score(self, values: list) -> float:
        """"""

    def process_df(self, df: pd.DataFrame) -> pd.DataFrame:
        scores = self._process_scores(df)
        global_scores = scores.apply(self.compute_record_score, axis=1)
        scores.rename(
            columns={col: f"score_{col}" for col in self.columns}, inplace=True
        )
        scores["global_scores"] = global_scores
        return scores

    def _process_scores(self, df: pd.DataFrame) -> pd.DataFrame:
        scores_series = []
        for column, scorer in zip(self.columns, self.scorers):
            serie = df[column].apply(scorer.score)
            scores_series.append(serie)

        return pd.DataFrame(scores_series, self.columns).transpose()


class BasicTracker(Tracker):

    def __init__(self, columns: list[str], baseline: list) -> None:
        super().__init__(
            columns,
            baseline=baseline,
            scorers=[BasicScorer() for _ in columns],
        )

    def compute_record_score(self, values: list) -> float:
        return np.mean(values)
