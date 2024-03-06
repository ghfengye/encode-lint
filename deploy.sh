#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e


push_addr=`git remote get-url --push origin` # 获取项目git地址赋值给push_addr
commit_info=`git describe --all --always --long` # 获取最近的提交信息的哈希赋值给commit_info
dist_path=docs/.vuepress/dist
push_branch=gh-pages

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd $dist_path

git init
git add -A
git commit -m "deploy, $commit_info"
git push -f $push_addr HEAD:$push_branch

cd -
rm -rf $dist_path
