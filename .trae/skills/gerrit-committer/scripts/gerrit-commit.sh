#!/bin/bash
set -e

# AI_AGENT_PATCH_START
# Gerrit提交脚本
# 用于添加所有更改、提交并推送到Gerrit
# AI_AGENT_PATCH_END

# Default commit message if none provided
MESSAGE="${1:-chore: update code}"

# AI_AGENT_PATCH_START
# AI_AGENT_PATCH_MODIFY
# 添加所有更改到暂存区
# AI_AGENT_PATCH_END
git add .

# AI_AGENT_PATCH_START
# AI_AGENT_PATCH_MODIFY
# 使用提供的提交信息进行提交
# AI_AGENT_PATCH_END
git commit -m "$MESSAGE"

# AI_AGENT_PATCH_START
# AI_AGENT_PATCH_MODIFY
# 获取当前分支名称
# AI_AGENT_PATCH_END
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# AI_AGENT_PATCH_START
# AI_AGENT_PATCH_MODIFY
# 推送到远程仓库，设置为Gerrit审查分支
# AI_AGENT_PATCH_END
git push origin HEAD:refs/for/$BRANCH

echo "✅ Successfully pushed to $BRANCH"
