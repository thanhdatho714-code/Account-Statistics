#!/bin/bash
# ============================================
# 企业版 2.0 高级账号测算 - 一键部署到 Netlify
# ============================================

echo "🔧 正在构建项目..."
export PATH="$HOME/.workbuddy/binaries/node/versions/22.12.0/bin:$PATH"
cd "$(dirname "$0")"
npx vite build

if [ $? -ne 0 ]; then
  echo "❌ 构建失败"
  exit 1
fi

echo "📦 正在部署到 Netlify..."
echo ""
echo "首次使用会要求你："
echo "  1. 在浏览器中注册/登录 Netlify（免费）"
echo "  2. 授权 CLI 访问"
echo ""

npx netlify deploy --dir=dist --prod

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 部署成功！"
fi
