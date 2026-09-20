// Vercel Serverless Function - 豆包 API 代理
// 部署时在 Vercel 环境变量中设置 DOUBAO_API_KEY 即可

const https = require('https');

const SYSTEM_PROMPT = `你是一个知识学习助手，专门帮助用户快速理解一个新的领域或概念。
你的回答必须严格按照以下 JSON 格式返回，不要有任何额外的文字、解释或 markdown 标记：

{
  "title": "概念的中文名称",
  "englishName": "概念的英文名称（如果没有则留空）",
  "definition": "一句话精确定义，100字以内",
  "overview": "这个概念/领域的整体介绍，200-300字，通俗易懂",
  "coreIdeas": [
    "核心理念1",
    "核心理念2",
    "核心理念3"
  ],
  "keyProcess": [
    {
      "step": "步骤名称",
      "desc": "这个步骤做什么，1-2句话"
    }
  ],
  "keyTools": [
    {
      "name": "工具/方法名称",
      "desc": "一句话说明用途"
    }
  ],
  "mindmap": {
    "center": "中心主题",
    "branches": [
      {
        "label": "一级分支名称",
        "children": ["二级子节点1", "二级子节点2", "二级子节点3"]
      }
    ]
  },
  "quiz": [
    {
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "answer": 0,
      "explanation": "答案解析，说明为什么正确"
    }
  ]
}

要求：
1. coreIdeas 3-5条
2. keyProcess 4-8个步骤，按流程顺序排列
3. keyTools 4-6个
4. mindmap.branches 3-5个一级分支，每个分支 3-5个子节点
5. quiz 5-8道选择题，涵盖核心概念
6. 回答必须是合法 JSON，用双引号，不能有注释
7. 内容要准确、专业、有深度，适合成年人快速学习`;

function callDoubaoAPI(apiKey, userMessage, model) {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      model: model || 'doubao-seed-1-6-250715',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const options = {
      hostname: 'ark.cn-beijing.volces.com',
      path: '/api/v3/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`API 请求失败: ${res.statusCode} - ${data}`));
          return;
        }
        try {
          const result = JSON.parse(data);
          const content = result.choices[0].message.content;
          resolve(content);
        } catch (e) {
          reject(new Error('解析 API 响应失败: ' + e.message));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.write(requestBody);
    req.end();
  });
}

function parseJSONContent(content) {
  // 尝试直接解析
  try {
    return JSON.parse(content);
  } catch (e) {
    // 尝试从代码块提取
    if (content.includes('```json')) {
      const match = content.match(/```json\n([\s\S]*?)\n```/);
      if (match) {
        try { return JSON.parse(match[1].trim()); } catch (_) {}
      }
    }
    if (content.includes('```')) {
      const match = content.match(/```\n([\s\S]*?)\n```/);
      if (match) {
        try { return JSON.parse(match[1].trim()); } catch (_) {}
      }
    }
    // 尝试提取第一个 { 到最后一个 }
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try { return JSON.parse(content.slice(firstBrace, lastBrace + 1)); } catch (_) {}
    }
    throw new Error('无法解析 AI 返回的 JSON 内容');
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, model } = req.body || {};

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: '请输入学习主题' });
    }

    // 优先使用环境变量中的 API Key，其次使用请求中传入的
    const apiKey = process.env.DOUBAO_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: '服务器未配置豆包 API Key，请在环境变量中设置 DOUBAO_API_KEY' });
    }

    const userMessage = `请帮我生成关于「${topic.trim()}」的完整知识学习资料。`;
    const rawContent = await callDoubaoAPI(apiKey, userMessage, model);
    const data = parseJSONContent(rawContent);

    return res.status(200).json({ data, raw: rawContent });
  } catch (error) {
    console.error('API 调用失败:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
