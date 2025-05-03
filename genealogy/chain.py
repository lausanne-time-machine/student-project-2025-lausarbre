import blitzbeaver as bb


def get_most_frequent_value(values: list[str]) -> str:
    """
    Returns the most frequent value in a list of strings.
    If there are multiple values with the same frequency,
    returns the first one.
    """
    value_counts = {}
    for value in values:
        value_counts[value] = value_counts.get(value, 0) + 1

    most_frequent_value = max(value_counts, key=value_counts.get)
    return most_frequent_value


def chain_summary(
    tracking_chain: bb.MaterializedTrackingChain,
    config: bb.GenealogyConfig,
    start_year: int,
) -> str:
    """
    Returns a summary of the tracking chain.
    """
    first_name = get_most_frequent_value(
        [
            frame.record[config.husband_name_idx]
            for frame in tracking_chain.matched_frames
        ]
    )
    last_name = get_most_frequent_value(
        [frame.record[config.last_name_idx] for frame in tracking_chain.matched_frames]
    )

    apparition_year = tracking_chain.frames[0].frame_idx + start_year
    end_year = apparition_year + tracking_chain.lifespan - 1

    return f"{first_name} {last_name} ({apparition_year} - {end_year})"
