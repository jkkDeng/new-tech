本项目仅是测试 demo， for 文章。

文章：

掘金：https://juejin.cn/post/7172099992683823118

CSDN：https://blog.csdn.net/JKK_jkk/article/details/128133638

### 前端新技术群 pnpm turbo vitepress vercel

本篇文章涉及：pnpm workspace 特性，turbo 的任务编排与缓存效率，vitepress 搭建博客，vercel 快速部署。

##### 技术分为:

- pnpm + turbo
- vitepress
- vercel

这里面的方案，可以解决什么需求呢？

- A：我开发了小程序，博客，个人网站，但有个功能是我更新了，就得在三个项目了，把代码更新一下。这样做，我感觉很费时间，还不如我把这个功能做成一个工具包，每个需要它得项目都依赖它。
- B：我只想写文章，想要 vue 官网的风格，想要快速搭建一个博客，但我不想做后端，不想写交互。
- C：我在开发阶段就花了很多时间了，再到部署到服务器，还要配置服务器信息（当然这是运维工作），还不如我提交代码那一刻就部署了呢。

很好！来吧！

#### pnpm + turbo

##### pnpm

npm 就是 Node Package Manager，即包管理工具。

对比一些当前的包管理工具：

| Node Package Manager | 有 package-lock | 安装依赖方式   | 依赖扁平化 | Workspace    |
| -------------------- | --------------- | -------------- | ---------- | ------------ | --- |
| pnpm                 | ⭐              | 并行且有硬链接 | ⭐⭐⭐     | ⭐           |
| yarn                 | ⭐              | 并行           | ⭐         | ⭐           |
| npm                  | ⭐              | 串行           | ❌         | 幽灵依赖问题 | ❌  |
| cnpm                 |                 |                |            |              |

注意：都不能混用

tip:

- 硬链接： 就是文件本身，是文件在硬盘中的区块。文件不存在，硬链接就不存在
- 软链接：是文件/目录的路径，类似于 win 里的快捷方式。

pnpm 最直观的理解：**快**，有 Workspace。

我在 tst 项目里**首次**添加一个依赖需要时间 2.6 秒。

![pnpm1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62102b48f0f04c61b33b41bbc1eb92c1~tplv-k3u1fbpfcp-watermark.image?)
然后删掉 node_modules 再下载，只需要 868 毫秒。

![pnpm2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d860de88f1614301ada5903a3a0c6041~tplv-k3u1fbpfcp-watermark.image?)

npm 一些问题参考：[pnpm 解决我哪些痛点？ - 掘金 (juejin.cn)](https://juejin.cn/post/7036319707590295565)

##### turbo

先了解一下 Monorepo（单一代码库），Monorepo 的意思是在版本控制系统的单个代码库里包含了许多项目的代码。这些项目虽然有可能是相关的，但通常在逻辑上是独立的，并由不同的团队维护。简单的理解，比如我的一个 github 仓库里存着 web 端项目，后端项目，移动端项目，博客项目等等多个项目代码文件。

也比如：我写了个 vue3 的前端项目叫：myVue，目录如下：

```
--myVue
  --node_modules
  --src
    --App.vue
  --index.html
  --package.json
```

同时我也写了个 node 后端叫：serve，目录如下：

```
--serve
  --node_modules
  --src
    --App.vue
  --index.js
  --package.json
```

这个时候我将两个项目放在一个文件夹下：

```
--project
  --myVue
  --serve
  --.git
```

project 里面的每个项目（myVue，serve）都是可以单独运行的。但是我放在同一个代码库中。

Turborepo 就是 Monorepo**管理工具**的其中一种，简称 turbo。

它有着：

- 依赖管理能力，保证安装的效率。
- 任务编排能力，能够按正确的顺序执行 Monorepo 内的项目的任务。
- 版本发布额能力，能够结合项目之间的依赖关系，正确地进行版本号更变及项目发布。

这里主要讲讲任务编排能力。

Monorepo 里有三个项目 A，B，C。A 和 C 还需要依赖于 B。也就是说 B 项目需要先构建好后，A 和 C 才能构建。

传统的任务编排是：lint->build->test->deploy。即检查规范->构建项目->测试项目->部署项目。

- lint：执行检查代码规范任务，比如 tsc，Eslint 这种检查代码是否符合规范。
- build：构建项目，比如用 vue3 框架，vite 框架，都需要构建，一般都会生成 dist 文件。
- test：测试自定义的命令。
- deploy：部署项目。

![turbo.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ad6aea4a24049b8a5a85d5694f8e38a~tplv-k3u1fbpfcp-watermark.image?)

看上图，虽然每个项目都是并行执行任务的，但是 lerna 管理中里面，每个项目的 build 任务在 lint 任务之后，test 任务在 build 任务之后。

但是 turbo 能够将每个项目里的任务进行拓扑排序再执行。

即图中 B 项目并行执行 lint，test，build，之后 A 和 C 就可以更快的执行构建，大大提高了整体的效率。

使用 turbo 需要在 monorepo 项目下添加 turbo 依赖，并且新建 turbo.json 配置文件即可。

```
--project
  --myVue
  --serve
  --package.json
  --turbo.json
  --.git
```

```
``turbo.json
"devDependencies": {
  "turbo": "^1.6.3"
}
```

##### 项目之间依赖

那么 pnpm 如何与 turbo 配合呢？

答案就是 pnpm workspace，这使得 pnpm 天生支持 monorepo。

workspace 可以使项目之间有依赖关系，在 monorepo 根目录里只需要有 pnpm-workspace.yaml，并且在里面配置 packages，pnpm 就可以识别出 workspace 的区域。

```
``pnpm-workspace.yaml
packages:
  - "packages/*"
```

在根目录建立一个 packages 目录来使用 pnpm workspace，packages 下有两个项目，一个是 docs 前端，一个 project-one。project-one 作为 docs 工具依赖（注意：project-one 是自己编写的，不是 node_modules）。

```
--project
  --package.json
  --packages
    --docs
      --package.json
    --project-one
      --package.json
  --pnpm-workspace.yaml
```

使用以下命令，给 docs 添加 project-one 依赖。这样就完成了项目之间的依赖。

接下来看看如何运行项目，然后测试项目之间的依赖是否成功。

```
pnpm add project-one --workspace --filter docs
```

tip：

- **--filter 后加上项目名称是指定对某个项目进行操作。**
- **“项目名称”** 是 package.json 里 name 对应的内容。
- 在根目录运行 pnpm install 命令即可将每个项目安装对应的依赖。

---

##### 根目录中执行项目内命令

现在要在根目录执行 packages 里面的项目 dev 任务。在根目录的 package.json 里配置任务即可运行相应项目的 dev 任务，同时 docs 和 project-one 项目里的 package.json：

```
``package.json
"scripts": {
  "dev-docs": "pnpm --filter "docs" dev",
  "dev-one": "pnpm --filter "project-one" dev"
}

``docs package.json
"scripts": {
  "dev": "vitepress dev"
}

``project-one package.json
"scripts": {
  "dev":"node index2.js",
}
```

然后可以在根目录里直接执行命令：

```
pnpm run dev-one
pnpm run dev-docs
```

这样它就会去每个项目里执行对应的 dev 任务。执行结果：

![rundev1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc716d5a0fbb4bb392f2c8e48a7845ba~tplv-k3u1fbpfcp-watermark.image?)

![rundev2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4a5022d84d0443c8967ffa5943ba932~tplv-k3u1fbpfcp-watermark.image?)

注：

- docs 是 vitepress 项目。
- project-one index2.js 里仅是一行代码，用来测试，通过控制台打印输出。

```
``project-one index2.js
console.log('nihao index2');
```

---

我们知道每个项目如何运行后，再来看看项目之间依赖是否成功。

---

现在在 docs 里调用一下 project-one 里的内容，docs 的 index 页面和 project-one 的 index.js：

```
// docs index.md
<script setup>
import addOne from 'project-one'
addOne(10,'docs')
</script>
```

```
// project-one index.js
const addOne = (x=0,msg='未填') => {
    console.log('调用project-one的项目是：',msg);
    return x + 1;
}
export default addOne
```

这里在 project-one 项目中定义了一个 addOne 函数，docs 里执行调用。现在再跑 docs 项目，看看浏览器控制台有什么输出：

![rundev2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1085099901374312a61e5d667398acba~tplv-k3u1fbpfcp-watermark.image?)

很好，docs 项目成功使用了 project-one 依赖。

---

pnpm 配合 turbo 任务编排等能力，能够更加高效的运行我们的每一个项目。

---

##### turbo 任务编排能力

接下来我们要执行多个任务，并且有先后要求：

- docs 和 project-one 都要执行 build 和 test 任务
- docs 是依赖于 project-one 的，所以 project-one 的 build 在 docs 的 build 前面。
- test 任务都是在 build 任务之后。

在这个需求中，我们可以这样解决：先将 project-one->build 再 docs->build，最后两个 test（不分前后）。

接下来用 turbo 解决这个问题，并再次执行的时候能够更高效。

首先为了方便测试，test 任务仅仅是输出内容。看两个项目的任务：

```
``project-one package.json
  "scripts": {
    "build":"node index2.js",
    "test": "echo "Error: no test specified""
  },
```

```
``docs package.json
  "scripts": {
    "build": "vitepress build",
    "test": "echo "Error: no test specified""
  },
```

turbo.json 文件的配置：pipeline 里面就是自定义的任务名称，如 build，test，lint，deploy。

```
``turbo.json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": [],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"]
    },
    "lint": {
      "outputs": []
    },
    "deploy": {
      "dependsOn": ["build", "test", "lint"],
      "outputs": []
    }
  }
}
```

我们在项目 package.json 里配置 turbo 的任务 turbo-test（turbo-build 这里不做测试），turbo 就会按照 turbo.json 配置文件去执行。

```
``package.json
"scripts": {
   "turbo-test": "turbo run test",
   "turbo-build": "turbo run build"
}
```

比如 turbo 运行 build 任务的时候，packages 里的每一个项目都会执行 build 任务。

在 turbo.json 的 pipeline 中，build 任务里面 dependsOn 的"^build"含义是指上游的 build 任务，也就是说，每个项目在执行自己 build（构建）任务之前，会先将 devDependencies 和 dependencies 里的构建/安装好。

```
``turbo.json
"build": {
   "dependsOn": ["^build"]
},
```

在这个例子中，就是指 docs 需要构建之前会等待 project-one（“上游”）的构建完成。

而 test 里的"build"就是 pipeline 中的 build 任务，含义是：每个项目要执行自己的 test 任务，就要先执行 build 任务。

```
``turbo.json
"test": {
   "dependsOn": ["build"]
},
```

然后我们通过 pnpm run turbo-test 命令进行测试，结果图如下（红色框先忽略）：

![turborun2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ad38ee7476e48ed821d536b71288c17~tplv-k3u1fbpfcp-watermark.image?)
![turborun3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2ac80be60d84cd69de73a50afc30046~tplv-k3u1fbpfcp-watermark.image?)

可以看见它的执行过程完全是我们的预期效果。顺序是：project-one build 输出"nihao index2"，test 输出"Error: no test specified"，docs build vitepress 成功构建，test 输出"Error: no test specified"。

```
project-one----> build---> test
                       |--> docs-> build ->test
```

当我们再次执行 pnpm run turbo-test 的时候：

![turborun4.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6da1651313ab40bda569b18f542fb78e~tplv-k3u1fbpfcp-watermark.image?)

![turborun5.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22cd9d955d53462c8dc0563cc9b92051~tplv-k3u1fbpfcp-watermark.image?)
因为代码并没有改动，turbo 使用缓存能力，将整体的速度优化提高了！

turbo 官方文档：[Turbo](https://turbo.build/)

所以 pnpm + turbo 两个技术配合起来，就能够更加高效地对多项目的单一代码库进行管理。

---

#### vitepress

vite 是一个前端构建工具，能够快速重载页面，构建和提供服务端口。vue3 是一个前端框架。vite 和 vue3 跟 vitepress 有什么关系呢？可以说 vitepress 也是基于 vite 而来的，所以会继承它的特性，vitepress 也支持 vue3 代码。

要了解 vitepress。先来了解 CSR（客户端渲染），SSR（服务端渲染）和 SSG（静态页面生成）。

- CSR，比如我们的 vue，react 框架开发的项目。都是浏览器先下载好 html 文档作为基础文档，再通过下载 js 来渲染出最终的页面效果。
- SSR，也比如我们的 vue，react 框架开发的项目（因为这些框架也支持）。是指在服务器端渲染成最终的页面效果。
- SSG，比如 vitepress，支持将 markdown 文件生成静态资源（html），客户端请求的时候，会直接获取到最终的页面效果。

注：vitepress 官网 slogan 就是：满足您一直想要的现代 SSG 框架。

可能你会好奇 SSR 和 SSG 区别在哪呢，可以简单的这样理解：SSR 在请求页面的时候，页面基本的数据还要动态获取，再渲染成最终效果的页面，再返回给客户端；而 SSG 是已经构建（build）好了的页面，就是一个静态资源，直接返回给客户端。

在我看来，这些区分的界限越来越不明显，各有优缺点，最终需要怎样的技术，还是看需求。

##### 简单说 vitepress，是一个极其简单的框架，有着 vite 的特性，并且支持 vue3 语法。

先将 vitepress 依赖安装好，如果也需要写 vue3 语法就加上 vue3 的依赖。

```
``package.json
"scripts": {
   "dev": "vitepress dev",
   "build": "vitepress build",
   "test": "echo "Error: no test specified""
},
"dependencies": {
   "vitepress": "1.0.0-alpha.29",
   "vue": "^3.2.45"
}
```

新建 index.md 文件，在 index.md 可以加入一些配置：

```
---
layout: home
hero:
  name: VitePress
  text: Vite & Vue powered static site generator.
  tagline: Lorem ipsum...
  actions:
    - theme: brand
      text: Get Started
      link: https://github.com/jkkdeng
    - theme: alt
      text: View on GitHub
      link: https://github.com/jkkdeng

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
```

直接运行 pnpm run dev 命令，页面就出来了：

![vitepress.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64f637c556344b37b478ffbea640b55c~tplv-k3u1fbpfcp-watermark.image?)

这里主要是 layout: home，配置了当前页的布局为 home，就可以使用 hero 和 features，layout 还可以选择 doc，page。

接着试一下 vitepress 的构建能力，运行 pnpm run build。它会在根目录默认生成.vitepress，vitepress 里面还有生成文件 dist。

![vitepress2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cfdced51e854bf0b35455be5402f7d5~tplv-k3u1fbpfcp-watermark.image?)

我们还可以通过 serve 对构建结果进行检查，执行 pnpm run serve 命令

```
``package.json
"scripts": {
  "dev": "vitepress dev",
  "build": "vitepress build",
  "serve": "vitepress serve",
  "test": "echo "Error: no test specified" && exit 1"
},
```

我们可以通过 vitepress 快速搭建起主题风格与 vitepress，vue3 等等这些官网一样的个人博客。

更多配置信息还可以在[官网](https://vitepress.vuejs.org/)查看。

---

#### vercel

这里主要是运用到 vercel 平台的能力。这是它的[官网](https://vercel.com/):

![vercel.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4be188871d6649d8af77565828bfb38e~tplv-k3u1fbpfcp-watermark.image?)

现在我们要将 vitepress 的项目部署到服务器，但我们不需要购买服务器，也不需要配置 ssl，我们用 vercel 就可以搞定这个简单的需求，并且有更快的部署。

vercel 解决的总路程：vercel 绑定 github 里的项目并克隆项目，在它的服务器里运行构建，自动配置访问信息即可访问。我们将我们的域名指向 vercel 给域名，完成重定向访问。

我们通过 github 账户可以直接注册登录，可以按照它的指引或在官网的指示板中添加项目，导入 github 里的项目。

![vercel2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02d91f4dbfd74de898442574520a855b~tplv-k3u1fbpfcp-watermark.image?)

![vercel3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5210a6b857ad4506800cc17e16976cbe~tplv-k3u1fbpfcp-watermark.image?)

点击部署即可完成部署，接下来 Domains 还可以添加我们的域名。

以后只要更改项目的内容提交到 github，vercel 都会再次部署。这对于我部署博客是非常快的了。

##### Serverless

vercel 还提供了 Serverless 技术，简单来讲就像是我们使用的云开发技术（腾讯，阿里，华为云开发），是一个无服务器，降低运维需求，降低运营成本的概念。

vercel 的 Serverless 支持四个官方运行时：node.js，go，python，ruby，也就是说支持 js ts go py rb 语言代码，可以选择我们熟悉的语言做后端！

![vercel4.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a798f264544b4788ad29060d85b7acf0~tplv-k3u1fbpfcp-watermark.image?)

本次学习中并没有使用 serverless：

- 一是在部署项目后，发现访问很差，毕竟可能是部署在外网，
- 二是接触过云开发的内容，目前还没开发的需求。

好了本次学习，项目里写的都是 demo，主要涉及到三板块：

- pnpm + turbo
- vitepress
- vercel

如果你也了解到 pnpm workspace 特性，turbo 的任务编排与缓存效率，vitepress 搭建博客，vercel 快速部署，那么就差不多啦！下次见。

我的个人博客原文：[前端新技术群](https://blog.darkerin.cn/newtech/%E5%89%8D%E7%AB%AF%E6%96%B0%E6%8A%80%E6%9C%AF%E7%BE%A4.html)

> https://blog.darkerin.cn/newtech/%E5%89%8D%E7%AB%AF%E6%96%B0%E6%8A%80%E6%9C%AF%E7%BE%A4.html

微信公众号文章：[前端新技术群](https://mp.weixin.qq.com/s/QtBwDO54VqRfzPjCFd2SQg)

> weixin.qq.com/s/QtBwDO54VqRfzPjCFd2SQg
