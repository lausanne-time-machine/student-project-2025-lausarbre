import time
import pandas as pd


from analytics import BasicTracker, MinChangesTracker

columns = [
    "chef_prenom_norm",
    "chef_nom_norm",
    "nom_rue_norm",
    "chef_vocation_norm",
    "epouse_nom_norm",
]

baseline = ["louis", "collioud", "marterey", "marechat", "blanchoud"]

df = pd.read_csv("data/csv/1842.csv")

tracker = MinChangesTracker(columns, baseline)

st = time.perf_counter()

global_scores = tracker.process_df(df)

d = time.perf_counter() - st
print(f"Duration: {d:.2f}")

result = pd.concat([df[columns], global_scores], axis=1)

result.sort_values(by=["global_scores"], inplace=True, ascending=False)

res_columns = columns + [f"score_{col}" for col in columns] + ["global_scores"]

print(result[res_columns].head(10))
