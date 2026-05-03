const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://nbyogdnutqhxaaevsvrm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieW9nZG51dHFoeGFhZXZzdnJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzgxNDk1MywiZXhwIjoyMDkzMzkwOTUzfQ.9CvTsC4rd-CiieNq9s51irwls31E1fXsbUrKh3drfjs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFile(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });
  
  if (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
    return null;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);
    
  return publicUrl;
}

async function run() {
  const img1 = 'C:\\Users\\ff\\.gemini\\antigravity\\brain\\2a94e735-321e-408c-8b1c-81add889cb3b\\.tempmediaStorage\\media_2a94e735-321e-408c-8b1c-81add889cb3b_1777818301957.png';
  const img2 = 'C:\\Users\\ff\\.gemini\\antigravity\\brain\\2a94e735-321e-408c-8b1c-81add889cb3b\\.tempmediaStorage\\media_2a94e735-321e-408c-8b1c-81add889cb3b_1777818306351.png';

  console.log('Uploading images...');
  const bannerUrl = await uploadFile(img1, 'church_banner.png');
  const pastorUrl = await uploadFile(img2, 'pastor_profile.png');

  if (bannerUrl && pastorUrl) {
    console.log('Banner URL:', bannerUrl);
    console.log('Pastor URL:', pastorUrl);

    // Update settings
    const { data: current } = await supabase.from('settings').select('data').eq('id', 1).single();
    const settings = current.data || {};
    
    settings.churchImage = bannerUrl;
    settings.pastorImage = pastorUrl;
    
    const { error: updateError } = await supabase
      .from('settings')
      .update({ data: settings, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (updateError) {
      console.error('Error updating settings:', updateError.message);
    } else {
      console.log('Settings updated successfully!');
    }
  }
}

run();
