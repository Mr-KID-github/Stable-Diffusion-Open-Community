document.addEventListener('DOMContentLoaded', function () {
    console.log('Hello, world!');


    // 监听按钮点击事件
    document.getElementById('sendToNotion').addEventListener('click', function () {
        // 获取信息
        const info = {
            // img: document.getElementById('info_img').textContent,
            negativePrompt: document.getElementById('info_negativePrompt').textContent,
            parameter: document.getElementById('info_parameter').textContent,
            prompt: document.getElementById('info_prompt').textContent,
        };
        console.log(info)
        // 发送信息到Notion
        send2Notion(info);
    });

    // 监听渲染事件
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log(request)
        if (request.info) {
            // 找到要渲染的元素
            var info_img = document.getElementById("info_img");
            var info_negativePrompt = document.getElementById("info_negativePrompt");
            var info_parameter = document.getElementById("info_parameter");
            var info_prompt = document.getElementById("info_prompt");
            // 将接收到的信息渲染到该元素中
            info_img.textContent = request.info.img;
            info_negativePrompt.textContent = request.info.negativePrompt;
            info_parameter.textContent = request.info.parameter;
            info_prompt.textContent = request.info.prompt;
            sendResponse("message received");
        }
    });
});


async function send2Notion(info) {
    console.log("data", info);
    let notion_api_key = "secret_dlGnFXeqAQhodIbcXrhnoJ3T8Px9dGSDUEk6KxOklip"
    let databaseID = "64b0306df17c4a458b077e0e18bc8e16"

    let dataResponse = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + notion_api_key,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        referrerPolicy: "no-referrer-when-downgrade",
        mode: "same-origin",
        body: JSON.stringify({
            "parent": { "database_id": databaseID },
            "properties": {
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": "Detail"
                            }
                        }
                    ]
                },
                "Prompt": {
                    "rich_text": [
                        {
                            "text": {
                                "content": info.prompt
                            }
                        }
                    ]
                },
                "Negative Prompt": {
                    "rich_text": [
                        {
                            "text": {
                                "content": info.negativePrompt
                            }
                        }
                    ]
                },
                "Parameter": {
                    "rich_text": [
                        {
                            "text": {
                                "content": info.parameter
                            }
                        }
                    ]
                }
            }
        })
    }).then(response => response.json());

    console.log(dataResponse);

}