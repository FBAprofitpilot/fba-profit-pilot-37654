'use client';

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  // Session prüfen
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        checkPaidStatus(data.session.user.email);
      }
    });
  }, []);

  const checkPaidStatus = async (email: string) => {
    const { data } = await supabase
      .from('paid_users')
      .select('email')
      .eq('email', email)
      .single();
    setIsPaid(!!data);
  };

  const sendMagicLink = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://fbaprofitpilot.de' }
    });
    if (error) setMessage('Fehler: ' + error.message);
    else setMessage('Magic-Link gesendet! Check deine Mails (auch Spam).');
    setLoading(false);
  };

  const signOut = () => supabase.auth.signOut().then(() => setUser(null));

  // Login-Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-8">FBA Profit Pilot</h1>
          <input
            type="email"
            placeholder="Deine E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <button
            onClick={sendMagicLink}
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Wird gesendet…' : 'Magic-Link senden'}
          </button>
          {message && <p className="mt-4 text-sm">{message}</p>}
          <p className="mt-8 text-xs text-gray-500">
            Nur zahlende Kunden erhalten Zugriff.<br />
            <a href="https://profitpilot28.gumroad.com/l/jvlif" className="text-blue-600 underline">
              Jetzt abonnieren (19 €/Monat)
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Bezahlt-Check
  if (!isPaid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Zugang noch nicht freigeschaltet</h2>
          <p className="mb-6">Dein Kauf wird gerade verarbeitet – in wenigen Minuten ist dein Dashboard bereit.</p>
          <button onClick={() => checkPaidStatus(user.email)} className="text-blue-600 underline">
            Erneut prüfen
          </button>
        </div>
      </div>
    );
  }

  // Dashboard (dein Rechner)
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">FBA Profit Pilot – Dashboard</h1>
          <button onClick={signOut} className="text-sm text-gray-500 underline">Abmelden</button>
        </div>
        {/* Hier deinen bestehenden Rechner-Code einfügen – ich kann dir den vollen Block schicken */}
        <p className="text-center mt-8 text-green-600 font-medium">
          Willkommen, {user.email}! Du hast vollen Zugriff.
        </p>
      </div>
    </div>
  );
}
