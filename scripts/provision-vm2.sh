
#!/usr/bin/env bash

set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

# ==========================================
# CONFIGURACOES DA APLICACAO
# ==========================================

APP_SOURCE="/vagrant_data"
APP_DIR="/opt/eventos-e-ingressos"
SERVICE_NAME="eventos-e-ingressos"

echo "=========================================="
echo "INICIANDO PROVISIONAMENTO DA VM2"
echo "=========================================="

# ==========================================
# 1. ATUALIZAR O UBUNTU E INSTALAR FERRAMENTAS
# ==========================================

echo "[1/6] Atualizando pacotes do Ubuntu..."

apt-get update

apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  rsync

# ==========================================
# 2. INSTALAR NODE.JS 24
# ==========================================

echo "[2/6] Verificando Node.js..."

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || true)"

if [ "$NODE_MAJOR" != "24" ]; then

  echo "Instalando Node.js 24..."

  curl -fsSL https://deb.nodesource.com/setup_24.x \
    -o /tmp/nodesource_setup.sh

  bash /tmp/nodesource_setup.sh

  apt-get install -y nodejs

  rm -f /tmp/nodesource_setup.sh

else

  echo "Node.js 24 ja esta instalado."

fi

echo "Versao do Node.js:"
node --version

echo "Versao do NPM:"
npm --version

# ==========================================
# 3. VERIFICAR A PASTA SINCRONIZADA
# ==========================================

echo "[3/6] Verificando arquivos do projeto..."

if [ ! -d "$APP_SOURCE" ]; then
  echo "ERRO: pasta /vagrant_data nao encontrada."
  exit 1
fi

for FILE in package.json package-lock.json index.js; do

  if [ ! -f "$APP_SOURCE/$FILE" ]; then
    echo "ERRO: arquivo $FILE nao encontrado em $APP_SOURCE."
    exit 1
  fi

done

# ==========================================
# 4. COPIAR O PROJETO PARA A VM2
# ==========================================

echo "[4/6] Preparando pasta de execucao..."

install -d -o vagrant -g vagrant "$APP_DIR"

rsync -a --delete \
  --exclude='node_modules/' \
  --exclude='.git/' \
  --exclude='.vagrant/' \
  --exclude='coverage/' \
  "$APP_SOURCE/" "$APP_DIR/"

chown -R vagrant:vagrant "$APP_DIR"

# ==========================================
# 5. INSTALAR DEPENDENCIAS DA APLICACAO
# ==========================================

echo "[5/6] Instalando dependencias do projeto..."

su -s /bin/bash vagrant -c \
  "cd '$APP_DIR' && npm ci --omit=dev --no-audit --no-fund"

# ==========================================
# 6. CONFIGURAR O SERVICO DA APLICACAO
# ==========================================

echo "[6/6] Configurando servico systemd..."

cat > /etc/systemd/system/eventos-e-ingressos.service <<'SERVICE'

[Unit]
Description=API Eventos e Ingressos
After=network.target

[Service]
Type=simple
User=vagrant
Group=vagrant
WorkingDirectory=/opt/eventos-e-ingressos
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /opt/eventos-e-ingressos/index.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target

SERVICE

systemctl daemon-reload

systemctl enable eventos-e-ingressos

systemctl restart eventos-e-ingressos

sleep 2

if systemctl is-active --quiet "$SERVICE_NAME"; then

  echo "=========================================="
  echo "PROVISIONAMENTO CONCLUIDO COM SUCESSO!"
  echo "=========================================="

else

  echo "ERRO: a aplicacao nao iniciou corretamente."

  journalctl -u "$SERVICE_NAME" -n 30 --no-pager

  exit 1

fi
