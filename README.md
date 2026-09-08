# Terminal — kişisel NVIDIA API sohbet uygulaman

Tek sayfalık, backend'siz bir sohbet arayüzü. NVIDIA'nın OpenAI-uyumlu API'sine
doğrudan tarayıcıdan bağlanır, akan (streaming) yanıt verir, markdown + kod
vurgulama yapar, dosya/görsel eklemeyi destekler ve birden fazla sohbeti
tarayıcının local storage'ında saklar. API key'in sadece kendi cihazında kalır,
hiçbir sunucuya gitmez.

## Dosyalar

- `index.html` — tüm uygulama (HTML + CSS + JS, tek dosya)
- `manifest.json` — iPhone'da "Ana Ekrana Ekle" ile tam ekran (Safari çubuğu
  olmadan) açılması için
- `icon-192.png`, `icon-512.png` — uygulama ikonu

## 1) Yayınlama (GitHub Pages — ücretsiz, 5 dakika)

1. GitHub'da yeni bir **repo** oluştur (private de olabilir — sadece sen
   kullanacağın için public olsa da sorun değil, kimse URL'i bilmeden
   içeriğe erişemez).
2. Bu 4 dosyayı (`index.html`, `manifest.json`, `icon-192.png`, `icon-512.png`)
   repo'ya yükle.
3. Repo **Settings → Pages** kısmından `main` branch / root klasörü seç ve
   kaydet.
4. Birkaç dakika içinde `https://kullanici-adin.github.io/repo-adi/`
   adresinde yayında olur.

Repo'yu private tutarsan GitHub Pages'in private repo'larda çalışması için
GitHub Pro/Team gerekir (kişisel ücretsiz hesapta Pages sadece public repo'da
çalışır). Kişisel kullanım için public repo + tahmin edilmesi zor bir repo adı
pratikte yeterli bir gizlilik sağlar; tam gizlilik istersen GitHub Pro'ya
geçebilir ya da Cloudflare Pages / Netlify gibi private deploy destekleyen
ücretsiz alternatifleri kullanabilirsin.

## 2) iPhone'a kurulum

1. Yayın URL'ini Safari'de aç (Chrome değil — "Ana Ekrana Ekle" özelliği
   iOS'ta sadece Safari'de var).
2. Paylaş simgesine dokun → **"Ana Ekrana Ekle"**.
3. Ana ekranda normal bir uygulama gibi ikonla açılır, adres çubuğu olmadan
   tam ekran çalışır.

## 3) İlk kurulum (uygulama içinde)

1. Açılışta otomatik olarak Ayarlar ekranı gelir.
2. **NVIDIA API Key**'ini gir (build.nvidia.com → hesap → API Keys).
3. **Model ID** olarak build.nvidia.com'daki bir modelin sayfasındaki API
   sekmesinden kopyaladığın tam ID'yi ekle, örn:
   - `meta/llama-3.1-70b-instruct`
   - `qwen/qwen2.5-coder-32b-instruct` (kod için)
   - `deepseek-ai/deepseek-r1` (akıl yürütme için)
4. Kaydet — artık sohbete başlayabilirsin.

Birden fazla model ekleyip Ayarlar'dan aralarında geçiş yapabilirsin.

## Özellikler

- **Akan yanıt (streaming)** — model yazarken ekranda anlık görünür
- **Markdown + kod vurgulama** — kod bloklarında dil etiketi ve "Kopyala" butonu
- **Dosya ekleme** — metin/kod dosyaları (.txt, .py, .js, .json, .gcode, .nc
  vb., 300KB'a kadar) mesaja otomatik olarak bağlam olarak eklenir
- **Görsel ekleme** — png/jpg/webp, vision destekleyen bir model seçtiysen
  (örn. `meta/llama-3.2-90b-vision-instruct`) resmi anlayabilir
- **Sürükle-bırak** — dosyayı pencereye bırakman yeterli
- **Çoklu sohbet** — sol panelde geçmiş sohbetler, yeniden adlandırma, silme
- **Sistem talimatı / temperature / max tokens** — Ayarlar'dan ayarlanabilir
- Her şey `localStorage`'da tutulur — sunucu, veritabanı, hesap yok

## CORS hakkında önemli not

NVIDIA'nın `integrate.api.nvidia.com` endpoint'i tarayıcıdan gelen doğrudan
isteklere izin vermiyor — bu yüzden uygulamada **"Load failed"** (Safari) ya
da "Failed to fetch" (Chrome) hatası alırsın. Bu bir bug değil, NVIDIA
API'sinin tarayıcı-içi isteklere kapalı olmasından kaynaklanıyor; sunucudan
(backend) gelen isteklere izin veriyor. Çözüm: aradan çok küçük, ücretsiz bir
proxy geçirmek.

**Kurulum (3 dakika):**

1. Bu repo'daki `cloudflare-worker-proxy.js` dosyasını aç, içindeki
   adım adım talimatı takip et (özetle: workers.cloudflare.com'da ücretsiz
   hesap aç, "Create Worker" de, dosyanın içeriğini yapıştır, Deploy'a bas).
2. Sana verilen adres şuna benzer olacak:
   `https://nvidia-proxy.kullanici-adin.workers.dev`
3. Terminal uygulamasında **Ayarlar → API adresi** kutusuna şunu yapıştır
   (sonuna `/v1/chat/completions` eklemeyi unutma):
   `https://nvidia-proxy.kullanici-adin.workers.dev/v1/chat/completions`
4. Kaydet — istekler artık bu proxy üzerinden gidiyor, key hâlâ sadece senin
   cihazından geçiyor, proxy hiçbir şey saklamıyor/loglamıyor.

Ayarlar'daki bu alanı boş bırakırsan uygulama doğrudan NVIDIA'nın adresini
dener; proxy'ye ihtiyaç olmadığı ortaya çıkarsa (NVIDIA ileride CORS açarsa)
alanı tekrar boşaltman yeterli.

## Güvenlik notu

API key tarayıcı `localStorage`'ında düz metin olarak tutulur. Bu, tek başına
kullandığın kişisel bir araç için makul bir tercih ama:
- Paylaşılan/ortak bir cihazda kullanma
- Uygulamayı başkasıyla paylaşmayacaksan (zaten öyle planlanmadı) sorun yok
- İstersen build.nvidia.com üzerinden bu key için harcama/oran limiti
  koyabilirsin, sızıntı riskine karşı ek güvence olur
