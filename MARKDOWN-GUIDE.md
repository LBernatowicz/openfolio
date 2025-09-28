# Przewodnik po Markdown w GitHub Issues

## ✅ **TAK - Możesz używać pełnego Markdown!**

Aplikacja obsługuje wszystkie standardowe elementy Markdown z GitHub Issues. Oto co możesz używać:

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

### Projekt z pełnym opisem
```markdown
# OpenFolio

Nowoczesne portfolio programistyczne zbudowane w **Next.js 14**, TypeScript i Tailwind CSS.

## 🚀 Funkcjonalności
- [x] Responsywny design
- [x] Dark mode
- [x] Animacje
- [ ] System komentarzy

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

### Artykuł z kodem
```markdown
# [#1] Implementacja systemu komentarzy

## Co zostało zrobione
Dodałem pełnofunkcjonalny system komentarzy z obsługą Markdown.

## Kod implementacji
```typescript
interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}
```

## Testy
- [x] Dodawanie komentarzy
- [x] Edycja komentarzy
- [x] Usuwanie komentarzy

## Screenshot
![Komentarze](https://example.com/comments.png)
```

## 💡 **Wskazówki**

1. **Używaj nagłówków** do strukturyzacji treści
2. **Dodawaj listy zadań** dla śledzenia postępu
3. **Wstawiaj screenshoty** dla lepszej wizualizacji
4. **Używaj kodu** dla przykładów implementacji
5. **Dodawaj linki** do live demo i GitHub

## 🎨 **Stylowanie w aplikacji**

Aplikacja automatycznie styluje wszystkie elementy Markdown:
- **Ciemny motyw** - dopasowany do designu
- **Syntax highlighting** - dla bloków kodu
- **Responsywność** - na wszystkich urządzeniach
- **Czytelność** - optymalne kolory i odstępy

**Wszystko jest gotowe do użycia!** 🎉
