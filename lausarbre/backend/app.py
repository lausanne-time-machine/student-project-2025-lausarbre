from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/census/{year}")
def get_census_data(year: str):
    mock_data = {
        "1850": [{"name": "Jean", "surname": "Dupont", "occupation": "Blacksmith"}],
        "1860": [{"name": "Marie", "surname": "Curie", "occupation": "Scientist"}],
        "1870": [{"name": "Louis", "surname": "Pasteur", "occupation": "Chemist"}],
    }
    return mock_data.get(year, [])

@app.get("/api/family-tree/{name}")
def get_family_tree(name: str):
    return {
        "name": name,
        "children": [
            {"name": "Parent A"},
            {"name": "Parent B", "children": [{"name": "Sibling X"}, {"name": "Sibling Y"}]}
        ]
    }
