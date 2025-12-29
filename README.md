# V2Board 二次元风格前端

<div align="center">

✨ 一个现代化的二次元风格 V2Board 前端项目 ✨

[![Vue](https://img.shields.io/badge/Vue-3.4-42b883?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.5-409eff)](https://element-plus.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

</div>

## 📝 项目简介

基于 wyx2685/v2board 后端 API 开发的现代化前端界面，采用二次元风格设计，提供流畅的用户体验。

## ✨ 主要特性

### 🎨 二次元设计风格
- **配色方案**: 粉紫渐变主题，温柔可爱
- **玻璃态效果**: 半透明模糊背景，现代感十足
- **流畅动画**: 页面切换、卡片悬停、按钮交互等丰富动画效果
- **可爱元素**: 星星装饰、圆润卡片、渐变按钮

### 🚀 核心功能
- ✅ 用户认证（登录/注册）
- ✅ 套餐浏览与购买
- ✅ 订单管理（查看/支付/取消）
- ✅ 订阅管理（链接/二维码）
- ✅ 个人中心（流量统计/账户信息/修改密码）

### 💎 技术亮点
- Vue 3 Composition API
- Pinia 状态管理
- Vue Router 路由守卫
- Axios 请求拦截
- Element Plus UI 组件
- Tailwind CSS 原子化样式
- 响应式设计，完美支持移动端

## 🛠️ 技术栈

- **框架**: Vue 3 + Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **UI 组件库**: Element Plus
- **样式**: Tailwind CSS + 自定义 CSS
- **图标**: @element-plus/icons-vue
- **二维码**: qrcode

## 📦 安装与运行

### 前置要求
- Node.js >= 16.0.0
- npm 或 yarn

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 配置环境变量
复制 `.env.example` 为 `.env` 并修改配置：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
VITE_API_BASE_URL=https://your-v2board-backend.com/api/v1
```

### 开发模式
```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:3000

### 生产构建
```bash
npm run build
# 或
yarn build
```

### 预览构建
```bash
npm run preview
# 或
yarn preview
```

## 📁 项目结构

```
v2board-frontend/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 请求封装
│   │   ├── auth.js       # 认证相关 API
│   │   ├── user.js       # 用户相关 API
│   │   ├── order.js      # 订单相关 API
│   │   ├── plan.js       # 套餐相关 API
│   │   └── request.js    # Axios 配置
│   ├── assets/           # 资源文件
│   │   └── styles/       # 样式文件
│   │       ├── anime.css        # 二次元样式
│   │       └── animations.css   # 动画效果
│   ├── components/       # 公共组件
│   │   ├── Layout.vue           # 布局组件
│   │   ├── Navbar.vue           # 导航栏
│   │   ├── AnimeCard.vue        # 二次元卡片
│   │   └── LoadingSpinner.vue   # 加载动画
│   ├── router/           # 路由配置
│   │   └── index.js     # 路由定义和守卫
│   ├── stores/           # Pinia 状态管理
│   │   ├── auth.js      # 认证状态
│   │   └── user.js      # 用户状态
│   ├── views/            # 页面组件
│   │   ├── Login.vue           # 登录页
│   │   ├── Register.vue        # 注册页
│   │   ├── Plans.vue           # 套餐列表
│   │   ├── Orders.vue          # 订单列表
│   │   ├── OrderDetail.vue     # 订单详情
│   │   ├── Subscribe.vue       # 订阅管理
│   │   └── Profile.vue         # 个人中心
│   ├── utils/            # 工具函数
│   │   └── helpers.js   # 辅助函数
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── index.html            # HTML 模板
├── package.json          # 依赖配置
├── vite.config.js        # Vite 配置
├── tailwind.config.js    # Tailwind 配置
├── postcss.config.js     # PostCSS 配置
└── README.md             # 项目文档
```

## 🎨 样式定制

### 二次元主题配色
在 `tailwind.config.js` 中定义了自定义颜色：
```javascript
colors: {
  anime: {
    pink: '#FF6B9D',
    'pink-light': '#FFA8D5',
    purple: '#C77DFF',
    'purple-light': '#E0B0FF',
    blue: '#89CFF0',
    bg: '#FFF0F5',
  }
}
```

### 自定义动画
在 `src/assets/styles/animations.css` 中包含多种动画效果：
- 浮动动画 (float)
- 闪烁动画 (sparkle)
- 滑入动画 (slide-in)
- 光晕动画 (glow)
- 等等...

## 🔌 API 端点

项目使用以下 V2Board API 端点：

### 认证相关
- `POST /api/v1/passport/auth/login` - 登录
- `POST /api/v1/passport/auth/register` - 注册
- `POST /api/v1/passport/auth/logout` - 退出

### 用户相关
- `GET /api/v1/user/info` - 获取用户信息
- `GET /api/v1/user/getStat` - 获取用户统计
- `GET /api/v1/user/getSubscribe` - 获取订阅链接
- `POST /api/v1/user/changePassword` - 修改密码
- `POST /api/v1/user/resetSecurity` - 重置订阅

### 套餐相关
- `GET /api/v1/user/plan/fetch` - 获取套餐列表

### 订单相关
- `GET /api/v1/user/order/fetch` - 获取订单列表
- `GET /api/v1/user/order/detail` - 获取订单详情
- `POST /api/v1/user/order/save` - 创建订单
- `POST /api/v1/user/order/checkout` - 订单支付
- `POST /api/v1/user/order/cancel` - 取消订单

## 📱 响应式设计

项目完全响应式，支持以下设备：
- 🖥️ 桌面端 (1200px+)
- 💻 笔记本 (768px - 1199px)
- 📱 移动端 (< 768px)

## 🔒 安全特性

- Token 认证
- 路由守卫保护
- 请求/响应拦截
- XSS 防护
- CSRF 防护

## 🌟 特色功能

### 玻璃态效果
使用 `backdrop-filter` 实现半透明模糊背景效果

### 流畅动画
- 页面切换动画
- 卡片悬停效果
- 按钮交互动画
- 加载状态动画

### 可爱的 UI 元素
- 圆润的卡片和按钮
- 渐变色设计
- 星星装饰元素
- 自定义滚动条

## 📄 开源协议

MIT License

## 🙏 鸣谢

- [wyx2685/v2board](https://github.com/wyx2685/v2board) - 后端 API
- [tqa24/v2board-theme-LuFly](https://github.com/tqa24/v2board-theme-LuFly) - 设计参考
- [q42602736/v2board-theme-luck](https://github.com/q42602736/v2board-theme-luck) - 设计参考

## 📮 联系方式

如有问题或建议，欢迎提 Issue 或 Pull Request。

---

<div align="center">
Made with ❤️ and ✨
</div>
