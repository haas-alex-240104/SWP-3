// HÜ-Domäne UE 3: Interface als Vertrag am Produkt (Shop).
// Dein Job: Produkt implementiert beide Verträge, bis produkt_test.ts grün ist.
export interface Comparable<T> {
  compareTo(other: T): number; // <0: dieses kleiner · 0: gleich · >0: größer
}

export interface Versendbar {
  versandkosten(): number; // in Cent
}

export class Produkt implements Comparable<Produkt>, Versendbar {
  readonly name: string;
  private preisCent: number;
  private gewichtKg: number;

  constructor(name: string, preisCent: number, gewichtKg: number) {
    if (preisCent < 0) {
      throw new Error(`Preis darf nicht negativ sein (war ${preisCent})`);
    }
    if (gewichtKg < 0) {
      throw new Error(`Gewicht darf nicht negativ sein (war ${gewichtKg})`);
    }
    this.name = name;
    this.preisCent = preisCent;
    this.gewichtKg = gewichtKg;
  }

  get preis(): number {
    return this.preisCent;
  }

  // Vertrag 1 erfüllt: Vergleich nach preisCent.
  compareTo(other: Produkt): number {
    return this.preisCent - other.preisCent;
  }

  // Vertrag 2 erfüllt: 400 Cent Grundgebühr + 200 Cent je kg.
  versandkosten(): number {
    return 400 + 200 * this.gewichtKg;
  }

  toString(): string {
    return `${this.name} (${
      (this.preisCent / 100).toFixed(2)
    } €, ${this.gewichtKg} kg)`;
  }
}

// Structural typing: Diese Funktion verlangt nur die FORM von Versendbar.
// Warum kompiliert akzeptiereVersendbar({ versandkosten: () => 0 }) ohne
// implements und ohne class? Weil TypeScript strukturell (nicht nominal)
// prüft: Versendbar fordert nur eine Methode versandkosten(): number. Das
// Objekt-Literal hat genau diese Form, also ist es zuweisungskompatibel.
// implements wäre nur Dokumentation bzw. ein Zusatz-Check für Klassen,
// aber keine Voraussetzung für die Typkompatibilität.
export function akzeptiereVersendbar(v: Versendbar): number {
  return v.versandkosten();
}
