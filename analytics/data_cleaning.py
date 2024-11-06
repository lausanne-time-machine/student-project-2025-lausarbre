import pandas as pd
import numpy as np


def normalize_nan_str_values(serie: pd.Series) -> pd.Series:
    """ """
    return serie.replace("·", pd.NA, regex=True)


def normalize_int_serie(serie: pd.Series, default_value: int = -1) -> pd.Series:
    """"""
    s = pd.to_numeric(serie, errors="coerce")
    s = s.replace(np.nan, default_value)
    s = s.astype(np.int64)
    return s
