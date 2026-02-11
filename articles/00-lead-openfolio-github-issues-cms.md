# OpenFolio — Kiedy GitHub Issues staje się Twoim CMS-em

> **TL;DR:** OpenFolio to portfolio programistyczne, które zamienia GitHub Issues w pełnoprawny system zarządzania treścią. Zero baz danych, zero dodatkowych kosztów, 100% kontroli nad contentem.

---

## 🎯 Problem, który rozwiązujemy

Każdy programista potrzebuje portfolio. Ale większość rozwiązań wymaga:
- Płatnego hostingu z bazą danych
- Konfiguracji CMS-a (Strapi, Contentful, Sanity)
- Zarządzania wieloma serwisami jednocześnie

**A co gdyby Twoje portfolio było tak proste jak... otwarcie Issue na GitHubie?**

---

## 💡 Koncepcja: GitHub Issues jako CMS

OpenFolio wykorzystuje **GitHub Issues API** jako backend dla całego portfolio:

```
📁 GitHub Repository
├── Issue #1 (label: "project") → Projekt "OpenFolio"
│   ├── Sub-issue #2 → Artykuł "Inicjalizacja projektu"
│   ├── Sub-issue #3 → Artykuł "Implementacja UI"
│   └── Comments → System komentarzy
└── Issue #4 (label: "project") → Projekt "E-commerce"
    └── ...
```

### Dlaczego to działa?

| GitHub Issues | → | Portfolio |
|---------------|---|-----------|
| Issue z label "project" | → | Karta projektu |
| Sub-issues | → | Artykuły/changelog |
| Comments | → | System komentarzy |
| Labels | → | Technologie i tagi |
| Markdown | → | Formatowanie treści |

---

## 🚀 Co oferuje OpenFolio?

- **Darmowy CMS** — GitHub Issues są bezpłatne
- **Wersjonowanie treści** — historia zmian out-of-the-box
- **Markdown + Syntax Highlighting** — programistyczny content w swoim żywiole
- **OAuth przez GitHub** — użytkownicy logują się i komentują
- **i18n** — wsparcie dla wielu języków (PL/EN)
- **Dark Mode** — bo tak

---

## 📚 W tej serii artykułów

1. **[Architektura systemu](./01-architektura-openfolio.md)** — jak zbudowano OpenFolio od podstaw
2. **[System tagów i oznaczeń](./02-system-tagow-i-oznaczen.md)** — instrukcja obsługi GitHub Issues jako CMS
3. **[Podsumowanie projektu](./03-podsumowanie-projektu.md)** — wnioski i plany na przyszłość

---

## 🔗 Linki

- **GitHub:** [github.com/lukaszbernatowicz/openfolio](https://github.com/lukaszbernatowicz/openfolio)
- **Demo:** Sprawdź działające portfolio
- **Dokumentacja:** README-GitHub-Issues-Guide.md w repozytorium

---

*Czas na rewolucję w budowaniu portfolio. Żadnych baz danych, żadnych dodatkowych serwisów — tylko GitHub i Twój kod.*
