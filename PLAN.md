# AI Email Writer - 出海 AI 工具产品规划

## 一、确定技术栈

| 层级 | 最终方案 | 说明 |
|------|----------|------|
| **前端框架** | Next.js 14 (App Router) | 你有一点前端基础，生态完善 |
| **样式** | Tailwind CSS | 快速开发，无需设计基础 |
| **AI 模型** | 阿里通义千问 (Qwen) | 免费额度充足，API 兼容 OpenAI 格式 |
| **数据库** | Turso (免费 5GB) | SQLite 边缘数据库，全球低延迟 |
| **用户认证** | NextAuth.js + Google OAuth | 简单安全，海外标配 |
| **支付** | Lemon Squeezy | 支持 PayPal + 信用卡，自动处理税务 |
| **部署** | Vercel | Next.js 原生支持，免费额度够用 |

---

## 二、产品定位

**产品名称（备选）**
- MailMuse
- WriteMail AI
- ProseMail

**核心价值主张**
> "Write professional emails in seconds with AI - no more writer's block"

**目标用户**
- 职场新人（不知道如何写专业邮件）
- 销售人员（需要大量 outreach）
- 求职者（申请工作需要专业邮件）

---

## 三、MVP 功能优先级

### P0 - 核心功能（必须上线）

```
1. 场景选择
   - Job Application（求职邮件）
   - Sales Outreach（销售开发）
   - Follow-up（跟进邮件）
   - Networking（人脉维护）
   - Custom（自定义场景）

2. 邮件生成
   - 输入：收件人身份、你的背景、邮件目的
   - 输出：AI 生成的专业邮件
   - 一键复制到剪贴板

3. 免费次数限制
   - 未登录：3次/天
   - 已登录：10次/天
```

### P1 - 第一版迭代（上线后2周）

```
4. 用户系统
   - Google OAuth 登录
   - 个人设置（名字、签名、语气偏好）

5. 历史记录
   - 保存最近 20 封邮件
   - 重新编辑/重新生成

6. 多语言输出
   - 支持生成英文、中文、西班牙语邮件
```

### P2 - 增长功能（后期）

```
7. 邮件模板库
   - 预设各场景优质模板
   - 用户可提交模板

8. 团队协作（企业版）
   - 品牌语气统一
   - 团队使用统计

9. Chrome 插件
   - 在 Gmail/Outlook 直接使用
```

---

## 四、页面结构

### 页面 1：落地页 (Landing Page)
```
[Header]
- Logo
- Login / Sign up 按钮

[Hero Section]
- 主标题：Write Professional Emails in Seconds
- 子标题：AI-powered email writer for professionals
- CTA：Start Free - 无需登录
- 展示：产品截图 / GIF 演示

[Features Section]
- 3-4 个核心功能卡片
- 图标 + 简短描述

[How it Works]
- 3 步流程图：选择场景 → 输入信息 → 获得专业邮件

[Pricing Section]
- Free: 3次/天
- Pro: $12/月 - 无限次 + 历史记录
- Team: $49/月 - 团队协作

[Testimonials]
- 用户评价（可先放假的）

[Footer]
- Privacy Policy, Terms
- Contact
```

### 页面 2：主应用 (Dashboard)
```
[Sidebar]
- Logo
- 新建邮件 (+)
- 历史记录
- 设置
- 升级 Pro (CTA)

[Main Content - 邮件生成器]
- 场景选择 (Tabs 或 Dropdown)
- 表单区域：
  - 收件人身份（输入框）
  - 你的身份/背景（输入框）
  - 邮件目的（输入框）
  - 语气偏好（Optional: Formal / Casual / Friendly）
- 生成按钮
- 结果展示区域
- 复制 / 重新生成 / 编辑 按钮
```

### 页面 3：设置页 (Settings)
```
- 个人信息（名字、邮箱）
- 语气偏好默认设置
- API 使用统计
- 订阅管理
```

---

## 五、开发里程碑

### Week 1-2: 基础搭建
- [ ] Next.js 项目初始化
- [ ] Tailwind CSS 配置
- [ ] 页面结构搭建（落地页 + Dashboard）
- [ ] 通义千问 API 接入测试

### Week 3: 核心功能
- [ ] 场景选择组件
- [ ] 邮件生成表单
- [ ] AI 生成逻辑 + 错误处理
- [ ] 复制功能

### Week 4: 用户系统
- [ ] NextAuth.js + Google OAuth
- [ ] Turso 数据库连接
- [ ] 用户登录状态显示
- [ ] 免费次数限制逻辑

### Week 5: 支付 & 收钱
- [ ] Lemon Squeezy 接入
- [ ] 订阅页面
- [ ] 支付成功后的权限解锁

### Week 6: 上线 & 验证
- [ ] Vercel 部署
- [ ] 域名绑定
- [ ] Google Analytics 接入
- [ ] 基础 SEO（Meta tags, Sitemap）

---

## 六、关键 Prompt 设计

### 邮件生成 Prompt（英文）

```
You are a professional email writer. Write a {tone} email with the following details:

Context:
- Recipient: {recipient_role}
- Sender: {sender_background}
- Purpose: {email_purpose}

Requirements:
- Length: {short/medium/long} (1-3 paragraphs typically)
- Tone: {formal/casual/friendly}
- Include a clear call-to-action if applicable
- Professional greeting and sign-off

Output ONLY the email body, no explanations.
```

---

## 七、竞品分析

| 竞品 | 价格 | 特点 | 我们的优势 |
|------|------|------|-----------|
| Lavender | $49/月 | 邮件增强+分析 | 更专注于撰写，功能更简单 |
| Smartly Email | 免费 | AI 草稿生成 | 更低价，界面更简洁 |
| Jasper | $49/月 | 全能 AI 写作 | 垂直邮件场景，更专注 |

**差异化点**：
1. 价格更低（$12 vs $49）
2. 界面更简洁，专注单一场景
3. 支持中文界面（未来）

---

## 八、风险 & 应对

| 风险 | 应对方案 |
|------|----------|
| AI 质量不够好 | 先用通义千问测试，不满意再换 Claude |
| Google OAuth 在国内难测试 | 开发时用 GitHub OAuth 或邮箱密码登录做备选 |
| Turso 在国内访问慢 | 可暂时用本地 SQLite 开发，部署时切换 |
| 收款困难 | Lemon Squeezy 支持 PayPal，中国开发者友好 |

---

## 九、下一步行动

1. **今天**：注册阿里云账号，获取通义千问 API Key
2. **本周**：搭建 Next.js 项目，跑通 AI 生成 demo
3. **下周的今天**：拿出 Demo 给 3-5 人测试，收集反馈
