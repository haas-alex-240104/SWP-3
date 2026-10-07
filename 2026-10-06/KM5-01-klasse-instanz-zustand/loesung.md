# Lösung KM5-01 — Klasse, Instanz, Zustand

## 1. Vorhersagen (erst hingeschrieben, dann mit Code geprüft)

**a) `const c = a;` — wie viele Konto-Objekte, wie viele Variablen? Gilt `c === a`?**

Vorhersage: Es gibt **1 Konto-Objekt** und **2 Variablen** (`a` und `c`).
`c === a` ist **`true`**, weil `const c = a` keine neue Instanz erzeugt
(kein `new`), sondern nur eine zweite Referenz auf dasselbe Objekt kopiert.
`===` vergleicht Identität (Speicherplatz), nicht Zustand.

**b) Nach `a.einzahlen(100)`: Was liefert `c.kontostand` — 500 oder 600? Warum?**

Vorhersage: **`600`**. Da `c` und `a` auf dasselbe Objekt zeigen, ändert
`a.einzahlen(100)` den Zustand genau dieses einen Objekts
(`this._kontostand += betrag`). Über `c.kontostand` lesen wir denselben
Feldwert aus. Zustand lebt pro Instanz, nicht pro Variable — hier ist es
dieselbe Instanz.

Prüfung (in `deno repl` bzw. Test `Zustand lebt pro Instanz` nachvollziehbar):

```ts
import { Konto } from "./konto.ts";
const a = new Konto("AT12 0000 0000 0001", 500);
const c = a;
console.log(c === a); // true
a.einzahlen(100);
console.log(c.kontostand); // 600
```

## 2. Umsetzung

`konto.ts`: `class Konto` mit `readonly iban`, privatem `_kontostand`
(lesen über `get kontostand()`), `einzahlen()` und
`equals(other: Konto): boolean` (vergleicht **IBAN**, nicht Kontostand).

## 3. Tests

`konto_test.ts` — `deno test` ist grün:

- gleiche IBAN, verschiedener Stand → `equals()` ist `true`
- verschiedene IBAN, gleicher Stand → `equals()` ist `false`
- zwei `new Konto(…)` → `a === b` ist `false` (Identität ≠ Zustand)
