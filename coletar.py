import requests
import time
import json
from urllib.parse import urlparse

# Lista de tuplas: (ID, URL completa do hino no Cifra Club)
hinos = [
(226, "https://www.cifraclub.com.br/harpa-crista/cristo-teu-santo-amor/intermediario.html"),
(227, "https://www.cifraclub.com.br/harpa-crista/deus-amou-este-mundo/"),
(228, "https://www.cifraclub.com.br/harpa-crista/este-mundo-nao-compreende/"),
(229, "https://www.cifraclub.com.br/harpa-crista/jesus-meigo-salvador/"),
(230, "https://www.cifraclub.com.br/harpa-crista/nos-vogamos-nesta-nau/hgkwtm.html"),
(231, "https://www.cifraclub.com.br/harpa-crista/nao-foi-com-ouro/"),
(232, "https://www.cifraclub.com.br/harpa-crista/os-bem-aventurados/"),
(233, "https://www.cifraclub.com.br/harpa-crista/hino-199-a-ceia-do-senhor/"),
(234, "https://www.cifraclub.com.br/harpa-crista/o-gozo-dos-santos/cifra.html"),
(235, "https://www.cifraclub.com.br/harpa-crista/ja-sei-ja-sei/"),
(236, "https://www.cifraclub.com.br/harpa-crista/ja-nos-lavou/"),
(237, "https://www.cifraclub.com.br/harpa-crista/o-gozo-de-estar-preparado/cifra.html"),
(238, "https://www.cifraclub.com.br/harpa-crista/o-pecador-desalentado/"),
(239, "https://www.cifraclub.com.br/harpa-crista/imploramos-consolador/"),
(240, "https://www.cifraclub.com.br/harpa-crista/oh-dia-alegre/"),
(241, "https://www.cifraclub.com.br/harpa-crista/marchemos-sem-temor/"),
(242, "https://www.cifraclub.com.br/harpa-crista/eu-confio-firmemente/"),
(243, "https://www.cifraclub.com.br/harpa-crista/ao-abrir-culto-243/"),
(244, "https://www.cifraclub.com.br/harpa-crista/louvai-jesus/"),
(245, "https://www.cifraclub.com.br/harpa-crista/paz-de-deus-em-jesus-encontrei/"),
(246, "https://www.cifraclub.com.br/harpa-crista/o-descanso-em-jesus/"),
(247, "https://www.cifraclub.com.br/harpa-crista/deus-nos-guarde-no-seu-amor/"),
(248, "https://www.cifraclub.com.br/harpa-crista/hosana-gloria/"),
(249, "https://www.cifraclub.com.br/harpa-crista/o-vem-senhor-habita/"),
(250, "https://www.cifraclub.com.br/harpa-crista/noiva-de-jesus-apronta-te/")
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
