import requests
import time
import json

# Lista com ID, slug do hino e, opcionalmente, slug do artista
hinos = [ 
    (18, "grata-nova"), 
    (19, "19-o-convite-de-cristo", "leandro-izauto"), 
    (20, "olhai-pra-cordeiro-de-deus"), 
    (21, "21-gloriosa-aurora", "leandro-izauto" ),  
]

DEFAULT_ARTIST = "harpa-crista"
result = []

inicio = 1
fim = 640

# Filtrar apenas os IDs no intervalo desejado
hinos = [h for h in hinos if inicio <= h[0] <= fim]

for hino in hinos:
    # Suporte a 2 ou 3 elementos por tupla
    id_ = hino[0]
    slug = hino[1]
    artist_slug = hino[2] if len(hino) > 2 else DEFAULT_ARTIST

    print(f"Buscando hino {id_}: {slug} (artista: {artist_slug})")
    
    if not slug:
        print(f"⚠️  Hino {id_} ignorado: slug ausente")
        continue

    url = f"https://louvai-api-cifra-club.fly.dev/artists/{artist_slug}/songs/{slug}"
    
    try:
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        data = response.json()
        result.append({
            "id": id_,
            "name": data.get("name", slug.replace("-", " ").title()),
            "artist": data.get("artist", "Harpa Cristã"),
            "cifra": data.get("cifra", []),
            "url": data.get("cifraclub_url", url)
        })
    except Exception as e:
        print(f"❌ Erro ao buscar hino {id_}: {e}")
    
    time.sleep(1)  # evitar sobrecarregar a API

# Salvar resultado em JSON
with open("hinos_coletados.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("\n✅ Arquivo 'hinos_coletados.json' gerado com sucesso!")
