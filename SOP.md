# MailCraftUs 项目标准操作流程（SOP）

## 文档概述

本文档记录了 MailCraftUs AI 邮件生成器从立项到上线部署的完整流程，为后续开发同类产品提供参考。本项目采用 Next.js 16 (App Router)、Turso 数据库、PayPal 订阅支付、阿里通义千问 AI 生成等核心技术栈。

---

## 第一部分：项目立项

### 1.1 市场调研方法

#### 调研目标
- 确定目标用户群体及其痛点
- 评估市场需求和竞争格局
- 验证产品创意可行性

#### 调研步骤

**Step 1: 确定目标市场**
```
调研市场：AI 邮件写作工具 / Professional Email Writing
目标地区：北美、欧洲等英语市场（出海产品）
目标用户：
  - 职场新人（不知道如何写专业邮件）
  - 销售人员（需要大量 outreach）
  - 求职者（申请工作需要专业邮件）
```

**Step 2: 竞品分析**

| 竞品 | 价格 | 特点 | 我们的优势 |
|------|------|------|-----------|
| Lavender | $49/月 | 邮件增强+分析 | 更专注于撰写，功能更简单 |
| Smartly Email | 免费 | AI 草稿生成 | 更低价，界面更简洁 |
| Jasper | $49/月 | 全能 AI 写作 | 垂直邮件场景，更专注 |

**Step 3: 需求验证方法**
- 在 Reddit、Twitter 等平台发布调研问卷
- 在 Product Hunt 等平台观察类似产品反馈
- 访谈 5-10 名潜在用户验证痛点

### 1.2 竞品分析框架

#### 竞品分析维度
```
1. 核心功能
   - 场景覆盖（求职、销售、跟进等）
   - 多语言支持
   - 自定义程度

2. 定价策略
   - 免费额度
   - 付费门槛
   - 订阅模式

3. 用户体验
   - 界面简洁度
   - 生成速度
   - 输出一致性

4. 技术实现
   - AI 模型选择
   - 响应式设计
   - 加载性能
```

### 1.3 项目可行性评估

#### 成本估算
```
AI API 成本：~$0.1/千次请求（通义千问）
数据库成本：$0（Turso 免费额度 5GB）
托管成本：$0（Vercel 免费额度）
用户认证：$0（Google OAuth 免费）

MVP 阶段总成本：~$50/月（AI API 费用）
```

#### 风险评估

| 风险 | 概率 | 影响 | 应对方案 |
|------|------|------|----------|
| AI 质量不够好 | 中 | 高 | 先用通义千问测试，不满意再换 Claude |
| Google OAuth 在国内难测试 | 高 | 中 | 开发时用 GitHub OAuth 或邮箱密码登录做备选 |
| Turso 在国内访问慢 | 中 | 低 | 可暂时用本地 SQLite 开发，部署时切换 |
| 收款困难 | 中 | 高 | PayPal 支持 PayPal + 信用卡，中国开发者友好 |

### 1.4 技术栈选型决策流程

#### 决策矩阵

| 层级 | 最终方案 | 说明 |
|------|----------|------|
| **前端框架** | Next.js 16 (App Router) | 生态完善，React 开发者易上手 |
| **样式** | Tailwind CSS | 快速开发，无需设计基础 |
| **AI 模型** | 阿里通义千问 (Qwen) | 免费额度充足，API 兼容 OpenAI 格式 |
| **数据库** | Turso (免费 5GB) | SQLite 边缘数据库，全球低延迟 |
| **用户认证** | NextAuth.js + Google OAuth | 简单安全，海外标配 |
| **支付** | PayPal 开发者平台 | 支持 PayPal + 信用卡，开发者友好 |
| **部署** | Vercel | Next.js 原生支持，免费额度够用 |

#### 选型决策流程图
```
1. 列出所有可行技术选项
2. 根据以下维度评分（1-5分）：
   - 开发速度
   - 成本
   - 维护难度
   - 社区支持
3. 权重分配：
   - 成本：30%
   - 开发速度：30%
   - 维护难度：20%
   - 社区支持：20%
4. 计算加权总分
5. 选择最高分方案
```

---

## 第二部分：需求文档

### 2.1 PRD（产品需求文档）模板

```markdown
# PRD - [功能名称]

## 1. 概述
### 1.1 背景
[描述此功能解决的问题或满足的需求]

### 1.2 目标
[功能上线后预期达成的指标]

### 1.3 范围
[功能边界，包含什么/不包含什么]

## 2. 用户故事
### 2.1 主要用户画像
- 用户角色：[角色名称]
- 使用场景：[具体场景描述]
- 痛点：[用户当前面临的问题]
- 期望：[用户希望达成的结果]

### 2.2 用户故事列表
| 故事ID | 描述 | 优先级 | 验收标准 |
|--------|------|--------|----------|
| US-001 | 作为[角色]，我希望[功能]以便[目的] | P0 | [验收条件] |

## 3. 功能需求
### 3.1 功能描述
[详细的功能说明]

### 3.2 用户交互流程
[用户使用此功能的完整流程]

### 3.3 界面设计
[界面布局、组件说明]

### 3.4 数据处理
[数据输入、处理、输出说明]

## 4. 非功能需求
### 4.1 性能需求
- 响应时间：< 3秒
- 并发用户：100+

### 4.2 安全需求
- 数据加密
- 隐私保护

## 5. 依赖关系
- [依赖的功能/服务]

## 6. 排期
- 设计：[X] 天
- 开发：[X] 天
- 测试：[X] 天
```

### 2.2 PRDs（技术设计文档）模板

```markdown
# Technical Design - [功能名称]

## 1. 概述
- 功能名称：[名称]
- 开发者：[负责人]
- 创建日期：[日期]
- 状态：[草稿/评审中/已批准]

## 2. 技术方案
### 2.1 架构设计
[系统架构图或描述]

### 2.2 API 设计
```
Endpoint: [API 路径]
Method: [HTTP 方法]
Request: [请求格式]
Response: [响应格式]
```

### 2.3 数据模型
```typescript
// [数据结构定义]
interface Example {
  field1: string;
  field2: number;
}
```

### 2.4 第三方服务集成
- 服务：[服务名称]
- 用途：[集成目的]
- 配置：[环境变量等]

## 3. 实现细节
### 3.1 目录结构
```
src/
  ├── app/[功能路径]/
  │   ├── page.tsx
  │   └── route.ts
  └── lib/[工具函数]/
      └── index.ts
```

### 3.2 核心逻辑
[关键代码逻辑说明]

## 4. 错误处理
| 错误场景 | 处理方式 |
|----------|----------|
| [场景] | [处理] |

## 5. 测试计划
- [ ] 单元测试覆盖率 > 80%
- [ ] 集成测试
- [ ] E2E 测试

## 6. 部署注意事项
[上线前需要检查的事项]
```

### 2.3 用户故事编写规范

#### 用户故事格式
```
作为 [角色]，我希望 [功能] 以便 [目的]
```

#### 示例

**邮件生成功能**
```
作为 求职者，我希望 能够选择不同场景以便 生成符合场景的专业邮件

验收标准：
- [ ] 可以选择 Job Application 场景
- [ ] 可以选择 Sales Outreach 场景
- [ ] 可以选择 Follow-up 场景
- [ ] 可以选择 Networking 场景
- [ ] 可以自定义场景
```

**免费次数限制**
```
作为 访客，我希望 每天有免费使用次数以便 体验产品核心功能

验收标准：
- [ ] 未登录用户每天 0 次
- [ ] 登录用户每天 5 次
- [ ] Pro 用户无限次
```

### 2.4 优先级排序方法（MoSCoW 法则）

#### 定义

| 优先级 | 定义 | 占比 |
|--------|------|------|
| **Must Have** | 必须有，否则产品无法上线 | 60% |
| **Should Have** | 应该有，可以推迟到下一版本 | 20% |
| **Could Have** | 可以有，但不是必需的 | 15% |
| **Won't Have** | 明确不在本版本范围内 | 5% |

#### MailCraftUs MVP 功能分配

**Must Have (P0)**
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
   - 未登录：0次/天
   - 已登录：5次/天
```

**Should Have (P1)**
```
4. 用户系统
   - Google OAuth 登录
   - 个人设置

5. 多语言输出
   - 支持生成英文、中文、西班牙语邮件
```

**Could Have (P2)**
```
6. 邮件历史记录
7. 团队协作（企业版）
```

---

## 第三部分：项目初始化与开发环境搭建

### 3.1 GitHub 仓库创建

#### Step 1: 登录 GitHub
1. 打开浏览器，访问 https://github.com
2. 点击右上角 **Sign in** 按钮
3. 输入用户名/邮箱和密码完成登录

#### Step 2: 创建新仓库
1. 点击右上角 **+** 图标，选择 **New repository**
2. 在 **Repository name** 字段输入：`mailmuse`
3. **Description** 字段输入：`AI-powered email writing tool`
4. 选择 **Private**（私有仓库）
5. 勾选 **Add a README file**
6. 点击 **Create repository**

#### Step 3: 克隆仓库到本地
```bash
git clone https://github.com/[your-username]/mailmuse.git
cd mailmuse
```

### 3.2 Vercel 项目创建详细步骤

#### Step 1: 注册/登录 Vercel
1. 打开浏览器，访问 https://vercel.com
2. 点击 **Sign Up** 注册账号（推荐使用 GitHub 账号登录）
3. 授权 GitHub 访问

#### Step 2: 创建新项目
1. 登录后进入 Dashboard
2. 点击 **Add New** 按钮
3. 选择 **Project**

#### Step 3: 导入 GitHub 仓库
1. 在 **Import Git Repository** 页面
2. 找到并点击 `mailmuse` 仓库
3. 点击 **Import**

#### Step 4: 配置项目
1. **Project Name**: `mailmuse`
2. **Framework Preset**: 选择 `Next.js`（通常自动识别）
3. **Root Directory**: `./`（默认）
4. **Build Command**: `npm run build`（默认）
5. **Output Directory**: `.next`（默认）

#### Step 5: 环境变量配置
点击 **Environment Variables**，添加以下变量：

| Name | Value |
|------|-------|
| `TURSO_DATABASE_URL` | `libsql://[your-db].turso.io` |
| `TURSO_AUTH_TOKEN` | `[your-turso-token]` |
| `DASHSCOPE_API_KEY` | `[your-dashscope-key]` |
| `GOOGLE_CLIENT_ID` | `[your-google-client-id]` |
| `GOOGLE_CLIENT_SECRET` | `[your-google-client-secret]` |
| `NEXTAUTH_URL` | `https://mailmuse.vercel.app` |
| `NEXTAUTH_SECRET` | `[generate-a-random-secret]` |
| `PAYPAL_CLIENT_ID` | `[your-paypal-client-id]` |
| `PAYPAL_SECRET` | `[your-paypal-secret]` |
| `PAYPAL_MODE` | `sandbox` 或 `live` |

#### Step 6: 点击 Deploy
1. 确认所有配置正确
2. 点击 **Deploy Project** 按钮
3. 等待部署完成（约 2-3 分钟）

### 3.3 本地开发环境搭建

#### 前置条件
- Node.js 18+（推荐 Node.js 20）
- npm、yarn、pnpm 或 bun（本文档使用 npm）
- Git

#### Step 1: 安装 Node.js
1. 访问 https://nodejs.org/
2. 下载 LTS 版本（推荐 20.x）
3. 运行安装程序，按提示完成安装

#### Step 2: 验证安装
```bash
node --version
npm --version
```

#### Step 3: 创建 Next.js 项目
```bash
npx create-next-app@latest mailmuse --typescript --tailwind --eslint
```

命令行交互：
```
? Would you like to use `src/` directory? ... No / Yes → **Yes**
? Would you like to use App Router? ... No / Yes → **Yes**
? Would you like to customize the default import alias? ... No / Yes → **Yes**, use `@/*`
```

#### Step 4: 安装项目依赖
```bash
cd mailmuse
npm install
```

#### Step 5: 安装额外依赖
```bash
npm install next-auth @paypal/react-paypal-js openai @libsql/client
```

#### Step 6: 配置环境变量
创建 `.env.local` 文件：
```bash
cp .env.example .env.local
```

编辑 `.env.local`：
```bash
# 阿里通义千问 API Key
DASHSCOPE_API_KEY=your_api_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-key

# Turso Database（本地开发可先不填）
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

# PayPal（沙盒模式）
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYPAL_MODE=sandbox
PAYPAL_MONTHLY_PLAN_ID=
PAYPAL_YEARLY_PLAN_ID=
```

#### Step 7: 启动开发服务器
```bash
npm run dev
```

#### Step 8: 验证运行
1. 打开浏览器
2. 访问 http://localhost:3000
3. 确认页面正常显示

### 3.4 环境变量配置规范

#### 环境变量命名规范
```
1. 使用下划线分隔：TURSO_DATABASE_URL
2. 使用大写字母：GOOGLE_CLIENT_ID
3. 前缀标识类型：
   - 数据库相关：TURSO_*
   - 认证相关：GOOGLE_*, NEXTAUTH_*
   - AI 相关：DASHSCOPE_*
   - 支付相关：PAYPAL_*
```

#### 环境变量分类

**开发环境 (.env.local)**
```
# 本地开发使用
DASHSCOPE_API_KEY=sk-xxxx（测试 key）
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-not-for-production
TURSO_DATABASE_URL=libsql://localhost:8080
TURSO_AUTH_TOKEN=
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=test-client
PAYPAL_SECRET=test-secret
PAYPAL_MONTHLY_PLAN_ID=
PAYPAL_YEARLY_PLAN_ID=
```

**生产环境 (Vercel Environment Variables)**
```
# 生产环境使用真实凭证
DASHSCOPE_API_KEY=sk-xxxx（生产 key）
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=[使用 openssl rand -base64 32 生成]
TURSO_DATABASE_URL=libsql://[db-name].turso.io
TURSO_AUTH_TOKEN=[turso token]
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=[生产 client id]
PAYPAL_SECRET=[生产 secret]
PAYPAL_MONTHLY_PLAN_ID=[生产 plan id]
PAYPAL_YEARLY_PLAN_ID=[生产 plan id]
```

### 3.5 数据库选型（Turso）与配置

#### Turso 简介
Turso 是一个边缘数据库服务，基于 libSQL（SQLite 的开源分支），提供全球低延迟访问，免费额度 5GB。

#### Step 1: 注册 Turso
1. 访问 https://turso.tech
2. 点击 **Sign Up**
3. 使用 GitHub 账号登录

#### Step 2: 创建数据库
1. 登录后进入 Dashboard
2. 点击 **Create new database**
3. **Database Name**: `mailmuse`
4. **Region**: 选择 `Los Angeles` 或靠近目标用户的区域
5. 点击 **Create database**

#### Step 3: 获取数据库凭证
1. 点击刚创建的数据库 `mailmuse`
2. 点击 **Connection**
3. 复制 **URL**（格式：`libsql://mailmuse-[xxx].turso.io`）
4. 点击 **Create access token**
5. 复制生成的 token

#### Step 4: 本地开发配置
安装 Turso CLI：
```bash
# macOS
brew install tursodatabase/tap/turso

# Windows
# 使用 WSL 或下载 release
```

连接本地数据库：
```bash
turso db create mailmuse --local
turso db shell mailmuse
```

#### Step 5: 初始化数据库表
访问 `http://localhost:3000/api/init` 或在代码中调用：
```typescript
import { initDatabase } from '@/lib/db';

await initDatabase();
```

---

## 第四部分：核心功能开发流程

### 4.1 用户认证系统

#### 技术选型
- NextAuth.js v4 + Google OAuth Provider
- 会话管理使用 JWT

#### 4.1.1 NextAuth + Google OAuth 配置

**Step 1: 创建 Google Cloud 项目**
1. 访问 https://console.cloud.google.com
2. 点击 **Select a project** → **New Project**
3. 输入项目名称：`mailmuse-auth`
4. 点击 **Create**

**Step 2: 配置 OAuth 同意屏幕**
1. 在左侧菜单选择 **APIs & Services** → **OAuth consent screen**
2. 选择 **External**
3. 点击 **Create**
4. 填写应用信息：
   - **App name**: `MailCraftUs`
   - **User support email**: 你的邮箱
   - **Developer contact**: 你的邮箱
5. 点击 **Save and Continue**
6. 在 **Scopes** 页面，点击 **Add or Remove Scopes**
7. 勾选：
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
8. 点击 **Save and Continue**

**Step 3: 创建 OAuth 客户端**
1. 在左侧菜单选择 **APIs & Services** → **Credentials**
2. 点击 **Create Credentials** → **OAuth client ID**
3. **Application type**: Web application
4. **Name**: `MailCraftUs Web Client`
5. **Authorized JavaScript origins**:
   - `http://localhost:3000`（开发环境）
   - `https://mailmuse.vercel.app`（生产环境，按实际域名）
6. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`（开发环境）
   - `https://mailmuse.vercel.app/api/auth/callback/google`（生产环境）
7. 点击 **Create**
8. 复制 **Client ID** 和 **Client Secret**

**Step 4: 配置 NextAuth**
创建文件 `src/lib/auth.ts`：
```typescript
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  events: {
    async signIn({ user }) {
      if (user.email) {
        try {
          await upsertUser(user.email, {
            name: user.name || undefined,
            avatar_url: user.image || undefined,
          });
        } catch (error) {
          console.error('Failed to sync user on login:', error);
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

**Step 5: 创建 API 路由**
创建文件 `src/app/api/auth/[...nextauth]/route.ts`：
```typescript
import { GET, POST } from '@/lib/auth';
export { authOptions } from '@/lib/auth';
export { GET, POST };
```

**Step 6: 配置 Providers 组件**
创建 `src/components/Providers.tsx`：
```typescript
'use client';

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

**Step 7: 修改 Root Layout**
编辑 `src/app/layout.tsx`：
```typescript
import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### 4.1.2 会话管理

**获取会话信息**
```typescript
// 服务端组件
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
console.log(session?.user?.email);

// 客户端组件
import { useSession } from 'next-auth/react';

const { data: session } = useSession();
console.log(session?.user?.email);
```

**会话类型扩展**
创建 `src/types/next-auth.d.ts`：
```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
}
```

#### 4.1.3 保护路由实现

**服务端保护**
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 业务逻辑
  return NextResponse.json({ data: 'protected data' });
}
```

**客户端保护**
```typescript
'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return <div>Protected content</div>;
}
```

### 4.2 数据库设计

#### 4.2.1 Schema 设计原则

```
1. 规范化设计
   - 每个表有唯一主键
   - 避免数据冗余
   - 使用外键维护关系

2. 字段设计
   - 合理的数据类型
   - 添加必要的索引
   - 设置合理的默认值

3. 扩展性考虑
   - 预留扩展字段
   - 版本控制字段
```

#### 4.2.2 用户表结构设计

**users 表**
```sql
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK(subscription_tier IN ('free', 'pro')),
  plan_type TEXT CHECK(plan_type IN ('monthly', 'yearly')),
  paypal_subscription_id TEXT,
  subscription_end_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 每日使用量追踪
ALTER TABLE users ADD COLUMN daily_usage_date TEXT;
ALTER TABLE users ADD COLUMN daily_usage_count INTEGER DEFAULT 0;
```

#### 4.2.3 订阅相关表结构

订阅信息直接存储在 users 表中，通过 `subscription_tier` 和 `subscription_end_date` 字段管理。

### 4.3 AI 功能集成

#### 4.3.1 阿里云百炼 API 接入

**Step 1: 获取 API Key**
1. 访问 https://dashscope.console.aliyun.com/
2. 登录阿里云账号
3. 进入 **API-KEY 管理**
4. 创建 API-KEY 并复制

**Step 2: 安装依赖**
```bash
npm install openai
```

**Step 3: 配置客户端**
创建 `src/lib/qwen.ts`：
```typescript
import OpenAI from 'openai';

function getClient() {
  const apiKey = process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY environment variable is not set');
  }

  return new OpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: apiKey,
  });
}
```

#### 4.3.2 Prompt 工程最佳实践

```typescript
export async function generateEmail(params: {
  scenario: string;
  recipientRole: string;
  senderBackground: string;
  emailPurpose: string;
  tone: string;
  language: string;
}) {
  const { scenario, recipientRole, senderBackground, emailPurpose, tone, language } = params;

  const toneInstructions = {
    formal: 'Use formal, professional language with proper greetings and sign-offs',
    casual: 'Use friendly, conversational tone while remaining professional',
    friendly: 'Use warm, approachable language with slight casualness',
  };

  const languageInstruction = language !== 'English'
    ? `Write the email in ${language}.`
    : '';

  const prompt = `You are a professional email writer. Write a ${tone} email for the following scenario:

Scenario: ${scenario}
Recipient: ${recipientRole}
Sender Background: ${senderBackground}
Email Purpose: ${emailPurpose}

Requirements:
- ${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.formal}
- ${languageInstruction}
- Length: Short to medium (1-3 paragraphs)
- Include a clear subject line (prefix with "Subject: ")
- Include a professional greeting
- Include a sign-off
- Focus on the core purpose without fluff

Output ONLY the email with subject line, no explanations or additional text.`;

  const client = getClient();

  try {
    const response = await client.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        { role: 'system', content: 'You are a professional email writing assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}
```

**Prompt 设计要点**
```
1. 角色定义 - 明确 AI 扮演的角色
2. 任务描述 - 具体说明要完成的任务
3. 输入参数 - 清晰地列出用户提供的参数
4. 输出格式 - 明确期望的输出格式，添加约束条件
5. 示例输出 - 提供期望的输出示例
```

### 4.4 订阅支付系统

#### 4.4.1 PayPal 开发者平台配置

**Step 1: 注册 PayPal 开发者账号**
1. 访问 https://developer.paypal.com
2. 点击 **Log into Dashboard**
3. 使用 PayPal 个人账户登录

**Step 2: 创建应用**
1. 在 Dashboard 点击 **My Apps & Credentials**
2. 点击 **Create App**
3. **App Name**: `MailCraftUs`
4. **App Type**: 选择 **Merchant**
5. 点击 **Create App**
6. 复制 **Client ID** 和 **Secret**

**Step 3: 配置沙盒环境**
1. 在 **My Apps & Credentials** 页面
2. 确认 **Sandbox** 开关打开
3. 使用沙盒模式的 Client ID 和 Secret

#### 4.4.2 Webhook 安全验证

**Step 1: 创建 Webhook**
1. 在 **My Apps & Credentials** 页面
2. 选择你的应用
3. 在 **Webhooks** 部分点击 **Add Webhook**
4. **Webhook URL**: `https://your-domain.com/api/webhook/paypal`
5. **Event types**: 选择：
   - `BILLING.SUBSCRIPTION.CREATED`
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `PAYMENT.SALE.COMPLETED`
6. 点击 **Save**

#### 4.4.3 订阅状态管理

```typescript
// 订阅计划配置
export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: process.env.PAYPAL_MONTHLY_PLAN_ID || '',
    name: 'MailCraftUs Pro Monthly',
    price: 9,
    interval: 'month',
  },
  yearly: {
    id: process.env.PAYPAL_YEARLY_PLAN_ID || '',
    name: 'MailCraftUs Pro Yearly',
    price: 99,
    interval: 'year',
  },
} as const;
```

#### 4.4.4 沙盒环境测试

**Step 1: 配置沙盒模式**
```bash
PAYPAL_MODE=sandbox
```

**Step 2: 创建 PayPal 产品和计划**
访问 `https://your-domain.com/api/setup/paypal`

**Step 3: 配置 Plan ID**
将返回的 Plan ID 添加到环境变量

#### 4.4.5 正式环境切换步骤

**Step 1: 获取生产凭证**
1. 登录 https://www.paypal.com
2. 进入 **Account Settings** → **Website payments**
3. 获取生产 Client ID 和 Secret

**Step 2: 更新环境变量**
```
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=[生产 Client ID]
PAYPAL_SECRET=[生产 Secret]
PAYPAL_MONTHLY_PLAN_ID=[生产 Monthly Plan ID]
PAYPAL_YEARLY_PLAN_ID=[生产 Yearly Plan ID]
NEXTAUTH_URL=https://your-actual-domain.com
```

**Step 3: 配置生产 Webhook**
1. 在 PayPal Dashboard 创建生产 Webhook
2. URL: `https://your-actual-domain.com/api/webhook/paypal`
3. 选择与沙盒相同的事件类型

---

## 第五部分：高效 AI 开发提示词

### 5.1 需求分析类

**模板 1: 功能需求分析**
```
请分析以下功能需求，识别潜在的技术挑战和解决方案：

功能描述：[详细描述功能]
目标用户：[目标用户群体]
使用场景：[具体使用场景]

请提供：
1. 技术实现方案
2. 可能的挑战
3. 建议的优先级
```

**模板 2: 用户流程分析**
```
请分析以下用户流程，找出可能的摩擦点和优化建议：

用户流程：[描述用户完成任务的步骤]

请提供：
1. 每一步的用户体验评分（1-5）
2. 痛点识别
3. 优化建议
```

**模板 3: 数据模型设计**
```
请为一个 [功能] 设计数据模型。

需求：
- [需求1]
- [需求2]

请提供：
1. 数据表结构
2. 字段说明
3. 关系图
```

**模板 4: API 设计**
```
请为一个 [功能] 设计 RESTful API。

功能描述：[描述]
用户操作：[用户会做什么]

请提供：
1. Endpoints
2. Request/Response 格式
3. 错误处理
```

### 5.2 代码实现类

**模板 1: 组件实现**
```
请使用 React + TypeScript + Tailwind CSS 实现以下组件：

组件名称：[名称]
功能描述：[描述]
Props：
- [prop1]: [类型] - [说明]
- [prop2]: [类型] - [说明]

设计要求：
- 使用深色主题
- 响应式设计
- 包含 loading 和 error 状态
```

**模板 2: API 路由实现**
```
请为 Next.js App Router 实现以下 API 路由：

路由：[HTTP方法] /api/[path]
功能：[描述]
认证要求：[需要/不需要]

请使用 TypeScript 实现，包含：
1. 类型定义
2. 参数验证
3. 错误处理
4. 响应格式
```

**模板 3: 数据库操作**
```
请为 Turso (libSQL) 数据库实现以下操作：

表名：[名称]
操作：
- [操作1]
- [操作2]

请提供：
1. SQL 语句
2. TypeScript 封装函数
3. 错误处理
```

**模板 4: 第三方服务集成**
```
请实现与 [服务名] 的集成：

集成目的：[为什么需要这个服务]
需要实现的功能：
- [功能1]
- [功能2]

请提供：
1. 配置说明
2. 封装函数
3. 错误处理
```

### 5.3 代码审查类

**模板 1: 代码审查请求**
```
请审查以下代码，检查：

1. 代码质量
2. 潜在 bug
3. 安全问题
4. 性能问题

代码路径：[文件路径]
代码内容：
[粘贴代码]

请提供：
1. 问题列表
2. 修复建议
3. 优化建议
```

**模板 2: 安全审查**
```
请审查以下代码的安全问题：

代码：[代码内容]
上下文：[使用场景]

请检查：
1. SQL 注入
2. XSS 攻击
3. CSRF 攻击
4. 敏感信息泄露
5. 认证/授权问题
```

**模板 3: 性能审查**
```
请审查以下代码的性能问题：

代码：[代码内容]
预期负载：[描述]

请检查：
1. 数据库查询效率
2. 不必要的重新渲染
3. 内存泄漏
4. 网络请求优化
```

### 5.4 问题排查类

**模板 1: Bug 排查**
```
请帮助排查以下问题：

问题描述：[描述问题]
复现步骤：
1. [步骤1]
2. [步骤2]
3. [步骤3]

错误信息：
[错误日志]

相关代码：
[相关代码]

环境：
- Node.js 版本：
- 框架版本：
- 操作系统：
```

**模板 2: 构建错误排查**
```
请帮助解决以下构建错误：

错误信息：
[完整的错误输出]

构建命令：[命令]
项目配置：
[package.json 或相关配置]

请提供：
1. 错误原因分析
2. 解决方案
3. 预防措施
```

**模板 3: 运行时错误排查**
```
请帮助解决以下运行时错误：

错误类型：[TypeError/RuntimeError 等]
错误信息：[完整错误]
发生位置：[文件和行号]
调用栈：
[调用栈信息]

触发条件：[什么操作导致]
```

### 5.5 优化建议类

**模板 1: 性能优化**
```
请分析以下代码并提供优化建议：

代码路径：[路径]
当前性能指标：[如果有]
目标：[描述目标]

请提供：
1. 性能瓶颈识别
2. 优化方案
3. 预期改进
```

**模板 2: 代码重构**
```
请分析以下代码并提供重构建议：

代码路径：[路径]
当前问题：[描述问题]

请提供：
1. 重构方案
2. 风险评估
3. 实施步骤
```

---

## 第六部分：上线部署

### 6.1 Vercel 部署完整步骤

#### Step 1: 推送代码到 GitHub
```bash
git add .
git commit -m "feat: initial commit"
git push origin main
```

#### Step 2: 连接到 Vercel
1. 登录 https://vercel.com
2. 点击 **Add New** → **Project**
3. 选择 **Import Git Repository**
4. 选择 `mailmuse` 仓库
5. 点击 **Import**

#### Step 3: 配置项目
1. **Project Name**: `mailmuse`
2. **Framework Preset**: `Next.js`
3. **Root Directory**: `.`
4. **Build Command**: `npm run build`
5. **Output Directory**: `.next`

#### Step 4: 配置环境变量
点击 **Environment Variables**，添加：

| Name | Value | Environments |
|------|-------|--------------|
| `TURSO_DATABASE_URL` | `libsql://[db].turso.io` | Production, Preview, Development |
| `TURSO_AUTH_TOKEN` | `[token]` | Production, Preview, Development |
| `DASHSCOPE_API_KEY` | `[key]` | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | `[id]` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | `[secret]` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://mailmuse.vercel.app` | Production |
| `NEXTAUTH_SECRET` | `[secret]` | Production, Preview, Development |
| `PAYPAL_CLIENT_ID` | `[id]` | Production, Preview, Development |
| `PAYPAL_SECRET` | `[secret]` | Production, Preview, Development |
| `PAYPAL_MODE` | `live` | Production |
| `PAYPAL_MODE` | `sandbox` | Preview, Development |

#### Step 5: 部署
1. 点击 **Deploy**
2. 等待构建完成（约 2-3 分钟）
3. 获得部署 URL：`https://mailmuse.vercel.app`

### 6.2 域名配置

#### Step 1: 在 Vercel 配置域名
1. 进入 Vercel Dashboard
2. 选择 `mailmuse` 项目
3. 点击 **Settings**
4. 点击 **Domains**
5. 输入你的域名
6. 点击 **Add**

#### Step 2: 配置 DNS
根据 Vercel 提供的 DNS 记录配置：

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### 6.3 PayPal Webhook 配置

#### 生产环境 Webhook 设置
1. 登录 https://developer.paypal.com
2. 选择你的应用
3. 点击 **Webhooks**
4. 点击 **Add Webhook**
5. **Webhook URL**: `https://mailmuse.com/api/webhook/paypal`
6. 选择事件类型：
   - `BILLING.SUBSCRIPTION.CREATED`
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `PAYMENT.SALE.COMPLETED`
7. 点击 **Save**

### 6.4 监控和日志

#### Vercel 内置监控
1. 进入 Vercel Dashboard
2. 选择项目
3. 查看 **Analytics** 标签页

#### 日志查看
1. 进入项目
2. 点击 **Logs** 标签页
3. 查看实时日志

---

## 第七部分：运维与维护

### 7.1 错误监控（Sentry）

#### Step 1: 注册 Sentry
1. 访问 https://sentry.io
2. 创建账户
3. 创建新项目

#### Step 2: 安装 SDK
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

#### Step 3: 配置环境变量
```
NEXT_PUBLIC_SENTRY_DSN=[Sentry DSN]
```

### 7.2 数据库备份

#### Turso 自动备份
- 每日自动备份
- 保留 30 天
- 可手动触发备份

#### 手动备份
```bash
turso db shell mailmuse --host libsql://mailmuse-[xxx].turso.io ".backup backup.sqlite"
```

### 7.3 性能优化

#### 前端优化
```
1. 图片优化 - 使用 Next.js Image 组件
2. 代码分割 - 使用动态导入
3. 缓存策略 - 配置 Cache-Control
```

#### 后端优化
```
1. API 响应缓存 - 使用 ISR
2. 数据库查询优化 - 添加必要的索引
3. AI API 优化 - 添加请求超时和重试机制
```

---

## 第八部分：附录

### 8.1 环境变量清单

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `DASHSCOPE_API_KEY` | 阿里通义千问 API Key | 是 |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | 是 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | 是 |
| `NEXTAUTH_URL` | NextAuth 访问 URL | 是 |
| `NEXTAUTH_SECRET` | NextAuth 加密密钥 | 是 |
| `TURSO_DATABASE_URL` | Turso 数据库 URL | 是 |
| `TURSO_AUTH_TOKEN` | Turso 认证 Token | 是 |
| `PAYPAL_CLIENT_ID` | PayPal Client ID | 是 |
| `PAYPAL_SECRET` | PayPal Secret | 是 |
| `PAYPAL_MODE` | PayPal 模式 (sandbox/live) | 是 |
| `PAYPAL_MONTHLY_PLAN_ID` | PayPal 月度计划 ID | 否 |
| `PAYPAL_YEARLY_PLAN_ID` | PayPal 年度计划 ID | 否 |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN | 否 |

### 8.2 Git 提交规范

#### 提交格式
```
<type>(<scope>): <subject>

<body>
```

#### Type 类型
| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式 |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |

#### 示例
```
feat(auth): add Google OAuth login

- Implement Google OAuth provider
- Add session management
- Add protected routes
```

### 8.3 API 错误码规范

#### HTTP 状态码
| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 400 | Bad Request | 参数错误 |
| 401 | Unauthorized | 未登录 |
| 403 | Forbidden | 权限不足 |
| 404 | Not Found | 资源不存在 |
| 429 | Too Many Requests | 请求过于频繁 |
| 500 | Internal Server Error | 服务器错误 |

#### 错误响应格式
```json
{
  "error": "错误描述",
  "code": "ERROR_CODE"
}
```

### 8.4 技术术语解释

| 术语 | 解释 |
|------|------|
| **Next.js App Router** | Next.js 14+ 的新路由系统 |
| **Tailwind CSS** | Utility-first 的 CSS 框架 |
| **Turso** | 基于 libSQL 的边缘数据库服务 |
| **NextAuth.js** | Next.js 的认证解决方案 |
| **Google OAuth** | Google 第三方登录认证协议 |
| **PayPal Webhook** | PayPal 支付事件通知机制 |
| **ISR** | Incremental Static Regeneration |
| **libSQL** | SQLite 的开源分支 |
| **MoSCoW** | 优先级排序方法 |
| **Webhook** | Web 回调机制 |

---

## 常见问题与解决方案

### Q1: Google OAuth 本地开发无法测试？
**A**: 使用 `http://localhost:3000` 作为 redirect URI。在 Google Cloud Console 添加本地 URI。

### Q2: PayPal Webhook 本地无法接收？
**A**: 使用 ngrok 进行本地测试：
```bash
ngrok http 3000
```

### Q3: Turso 数据库连接失败？
**A**: 检查网络连接、TURSO_AUTH_TOKEN 是否正确、数据库是否创建。

### Q4: AI 生成失败如何处理？
**A**: 检查 DASHSCOPE_API_KEY 是否有效、API 配额是否用完、添加重试机制。

### Q5: 部署后页面空白？
**A**: 检查 build 是否成功、确认环境变量已配置、查看 Vercel 日志。

---

## 文档版本历史

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| 1.0 | 2026-03-26 | 初始版本 |

---

*本 SOP 文档基于 MailCraftUs 项目实际开发经验总结，供后续同类产品开发参考。*
