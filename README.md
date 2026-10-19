# /REST · 休養小室

**先歇一會兒，世界可以等等。**

一個以繁體中文為預設的個人休養網頁，以及可重複使用的 `rest` Agent Skill。原創等角小房間、柔和鼠尾草綠與簡潔控制，讓評估、休養與回顧留在同一個舒服的空間。

Traditional Chinese recovery dashboard with a portable skill. Static, deterministic, dependency-free; no account, connectors, sensors, or external requests.

## 先在自己的電腦看看

需要 Node.js 22.20 或更新版本。在本專案資料夾執行：

```sh
node scripts/server.mjs
```

打開 **http://127.0.0.1:4173**。結束時在終端機按 `Ctrl+C`。不要直接雙擊 HTML，瀏覽器的本機檔案限制可能阻擋 JavaScript 模組。

若連接埠已被使用，先指定另一個 `PORT`。PowerShell 範例：

```powershell
$env:PORT = '4175'
node scripts/server.mjs
```

## 可以做什麼

- 能量 0–10，初始顯示「尚未評估」；0 是有效分數。
- 五項需要可複選，也可以不選。
- 七種休養分為生理、心理、社會・環境三組；可採用推薦或手動選擇。
- 產生 2–3 步安排、每步時間與工作節奏建議。
- 每步計時可開始、暫停、重設、提早完成，亦可直接進入回顧。
- 恢復後重新評估能量與每項感受，建議即依新結果調整。
- 可將新能量與尚未舒緩的需要帶入下一輪。
- 房間燈光與日夜切換；選定方式會點亮對應小物。
- 頂部提供 **繁中 / EN** 兩種語言，切換不會重設評估或計時。
- 房間右上角的雨聲開關播放本機合成的柔和雨天白噪音，預設關閉，沒有音訊下載。
- 手機與桌機排版、鍵盤操作、焦點提示、螢幕閱讀器標籤與減少動態偏好。

## 使用 Vercel 發布網站

1. 將解壓後 `rest-kit/` 的**內容**上傳到自己的 GitHub repository 根目錄，讓 `package.json`、`vercel.json`、`scripts/` 和 `skills/` 位於根目錄。
2. 登入 [Vercel](https://vercel.com/new)，選擇 **Add New → Project**，匯入這個 GitHub repository。
3. Root Directory 保持 repository 根目錄。如果你把整個 `rest-kit` 資料夾上傳成子目錄，Root Directory 就改選 `rest-kit`。
4. 確認 **Framework Preset: Other**、**Build Command: `node scripts/build.mjs`**、**Output Directory: `dist`**。這些已寫入 `vercel.json`，不需要環境變數或 API key。
5. 按 **Deploy**。完成後分享專案的正式 `https://你的專案名稱.vercel.app` 網址，手機瀏覽器即可使用；實際網址以 Vercel 顯示的為準。
6. 用手機的無痕視窗檢查正式網址。如果要求登入 Vercel，檢查該專案的 **Settings → Deployment Protection**，確保你要公開分享的正式網站可供訪客存取。請分享 production domain，而不是受保護的 preview URL。

後續將修改推送到 GitHub 的正式分支，Vercel 會重新部署。不需要同時啟用 GitHub Pages。網站只提供靜態檔案，不會上傳訪客的評估。參考 [Vercel 設定文件](https://vercel.com/docs/project-configuration/vercel-json)與[部署存取設定](https://vercel.com/docs/deployment-protection)。

## 另一個選擇：GitHub Pages

1. 建立一個 GitHub repository，例如 `rest-room`。將本資料夾的**內容**放到 repository 根目錄，包含隱藏的 `.github/` 資料夾。預設分支使用 `main`。
2. 開啟 repository 的 **Settings → Pages → Build and deployment → Source → GitHub Actions**。
3. 推送到 `main`，或在 **Actions → Test and publish REST → Run workflow** 手動執行。
4. 工作流程會先測試、產生 `dist/`，再發布網站。完成後，從 Pages 設定或部署紀錄取得真正的網址，通常為 `https://YOUR-USERNAME.github.io/rest-room/`。這是格式範例，請替換成自己的帳號與 repository 名稱。
5. 分享這個 **Pages 網址**，朋友就會看到同一份介面。分享 GitHub repository 網址則是讓別人取得原始碼與 skill。

如果預設分支不是 `main`，請同步修改 `.github/workflows/pages.yml` 的分支條件。不要把整個 repository 當網站內容上傳：現有流程只發布 `dist/`。

流程依照 [GitHub Pages 官方部署說明](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically) 設定。此交付包尚未連接或發布到你的 GitHub 帳號。

### 其他靜態網站代管

```sh
node scripts/build.mjs
```

將產生的 `dist/` **內容**部署到支援 HTTPS 的靜態網站服務即可。入口是 `index.html`，所有路徑皆為相對路徑，可放在子目錄。沒有後端、環境機密或 API key。

## 讓別人安裝 Skill

可獨立安裝的完整資料夾是 **`skills/rest/`**，裡面已包含同一份網頁資產和本機啟動程式。不要只複製 `SKILL.md`。

發布 repository 後，使用者可以對 Codex 說：

```text
Use $skill-installer to install the skill at skills/rest from https://github.com/YOUR-USERNAME/rest-room.
```

或手動把 `skills/rest/` 複製到自己的 `~/.agents/skills/rest/`；專案限定安裝可放到該專案的 `.agents/skills/rest/`。如果新 skill 未出現，重新啟動 Codex。再以 `$rest` 或「啟動 /REST 個人休養建議」使用它。參考 [官方 Skills 文件](https://learn.chatgpt.com/docs/build-skills)。

**相同介面的來源是網頁資產。** Skill 是指引與資源，不能保證每一種聊天環境都以同樣方式內嵌網站。能執行 Node 與開啟瀏覽器的環境，可啟動 skill 內的 `scripts/serve.mjs`。其他環境請使用已發布的 Pages 網址；對話式引導也可獨立使用。若日後希望透過 ChatGPT/Codex 的 plugin 安裝介面分發，另依[官方 plugin 打包說明](https://developers.openai.com/plugins/build/plugins)包裝與測試，不需要為此加入連接器。

## 隱私

網站只把本輪答案保留在分頁記憶體。沒有 cookie、瀏覽器資料庫、追蹤器、遠端字型或第三方套件；重新整理、關閉分頁或重新開始即清除。只有載入網站靜態檔案的網路請求；評估不會傳到伺服器，網址不含答案。網站代管服務仍可能記錄一般連線資訊。

在聊天裡使用 skill 時，訊息受到所用聊天平台的資料政策管理；它與獨立網頁的記憶體模式不同。

## 推薦規則與客製化

`skills/rest/assets/app/core.js` 是規則的單一來源。推薦將勾選需要的權重相加；低能量增加身體休息的優先度。同分時固定依方法清單的順序決定。手動選擇優先，不使用亂數、時間、AI 回覆或外部資料。

每次安排先留 2 分鐘安頓自己，再進行選定方法。能量大於 3 且還有另一個直接對應需要的方法時，加入 3 分鐘的補充步驟。低能量維持兩步。時間是可調整的日常提案，不是醫療處方或經驗證的評估量表。

回顧優先序：能量下降／任一感受加重 → 目前能量偏低 → 有改善 → 無明顯變化。修改原始評估或休養方式會清除舊安排；修改回顧會移除過期建議，待重新提交後再顯示。

| 檔案 | 用途 |
| --- | --- |
| `skills/rest/SKILL.md` | 可攜的 skill 指引 |
| `skills/rest/assets/app/core.js` | 需要、七種方式、計分、安排與回顧 |
| `skills/rest/assets/app/app.js` | 控制項、計時、狀態與焦點 |
| `skills/rest/assets/app/room.js` | 原創 SVG 房間與圖示 |
| `skills/rest/assets/app/style.css` | 顏色與視覺樣式 |
| `skills/rest/assets/app/layout.css` | 響應式排版 |
| `skills/rest/assets/app/i18n.js` | 繁中／英文文案與保留狀態的語言切換 |
| `skills/rest/assets/app/rain.js` | 本機合成雨聲與播放生命週期 |
| `vercel.json` | Vercel 靜態網站部署設定 |
| `skills/rest/scripts/serve.mjs` | 獨立 skill 的本機伺服器 |
| `scripts/` | 專案啟動與靜態輸出 |
| `tests/` | 規則、隱私與伺服器測試 |

原對話中的嵌入式 dashboard 未能取回，因此這是依明確需求重建的版本。五項需要與七種方法的標籤已集中管理，取得原版名稱後可直接調整。視覺參考使用者提供的 [太空盒子](https://www.bilibili.com/toy/slUR9gLKcCttgxMU/index.html) 的舒適房間與精簡控制概念；沒有複製該站的程式、圖片或音樂。

## 測試

```sh
node --test --test-isolation=none tests/*.test.mjs
node scripts/build.mjs
```

測試涵蓋所有 **2,816 組**能量／需要／推薦或手動選擇組合、未評估與 0 的差異、重評結果優先序、計時邊界、靜態資產、隱私限制與伺服器回應。瀏覽器檢查詳見 `QA.md`。目前沒有持續整合中的自動瀏覽器測試，也尚未在 Safari／Firefox 或真實觸控裝置驗證。

MIT License，詳見 `LICENSE`。
