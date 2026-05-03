const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://nbyogdnutqhxaaevsvrm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieW9nZG51dHFoeGFhZXZzdnJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzgxNDk1MywiZXhwIjoyMDkzMzkwOTUzfQ.9CvTsC4rd-CiieNq9s51irwls31E1fXsbUrKh3drfjs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testActions() {
  console.log('--- Supabase CRUD Test ---');
  
  // 1. Test Notice Creation (camelCase to snake_case test)
  console.log('1. Testing Notice Creation...');
  const testNotice = {
    title: 'QA 테스트 공지',
    content: '테스트 내용입니다.',
    date: new Date().toISOString().split('T')[0],
    showOnMain: true, // This should be converted to show_on_main
    status: '게시'
  };

  function toSnakeCase(obj) {
    const newObj = {};
    for (const key in obj) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      newObj[snakeKey] = obj[key];
    }
    return newObj;
  }

  const insertData = toSnakeCase(testNotice);
  insertData.created_at = new Date().toISOString();
  insertData.updated_at = new Date().toISOString();

  const { data: notice, error: noticeErr } = await supabase
    .from('notices')
    .insert(insertData)
    .select()
    .single();

  if (noticeErr) {
    console.error('Notice Creation Failed:', noticeErr);
  } else {
    console.log('Notice Created Successfully:', notice.id, 'show_on_main:', notice.show_on_main);
  }

  // 2. Test Bulletin Creation
  console.log('2. Testing Bulletin Creation...');
  const testBulletin = {
    title: 'QA 테스트 주보',
    date: '2026-05-03',
    pdf_url: 'https://example.com/test.pdf',
    show_on_main: true
  };
  
  const { data: bulletin, error: bulletinErr } = await supabase
    .from('bulletins')
    .insert({ ...testBulletin, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .select()
    .single();

  if (bulletinErr) {
    console.error('Bulletin Creation Failed:', bulletinErr);
  } else {
    console.log('Bulletin Created Successfully:', bulletin.id);
  }

  // 3. Cleanup
  console.log('3. Cleaning up test data...');
  if (notice) await supabase.from('notices').delete().eq('id', notice.id);
  if (bulletin) await supabase.from('bulletins').delete().eq('id', bulletin.id);
  
  console.log('Test Finished.');
}

testActions();
