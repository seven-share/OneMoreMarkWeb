# OneMoreMark VitePress Theme

OneMoreMark Web 是一个基于 VitePress 的双语内容站主题。它围绕“工具、资源和知识管理”内容场景定制了首页、分类页、文章页、侧边栏、语言切换、明暗主题切换、分类图标和内容列表能力。

这个项目不是默认文档站，而是一个内容型 VitePress 自定义主题：Markdown 负责内容和路由，Vue 组件负责页面结构，Content Loader 负责收集文章和分类数据。

## 技术栈

- VitePress 1.x
- Vue 3
- Markdown frontmatter
- VitePress `createContentLoader`
- 静态 SVG 分类图标

## 目录结构

```txt
web/
├─ .vitepress/
│  ├─ config.ts
│  └─ theme/
│     ├─ index.ts
│     ├─ Layout.vue
│     ├─ style.css
│     ├─ components/
│     │  ├─ HomePage.vue
│     │  ├─ CategoryPage.vue
│     │  ├─ PostPage.vue
│     │  ├─ SiteHeader.vue
│     │  ├─ LanguageSelect.vue
│     │  ├─ ThemeToggle.vue
│     │  └─ ...
│     └─ data/
│        ├─ posts.data.ts
│        ├─ categories.data.ts
│        └─ categories.ts
├─ zh/
│  ├─ index.md
│  ├─ category/
│  └─ posts/
├─ en/
│  ├─ index.md
│  ├─ category/
│  └─ posts/
├─ public/
│  ├─ images/
│  └─ icons/category/
├─ index.md
├─ package.json
└─ README.md
```

## 本地开发

```bash
npm install
npm run dev
```

构建与预览：

```bash
npm run build
npm run preview
```

构建产物输出到：

```txt
.vitepress/dist
```

## 路由与语言

当前支持两种语言：

- 中文：`/zh/`
- English：`/en/`

根路径 `/` 会跳转到 `.vitepress/config.ts` 中配置的默认语言：

```ts
themeConfig: {
  defaultLocale: 'zh'
}
```

如果要默认进入英文，把 `defaultLocale` 改为 `en`。

## 主题布局

主题入口在 `.vitepress/theme/Layout.vue`，根据页面 frontmatter 的 `layout` 渲染不同页面：

- `layout: home` 使用 `HomePage.vue`
- `layout: category` 使用 `CategoryPage.vue`
- `layout: post` 使用 `PostPage.vue`

站点根路径 `index.md` 使用 `RootRedirect.vue` 跳转到默认语言首页。

## 文章模型

中文文章放在 `zh/posts/`，英文文章放在 `en/posts/`。文章数据由 `.vitepress/theme/data/posts.data.ts` 加载。

文章 frontmatter 示例：

```md
---
layout: post
title: AI 工具的未来趋势
category: AI 工具
categorySlug: ai-tools
date: 2024-05-25
cover: /images/articles/category.png
hot: true
pinned: true
---
```

字段说明：

- `layout`: 文章页固定为 `post`。
- `title`: 文章标题。
- `category`: 展示用分类名称。
- `categorySlug`: 分类标识，需要匹配分类页中的 `categorySlug`。
- `date`: 发布日期，参与排序。
- `cover`: 可选，文章封面图路径。
- `hot`: 可选，`true` 时进入热门文章模块。
- `pinned`: 可选，`true` 时在分类页中置顶。

文章排序规则：

- `pinned: true` 的文章排在普通文章前面。
- 同一置顶状态下，按 `date` 倒序排列。

## 分类模型

中文分类放在 `zh/category/`，英文分类放在 `en/category/`。分类数据由 `.vitepress/theme/data/categories.data.ts` 加载。

分类 frontmatter 示例：

```md
---
layout: category
title: AI 工具
category: AI 工具
categorySlug: ai-tools
icon: ai-tools
order: 3
---
```

字段说明：

- `layout`: 分类页固定为 `category`。
- `title`: 页面标题。
- `category`: 展示用分类名称。
- `categorySlug`: 分类标识，用于匹配文章。
- `icon`: 分类图标文件名，不带 `.svg`。
- `order`: 分类排序权重，数字小的排前面；数字相同时随机排序。

分类图标放在：

```txt
public/icons/category/
```

例如：

```md
icon: ai-tools
```

会加载：

```txt
public/icons/category/ai-tools.svg
```

后续新增分类时，可以从阿里矢量图标下载 SVG，放入这个目录，再在分类页中填写同名 `icon`。

## 首页内容

首页由 `HomePage.vue` 渲染，内容来源如下：

- 今日推荐：读取 `categorySlug: recommend` 的文章，最多 5 篇。
- 精选文章：读取 `categorySlug: featured` 的文章，最多 5 篇。
- 分类浏览：读取当前语言的分类，排除 `recommend` 和 `featured`。

热门文章不是分类。它来自文章 frontmatter：

```md
hot: true
```

分类页侧边栏会展示当前语言下最多 5 篇热门文章。

## 分页

分类页分页在 `CategoryPage.vue` 中配置：

```ts
const pageSize = 10
```

同一分类超过 10 篇文章时会显示分页。分页使用 URL query，例如：

```txt
/zh/category/recommend?page=2
```

## 明暗主题

顶部导航右侧提供明暗主题切换按钮。主题状态保存在：

```txt
localStorage.om-theme
```

深色模式通过 `html.dark` 控制，样式变量定义在 `.vitepress/theme/style.css`。

## Cloudflare Pages 部署

推荐配置：

```txt
Root directory: web
Framework preset: VitePress
Build command: npm run build
Build output directory: .vitepress/dist
```

## 维护约定

- 新增文章时，同时维护对应语言版本，推荐中英文使用相同 slug。
- 新增分类时，同时新增 `zh/category` 和 `en/category` 下的分类页。
- 分类图标使用本地 SVG，避免依赖外部 iconfont 脚本。
- `开发规划.md` 已通过 `srcExclude` 排除，不参与站点构建。
