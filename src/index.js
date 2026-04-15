import { astro } from 'iztro';

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: "Vektor Systems - Unauthorized." }), { 
        status: 401, 
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    try {
      const inputData = await request.json();
      
      // Iztro Cinsiyet formatı (Hesaplama için '男' veya '女' parametresi bekliyor)
      const genderStr = inputData.gender === 'M' ? '男' : '女';
      
      // Doğru fonksiyon: astro.bySolar(Tarih, Saat Indeksi, Cinsiyet)
      const chart = astro.bySolar(inputData.date, inputData.timeIndex, genderStr);

      return new Response(JSON.stringify({ status: "success", data: chart }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }
  },
};