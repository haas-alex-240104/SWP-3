/**
 * KM5-03 — Interfaces als Vertrag
 *
 * Vertrag (was, nicht wie): Versendbar verlangt eine readonly-ID
 * plus die Faehigkeit `versende(an)`.
 * Zwei verschiedene Klassen setzen ihn unterschiedlich um.
 * Die Funktion `versendeAn` kennt nur den Vertragstyp.
 */

/** Der Vertrag: jede Versendbar-Instanz hat eine feste id und kann versenden. */
export interface Versendbar {
  readonly id: string;
  versende(an: string): string;
}

/** Umsetzung 1: Brief — versendet per Post. */
export class Brief implements Versendbar {
  readonly id: string;
  constructor(id: string, private betreff: string) {
    this.id = id;
  }
  versende(an: string): string {
    return `Brief ${this.id} ("${this.betreff}") per Post an ${an}`;
  }
}

/** Umsetzung 2: ganz anders — Paket mit Tracking, versendet per Kurier. */
export class Paket implements Versendbar {
  readonly id: string;
  constructor(id: string, private gewichtKg: number) {
    if (gewichtKg <= 0) throw new Error("Gewicht muss positiv sein");
    this.id = id;
  }
  versende(an: string): string {
    return `Paket ${this.id} (${this.gewichtKg} kg) per Kurier an ${an}`;
  }
}

/**
 * Kennt NUR den Vertrag — keine der beiden Klassen.
 * Darum bleibt sie erweiterbar, ohne angefasst zu werden (Open-Closed).
 */
export function versendeAn(item: Versendbar, an: string): string {
  return item.versende(an);
}
