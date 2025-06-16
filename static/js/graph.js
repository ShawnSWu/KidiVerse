// 知識圖譜視覺化 - 使用D3.js實現力導向圖
document.addEventListener('DOMContentLoaded', function() {
    // 獲取容器元素和尺寸
    const container = document.querySelector('.graph-visualization');
    
    // 如果沒有找到容器元素，停止執行
    if (!container) {
        console.error('找不到 .graph-visualization 容器元素');
        return;
    }
    
    // 自定義節點樣式設定 - 宇宙風格
    const nodeStyles = {
        // 節點半徑
        defaultRadius: 12,
        hoverRadius: 18,
        
        // 節點顏色 - 宇宙紫藍色系
        colors: [
            '#8A6BFF', // 主要紫色
            '#6D5EE0', // 深紫色
            '#9F87FF', // 淡紫色
            '#7574D9', // 藍紫色
            '#6A63F6', // 紫藍色
            '#5E4FE0', // 深藍紫色
            '#8362FF', // 明亮紫色
            '#7C6EFF', // 中紫色
            '#7F5AEB', // 紫羅蘭色
            '#6B4FF6'  // 藍紫色
        ],
        
        // 節點效果
        opacity: 0.85,       // 半透明效果
        glowStrength: '10px', // 發光效果強度
        glowColor: 'rgba(138, 107, 255, 0.6)', // 發光顏色
        
        // 節點邊框
        stroke: 'rgba(255, 255, 255, 0.3)', // 半透明白色邊框
        strokeWidth: 1,
        hoverStroke: 'rgba(255, 255, 255, 0.8)',
        
        // 文字樣式
        fontSize: '11px',
        fontColor: '#ffffff', // 白色文字
        hoverFontColor: '#ffffff',
        fontWeight: 'normal',
        hoverFontWeight: 'bold'
    };
    
    const tooltip = document.querySelector('.tooltip');
    // tooltip 可能不存在，這是可以接受的
    // 若容器尚未正確計算尺寸，提供回退值
    const width = container.clientWidth || container.parentElement.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 使用已有的 SVG 元素
    // 先清空已有的 SVG 內容
    const existingSvg = document.querySelector('.graph-visualization svg');
    if (existingSvg) {
        while (existingSvg.firstChild) {
            existingSvg.removeChild(existingSvg.firstChild);
        }
    }

    // 使用已有的 SVG 元素
    const svg = d3.select('.graph-visualization svg')
        // 保留 SVG 的 100% 寬度和高度，並從 viewBox 設定中使用計算的尺寸
        .attr('viewBox', [0, 0, width, height])
        .call(d3.zoom().on('zoom', (event) => {
            g.attr('transform', event.transform);
        }));

    // 創建一個包含所有元素的組
    const g = svg.append('g');

    // 定義顏色比例尺 - 基於節點ID分配不同顏色
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 加載數據
    d3.json('/data/notes_graph.json').then(data => {
        // 創建力導向模擬
        const simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.edges)
                .id(d => d.id)
                .distance(d => (120 * (1 - d.score) + 20) * 5) // 將距離放大 10 倍，增加視覺間隔
                .strength(d => d.score * 0.7)) // 相似度越高，連接強度越大
            .force('charge', d3.forceManyBody().strength(-250)) // 適度排斥，縮小群組間距離
            .force('center', d3.forceCenter(width / 2, height / 2)) // 居中力
            .force('collision', d3.forceCollide().radius(30)); // 防止節點重疊

        // 創建連接線 - 宇宙風格
        const link = g.append('g')
            .selectAll('line')
            .data(data.edges)
            .join('line')
            .attr('stroke', '#4F7BFF') // 藍色連線
            .attr('stroke-opacity', 0.4)
            .attr('stroke-width', d => d.score * 2) // 相似度越高，線越粗
            .style('filter', 'drop-shadow(0 0 2px rgba(79, 123, 255, 0.5))');

        // 創建節點
        const node = g.append('g')
            .selectAll('.node')
            .data(data.nodes)
            .join('g')
            .attr('class', 'node')
            .call(drag(simulation)); // 啟用拖拽功能

        // 為每個節點添加圓形 - 使用宇宙風格
        node.append('circle')
            .attr('r', nodeStyles.defaultRadius)
            .attr('fill', d => color(d.group))
            .attr('stroke', nodeStyles.stroke)
            .attr('stroke-width', nodeStyles.strokeWidth)
            .style('opacity', nodeStyles.opacity)
            .style('filter', `drop-shadow(0 0 ${nodeStyles.glowStrength} ${nodeStyles.glowColor})`);

        // 為每個節點添加標籤 - 使用自定義樣式
        const labels = node.append('text')
            .text(d => d.title)
            .attr('x', 12)
            .attr('y', 4)
            .style('font-size', nodeStyles.fontSize)
            .style('font-weight', nodeStyles.fontWeight)
            .style('pointer-events', 'none')
            .style('fill', nodeStyles.fontColor);

        // 添加節點懸停效果
        node.on('mouseover', function(event, d) {
            // 顯示工具提示（如果存在）
            if (tooltip) {
                tooltip.style.display = 'block';
                tooltip.innerHTML = `<strong>${d.title}</strong><br>${d.path}`;
                tooltip.style.left = (event.pageX + 10) + 'px';
                tooltip.style.top = (event.pageY - 10) + 'px';
            }
            
            // 高亮相關連接 - 宇宙風格
            link.style('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? '#A3BFFF' : '#4F7BFF')
                .style('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.2)
                .style('stroke-width', l => (l.source.id === d.id || l.target.id === d.id) ? l.score * 4 : l.score * 1)
                .style('filter', l => (l.source.id === d.id || l.target.id === d.id) ? 'drop-shadow(0 0 4px rgba(163, 191, 255, 0.8))' : 'drop-shadow(0 0 2px rgba(79, 123, 255, 0.5))');
                
            // 高亮相關節點 - 使用自定義樣式
            node.selectAll('circle')
                .style('fill', n => (n.id === d.id || isConnected(n, d)) 
                    ? nodeStyles.colors[n.id % nodeStyles.colors.length] 
                    : '#ccc')
                .style('stroke', n => (n.id === d.id) ? nodeStyles.hoverStroke : nodeStyles.stroke)
                .style('stroke-width', n => (n.id === d.id) ? nodeStyles.strokeWidth * 1.5 : nodeStyles.strokeWidth)
                .style('r', n => (n.id === d.id) ? nodeStyles.hoverRadius : nodeStyles.defaultRadius);
                
            // 高亮文字
            node.selectAll('text')
                .style('font-weight', n => (n.id === d.id || isConnected(n, d)) ? nodeStyles.hoverFontWeight : nodeStyles.fontWeight)
                .style('fill', n => (n.id === d.id || isConnected(n, d)) ? nodeStyles.hoverFontColor : nodeStyles.fontColor);
        })
        .on('mouseout', function() {
            // 隱藏工具提示（如果存在）
            if (tooltip) {
                tooltip.style.display = 'none';
            }
            
            // 恢復連接樣式 - 宇宙風格
            link.style('stroke', '#4F7BFF')
                .style('stroke-opacity', 0.4)
                .style('stroke-width', d => d.score * 2)
                .style('filter', 'drop-shadow(0 0 2px rgba(79, 123, 255, 0.5))');
                
            // 恢復節點樣式 - 宇宙風格
            node.selectAll('circle')
                .style('fill', d => nodeStyles.colors[d.id % nodeStyles.colors.length])
                .style('r', nodeStyles.defaultRadius)
                .style('stroke', nodeStyles.stroke)
                .style('stroke-width', nodeStyles.strokeWidth)
                .style('opacity', nodeStyles.opacity)
                .style('filter', `drop-shadow(0 0 ${nodeStyles.glowStrength} ${nodeStyles.glowColor})`);
                
            // 恢復文字樣式
            node.selectAll('text')
                .style('font-weight', nodeStyles.fontWeight)
                .style('fill', nodeStyles.fontColor);
        })
        .on('click', function(event, d) {
            // 點擊節點時的行為 - 可以在這裡添加打開文件的功能
            console.log('點擊節點:', d.title, d.path);
        });

        // 添加模擬的tick事件處理
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // 在力導向圖穩定後，自動縮放以涵蓋所有節點
        simulation.on('end', () => {
            const bounds = g.node().getBBox();
            const fullWidth = bounds.width;
            const fullHeight = bounds.height;
            if (fullWidth === 0 || fullHeight === 0) return; // 容錯
            const midX = bounds.x + fullWidth / 2;
            const midY = bounds.y + fullHeight / 2;
            const scale = 0.9 / Math.max(fullWidth / width, fullHeight / height);
            const transform = d3.zoomIdentity
                .translate(width / 2 - scale * midX, height / 2 - scale * midY)
                .scale(scale);
            svg.transition().duration(750).call(d3.zoom().transform, transform);
        });

        // 重置縮放按鈕（如果存在）
        const resetZoomBtn = document.getElementById('reset-zoom');
        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', function() {
                svg.transition().duration(750).call(
                    d3.zoom().transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
                );
            });
        }

        // 切換標籤顯示/隱藏（如果按鈕存在）
        let labelsVisible = true;
        const toggleLabelsBtn = document.getElementById('toggle-labels');
        if (toggleLabelsBtn) {
            toggleLabelsBtn.addEventListener('click', function() {
                labelsVisible = !labelsVisible;
                labels.style('display', labelsVisible ? 'block' : 'none');
            });
        }

        // 輔助函數：檢查兩個節點是否相連
        function isConnected(a, b) {
            return data.edges.some(l => 
                (l.source.id === a.id && l.target.id === b.id) || 
                (l.source.id === b.id && l.target.id === a.id)
            );
        }

        // 拖拽功能
        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }
            
            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }
            
            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }
            
            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }
    }).catch(error => {
        console.error('加載數據時出錯:', error);
        // 僅在控制台顯示錯誤信息，不在頁面上添加錯誤信息
    });
});
