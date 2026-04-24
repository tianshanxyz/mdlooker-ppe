
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadData() {
  console.log('开始上传数据到Supabase...');
  
  // 读取本地爬取的数据
  const dataPath = path.join(__dirname, 'data', 'mask_registration_data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // 批量插入数据
  const batchSize = 1000;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { error } = await supabase.from('products').insert(batch);
    if (error) {
      console.error('上传批次失败:', error);
      return;
    }
    console.log(`已上传 ${Math.min(i + batchSize, data.length)} 条数据`);
  }
  
  console.log(`✅ 全部${data.length}条数据上传完成！`);
}

uploadData();
