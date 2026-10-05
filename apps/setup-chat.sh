#!/usr/bin/env bash
set -e

echo "Creating SPV Chat scaffold..."

# Clean if exists
rm -rf chat
mkdir -p chat
cd chat

# Folders — quoting brackets to avoid glob expansion
mkdir -p app/auth
mkdir -p app/feed
mkdir -p app/chat
mkdir -p 'app/chat/[id]'
mkdir -p app/profile
mkdir -p 'app/profile/[username]'
mkdir -p app/settings
mkdir -p components
mkdir -p hooks
mkdir -p lib
mkdir -p public
mkdir -p supabase/migrations

# Root files
touch package.json
touch next.config.mjs
touch tailwind.config.js
touch postcss.config.js
touch jsconfig.json
touch .env.example
touch .gitignore

# App files
touch app/layout.jsx
touch app/page.jsx
touch app/globals.css
touch app/auth/page.jsx
touch app/feed/page.jsx
touch app/chat/page.jsx
touch 'app/chat/[id]/page.jsx'
touch 'app/profile/[username]/page.jsx'
touch app/settings/page.jsx

# Components
touch components/AppShell.jsx
touch components/Nav.jsx
touch components/SignIn.jsx
touch components/ProfileSetup.jsx
touch components/PostComposer.jsx
touch components/PostCard.jsx
touch components/Feed.jsx
touch components/ChatList.jsx
touch components/ChatView.jsx
touch components/MessageComposer.jsx
touch components/WalletButton.jsx
touch components/Avatar.jsx

# Hooks
touch hooks/useAuth.js
touch hooks/useProfile.js
touch hooks/useFeed.js
touch hooks/useChat.js

# Lib
touch lib/supabase.js
touch lib/wagmi.js
touch lib/config.js
touch lib/utils.js

# Supabase
touch supabase/migrations/0001_init.sql

# Verify
echo ""
echo "Scaffold complete."
echo ""
echo "Structure:"
find . -type d | grep -v node_modules | sort
echo ""
echo "Next steps:"
echo "  1. cd ~/Desktop/spv-token-system/apps/chat"
echo "  2. Paste the file contents into each file"
echo "  3. npm install"
echo "  4. Create .env.local with your keys"
echo "  5. Run the SQL migration in Supabase"
echo "  6. npm run dev"