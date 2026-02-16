#!/bin/bash
set -e
echo ""
echo "=========================================="
echo "  KwikReel M1 Build Machine Setup"
echo "=========================================="
echo ""
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
ok()   { echo -e "${GREEN} $1${NC}"; }
warn() { echo -e "${YELLOW} $1${NC}"; }
fail() { echo -e "${RED} $1${NC}"; }

echo "--- Step 1: Checking Homebrew ---"
if command -v brew &> /dev/null; then
    ok "Homebrew already installed"
else
    warn "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    if [[ -f /opt/homebrew/bin/brew ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi
echo ""

echo "--- Step 2: Checking Node.js ---"
if command -v node &> /dev/null; then
    ok "Node.js already installed ($(node --version))"
else
    warn "Installing Node.js..."
    brew install node
fi
echo ""

echo "--- Step 3: Installing Claude Code CLI ---"
if command -v claude &> /dev/null; then
    ok "Claude Code already installed"
else
    warn "Installing Claude Code CLI..."
    npm install -g @anthropic-ai/claude-code
    NPM_BIN=$(npm config get prefix)/bin
    if [ -f "$NPM_BIN/claude" ]; then
        echo "export PATH=\"$NPM_BIN:\$PATH\"" >> ~/.zprofile
        export PATH="$NPM_BIN:$PATH"
        ok "Claude Code installed"
    fi
fi
echo ""

echo "--- Step 4: Setting up SSH for VPS ---"
VPS_IP="76.13.107.27"
SSH_KEY="$HOME/.ssh/id_kwikreel_vps"
mkdir -p ~/.ssh && chmod 700 ~/.ssh
if [ -f "$SSH_KEY" ]; then
    ok "SSH key already exists"
else
    ssh-keygen -t ed25519 -f "$SSH_KEY" -C "m1-build-machine" -N ""
    ok "SSH key created"
    echo ""
    echo "=========================================="
    echo "  Copy this public key to VPS:"
    echo "=========================================="
    cat "${SSH_KEY}.pub"
    echo "=========================================="
    echo "Press Enter to try ssh-copy-id (needs VPS password)..."
    read -r
    ssh-copy-id -i "$SSH_KEY" "root@$VPS_IP" 2>/dev/null || warn "ssh-copy-id failed  copy key manually"
fi
if ! grep -q "kwikreel-vps" ~/.ssh/config 2>/dev/null; then
    printf "\nHost kwikreel-vps\n    HostName %s\n    User root\n    IdentityFile %s\n    StrictHostKeyChecking no\n" "$VPS_IP" "$SSH_KEY" >> ~/.ssh/config
    chmod 600 ~/.ssh/config
    ok "SSH config added (use: ssh kwikreel-vps)"
fi
echo ""

echo "--- Step 5: Setting up API keys ---"
ENV_FILE="$HOME/.env"
if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" << 'ENVEOF'
# KwikReel M1 Build Machine  API Keys
ELEVENLABS_API_KEY=your_key_here
PEXELS_API_KEY=your_key_here
IDEOGRAM_API_KEY=your_key_here
OPENART_API_KEY=your_key_here
HIGGSFIELD_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
RUNWAY_API_KEY=your_key_here
ENVEOF
    chmod 600 "$ENV_FILE"
    ok "Created ~/.env  edit it with: nano ~/.env"
else
    ok "~/.env already exists"
fi
echo ""

echo "--- Step 6: Setting up workspace ---"
WORKSPACE="$HOME/kwikreel"
mkdir -p "$WORKSPACE"
if [ ! -d "$WORKSPACE/kwikreel-platform" ]; then
    git clone https://github.com/biju5555-arch/kwikreel-platform.git "$WORKSPACE/kwikreel-platform" 2>/dev/null && ok "Repo cloned" || warn "Git clone failed"
else
    ok "Repo already cloned"
fi
echo ""

echo "--- Step 7: Testing ---"
ssh -o ConnectTimeout=5 -o BatchMode=yes kwikreel-vps "echo 'SSH_OK'" 2>/dev/null && ok "SSH to VPS works" || warn "SSH to VPS failed"
curl -s --max-time 5 "http://$VPS_IP:3001/health" 2>/dev/null | grep -q "ok" && ok "VPS API healthy" || warn "VPS API check failed"
command -v claude &>/dev/null && ok "Claude Code available" || warn "Claude Code not in PATH"
echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "  Next: nano ~/.env (add real API keys)"
echo "  Then: cd ~/kwikreel/kwikreel-platform && claude"
echo "=========================================="
