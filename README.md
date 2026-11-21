# Vila em Chamas — jogo + multiplayer + app

Tudo numa pasta só. **Não precisa instalar nada** (o servidor não tem dependências), só o Node 18 ou mais novo.

```
vila-app/
├─ server.js            ← servidor: entrega o jogo e faz o multiplayer (WebSocket)
├─ package.json
├─ Dockerfile           ← opcional (Fly.io, Railway, Render, VPS…)
└─ public/
   ├─ index.html        ← o jogo
   ├─ manifest.webmanifest, sw.js, icon-*.png   ← viram app instalável (PWA)
```

## 1) Testar no seu computador
```
node server.js
```
Abra `http://localhost:3000`. Para testar o multiplayer, abra em duas abas (ou em dois aparelhos na mesma rede, usando `http://IP-DO-PC:3000`), vá em **Online**, use o mesmo código de sala e entre.

## 2) Colocar na internet (grátis)
1. Suba esta pasta num repositório do GitHub.
2. Em **Render.com** (ou Railway/Fly.io): *New → Web Service* → escolha o repositório.
   - Build command: *(vazio)* · Start command: `node server.js`
3. Pronto: o endereço que o Render der (ex.: `meujogo.onrender.com`) já serve o jogo **e** o multiplayer. Quem abrir esse link entra direto nas salas, sem digitar servidor.
   - No plano grátis o servidor “dorme” quando ninguém usa; o primeiro acesso demora uns segundos.

## 3) Como o multiplayer funciona
- Salas por código (até 3 jogadores). Cada um enfrenta os próprios goblins e vê os outros em tempo real (posição, visual, nome).
- O jogo manda a posição ~10x por segundo; o servidor só repassa. Há limites contra abuso: 40 mensagens/s, 4 KB por mensagem, 500 salas, desconexão de quem fica 60 s sem responder.
- Dentro do claude.ai o jogo continua usando a sala do Claude; fora dele usa este servidor automaticamente.
- Se o jogo for aberto de outro lugar (arquivo no celular, app), digite o endereço do servidor no campo **Servidor** da tela Online (fica salvo).

## 4) Instalar como app (PWA) — o jeito mais rápido
Abra o link do jogo (https) no Chrome/Safari do celular → **Adicionar à tela inicial**. Abre em tela cheia, com ícone, e o jogo funciona offline (o online precisa de internet).

## 5) App de verdade (Android/iOS) com Capacitor
1. Em `public/index.html`, troque `window.VC_DEFAULT_SERVER=''` pelo seu endereço (ex.: `'meujogo.onrender.com'`), para o app já saber onde está o servidor.
2. Na pasta do projeto:
```
npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "Vila em Chamas" com.seunome.vila --web-dir=public
npx cap add android        # e/ou: npx cap add ios
npx cap sync
npx cap open android       # abre o Android Studio → Run / Build APK ou AAB
```
3. Para a Play Store: gere o AAB no Android Studio, crie conta de desenvolvedor (US$ 25, uma vez) e envie. Para a App Store é preciso um Mac e conta Apple Developer.
Alternativa sem Android Studio: **pwabuilder.com** — cole o link do jogo publicado e baixe o pacote Android.

## 6) Antes de lançar de verdade (recomendado)
- A fonte “Press Start 2P” vem do Google Fonts; para funcionar 100% offline, baixe o arquivo da fonte para `public/` e aponte o `@font-face` para ele.
- O multiplayer atual confia nos clientes (só mostra posições). Se um dia houver ranking ou itens online, a lógica precisa passar para o servidor.
- Se quiser contas de jogador, salvamento na nuvem ou lista de salas públicas, o próximo passo é um banco (ex.: Supabase/Firebase).
