
function copyToClipboard(text) {
    navigator.clipboard.writeText("要复制的内容")
  .then(() => console.log("内容已复制到剪贴板"))
  .catch(err => console.error("复制失败:", err));

  }
  

chrome.downloads.onCreated.addListener((downloadItem) => {

    console.log('Download started:', downloadItem);


});

chrome.downloads.onErased.addListener((downloadId) => {


    console.log('Download erased:', downloadId);


});

chrome.downloads.onChanged.addListener(function (downloadDelta) {
    if (downloadDelta.state && downloadDelta.state.current === 'complete') {
        console.log('下载已完成:', downloadDelta);

        // 向 popup 发送消息
        chrome.runtime.sendMessage({
            action: 'updateStatus',
            message: '保存完成，正在发送邮箱...'
        });

        // todo 获取文件路径
        let filePath = null;
        let fileName = null;
        chrome.downloads.search({ id: downloadDelta.id }, function (downloads) {
            if (downloads && downloads[0]) {
                filePath = downloads[0].filename;
                fileName = filePath.split('\\').pop();
                copyToClipboard(filePath)
                console.log(filePath)
            }
        });        

        // 获取存储的 email
        chrome.storage.local.get(['userEmail'], function (result) {
            const email = result.userEmail;
            console.log("email"+email)
            const mailtoUrl = `mailto:${email}?subject=互联网本分享内容:${fileName}&body=本地地址${filePath}`;
            chrome.tabs.create({
                url: encodeURI(mailtoUrl)
            });
            // todo email j
        });



        // 向 popup 发送消息
        chrome.runtime.sendMessage({
            action: 'updateStatus',
            message: '邮件已发送，请查收...'
        });



    }
});