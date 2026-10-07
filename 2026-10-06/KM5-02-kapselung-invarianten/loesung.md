# Lösung KM5-02 — Kapselung & Invarianten

## 1. Vorhersagen (erst hingeschrieben, dann geprüft)

**a) Bei welchem Feld schlägt `deno check` auf `k.kontostand = -1` fehl: `public` oder `private`? Was passiert jeweils zur Laufzeit?**

Vorhersage: Bei **`private`** schlägt `deno check` fehl
(`Property 'kontostand' is private and only accessible within class 'Konto'`),
bei **`public`** kompiliert es. Zur **Laufzeit** passiert in beiden Fällen die
Zuweisung (TypeScript-`private` prüft nur Kompilierzeit; im emittierten JS ist
das Feld normal erreichbar). Genau deshalb ist `private` allein kein Schutz
gegen Müll — erst geprüfte Methoden + Fail-Fast machen die Klasse zur Herrin
ihres Zustands. Harte Laufzeit-Kapselung gäbe es nur mit `#feld`.

In unserer Lösung gibt es zusätzlich gar keinen setter, sondern nur
`get kontostand()` — `k.kontostand = -1` schlägt daher schon beim Check fehl
(Cannot assign to read-only getter), und zur Laufzeit passiert nichts.

**b) Der Konstruktor wirft bei negativem Startwert. Wie viele Objekte existieren nach `new Konto(-5)` — null oder ein halbfertiges?**

Vorhersage: **Null.** `throw` im Konstruktor bricht die Objekterzeugung ab,
bevor der Konstruktor fertig wird — die Zuweisung `const k = new Konto(-5)`
erhält nie ein Objekt, `k` existiert danach nicht (Ausnahme fliegt zum
Aufrufer). Es bleibt **kein halbfertiges Objekt** zurück, weil der Aufrufer
keine Referenz darauf erhalten kann. Genau das ist Fail-Fast: lieber gar kein
Objekt als ein ungültiges.

## 2. Umsetzung (`konto.ts`)

Klasse `Konto` mit `readonly iban`, privatem `_kontostand`, zwei Invarianten:

1. **I1: `kontostand >= 0`** — kein Dispo. Prüfung im Konstruktor
   (`startBetrag < 0 → throw`), in `abheben` und `ueberweisen`
   (`betrag > stand → throw`).
2. **I2: `betrag > 0`** — jede Zustandsänderung braucht positiven Betrag.
   Prüfung in `einzahlen`, `abheben`, `ueberweisen`.

Kein setter (würde die Prüfung umgehen); Lesen über `get kontostand()`.
`ueberweisen(auf, betrag)` ist **atomar**: erst alle Prüfungen, dann erst
buchen — entweder stimmen beide Konten oder gar keines.

## 3. Tests (`konto_test.ts`, `deno test` grün)

- je Invariante mindestens ein Test, der beweist, dass die Verletzung wirft
- plus grüner Pfad mit gültigem Übergang (einzahlen → abheben → überweisen)
