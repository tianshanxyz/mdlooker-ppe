import { NextResponse } from 'next/server';
import crypto from 'crypto';

function signRequest(
  accessKeyId: string,
  accessKeySecret: string,
  method: string,
  path: string,
  headers: Record<string, string>,
  body: string
) {
  // 火山引擎签名逻辑，简化实现
  const date = new Date().toISOString().replace(/[:-]/g, '').replace(/\.\d+Z$/, 'Z');
  const signedHeaders = Object.keys(headers).sort().join(';');
  
  const canonicalRequest = [
    method.toUpperCase(),
    path,
    '',
    Object.entries(headers)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k.toLowerCase()}:${v.trim()}`)
      .join('\n'),
    '',
    signedHeaders,
    crypto.createHash('sha256').update(body).digest('hex')
  ].join('\n');

  const algorithm = 'HMAC-SHA256';
  const credentialScope = `${date.slice(0, 8)}/cn-beijing/maas/request`;
  
  const stringToSign = [
    algorithm,
    date,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');

  const kDate = crypto.createHmac('sha256', accessKeySecret).update(date.slice(0, 8)).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update('cn-beijing').digest();
  const kService = crypto.createHmac('sha256', kRegion).update('maas').digest();
  const kSigning = crypto.createHmac('sha256', kService).update('request').digest();
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  return `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const accessKeyId = process.env.VOLCENGINE_ACCESS_KEY_ID;
    const accessKeySecret = process.env.VOLCENGINE_ACCESS_KEY_SECRET;
    const endpoint = process.env.VOLCENGINE_ENDPOINT || 'maas-api.cn-beijing.volces.com';
    const modelId = process.env.VOLCENGINE_MODEL_ID || 'doubao-seed-2.0-pro';

    // 如果没有配置API密钥，返回模拟回复
    if (!accessKeyId || !accessKeySecret) {
      return NextResponse.json({ 
        content: '您好！我是MDLOOKER AI合规助手，目前正在配置中，很快就可以为您服务。\n\n您现在可以使用我们的其他功能：\n✅ 合规检查向导：快速获取产品进入目标市场的合规要求\n✅ 法规知识库：查询全球各国最新PPE法规标准\n✅ 文档模板库：下载经过专业审核的合规文档模板\n\n如需帮助，请联系客服：support@mdlooker.com'
      });
    }

    const path = `/api/v1/model/${modelId}/chat`;
    const url = `https://${endpoint}${path}`;
    
    const body = JSON.stringify({
      messages: [
        {
          role: 'system',
          content: '你是MDLOOKER平台的AI合规助手，专门解答PPE（个人防护装备）合规相关的问题，包括认证要求、法规解读、标准查询、文档审核、合规建议等。回答要专业、准确、简洁，对于不确定的问题，建议用户咨询专业的认证机构。'
        },
        ...messages
      ],
      parameters: {
        max_tokens: 2048,
        temperature: 0.7,
      }
    });

    const date = new Date().toISOString().replace(/[:-]/g, '').replace(/\.\d+Z$/, 'Z');
    const headers = {
      'Content-Type': 'application/json',
      'X-Date': date,
      'Host': endpoint,
    };

    const authorization = signRequest(accessKeyId, accessKeySecret, 'POST', path, headers, body);
    headers['Authorization'] = authorization;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return NextResponse.json({ content });
  } catch (error) {
    console.error('AI chat error:', error);
    // 降级处理，返回模拟回复
    return NextResponse.json({ 
      content: '抱歉，我遇到了一些问题，请稍后再试，或者联系客服获取帮助：support@mdlooker.com'
    });
  }
}