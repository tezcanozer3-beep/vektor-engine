import { astrolabe } from 'iztro';

export default {
  async fetch(request, env, ctx) {
    // CORS ayarları (Frontend'in bu API ile konuşabilmesi için)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Sadece POST isteklerini kabul et (Güvenlik)
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: "Vektor Systems - Unauthorized Access." }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    try {
      // Frontend'den (ast.html) gelen JSON verisini al
      const inputData = await request.json();
      
      // Iztro'ya Subject 01 verilerini gönder ve haritayı matematiksel olarak hesapla
      const chart = astrolabe({
        solarDate: inputData.date,       // Örn: '1990-05-20'
        timeIndex: inputData.timeIndex,  // ZWDS Saat dilimi (0-12 arası indeks)
        gender: inputData.gender         // 'M' (Erkek) veya 'F' (Kadın)
      });

      // Hesaplanan elit veriyi Frontend'e geri gönder
      return new Response(JSON.stringify({ 
        status: "success", 
        data: chart 
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  },
};