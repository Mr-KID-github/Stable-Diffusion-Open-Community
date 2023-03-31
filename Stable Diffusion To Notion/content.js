// 从页面中获取需要发送的信息
function getInfoFromPage() {
    // 在这里编写代码来获取信息
    console.log("执行getInfoFromPage")
    const img = document.querySelector("body > gradio-app").shadowRoot.querySelector("#txt2img_gallery > div.overflow-y-auto.h-full.p-2.min-h-\\[350px\\].max-h-\\[55vh\\].xl\\:min-h-\\[450px\\] > div > button > img")
    console.log(img)
    const all_msg = document.querySelector("body > gradio-app").shadowRoot.querySelector("#html_info_txt2img > p");

    let all_msg_str = all_msg.textContent.trim();
    console.log(all_msg_str);

    const regex = /^(?:([^<\n]*)(?:\nNegative prompt: ([^<\n]*))?)?\n(.+)$/m;
    const match = all_msg_str.match(regex);
    console.log(match);

    // 匹配 prompt 和 negativePromptRegex
    const promptRegex = /^(.*?)(?:\nNegative prompt: (.*))?$/is; // ?: 表示这个括号内的表达式是非捕获组
    const promptMatch = all_msg_str.match(promptRegex);
    const prompt = promptMatch[1].trim(); // 提取第一组匹配项并去除首尾空格
    const negativePromptRegex = /Negative prompt:\s*((?:(?!Steps:).)*)/s;
    const negativePromptMatch = all_msg_str.match(negativePromptRegex);
    const negativePrompt = negativePromptMatch ? negativePromptMatch[1].trim() : '';

    // 匹配 parameter
    const parameterRegex = /Steps:.*$/m;
    const parameterMatch = all_msg_str.match(parameterRegex);
    const parameter = parameterMatch[0].trim(); // 提取匹配项并去除首尾空格


    return {
        "img": img.src,
        "prompt": prompt,
        "negativePrompt": negativePrompt,
        "parameter": parameter
    }
}


// 监听加载完毕的事件
window.addEventListener("load", function () {
    console.log("页面加载完毕，延时1s后开始插入button")
    // 延迟 1 秒钟执行按钮插入操作（等待页面加载完毕）
    setTimeout(function () {
        // 创建一个按钮元素
        const button = document.createElement("button");
        button.innerHTML = "发送到 Notion";
        // 获取Web中的同类型的ClassName，并套用在嵌入的按钮元素上
        button.className = "gr-button gr-button-lg gr-button-secondary";
        //增加元素的title
        button.setAttribute("title", "将图像写入Notion");
        // 将按钮添加到页面中的特定位置
        const container = document.querySelector("body > gradio-app").shadowRoot.querySelector("#component-229")

        if (container) {
            container.appendChild(button);
            console.log("已经将button插入指定位置");
        } else {
            console.log("未找到容器元素，将按钮添加到页面底部");
            // 将按钮添加到页面底部
            document.body.appendChild(button);
        }
        // 添加按钮点击事件的监听器
        button.addEventListener("click", function () {
            // 从页面中获取需要发送的信息
            const info = getInfoFromPage();
            console.log(info)
            // 向后台脚本发送一个消息，指示它打开popup.html并将信息传递给它
            chrome.runtime.sendMessage({ action: "open_popup", info: info }, function (response) {
                console.log(response);
            });
        });
    }, 1000);
});


