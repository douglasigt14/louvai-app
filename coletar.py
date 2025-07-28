import requests
import time
import json
from urllib.parse import urlparse

# Lista de tuplas: (ID, URL completa do hino no Cifra Club)
hinos = [
(300, "https://www.cifraclub.com.br/harpa-crista/300-nossa-esperanca-/")
]

result = []
inicio = 1
fim = 640

# Filtrar IDs válidos
hinos = [h for h in hinos if inicio <= h[0] <= fim]

for id_, full_url in hinos:
    print(f"\n🔍 Processando hino {id_}")
    
    try:
        parsed = urlparse(full_url)
        path_parts = parsed.path.strip("/").split("/")

        if len(path_parts) < 2:
            result.append({
                "id": id_,
                "name": f"Hino {id_}",
                "artist": "Harpa Cristã",
                "cifra": [],
                "url": ""
            })
            continue

        artist_slug, song_slug = path_parts[0], path_parts[1]

        url = f"https://louvai-api-cifra-club.fly.dev/artists/{artist_slug}/songs/{song_slug}"

        response = requests.get(url, timeout=60)
        response.raise_for_status()
        data = response.json()

        result.append({
            "id": id_,
            "name": data.get("name", song_slug.replace("-", " ").title()),
            "artist": data.get("artist", artist_slug.replace("-", " ").title()),
            "cifra": data.get("cifra", []),
            "url": data.get("cifraclub_url", full_url)
        })

    except Exception as e:
        print(f"❌ Erro ao buscar hino {id_}: {e}")

    time.sleep(1)

# Salvar resultado no JSON
with open("hinos_coletados.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("\n✅ Arquivo 'hinos_coletados.json' gerado com sucesso!")
