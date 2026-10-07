/**
 * KM5-01 — Klasse, Instanz, Zustand
 * Bauplan: class Konto. Instanzen: jedes `new` erzeugt ein eigenes Objekt.
 * Zustand: kontostand pro Instanz. Identität: iban (readonly).
 */
export class Konto {
  readonly iban: string;
  private _kontostand: number;

  constructor(iban: string, startBetrag: number) {
    this.iban = iban;
    this._kontostand = startBetrag;
  }

  /** Lesen über getter — kein direkter Feldzugriff von außen. */
  get kontostand(): number {
    return this._kontostand;
  }

  einzahlen(betrag: number): void {
    this._kontostand += betrag;
  }

  /**
   * Identitätsvergleich: gleiche IBAN = gleiches Konto,
   * egal wie unterschiedlich der Kontostand ist.
   */
  equals(other: Konto): boolean {
    return this.iban === other.iban;
  }
}
