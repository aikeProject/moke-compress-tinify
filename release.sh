#!/usr/bin/env sh

# 执行结果不为true则退出
set -e
echo "输入 release version: "
read VERSION
read -p "确定设置 $VERSION 为此版本 ? (y/n)" -n 1 -r
echo  # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"
  git push origin master

  # publish
  npm publish
fi
