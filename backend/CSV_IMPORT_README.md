# Guia de Importação CSV para CinePlay

Este documento descreve como usar a funcionalidade de importação CSV para adicionar filmes e séries ao CinePlay.

## Importação de Vídeos (Filmes)

### Endpoint

```
POST /admin/content/import/videos
```

**Autorização:** Token JWT de um usuário com privilégios de administrador

**Formato:** `multipart/form-data`

**Parâmetro:** `file` (arquivo CSV)

### Formato do CSV para Vídeos

O arquivo CSV deve conter um cabeçalho com os seguintes campos (campos obrigatórios marcados com *):

- `title`* - Título do vídeo em português
- `originalTitle` - Título original (se diferente do título em português)
- `description` - Descrição ou sinopse do vídeo
- `fileUrl`* - URL do arquivo de vídeo (pode ser URL externa ou caminho para o servidor)
- `thumbnailUrl` - URL da miniatura do vídeo
- `releaseYear` - Ano de lançamento (YYYY)
- `genres` - Gêneros, separados por vírgula (ex: "Ação, Aventura, Sci-Fi")
- `ageRating` - Classificação etária (ex: "Livre", "12", "14", "16", "18")
- `cast` - Elenco principal, separados por vírgula (ex: "Ator A, Atriz B, Ator C")
- `director` - Diretor do filme

### Exemplo de CSV para Vídeos

```csv
title,originalTitle,description,fileUrl,thumbnailUrl,releaseYear,genres,ageRating,cast,director
Cidade de Deus,City of God,História sobre crime organizado na Cidade de Deus,https://example.com/videos/cidade-de-deus.mp4,https://example.com/thumbs/cidade-de-deus.jpg,2002,"Drama, Crime",18,"Alexandre Rodrigues, Leandro Firmino, Matheus Nachtergaele","Fernando Meirelles, Kátia Lund"
Central do Brasil,Central Station,Uma ex-professora ajuda um menino a encontrar seu pai,https://example.com/videos/central-do-brasil.mp4,https://example.com/thumbs/central-do-brasil.jpg,1998,Drama,12,"Fernanda Montenegro, Vinícius de Oliveira",Walter Salles
```

## Importação de Séries

### Endpoint

```
POST /admin/content/import/series
```

**Autorização:** Token JWT de um usuário com privilégios de administrador

**Formato:** `multipart/form-data`

**Parâmetro:** `file` (arquivo CSV)

### Formato do CSV para Séries

O arquivo CSV deve conter um cabeçalho com os seguintes campos (campos obrigatórios marcados com *):

- `title`* - Título da série em português
- `originalTitle` - Título original (se diferente do título em português)
- `description` - Descrição ou sinopse da série
- `thumbnailUrl` - URL da miniatura da série
- `bannerUrl` - URL da imagem de banner da série
- `releaseYear` - Ano de lançamento inicial (YYYY)
- `genres` - Gêneros, separados por vírgula (ex: "Comédia, Drama")
- `ageRating` - Classificação etária (ex: "Livre", "12", "14", "16", "18")
- `cast` - Elenco principal, separados por vírgula (ex: "Ator X, Atriz Y, Ator Z")
- `director` - Diretor ou criador da série

### Exemplo de CSV para Séries

```csv
title,originalTitle,description,thumbnailUrl,bannerUrl,releaseYear,genres,ageRating,cast,director
3%,3%,Em um futuro dividido entre progresso e devastação,https://example.com/thumbs/3-percent.jpg,https://example.com/banners/3-percent.jpg,2016,"Sci-Fi, Drama, Thriller",16,"Bianca Comparato, João Miguel, Michel Gomes",Pedro Aguilera
Coisa Mais Linda,Most Beautiful Thing,Uma mulher abre um clube de bossa nova em Copacabana nos anos 50,https://example.com/thumbs/coisa-mais-linda.jpg,https://example.com/banners/coisa-mais-linda.jpg,2019,"Drama, Musical",14,"Maria Casadevall, Pathy Dejesus, Fernanda Vasconcellos","Giuliano Cedroni, Heather Roth"
```

## Respostas

### Sucesso

```json
{
  "imported": 2,
  "errors": []
}
```

### Sucesso Parcial (com alguns erros)

```json
{
  "imported": 1,
  "errors": [
    "Erro ao importar o vídeo \"Título do Vídeo\": Mensagem do erro"
  ]
}
```

## Notas

1. **Caminhos Relativos:** Para arquivos que já estão no servidor, você pode usar caminhos relativos como `fileUrl`, por exemplo: `/uploads/videos/filme.mp4`.

2. **Temporadas e Episódios:** A importação básica de séries não inclui temporadas e episódios. Esses precisam ser adicionados depois usando as APIs específicas.

3. **Formato de Data:** Use apenas o ano (YYYY) no campo `releaseYear`.

4. **Campos com Vírgulas:** Se um campo (como a descrição) contiver vírgulas, coloque o texto entre aspas duplas.

5. **Codificação:** O arquivo CSV deve estar codificado em UTF-8. 