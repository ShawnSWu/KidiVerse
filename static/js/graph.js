// 知識圖譜視覺化 - 使用D3.js實現力導向圖
document.addEventListener('DOMContentLoaded', function() {
    // 獲取容器元素和尺寸
    const container = document.querySelector('.graph-visualization');
    
    // 如果沒有找到容器元素，停止執行
    if (!container) {
        console.error('找不到 .graph-visualization 容器元素');
        return;
    }
    
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
        .attr('width', width)
        .attr('height', height)
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
                .distance(d => 100 * (1 - d.score)) // 相似度越高，距離越近
                .strength(d => d.score * 0.7)) // 相似度越高，連接強度越大
            .force('charge', d3.forceManyBody().strength(-200)) // 節點間的排斥力
            .force('center', d3.forceCenter(width / 2, height / 2)) // 居中力
            .force('collision', d3.forceCollide().radius(30)); // 防止節點重疊

        // 創建連接線
        const link = g.append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(data.edges)
            .join('line')
            .attr('stroke-width', d => d.score * 3) // 相似度越高，線越粗
            .attr('stroke-opacity', d => d.score * 0.8); // 相似度越高，透明度越低

        // 創建節點
        const node = g.append('g')
            .selectAll('.node')
            .data(data.nodes)
            .join('g')
            .attr('class', 'node')
            .call(drag(simulation)); // 啟用拖拽功能

        // 為每個節點添加圓形
        node.append('circle')
            .attr('r', 10)
            .attr('fill', d => color(d.id % 10))
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5);

        // 為每個節點添加標籤
        const labels = node.append('text')
            .text(d => d.title)
            .attr('x', 12)
            .attr('y', 4)
            .style('font-size', '10px')
            .style('pointer-events', 'none')
            .style('fill', '#333');

        // 添加節點懸停效果
        node.on('mouseover', function(event, d) {
            // 顯示工具提示（如果存在）
            if (tooltip) {
                tooltip.style.display = 'block';
                tooltip.innerHTML = `<strong>${d.title}</strong><br>${d.path}`;
                tooltip.style.left = (event.pageX + 10) + 'px';
                tooltip.style.top = (event.pageY - 10) + 'px';
            }
            
            // 高亮相關連接
            link.style('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? '#ff0000' : '#999')
                .style('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.2)
                .style('stroke-width', l => (l.source.id === d.id || l.target.id === d.id) ? l.score * 5 : l.score * 1);
                
            // 高亮相關節點
            node.select('circle')
                .style('fill', n => (n.id === d.id || isConnected(n, d)) ? color(n.id % 10) : '#ddd')
                .style('r', n => (n.id === d.id) ? 15 : 10);
        })
        .on('mouseout', function() {
            // 隱藏工具提示（如果存在）
            if (tooltip) {
                tooltip.style.display = 'none';
            }
            
            // 恢復連接樣式
            link.style('stroke', '#999')
                .style('stroke-opacity', 0.6)
                .style('stroke-width', d => d.score * 3);
                
            // 恢復節點樣式
            node.select('circle')
                .style('fill', d => color(d.id % 10))
                .style('r', 10);
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
