import { assertEquals, assertThrows } from "@std/assert";
import { Konto } from "./konto.ts";

// --- Invariante 1: kontostand >= 0 ---

Deno.test("I1: Konstruktor mit negativem Start wirft", () => {
  assertThrows(() => new Konto("AT1", -5), Error, "negativ");
});

Deno.test("I1: abheben ueber Stand hinaus wirft, Stand bleibt unveraendert", () => {
  const k = new Konto("AT1", 500);
  assertThrows(() => k.abheben(600), Error, "Dispo");
  assertEquals(k.kontostand, 500); // kein halb-veraendertes Objekt
});

Deno.test("I1: ueberweisen ohne Deckung wirft, BEIDE Konten bleiben unveraendert", () => {
  const a = new Konto("AT1", 500);
  const b = new Konto("AT2", 100);
  assertThrows(() => a.ueberweisen(b, 600), Error, "Dispo");
  assertEquals(a.kontostand, 500);
  assertEquals(b.kontostand, 100);
});

// --- Invariante 2: Bewegungsbetrag > 0 ---

Deno.test("I2: einzahlen(0 / negativ) wirft", () => {
  const k = new Konto("AT1", 500);
  assertThrows(() => k.einzahlen(0), Error, "positiv");
  assertThrows(() => k.einzahlen(-50), Error, "positiv");
  assertEquals(k.kontostand, 500);
});

Deno.test("I2: abheben(0 / negativ) wirft", () => {
  const k = new Konto("AT1", 500);
  assertThrows(() => k.abheben(-10), Error, "positiv");
  assertEquals(k.kontostand, 500);
});

// --- gruener Pfad: gueltige Uebergaenge funktionieren ---

Deno.test("gruener Pfad: einzahlen/abheben/ueberweisen mit gueltigen Betraegen", () => {
  const a = new Konto("AT1", 500);
  const b = new Konto("AT2", 100);
  a.einzahlen(100);
  assertEquals(a.kontostand, 600);
  a.abheben(200);
  assertEquals(a.kontostand, 400);
  a.ueberweisen(b, 150);
  assertEquals(a.kontostand, 250);
  assertEquals(b.kontostand, 250);
});
