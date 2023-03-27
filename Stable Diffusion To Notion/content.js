// 在按钮点击事件中执行此函数
async function sendToNotion() {
    try {
        // 获取需要发送的信息
        const info = getInfoFromPage();

        // // 向Notion发送信息的API请求
        // const response = await fetch("https://api.notion.com/v1/pages", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Notion-Version": "2022-03-16",
        //         "Authorization": "Bearer YOUR_NOTION_API_TOKEN"
        //     },
        //     body: JSON.stringify({
        //         parent: {
        //             database_id: "YOUR_DATABASE_ID"
        //         },
        //         properties: {
        //             "名称": {
        //                 title: [
        //                     {
        //                         text: {
        //                             content: info.name
        //                         }
        //                     }
        //                 ]
        //             },
        //             "内容": {
        //                 rich_text: [
        //                     {
        //                         text: {
        //                             content: info.content
        //                         }
        //                     }
        //                 ]
        //             }
        //         }
        //     })
        // });

        // // 获取Notion API的响应
        // const result = await response.json();

        // // 处理响应
        // console.log(result);
    } catch (error) {
        console.error(error);
    }
}

// 从页面中获取需要发送的信息
function getInfoFromPage() {
    // 在这里编写代码来获取信息
    console.log("执行getInfoFromPage")
    const img = document.querySelector("body > gradio-app").shadowRoot.querySelector("#txt2img_gallery > div.overflow-y-auto.h-full.p-2.min-h-\\[350px\\].max-h-\\[55vh\\].xl\\:min-h-\\[450px\\] > div > button > img")
    console.log(img)

    // const all_msg = document.querySelector("body > gradio-app").shadowRoot.querySelector("#html_info_txt2img > p");
    // const all_msg_str = all_msg.textContent;
    // const regex = /(.+)[\n\r]+.+: (.+)[\n\r]+(.+)/;
    // const match = all_msg_str.match(regex);
    // console.log(match)

    // const prompt = "";
    // const negativePrompt = "";
    // const parameter = "";
    // if (match) {
    //     // 如果全部可以匹配到则依次输出
    //     const prompt = match[1];
    //     const negativePrompt = match[2];
    //     const parameter = match[3];
    // } else {
    //     const regex = /Negative prompt: (.+)(?:<br>)?(.+)?/;  // 修改正则表达式
    //     const match = all_msg_str.match(regex);
    // }

    // console.log(prompt);
    // console.log(negativePrompt);
    // console.log(parameter);
    const all_msg = document.querySelector("body > gradio-app").shadowRoot.querySelector("#html_info_txt2img > p");

    let all_msg_str = all_msg.textContent.trim();
    console.log(all_msg_str);

    const regex = /^(?:([^<\n]*)(?:\nNegative prompt: ([^<\n]*))?)?\n(.+)$/m;
    const match = all_msg_str.match(regex);
    console.log(match);


    let prompt = '';
    let negativePrompt = '';
    let parameter = '';
    if (match) {
        if (match[1].includes("Negative prompt: ")) {
            prompt = '';
            negativePrompt = match[1] || '';
            parameter = match[3] || '';
        } else {
            prompt = match[1] || '';
            negativePrompt = match[2] || '';
            parameter = match[3] || '';
        }
        console.log(prompt);
        console.log(negativePrompt);
        console.log(parameter);
    } else {
        console.log('No match found.');
    }
}

// 监听加载完毕的事件
window.addEventListener("load", function () {
    console.log("页面加载完毕，延时1s后开始插入button")
    // 延迟 1 秒钟执行插入操作
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

            // 添加按钮点击事件的监听器
            button.addEventListener("click", function () {
                // 在按钮点击事件中执行sendToNotion函数
                sendToNotion();
            });
        } else {
            console.log("未找到容器元素，将按钮添加到页面底部");
            // 将按钮添加到页面底部
            document.body.appendChild(button);
        }
    }, 1000);
});


