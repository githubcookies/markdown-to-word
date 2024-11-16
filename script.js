document.addEventListener('DOMContentLoaded', function() {
    const mdInput = document.getElementById('mdInput');
    const preview = document.getElementById('preview');
    const convertBtn = document.getElementById('convertBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');

    // 设置 marked 选项
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
        sanitize: false
    });
    
    // 实时预览功能
    function updatePreview(content) {
        try {
            preview.innerHTML = marked.parse(content || mdInput.value);
        } catch (error) {
            console.error('预览转换错误:', error);
        }
    }

    // 监听输入变化
    mdInput.addEventListener('input', function(e) {
        updatePreview(e.target.value);
    });

    // 处理文件上传
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // 检查文件类型
            if (!file.name.match(/\.(md|txt)$/i)) {
                alert('请上传 .md 或 .txt 格式的文件！');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                mdInput.value = e.target.result;
                updatePreview(e.target.result);
            };
            reader.onerror = () => {
                alert('文件读取失败！');
            };
            reader.readAsText(file);
        }
    });

    // 转换为 Word 并下载
    convertBtn.addEventListener('click', async () => {
        const markdown = mdInput.value;
        if (!markdown) {
            alert('请输入或上传 Markdown 内容！');
            return;
        }

        convertBtn.disabled = true;
        convertBtn.textContent = '转换中...';
        
        try {
            const html = marked.parse(markdown);
            
            // 优化的 Word 文档样式
            const docContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        @page {
                            size: A4;
                            margin: 2.54cm;
                        }
                        body {
                            font-family: "Microsoft YaHei", Arial, sans-serif;
                            line-height: 1.5;
                            font-size: 12pt;
                            color: #333333;
                            margin: 0;
                            padding: 0;
                            word-wrap: break-word;
                            text-align: justify;
                        }
                        /* 标题样式 */
                        h1, h2, h3, h4, h5, h6 {
                            font-family: "Microsoft YaHei", Arial, sans-serif;
                            line-height: 1.2;
                            margin-top: 1.2em;
                            margin-bottom: 0.6em;
                            page-break-after: avoid;
                            color: #000000;
                        }
                        h1 { font-size: 20pt; margin-top: 24pt; }
                        h2 { font-size: 16pt; margin-top: 20pt; }
                        h3 { font-size: 14pt; margin-top: 16pt; }
                        h4 { font-size: 12pt; margin-top: 14pt; }
                        
                        /* 段落样式 */
                        p {
                            margin: 12pt 0;
                            line-height: 1.6;
                            text-indent: 0;
                        }
                        
                        /* 列表样式 */
                        ul, ol {
                            margin: 12pt 0;
                            padding-left: 28pt;
                        }
                        li {
                            margin: 6pt 0;
                            line-height: 1.6;
                        }
                        
                        /* 代码块样式 */
                        pre {
                            background-color: #f6f8fa;
                            border: 1pt solid #ddd;
                            padding: 12pt;
                            margin: 12pt 0;
                            border-radius: 4pt;
                            font-family: Consolas, "Courier New", monospace;
                            font-size: 10.5pt;
                            line-height: 1.4;
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            page-break-inside: avoid;
                        }
                        code {
                            font-family: Consolas, "Courier New", monospace;
                            font-size: 10.5pt;
                            background-color: #f6f8fa;
                            padding: 2pt 4pt;
                            border-radius: 3pt;
                        }
                        
                        /* 表格样式 */
                        table {
                            border-collapse: collapse;
                            width: 100%;
                            margin: 16pt 0;
                            page-break-inside: avoid;
                        }
                        th, td {
                            border: 1pt solid #ddd;
                            padding: 8pt;
                            text-align: left;
                            vertical-align: top;
                        }
                        th {
                            background-color: #f6f8fa;
                            font-weight: bold;
                        }
                        
                        /* 引用块样式 */
                        blockquote {
                            margin: 12pt 0;
                            padding: 12pt 24pt;
                            border-left: 4pt solid #ddd;
                            background-color: #f9f9f9;
                            color: #666;
                            page-break-inside: avoid;
                        }
                        
                        /* 水平线样式 */
                        hr {
                            border: none;
                            border-top: 1pt solid #ddd;
                            margin: 24pt 0;
                        }
                        
                        /* 链接样式 */
                        a {
                            color: #0366d6;
                            text-decoration: underline;
                        }
                        
                        /* 图片样式 */
                        img {
                            max-width: 100%;
                            height: auto;
                            margin: 12pt 0;
                            page-break-inside: avoid;
                        }
                        
                        /* 分页控制 */
                        .page-break {
                            page-break-after: always;
                        }
                    </style>
                </head>
                <body>
                    ${html}
                </body>
                </html>
            `;

            const blob = new Blob([docContent], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });

            const fileName = `markdown-doc-${new Date().toISOString().slice(0,10)}.doc`;
            saveAs(blob, fileName);

        } catch (error) {
            console.error('转换错误:', error);
            alert('转换过程中出现错误，请检查内容格式！');
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = '转换为 Word';
        }
    });

    // 初始化预览
    updatePreview();
});