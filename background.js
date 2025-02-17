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
        chrome.downloads.search({ id: downloadDelta.id }, function (downloads) {
            if (downloads && downloads[0]) {
                const filePath = downloads[0].filename;
            }
        });

        // 获取存储的 email
        chrome.storage.local.get(['userEmail'], function (result) {
            const email = result.userEmail;
            const mailtoUrl = `mailto:${email}?subject=文件分享&body=这是您要的文件`;
            chrome.tabs.create({
                url: encodeURI(mailtoUrl)
            });
            // todo email js


            //
        });

        // 向 popup 发送消息
        chrome.runtime.sendMessage({
            action: 'updateStatus',
            message: '邮件已发送，请查收...'
        });



    }
});