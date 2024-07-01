import json
import asyncio
import asyncpg

DATABASE_URL = "postgresql://postgres:postgres@postgres:5432/pipelines"

async def execute_query(query: str, params: tuple = ()):
    connection = await asyncpg.connect(DATABASE_URL)
    try:
        await connection.execute(query, *params)
    finally:
        await connection.close()

def parse_dbt_manifest(manifest_path):
    with open(manifest_path) as f:
        manifest = json.load(f)

    nodes = manifest['nodes']
    models = {}
    for node_name, node_data in nodes.items():
        if node_data['resource_type'] == 'model':
            models[node_name] = {
                'name': node_data['name'],
                'depends_on': node_data['depends_on']['nodes']
            }
    return models

async def store_dbt_metadata(models: dict):
    for model_name, model_data in models.items():
        query = """
        INSERT INTO public.dbt_models (name, depends_on) 
        VALUES ($1, $2) 
        ON CONFLICT (name) DO UPDATE 
        SET depends_on = $2
        """
        await execute_query(query, (model_data['name'], json.dumps(model_data['depends_on'])))

if __name__ == "__main__":
    manifest_path = 'target/manifest.json'
    models = parse_dbt_manifest(manifest_path)
    asyncio.run(store_dbt_metadata(models))
    print("Metadata has been stored in the database.")

