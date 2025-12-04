'use client';

import { useState } from 'react';

export default function Home() {
  const [asin, setAsin] = useState('');
  const [umsatz, setUmsatz] = useState(0);
  const [gewicht, setGewicht] = useState(0);
const [ergebnis, setErgebnis] = useState<{
  referralFee: string;
  fulfillmentFee: string;
  storageFee: string;
  placementFee: string;
  lowInventorySurcharge: string;
  gesamtGebuehren: string;
  nettoGewinn: string;
} | null>(null);

  const berechneGebuehren = () => {
    // Einfache 2025-FBA-Gebühren-Logik (DE-Markt, Standard-Produkt)
    const referralFee = umsatz * 0.15; // 15% Referral
    const fulfillmentFee = gewicht > 0.5 ? 3.50 : 2.80; // Basierend auf Gewicht
    const storageFee = umsatz * 0.02; // Monatlich ~2%
    const placementFee = umsatz * 0.005; // Neu 2025: 0.5%
    const lowInventorySurcharge = umsatz * 0.01; // Wenn Low-Stock
    const gesamtGebuehren = referralFee + fulfillmentFee + storageFee + placementFee + lowInventorySurcharge;
    const nettoGewinn = umsatz - gesamtGebuehren;

    setErgebnis({
      referralFee: referralFee.toFixed(2),
      fulfillmentFee: fulfillmentFee.toFixed(2),
      storageFee: storageFee.toFixed(2),
      placementFee: placementFee.toFixed(2),
      lowInventorySurcharge: lowInventorySurcharge.toFixed(2),
      gesamtGebuehren: gesamtGebuehren.toFixed(2),
      nettoGewinn: nettoGewinn.toFixed(2),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">FBA Profit Pilot</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="ASIN eingeben (z.B. B08XYZ123)"
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Monatsumsatz (€)"
            value={umsatz}
            onChange={(e) => setUmsatz(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Durchschnittsgewicht (kg)"
            value={gewicht}
            onChange={(e) => setGewicht(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={berechneGebuehren}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Berechnen
          </button>
          {ergebnis && (
            <div className="mt-4 space-y-2 text-sm">
              <p>Referral Fee: {ergebnis.referralFee} €</p>
              <p>Fulfillment Fee: {ergebnis.fulfillmentFee} €</p>
              <p>Storage Fee: {ergebnis.storageFee} €</p>
              <p>Placement Fee: {ergebnis.placementFee} €</p>
              <p>Low Inventory Surcharge: {ergebnis.lowInventorySurcharge} €</p>
              <hr />
              <p className="font-bold">Gesamt Gebühren: {ergebnis.gesamtGebuehren} €</p>
              <p className="text-green-600 font-bold">Netto Gewinn: {ergebnis.nettoGewinn} €</p>
              <button
                onClick={() => {
                  const csv = `Fee,Amount\nReferral,${ergebnis.referralFee}\n...`; // Vollständig erweitern später
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'fba-fees.csv';
                  a.click();
                }}
                className="w-full bg-green-500 text-white py-1 rounded mt-2"
              >
                Als CSV exportieren (SevDesk-ready)
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">Beta-Version – Refund-Scanner kommt nächste Woche</p>
      </div>
    </div>
  );
}
