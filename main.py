import pandas as pd

from analytics import BasicTracker

columns = [
    "chef_prenom_norm",
    "chef_nom_norm",
    "nom_rue_norm",
    "chef_vocation_norm",
    "epouse_nom_norm",
]

baseline = ["louis", "collioud", "marterey", "marechat", "blanchoud"]

df = pd.read_csv("data/csv/1851.csv")

tracker = BasicTracker(columns, baseline)

global_scores = tracker.process_df(df)

result = pd.concat([df[columns], global_scores], axis=1)

result.sort_values(by=["global_scores"], inplace=True, ascending=False)

res_columns = columns + [f"score_{col}" for col in columns] + ["global_scores"]

print(result[res_columns].head(10))
