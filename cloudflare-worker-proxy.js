// Cloudflare Worker — NVIDIA API CORS proxy
//
// Bu dosya NVIDIA API'ye giden isteği tarayıcı yerine bir sunucudan geçirir,
// böylece "Load failed" / CORS hatası ortadan kalkar. API key hâlâ sadece
// senin cihazından geçer — bu worker key'i saklamaz veya loglamaz, sadece
// olduğu gibi iletir.
//
// KURULUM (yaklaşık 3 dakika, tamamen ücretsiz):
// 1) https://workers.cloudflare.com adresine git, ücretsiz hesap aç.
// 2) Dashboard'da "Create Worker" de, ismini istediğin gibi ver (örn. nvidia-proxy).
// 3) Açılan editördeki örnek kodu SİL, bu dosyanın tamamını yapıştır.
// 4) "Deploy" butonuna bas.
// 5) Sana verilen adres şuna benzer olacak:
//      https://nvidia-proxy.SENIN-KULLANICI-ADIN.workers.dev
// 6) Terminal uygulamasında Ayarlar → "API adresi" kutusuna şunu yapıştır:
//      https://nvidia-proxy.SENIN-KULLANICI-ADIN.workers.dev/v1/chat/completions
//    (sonuna /v1/chat/completions eklemeyi unutma)
// 7) Kaydet — artık istekler bu worker üzerinden NVIDIA'ya gidecek.

const NVIDIA_UPSTREAM = "https://integrate.api.nvidia.com/v1/chat/completions";

export default {
  async fetch(request) {
    // Tarayıcının "preflight" (OPTIONS) isteğine izin ver
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Only POST is supported", { status: 405 });
    }

    try {
      const upstreamResp = await fetch(NVIDIA_UPSTREAM, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": request.headers.get("Authorization") || "",
          "Accept": request.headers.get("Accept") || "application/json",
        },
        body: request.body,
      });

      const resp = new Response(upstreamResp.body, upstreamResp);
      resp.headers.set("Access-Control-Allow-Origin", "*");
      return resp;
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
