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
- **Cihazlar arası senkronizasyon** (opsiyonel) — Deno Deploy proxy'n üzerinden sohbetlerini iPhone + laptop arasında paylaşabilirsin, aşağıya bak

## Cihazlar arası senkronizasyon (iPhone + laptop)

Bir sohbete iPhone'da başlayıp laptop'ta devam etmek istiyorsan:

1. `deno-deploy-proxy.js` dosyasının **en güncel halini** Deno Deploy projene yapıştır (NVIDIA proxy'sinin yanına artık `/sync/get` ve `/sync/set` uçları da eklendi). Deploy'a bas — proxy adresin **değişmez**.
2. Uygulamada Ayarlar → **"Cihazlar arası senkronizasyon"** bölümünü aç:
   - **Sunucu adresi**: Deno Deploy proxy'nin kök adresi (örn. `https://exact-minnow-4410.koruker.deno.net` — sonuna `/v1/...` ekleme).
   - **Senkronizasyon ID**: "Rastgele oluştur"a bas, çıkan kodu not al (ya da aşağıdaki Google girişini kullan, otomatik doldurur).
   - Açma anahtarını aç, Kaydet.
3. **Diğer cihazda** (örn. laptop) da uygulamayı aç, Ayarlar'da aynı bölüme gir, **aynı Sunucu adresi + aynı Senkronizasyon ID'sini** birebir gir, açma anahtarını aç, Kaydet.
4. Artık her sohbet değişikliği birkaç saniye içinde otomatik olarak diğer cihaza yansır. Uygulamayı her açtığında da otomatik kontrol eder. "Şimdi senkronize et" ile de anlık zorlayabilirsin.

**Önemli:**
- Senkronizasyon ID'si aynı zamanda tek koruman — kimseyle paylaşma, rastgele oluşturulan uzun kodu kullan.
- Birleştirme mantığı basit "son güncellenen kazanır" şeklinde çalışır (sohbet bazında). Aynı sohbeti iki cihazda **aynı anda** düzenlemezsen sorunsuz çalışır; nadir bir çakışma senaryosunda en son kaydedilen taraf kazanır.
- Bir cihazda sildiğin bir sohbet, senkronize olmadan önce diğer cihaz hâlâ eski kopyayı gönderirse geri gelebilir — bu basit senkronizasyon modelinin bilinen bir sınırıdır, iki cihazlı kişisel kullanım için pratikte sorun çıkarmaz.

### Google ile giriş (Senkronizasyon ID'sini elle kopyalamamak için)

Senkronizasyon ID'sini iki cihaza da elle yazmak yerine, aynı Google hesabıyla
giriş yaparsan otomatik aynı ID türetilir.

**Google Cloud Console'da tek seferlik kurulum:**
1. [console.cloud.google.com](https://console.cloud.google.com) → yeni proje oluştur.
2. **APIs & Services → OAuth consent screen** → "External" seç, uygulama adı ve
   e-postanı gir, kaydet. Kendi hesabını test kullanıcısı olarak ekle.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** →
   Uygulama türü: **Web application**.
4. **Authorized JavaScript origins** kısmına GitHub Pages adresini ekle
   (örn. `https://koruker.github.io` — path olmadan, tam origin).
5. Oluşan **Client ID**'yi (`xxxxx.apps.googleusercontent.com`) kopyala.

**Uygulamada:**
1. Ayarlar → "Google ile giriş" → Client ID'yi yapıştır.
2. Çıkan Google butonuna dokunup giriş yap. Senkronizasyon ID'si otomatik
   dolar ve senkronizasyon açılır.
3. **Diğer cihazda** aynı Client ID'yi gir, aynı Google hesabıyla giriş yap —
   otomatik olarak aynı Senkronizasyon ID'sine sahip olursunuz.

**Bilinmesi gerekenler:**
- Bu, verilerini Google'a göndermez — Google Sign-In sadece kimliğini
  doğrulayıp cihazlar arasında aynı kodu türetmek için kullanılır. Sohbetlerin
  hâlâ sadece senin Deno Deploy sunucunda tutuluyor.
- Güvenlik modeli, elle girilen Senkronizasyon ID'siyle aynıdır: kod
  (bu durumda Google hesabından türetilen kod) kimin elindeyse o erişebilir.
  Sunucu tarafında Google token'ı doğrulanmıyor — bu sadece ID'yi elle
  kopyalamaktan kurtarmak için bir kolaylık katmanı.
- iPhone'da Safari'nin gizlilik korumaları (ITP) yüzünden "sessiz otomatik
  giriş" (sayfayı her açtığında kendiliğinden oturum açması) bazen
  çalışmayabilir — bu durumda Ayarlar'ı açıp Google butonuna elle bir kez
  daha dokunman yeterli.

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
