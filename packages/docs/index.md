---
title: HOME
editLink: true

layout: doc

hero:
  name: VitePress
  text: Vite & Vue powered static site generator.
  tagline: Lorem ipsum...
  actions:
    - theme: brand
      text: Get Started
      link: /guide/what-is-vitepress
    - theme: alt
      text: View on GitHub
      link: https://github.com/vuejs/vitepress

features:
  - icon: ⚡️
    title: Vite, The DX that can't be beat
    details: Lorem ipsum...
  - icon: 🖖
    title: Power of Vue meets Markdown
    details: Lorem ipsum...
  - icon: 🛠️
    title: Simple and minimal, always
    details: Lorem ipsum...
---

# Hello VitePress

如果 git merge 合并的时候出现 refusing to merge unrelated histories 的错误，原因是两个仓库不同而导致的，需要在后面加上--allow-unrelated-histories 进行允许合并，即可解决问题

<script setup>
import { useData } from 'vitepress'

const { page } = useData()
import addOne from 'project-one'
addOne(10,'docs')
</script>
