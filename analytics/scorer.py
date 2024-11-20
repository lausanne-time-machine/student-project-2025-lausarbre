from abc import ABC, abstractmethod
from typing import TypeVar

T = TypeVar("T")


class Scorer(ABC):

    @abstractmethod
    def set_baseline(self, baseline: T) -> None:
        """ """

    @abstractmethod
    def score(self, value: T) -> float:
        """
        Apply a score to the given value
        """


class BasicScorer(Scorer):

    def __init__(self) -> None:
        self.baseline = None

    def set_baseline(self, baseline: str) -> None:
        self.baseline = baseline

    def score(self, value: str) -> float:
        if self.baseline is None:
            raise ValueError("Missing baseline value")

        lbig = max(len(value), len(self.baseline))
        llow = min(len(value), len(self.baseline))

        dist = 0
        for i in range(llow):
            if value[i] != self.baseline[i]:
                dist += 1

        dist += lbig - llow

        if dist == 0:
            return 1.0
        return 1.0 - dist / lbig
