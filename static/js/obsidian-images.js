document.addEventListener('DOMContentLoaded', function() {
  // 尋找所有 Markdown 內容區域
  const markdownAreas = document.querySelectorAll('.markdown-area');
  
  markdownAreas.forEach(function(area) {
    // 獲取 HTML 內容
    let content = area.innerHTML;
    
    // 獲取當前頁面的URL路徑
    const currentPath = window.location.pathname;
    // 從URL路徑中提取出內容部分，例如 /container/kubernetes/
    // 我們需要找到最後一個非空部分的索引
    const pathParts = currentPath.split('/').filter(part => part);
    
    // 構建正確的內容路徑
    let contentPath = '';
    if (pathParts.length >= 2) {
      // 例如從 ["container", "kubernetes", "k8s"] 中取出 ["container", "kubernetes"]
      contentPath = '/' + pathParts.slice(0, 2).join('/');
    }
    
    // 使用正則表達式替換 Obsidian 圖片語法
    content = content.replace(/!?\[\[(.*?)\]\]/g, function(match, filename) {
      // 檢查是否為圖片格式
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
      const isImage = imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
      
      if (isImage || match.startsWith('!')) {
        // 是圖片，替換為 <img> 標籤，使用絕對路徑
        return `<img src="${contentPath}/attachments/${filename}" alt="${filename}">`;
      } else {
        // 不是圖片，可能是普通的 Obsidian 內部連結
        return `<a href="${contentPath}/${filename}">${filename}</a>`;
      }
    });
    
    // 更新 HTML 內容
    area.innerHTML = content;
  });
});
