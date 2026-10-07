/**
 * KM5-02 — Kapselung & Invarianten
 *
 * Invariante 1: kontostand >= 0 ("nie negativ, kein Dispo").
 * Invariante 2: jeder Bewegungsbetrag > 0 ("nur positive Betraege").
 *   + daraus abgeleitet: abheben/ueberweisen nur bei Deckung
 *     (betrag <= kontostand), sonst wuerde Invariante 1 brechen.
 *
 * Sicherung (Fail-Fast): throw im Konstruktor UND in jeder
 * mutierenden Methode (einzahlen, abheben, ueberweisen).
 * Kein setter fuer kontostand; Lesen nur ueber getter.
 */
export class Konto {
  readonly iban: string;
  private _kontostand: number;

  constructor(iban: string, startBetrag: number) {
    if (startBetrag < 0) {
      throw new Error(`Startbetrag darf nicht negativ sein (war ${startBetrag})`);
    }
    this.iban = iban;
    this._kontostand = startBetrag;
  }

  /** Lesen ist unproblematisch — Zugriff, keine Aenderung. */
  get kontostand(): number {
    return this._kontostand;
  }

  // Absichtlich KEIN setter: `set kontostand(...)` wuerde die Pruefung umgehen.

  einzahlen(betrag: number): void {
    if (betrag <= 0) throw new Error(`Betrag muss positiv sein (war ${betrag})`);
    this._kontostand += betrag;
  }

  abheben(betrag: number): void {
    if (betrag <= 0) throw new Error(`Betrag muss positiv sein (war ${betrag})`);
    if (betrag > this._kontostand) {
      throw new Error(
        `Kein Dispo vereinbart: Stand ${this._kontostand}, verlangt ${betrag}`,
      );
    }
    this._kontostand -= betrag;
  }

  /**
   * Atomar: entweder beide Konten stimmen oder gar keines.
   * Erst ALLES pruefen (Fail-Fast), dann erst buchen —
   * so bleibt nie ein halb-veraendertes Objekt zurueck.
   */
  ueberweisen(auf: Konto, betrag: number): void {
    if (betrag <= 0) throw new Error(`Betrag muss positiv sein (war ${betrag})`);
    if (betrag > this._kontostand) {
      throw new Error(
        `Kein Dispo vereinbart: Stand ${this._kontostand}, verlangt ${betrag}`,
      );
    }
    // Ab hier kann nichts mehr fehlschlagen:
    this._kontostand -= betrag;
    auf._kontostand += betrag;
  }

  equals(other: Konto): boolean {
    return this.iban === other.iban;
  }
}
