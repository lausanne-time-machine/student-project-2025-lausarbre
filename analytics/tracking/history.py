from typing import TypeVar

from analytics.scorer import Scorer
from analytics.config import TrackingConfig

T = TypeVar("T")


class TrackingHistory:
    """
    History of tracking of a value
    """

    def __init__(self, config: TrackingConfig, baseline: T):
        self._config = config

        self._history: list[tuple[int, T]] = []
        self._history.append((1, baseline))

    def _ensure_history_sorted(self, idx: int) -> None:
        """
        Ensure the history is sorted from index `idx` and before
        """
        for i in range(idx - 1, -1, -1):
            if self._history[i][0] >= self._history[idx][0]:
                break
            # swap
            temp = self._history[i]
            self._history[i] = self._history[idx]
            self._history[idx] = temp
            idx = i

    def _history_add_value(self, value: T) -> None:
        for i in range(len(self._history)):
            if value == self._history[i][1]:
                self._history[i][0] += 1
                self._ensure_history_sorted(i)
                return

    def score(self, scorer: Scorer, value: T) -> float:
        """
        Give a score to `value` using the `scorer`.

        Updates the history with `value` if it is considered a match.
        """
        scores: list[float] = []

        num_considered_history_values = min(
            len(self._history),
            self._config.history.max_num_value_to_score,
        )

        for i in range(num_considered_history_values):
            count, baseline = self._history[i]

            score = scorer.score(baseline, value)
            scores.append(score)

        final_score = max(scores)

        if final_score >= self._config.threshold_mismatch:
            self._history_add_value(value)

        return final_score
