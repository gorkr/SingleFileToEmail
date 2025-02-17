document.getElementById('saveAndSend').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const statusElement = document.getElementById('status');
  
    if (!email) {
      statusElement.textContent = '请填写所有字段！';
      return;
    }
  
    try {
      statusElement.textContent = '正在保存页面...';
      
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
    //   // 检查 downloads API 是否可用
    //   if (!chrome.downloads) {
    //     throw new Error('下载 API 不可用，请检查扩展权限设置');
    //   }
      
    //   // 设置下载监听器
    //   const downloadListener = (downloadItem) => {
    //     if (downloadItem.filename.endsWith('.html')) {
    //       statusElement.textContent = 'HTML文件已生成：' + downloadItem.filename;
    //       console.log("监听到下载成功")
    //       // TODO: 在这里添加发送邮件的逻辑
          
    //       // 移除监听器
    //       chrome.downloads.onCreated.removeListener(downloadListener);
    //     }
    //   };
      
      // 添加下载监听器
    //   chrome.downloads.onCreated.addListener(downloadListener);
      
      // 发送消息给SingleFile扩展
      chrome.runtime.sendMessage('mpiodijhokgodhhofbcjdecpffjipkle', "save-page");
      statusElement.textContent = '已发送保存命令，SingleFile 正在处理...';
      
    } catch (error) {
      statusElement.textContent = '发生错误：' + error.message;
      console.error('Error:', error);
    }
});

// 添加消息监听器
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateStatus') {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message.message;
  }
});