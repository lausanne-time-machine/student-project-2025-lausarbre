from abc import ABC, abstractmethod
import pandas as pd
import numpy as np

from analytics.config import TrackingConfig

from ..scorer import Scorer, BasicScorer, MinChangesScorer


Record = list
"""
Represents a line in a dataframe
"""


class Tracker(ABC):

    def __init__(
        self,
        config: TrackingConfig,
        columns: list[str],
        scorers: list[Scorer],
        baseline_record: Record,
    ) -> None:
        self._config = config
        self.columns = columns
        self.scorers = scorers
        self.baseline_record = baseline_record

    @abstractmethod
    def compute_record_score(self, scores: list[float]) -> float:
        """
        Computes the overall score of a record given the score of each column
        """

    def select_record(
        self,
        df: pd.DataFrame,
        record_scores: pd.DataFrame,
    ) -> Record | None:
        """ """
        idx = record_scores["global_scores"] >= self._config.threshold_mismatch
        n_matching = np.sum(idx)
        if n_matching == 0:
            return None

        if n_matching > 1:
            print(f"Warning: {n_matching} matching records found")

        return df[idx].iloc[0]

    def compute_record_scores(
        self,
        df: pd.DataFrame,
        include_column_scores: bool = False,
    ) -> pd.DataFrame:
        """
        Computes the score of each record in the dataframe.

        If `include_column_scores` is true, include the scores of each tracked column.

        Returns a dataframe with "global_scores" column containing the records scores.
        """
        scores = self._compute_columns_score(df)
        global_scores = scores.apply(self.compute_record_score, axis=1)

        if include_column_scores:
            scores.rename(
                columns={col: f"score_{col}" for col in self.columns},
                inplace=True,
            )
            scores["global_scores"] = global_scores
            df = scores
        else:
            df = pd.DataFrame(data=global_scores)
        return scores

    def _compute_columns_score(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Computes the score of each value in each column.

        Returns a dataframe with all tracked columns containing the scores.
        """
        scores_series = []
        for i in range(len(self.columns)):
            serie = df[self.columns[i]].apply(
                self.scorers[i].score,
                baseline=self.baseline_record[i],
            )
            scores_series.append(serie)

        return pd.DataFrame(scores_series, self.columns).transpose()


class BasicTracker(Tracker):

    def __init__(
        self,
        config: TrackingConfig,
        columns: list[str],
        baseline_record: Record,
    ) -> None:
        super().__init__(
            config=config,
            columns=columns,
            baseline_record=baseline_record,
            scorers=[BasicScorer() for _ in columns],
        )

    def compute_record_score(self, values: list) -> float:
        return np.mean(values)


class MinChangesTracker(Tracker):

    def __init__(
        self,
        config: TrackingConfig,
        columns: list[str],
        baseline_record: Record,
    ) -> None:
        super().__init__(
            config=config,
            columns=columns,
            baseline_record=baseline_record,
            scorers=[MinChangesScorer() for _ in columns],
        )

    def compute_record_score(self, values: list) -> float:
        return np.mean(values)
