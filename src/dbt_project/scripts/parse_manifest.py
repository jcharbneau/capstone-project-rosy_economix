import json
import csv

def parse_dbt_manifest(manifest_path, output_csv_path):
    with open(manifest_path) as f:
        manifest = json.load(f)

    nodes = manifest['nodes']
    models = []
    for node_name, node_data in nodes.items():
        if node_data['resource_type'] == 'model':
            models.append({
                'name': node_data['name'],
                'depends_on': ",".join(node_data['depends_on']['nodes'])
            })

    # Write to CSV
    with open(output_csv_path, 'w', newline='') as csvfile:
        fieldnames = ['name', 'depends_on']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for model in models:
            writer.writerow(model)

if __name__ == "__main__":
    parse_dbt_manifest('target/manifest.json', 'seeds/raw_dbt_manifest.csv')
    print("Manifest seed file created.")

