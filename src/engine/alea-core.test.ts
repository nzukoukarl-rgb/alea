import { describe, expect, it } from "vitest";
import { makeBirthIdentity, tirage_pays_pondere, tirage_prenom, tirage_revenu } from "./alea-core";
import { newLife } from "@/lib/sim/engine";

describe("Alea engine contract", () => {
  it("keeps a fixed seed reproducible", () => {
    expect(makeBirthIdentity(123456)).toEqual(makeBirthIdentity(123456));
    expect(tirage_pays_pondere(123456)).toBe(tirage_pays_pondere(123456));
    expect(newLife(123456, "chapitres", false)).toEqual(newLife(123456, "chapitres", false));
  });
  it("uses a country-compatible identity", () => {
    const identity = makeBirthIdentity(7);
    expect(identity.name).toBe(tirage_prenom(identity.country.name, identity.sex, 7 + 6));
    expect(identity.incomeQuintile).toBeGreaterThanOrEqual(1);
    expect(identity.incomeQuintile).toBeLessThanOrEqual(5);
    expect(tirage_revenu(identity.country.name, 7)[0]).toBeGreaterThanOrEqual(1);
    expect(identity.religion).not.toBe("protestantisme");
  });
});
