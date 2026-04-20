import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: '缺少授权码' }, { status: 400 });
  }

  try {
    // 调用飞书接口获取access_token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/oidc/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        app_id: 'cli_a969b7b56b78dbc3',
        app_secret: 'nBu2K5noH1Dn5hJBa56O4Civ047p7ayw',
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.code !== 0) {
      return NextResponse.json({ error: '获取access_token失败', details: tokenData.msg }, { status: 500 });
    }

    const accessToken = tokenData.data.access_token;

    // 获取用户信息
    const userRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/user_info', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const userData = await userRes.json();
    if (userData.code !== 0) {
      return NextResponse.json({ error: '获取用户信息失败', details: userData.msg }, { status: 500 });
    }

    const userInfo = userData.data;

    // 登录成功，返回提示页面
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>飞书登录成功</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #f6f8fa; margin: 0; }
            .card { background: white; padding: 48px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
            .success-icon { color: #10b981; font-size: 64px; margin-bottom: 24px; }
            h1 { color: #1f2937; font-size: 24px; margin-bottom: 16px; }
            p { color: #6b7280; line-height: 1.6; }
            .info { background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0; text-align: left; }
            .info p { margin: 8px 0; }
            .btn { display: inline-block; background: #339999; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-top: 8px; }
            .btn:hover { background: #2d8a8a; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="success-icon">✅</div>
            <h1>飞书登录成功！</h1>
            <p>你已成功授权登录Milly助手平台，现在可以正常使用所有飞书文档相关功能。</p>
            <div class="info">
              <p><strong>用户名:</strong> ${userInfo.name}</p>
              <p><strong>用户ID:</strong> ${userInfo.open_id}</p>
              <p><strong>企业:</strong> ${userInfo.tenant_name || '当前企业'}</p>
            </div>
            <a href="/" class="btn">返回首页</a>
          </div>
        </body>
      </html>
    `;

    // 这里可以保存用户登录状态到数据库或者session

    // 通知后台登录成功
    console.log('飞书用户登录成功:', userInfo);

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 200,
    });

  } catch (error: any) {
    console.error('飞书登录回调处理失败:', error);
    return NextResponse.json({ error: '登录处理失败', details: error.message }, { status: 500 });
  }
}
