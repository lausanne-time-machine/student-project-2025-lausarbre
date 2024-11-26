from abc import ABC, abstractmethod
from typing import TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Scorer(ABC):

    @abstractmethod
    def score(self, value: T, baseline: T) -> float:
        """
        Apply a score to `value` against the `baseline`
        """


class BasicScorer(Scorer):

    def __init__(self) -> None:
        pass

    def score(self, value: str, baseline: str) -> float:
        lbig = max(len(value), len(baseline))
        llow = min(len(value), len(baseline))

        dist = 0
        for i in range(llow):
            if value[i] != baseline[i]:
                dist += 1

        dist += lbig - llow

        if dist == 0:
            return 1.0
        return 1.0 - dist / lbig


class Change(BaseModel):
    deletion: str | None = None
    addition: str | None = None
    replacement: tuple[str, str] | None = None


# leetcode problem: https://leetcode.com/problems/edit-distance
# solution: https://leetcode.com/problems/edit-distance/solutions/3230662/clean-codes-full-explanation-dynamic-programming-c-java-python3/
class MinChangesScorer(Scorer):

    def __init__(self):
        pass

    def score(self, value: str, baseline: str):
        diffs = self._get_differences(value, baseline)
        if len(diffs) == 0:
            return 1.0
        return 1.0 - len(diffs) / max(len(value), len(baseline))

    def _get_differences(self, w1: str, w2: str) -> list[Change]:
        m = len(w1)
        n = len(w2)
        # dp[i][j] := min # Of operations to convert word1[0..i) to word2[0..j)
        dp: list[list[list[Change]]] = [[[]] * (n + 1) for _ in range(m + 1)]

        for i in range(1, m + 1):
            dp[i][0] = [Change(deletion=c) for c in w1[:i]]

        for j in range(1, n + 1):
            dp[0][j] = [Change(addition=c) for c in w2[:j]]

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if w1[i - 1] == w2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1].copy()
                else:
                    len_replacement = len(dp[i - 1][j - 1])
                    len_deletion = len(dp[i - 1][j])
                    len_addition = len(dp[i][j - 1])
                    min_len = min(len_replacement, len_deletion, len_addition)

                    if len_replacement == min_len:
                        dp[i][j] = dp[i - 1][j - 1] + [
                            Change(replacement=(w1[i - 1], w2[j - 1]))
                        ]
                    elif len_deletion == min_len:
                        dp[i][j] = dp[i - 1][j] + [Change(deletion=w1[i - 1])]
                    elif len_addition == min_len:
                        dp[i][j] = dp[i][j - 1] + [Change(addition=w2[j - 1])]

        return dp[m][n]
