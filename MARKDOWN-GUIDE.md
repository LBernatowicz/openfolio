# Przewodnik po Markdown w GitHub Issues

## ✅ **TAK - Możesz używać pełnego Markdown!**

Aplikacja obsługuje wszystkie standardowe elementy Markdown z GitHub Issues, **zewnętrzne obrazy**, **frontmatter** i **system komentarzy**. Oto co możesz używać:

## 🎯 **Frontmatter (Metadane)**

Aplikacja obsługuje **frontmatter** w dwóch formatach:

### Format YAML (z ---)
```yaml
---
title: "Nazwa projektu/artykułu"
date: "2025-09-23"
mainImage: "https://example.com/main-image.jpg"
thumbnailImage: "https://example.com/thumbnail.jpg"
image: "https://example.com/article-image.jpg"
technologies: ["React", "TypeScript", "Next.js"]
status: "completed"
liveUrl: "https://example.com"
---
Treść artykułu...
```

### Format Key-Value (bez ---)
```
title: "Nazwa projektu/artykułu"
date: "2025-09-23"
mainImage: "https://example.com/main-image.jpg"
thumbnailImage: "https://example.com/thumbnail.jpg"
image: "https://example.com/article-image.jpg"
technologies: ["React", "TypeScript", "Next.js"]
status: "completed"
liveUrl: "https://example.com"

Treść artykułu...
```

### Dostępne pola frontmatter:
- **`title`** - Tytuł projektu/artykułu
- **`date`** - Data publikacji
- **`mainImage`** - Główny obraz projektu (strona projektu)
- **`thumbnailImage`** - Miniaturka projektu (lista projektów)
- **`image`** - Obraz artykułu (strona artykułu)
- **`technologies`** - Lista technologii
- **`status`** - Status projektu (`completed`, `in-progress`, `planned`)
- **`liveUrl`** - Link do live demo

## 🖼️ **Zewnętrzne obrazy**

Aplikacja obsługuje obrazy z **dowolnych domen**:

```markdown
![Opis obrazu](https://example.com/image.jpg)
![Screenshot](https://imgur.com/abc123.png)
![Logo](https://cdn.example.com/logo.svg)
```

**Obsługiwane formaty:** JPG, PNG, GIF, SVG, WebP

## 💬 **System komentarzy**

Aplikacja ma wbudowany system komentarzy z obsługą:

### Funkcjonalności komentarzy:
- **Komentarze zalogowanych użytkowników** - z awatarem z GitHub
- **Komentarze anonimowe** - z nickiem użytkownika
- **Odpowiedzi na komentarze** - zagnieżdżone wątki
- **Markdown w komentarzach** - pełna obsługa Markdown
- **Automatyczne zapisywanie** - komentarze są zapisywane w GitHub Issues

### Jak komentować:
1. **Zalogowani użytkownicy** - kliknij "Wyślij" i zaloguj się przez GitHub
2. **Anonimowi użytkownicy** - kliknij "Wyślij" i wybierz "Komentuj anonimowo"
3. **Odpowiedzi** - kliknij "Odpowiedz" pod komentarzem

### Przykład komentarza z Markdown:
```markdown
Świetny projekt! 🚀

**Co mi się podoba:**
- [x] Responsywny design
- [x] Czyste API
- [ ] Dokumentacja

```typescript
const example = "Kod w komentarzu";
```

> Dziękuję za udostępnienie!
```

## 📝 **Podstawowe elementy**

### Nagłówki
```markdown
# Nagłówek 1
## Nagłówek 2
### Nagłówek 3
#### Nagłówek 4
```

### Tekst
```markdown
**Pogrubiony tekst**
*Kursywa*
~~Przekreślony~~
`Kod inline`
```

### Listy
```markdown
- Element listy
- Kolejny element
  - Zagnieżdżony element

1. Lista numerowana
2. Drugi element
```

### Linki i obrazy
```markdown
[Link do strony](https://example.com)
![Obraz](https://example.com/image.jpg)
```

## 🎨 **Zaawansowane elementy**

### Tabele
```markdown
| Kolumna 1 | Kolumna 2 | Kolumna 3 |
|-----------|-----------|-----------|
| Dane 1    | Dane 2    | Dane 3    |
| Dane 4    | Dane 5    | Dane 6    |
```

### Cytaty
```markdown
> To jest cytat
> Może być wieloliniowy
```

### Kod blokowy
````markdown
```javascript
function hello() {
  console.log("Hello World!");
}
```
````

### Linie poziome
```markdown
---
```

## 🚀 **GitHub Flavored Markdown (GFM)**

### Zadania
```markdown
- [x] Ukończone zadanie
- [ ] Nieukończone zadanie
- [x] Kolejne ukończone
```

### Tabele z wyrównaniem
```markdown
| Lewo | Środek | Prawo |
|:-----|:------:|------:|
| 1    | 2      | 3     |
```

### Strikethrough
```markdown
~~Przekreślony tekst~~
```

### Emoji
```markdown
:rocket: :star: :heart: :thumbsup:
```

## 📋 **Struktura Issues w GitHub**

### Projekty
```markdown
# Nazwa Projektu

## Opis
Krótki opis projektu...

## Technologie
- React
- TypeScript
- Next.js

## Live Demo
https://example.com

## Funkcjonalności
- [x] Funkcja 1
- [x] Funkcja 2
- [ ] Funkcja 3
```

### Artykuły/Changelog
```markdown
# [#1] Nazwa Artykułu

## Co zostało zrobione
Szczegółowy opis zmian...

## Kod
```javascript
const example = "Hello World";
```

## Screenshoty
![Screenshot](https://example.com/screenshot.png)

## Następne kroki
- [ ] Zadanie 1
- [ ] Zadanie 2
```

## 🎯 **Przykłady użycia**

### Projekt z pełnym opisem i frontmatter
```yaml
---
title: "OpenFolio"
date: "2025-09-23"
mainImage: "https://example.com/openfolio-main.jpg"
thumbnailImage: "https://example.com/openfolio-thumb.jpg"
technologies: ["Next.js", "TypeScript", "Tailwind CSS"]
status: "completed"
liveUrl: "https://openfolio.vercel.app"
---

# OpenFolio

Nowoczesne portfolio programistyczne zbudowane w **Next.js 14**, TypeScript i Tailwind CSS.

## 🚀 Funkcjonalności
- [x] Responsywny design
- [x] Dark mode
- [x] Animacje
- [x] System komentarzy
- [x] Zewnętrzne obrazy

## 🛠 Technologie
- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Animacje:** Framer Motion

## 📸 Screenshoty
![Desktop](https://example.com/desktop.png)
![Mobile](https://example.com/mobile.png)

## 🔗 Linki
- **Live Demo:** https://openfolio.vercel.app
- **GitHub:** https://github.com/user/openfolio

## 📝 Notatki
> To jest ważna informacja o projekcie
```

### Artykuł z frontmatter i kodem
```yaml
---
title: "Implementacja systemu komentarzy"
date: "2025-09-23"
image: "https://example.com/comments-screenshot.jpg"
---

# [#1] Implementacja systemu komentarzy

## Co zostało zrobione
Dodałem pełnofunkcjonalny system komentarzy z obsługą Markdown i GitHub OAuth.

## Kod implementacji
```typescript
interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  avatar?: string;
  parentId?: string;
}
```

## Funkcjonalności
- [x] Dodawanie komentarzy
- [x] Edycja komentarzy
- [x] Usuwanie komentarzy
- [x] Odpowiedzi na komentarze
- [x] Markdown w komentarzach

## Screenshot
![Komentarze](https://example.com/comments.png)

## Następne kroki
- [ ] Moderacja komentarzy
- [ ] Powiadomienia email
```

## 💡 **Wskazówki**

1. **Używaj frontmatter** do metadanych (tytuł, data, obrazy)
2. **Dodawaj zewnętrzne obrazy** z dowolnych domen
3. **Używaj nagłówków** do strukturyzacji treści
4. **Dodawaj listy zadań** dla śledzenia postępu
5. **Wstawiaj screenshoty** dla lepszej wizualizacji
6. **Używaj kodu** dla przykładów implementacji
7. **Dodawaj linki** do live demo i GitHub
8. **Komentuj projekty** - używaj systemu komentarzy
9. **Używaj Markdown w komentarzach** - pełna obsługa
10. **Testuj responsywność** - obrazy dostosowują się automatycznie

## 🎨 **Stylowanie w aplikacji**

Aplikacja automatycznie styluje wszystkie elementy Markdown:
- **Ciemny motyw** - dopasowany do designu
- **Syntax highlighting** - dla bloków kodu (VSCode Dark+)
- **Responsywność** - na wszystkich urządzeniach
- **Czytelność** - optymalne kolory i odstępy
- **Zewnętrzne obrazy** - automatyczne skalowanie i zaokrąglone rogi
- **Nagłówki z ID** - automatyczne linki do sekcji
- **Tabele** - z obramowaniem i hover efektami
- **Cytaty** - z niebieskim obramowaniem
- **Linki** - z hover efektami i automatycznym otwieraniem w nowej karcie

## 🚀 **Nowe funkcjonalności**

### ✅ **Dodane w najnowszej wersji:**
- **Frontmatter** - obsługa metadanych w YAML i key-value
- **Zewnętrzne obrazy** - z dowolnych domen
- **System komentarzy** - z GitHub OAuth i anonimowymi komentarzami
- **Markdown w komentarzach** - pełna obsługa
- **Awatary użytkowników** - automatyczne pobieranie z GitHub
- **Odpowiedzi na komentarze** - zagnieżdżone wątki
- **Automatyczne zapisywanie** - komentarze w GitHub Issues

**Wszystko jest gotowe do użycia!** 🎉
