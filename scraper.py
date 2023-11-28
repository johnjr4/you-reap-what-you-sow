import requests
import json

# Set your API endpoint and key
base_url = "https://perenual.com/api/species/details/"
api_key = "sk-nPCa656657bf342873177"

# Make API calls and store responses in a list
responses = []
for species_id in range(2, 101):
    url = f"{base_url}{species_id}?key={api_key}"
    response = requests.get(url)
    
    if response.status_code == 200:
        responses.append(response.json())
    else:
        print(f"Failed to fetch data for ID {species_id}. Status code: {response.status_code}")

# Compile all responses into one JSON file
output_file = "compiled_responses.json"
with open(output_file, "w") as file:
    json.dump(responses, file)

print(f"Responses compiled and saved to {output_file}")