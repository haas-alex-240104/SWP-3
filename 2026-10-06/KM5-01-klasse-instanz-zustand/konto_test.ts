import { assertEquals } from "@std/assert";
import { Konto } from "./konto.ts";

Deno.test("gleiche IBAN, verschiedener Stand -> equals() ist true", () => {
  const a = new Konto("AT12 0000 0000 0001", 500);
  const b = new Konto("AT12 0000 0000 0001", 9999);
  assertEquals(a.equals(b), true);
  assertEquals(b.equals(a), true);
});

Deno.test("verschiedene IBAN, gleicher Stand -> equals() ist false", () => {
  const a = new Konto("AT12 0000 0000 0001", 500);
  const b = new Konto("AT12 0000 0000 0002", 500);
  assertEquals(a.equals(b), false);
});

Deno.test("zwei new erzeugen verschiedene Identitaet (=== ist false)", () => {
  const a = new Konto("AT12 0000 0000 0001", 500);
  const b = new Konto("AT12 0000 0000 0001", 500);
  // gleicher Zustand (iban + stand), aber verschiedene Objekte
  assertEquals(a === b, false);
});

Deno.test("Zustand lebt pro Instanz: einzahlen aendert nur diese Instanz", () => {
  const a = new Konto("AT12 0000 0000 0001", 500);
  const b = new Konto("AT12 0000 0000 0002", 500);
  a.einzahlen(100);
  assertEquals(a.kontostand, 600);
  assertEquals(b.kontostand, 500);
});
