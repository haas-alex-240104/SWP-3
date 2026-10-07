import { assertEquals, assertMatch } from "@std/assert";
import { Brief, Paket, versendeAn } from "./versendbar.ts";
import type { Versendbar } from "./versendbar.ts";

Deno.test("Brief erfuellt den Vertrag (Funktion akzeptiert ihn)", () => {
  const b = new Brief("B-001", "Einladung");
  const text = versendeAn(b, "Anna");
  assertMatch(text, /Brief B-001.*Anna/);
});

Deno.test("Paket erfuellt denselben Vertrag, aber anders", () => {
  const p = new Paket("P-001", 2.5);
  const text = versendeAn(p, "Ben");
  assertMatch(text, /Paket P-001.*Kurier.*Ben/);
  // unterschiedliche Umsetzung bei gleichem Vertrag (was, nicht wie):
  assertEquals(text === versendeAn(new Brief("P-001", "x"), "Ben"), false);
});

Deno.test("structural typing: Objekt MIT Form, OHNE implements, wird akzeptiert", () => {
  const fax = {
    id: "F-001",
    versende(an: string): string {
      return `Fax ${this.id} an ${an} gefaxt`;
    },
  };
  // kein `implements Versendbar` — nur die Form stimmt:
  const v: Versendbar = fax;
  assertEquals(versendeAn(v, "Clara"), "Fax F-001 an Clara gefaxt");
});

Deno.test("readonly id ist im Typ verankert (Check erfolgt via deno check)", () => {
  const b: Versendbar = new Brief("B-002", "Rechnung");
  assertEquals(b.id, "B-002");
});
