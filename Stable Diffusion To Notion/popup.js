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
            info_img.src = request.info.img;
            info_negativePrompt.textContent = request.info.negativePrompt;
            info_parameter.textContent = request.info.parameter;
            info_prompt.textContent = request.info.prompt;
            sendResponse("message received");
        }
    });
});

// 由于Notion暂时还不支持文件上传，因此我们将使用Github为我的提供文件托管服务（图床）
// 将图片解码至base64
let img2Notion_url = ""
function translate() {
    return new Promise((resolve, reject) => {
        const img = document.getElementById('info_img');
        const image = new Image();
        image.src = img.src;
        const splitArray = image.src.split("/");
        const img_name = splitArray[splitArray.length - 2] + "/" + splitArray[splitArray.length - 1];
        console.log(img_name);
        img2Notion_url = "https://github.com/Mr-KID-github/Stable-Diffusion-Open-Community/blob/main/images/" + img_name + "?raw=true"

        image.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            const base64 = canvas.toDataURL().split(',')[1];

            console.log(base64);
            resolve({
                data: base64,
                name: img_name
            });
        };
    });
}


// 将图片文件上传到 GitHub 仓库中
async function uploadFileToGithub() {
    // 将图片解码至base64
    const imgbase64 = await translate();
    console.log(imgbase64.data)
    const Github_url = "https://api.github.com/repos/Mr-KID-github/Stable-Diffusion-Open-Community/contents/images/" + imgbase64.name
    return window.fetch(Github_url, {
        method: 'PUT',
        headers: {
            "Accept": "application/vnd.github+json ",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
            "message": "Stable Diffusion 上传图片 " + imgbase64.name,
            "content": imgbase64.data
        })
    })
        .then(async res => {
            if (res.status >= 200 && res.status < 400) {
                return {
                    status: res.status,
                    data: await res.json()
                }
            } else {
                // 显示弹窗
                alert("图片上传GitHub图床失败！");
                console.log(res)
                return {
                    status: res.status,
                    data: null
                }
            }
        })
        .catch(e => e)
}

async function send2Notion(info) {
    console.log("data", info);

    // 将info中的图片上传至Github
    await uploadFileToGithub()
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
            },
            "children": [
                {
                    "object": "block",
                    "type": "image",
                    "image": {
                        "type": "external",
                        "external": {
                            "url": img2Notion_url
                        }
                    }
                },
            ]
        })
    }).then(response => response.json());

    if (dataResponse) {
        // 显示弹窗
        alert("信息已成功发送至 Notion！");
        // 关闭 popup.html 窗口
        window.close();
    } else {
        // 发生错误，打印错误信息
        console.log("发送信息至 Notion 时发生错误：", dataResponse);
    }
}