# Lösung KM5-03 — Interfaces als Vertrag

## 1. Vorhersagen (erst hingeschrieben, dann geprüft)

**a) Eine Klasse schreibt `implements Verzinsbar`, vergisst aber `jahresZins()`. Kompiliert das — und wo meckert TypeScript?**

Vorhersage: **Nein, es kompiliert nicht.** TypeScript meckert **an der
Klassen-Deklaration** (beim `implements`), z. B.:
`Class 'X' incorrectly implements interface 'Verzinsbar'. Property
'jahresZins' is missing ...`. Der Vertrag wird zur **Kompilierzeit** geprüft —
genau dafür ist `implements` da (Dokumentation + Zwang zur exakten Signatur).

**b) Ein Objekt mit `jahresZins`, aber ohne `implements`, wird einer Variablen vom Typ `Verzinsbar` zugewiesen. Erlaubt oder nicht — und warum?**

Vorhersage: **Erlaubt.** TypeScript nutzt **structural typing**: Es prüft nur
die **Form** (hat das Objekt alle geforderten Mitglieder in der richtigen
Signatur?), nicht die **Abstammung**. `implements` ist nur Dokumentation, keine
Bedingung. Java würde nein sagen, TypeScript sagt ja, solange die Form passt
(siehe Test „structural typing" in `versendbar_test.ts`).

## 2. Umsetzung (`versendbar.ts`)

- Vertrag `Versendbar` mit einer Methode `versende(an: string): string` und
  einer `readonly`-Eigenschaft `id: string`.
- Zwei **verschiedene** Klassen: `Brief` (Post) und `Paket` (Kurier mit
  Gewicht) — gleiche Schnittstelle, unterschiedliche Umsetzung.
- Funktion `versendeAn(item: Versendbar, an: string)`, die **nur den
  Vertragstyp** als Parameter kennt; Aufruf mit beiden Klassen.

## 3. Tests (`versendbar_test.ts`, `deno test` grün)

- beide Klassen erfüllen den Vertrag (Funktion akzeptiert beide)
- ein Objekt mit passender Form **ohne** `implements` wird ebenfalls akzeptiert
