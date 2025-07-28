import requests
import time
import json
from urllib.parse import urlparse

# Lista de tuplas: (ID, URL completa do hino no Cifra Club)
hinos = [
(201, "https://www.cifraclub.com.br/harpa-crista/a-descisao/"),
(202, "https://www.cifraclub.com.br/harpa-crista/lugar-de-delicias/"),
(203, "https://www.cifraclub.com.br/harpa-crista/deixai-as-ilusoes/"),
(204, "https://www.cifraclub.com.br/harpa-crista/o-peregrino-na-terra/"),
(205, "https://www.cifraclub.com.br/harpa-crista/graca-graca/"),
(206, "https://www.cifraclub.com.br/harpa-crista/o-clarim-nos-alerta/"),
(207, "https://www.cifraclub.com.br/harpa-crista/jerusalem-divina/"),
(208, "https://www.cifraclub.com.br/harpa-crista/vem-cristo/"),
(209, "https://www.cifraclub.com.br/harpa-crista/a-voz-do-bom-pastor/"),
(210, "https://www.cifraclub.com.br/harpa-crista/fala-fala-senhor/"),
(211, "https://www.cifraclub.com.br/harpa-crista/vem-deus/"),
(212, "https://www.cifraclub.com.br/harpa-crista/os-guerreiros-se-preparam/"),
(213, "https://www.cifraclub.com.br/harpa-crista/sobre-terra-vou-andando/"),
(214, "https://www.cifraclub.com.br/harpa-crista/desejamos-ir-la/"),
(215, "https://www.cifraclub.com.br/harpa-crista/ver-nos-emos/"),
(216, "https://www.cifraclub.com.br/harpa-crista/louvai-deus/"),
(217, "https://www.cifraclub.com.br/harpa-crista/ouve-sua-voz/"),
(218, "https://www.cifraclub.com.br/harpa-crista/da-teu-fardo-jesus/"),
(219, "https://www.cifraclub.com.br/harpa-crista/o-amor-do-criador/"),
(220, "https://www.cifraclub.com.br/harpa-crista/ide-segar/"),
(221, "https://www.cifraclub.com.br/harpa-crista/opera-em-mim/"),
(222, "https://www.cifraclub.com.br/harpa-crista/vem-jesus-perdido/"),
(223, "https://www.cifraclub.com.br/harpa-crista/na-minhalma-reina-paz/"),
(224, "https://www.cifraclub.com.br/harpa-crista/224-e-o-tempo-de-segar/"),
(225, "https://www.cifraclub.com.br/harpa-crista/225-na-batalha-contra-o-mal-se-valente/")
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
