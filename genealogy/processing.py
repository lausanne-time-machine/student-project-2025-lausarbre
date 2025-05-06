import polars as pl
import blitzbeaver as bb

from genealogy.models import TrackingChain, SerializedDataframe


def preprocess_df(df: pl.DataFrame) -> pl.DataFrame:
    """
    Preprocess the dataframe

    All values need to be capped to a maximum of 256 characters
    to avoid issues in the computation of the levenshtein distance.

    Split the `enfants_chez_parents_prenom` column by the `|` character
    and filter out empty strings.
    """
    return df.with_columns(
        df["enfants_chez_parents_prenom"]
        .str.split("|")
        .list.eval(pl.element().filter(pl.element() != "").slice(0, 256))
        .alias("enfants_chez_parents_prenom"),
        df["nom_rue"].str.slice(0, 256).alias("nom_rue"),
        df["chef_prenom"].str.slice(0, 256).alias("chef_prenom"),
        df["chef_nom"].str.slice(0, 256).alias("chef_nom"),
        df["chef_origine"].str.slice(0, 256).alias("chef_origine"),
        df["epouse_nom"].str.slice(0, 256).alias("epouse_nom"),
        df["chef_vocation"].str.slice(0, 256).alias("chef_vocation"),
    )


def load_dataframes(
    folder_path: str, start_year: int, end_year: int
) -> list[pl.DataFrame]:
    """
    Load the dataframes from the CSV files
    and concatenate them into a single dataframe.
    """
    dataframes = []
    for year in range(start_year, end_year + 1):
        df = pl.read_csv(f"{folder_path}/{year}.csv", infer_schema_length=10000)
        dataframes.append(preprocess_df(df))
    return dataframes


def serialize_tracking_chains(
    graph: bb.TrackingGraph,
    dataframes: list[pl.DataFrame],
    record_schema: bb.RecordSchema,
) -> dict[int, TrackingChain]:
    """
    Serializes the tracking chains from the graph into a JSON-like format.
    """
    raw = {}
    for id in graph.trackers_ids:
        chain = graph.materialize_tracking_chain(id, dataframes, record_schema)
        raw[id] = [
            {
                "frame_idx": frame.frame_idx,
                "record_idx": frame.record_idx,
            }
            for frame in chain.frames
        ]
    return raw


def serialize_dataframes(dataframes: list[pl.DataFrame]) -> list[SerializedDataframe]:
    """
    Serializes the dataframes into a JSON-like format.
    """
    serialized = []
    for df in dataframes:
        serialized.append(df.to_dict(as_series=False))
    return serialized
