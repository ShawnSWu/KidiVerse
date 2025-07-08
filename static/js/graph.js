// Knowledge graph visualization - Force-directed graph using D3.js
function initGraph() {
    console.log('Initializing graph...');
    
    // Ensure window.graphData exists
    if (!window.graphData) {
        console.warn('Graph data not available, using empty data');
        window.graphData = { nodes: [], links: [] };
    }
    
    // Load graph data from global variable and verify structure
    const data = {
        nodes: Array.isArray(window.graphData.nodes) ? window.graphData.nodes : [],
        links: Array.isArray(window.graphData.links) ? window.graphData.links : []
    };
    
    console.log('Graph data:', {
        nodes: data.nodes.length,
        links: data.links.length,
        sampleNode: data.nodes[0],
        sampleLink: data.links[0]
    });
    
    // Warn if there is no node data
    if (data.nodes.length === 0) {
        console.warn('No nodes found in graph data');
    }
    
    // Performance tuning parameters (internal only, no UI exposure)
    const performanceSettings = {
        // High-performance mode flag
        highPerformanceMode: false,
        // Node threshold: enable high-performance mode when exceeded
        nodeTreshold: 50,
        // Label display settings (internal)
        labelsAlwaysVisible: true
    };
    // Get container element and dimensions
    const container = document.querySelector('.graph-visualization');
    
    // Abort if container element is missing
    if (!container) {
        console.error('找不到 .graph-visualization 容器元素');
        return;
    }
    
    // Custom node style — "cosmic" theme
    const nodeStyles = {
        // Node radius
        defaultRadius: 12,
        hoverRadius: 18,
        
        // Node colors — purple/blue palette
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
        
        // Node visual effects
        opacity: 0.85,       // Semi-transparent effect
        glowStrength: '10px', // Glow strength
        glowColor: 'rgba(138, 107, 255, 0.6)', // Glow color
        
        // Node stroke
        stroke: 'rgba(255, 255, 255, 0.3)', // 半透明白色邊框
        strokeWidth: 1,
        hoverStroke: 'rgba(255, 255, 255, 0.8)',
        
        // Font styling
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
    
    // 計算和更新統計信息的函數
    function updateStatsDisplay(data) {
        // 使用全局變量加載圖表數據
        const graphData = window.graphData || {};       
        // 獲取總筆記數
        const totalNotes = data.nodes.length;
        
        // 獲取獨特的主題（組別）數
        // 使用 Set 數據結構來計算獨特的 group 值數量
        const uniqueTopics = new Set();
        data.nodes.forEach(node => {
            if (node.group) { // 確保 group 屬性存在
                uniqueTopics.add(node.group);
            }
        });
        const totalTopics = uniqueTopics.size;
        
        // 更新 DOM 中的統計數字
        const totalNotesElement = document.getElementById('total-graph-count');
        const totalTopicsElement = document.getElementById('total-topics-count');
        
        if (totalNotesElement) {
            totalNotesElement.textContent = totalNotes;
        }
        
        if (totalTopicsElement) {
            totalTopicsElement.textContent = totalTopics -1; //About page eliminate the "All" topic
        }
        
        console.log(`知識圖譜統計：${totalNotes} 筆記，${totalTopics} 主題`);
    }

    // 數據已經在函數開始時加載
    
    // 處理數據
    console.log('Initializing graph with data:', data);
    try {
        // 確保 nodes 是數組
        const nodes = Array.isArray(data.nodes) ? data.nodes : [];
        
        console.log('Nodes loaded:', nodes);
        console.log('Links loaded:', data.links);
        
        if (nodes.length === 0) {
            console.warn('No nodes found in graph data');
        } else {
            console.log(`Loaded ${nodes.length} nodes and ${data.links ? data.links.length : 0} links`);
        }
        
        // 計算統計信息：總筆記數和獨立主題（組別）數
        updateStatsDisplay(data);
        
        // 根據節點數自動調整效能模式但不顯示UI元素
        if (nodes.length > performanceSettings.nodeTreshold) {
            performanceSettings.highPerformanceMode = true;
            console.log(`啟用高效能模式：${nodes.length}個節點超過閾值(${performanceSettings.nodeTreshold})`);
        }
        
        // ===== Detect connected components so that totally unconnected clusters can be laid out far apart =====
        // 使用 Union-Find 找 connected components
        const parent = new Map();
        function find(x) {
            if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
            return parent.get(x);
        }
        function union(a, b) {
            const pa = find(a);
            const pb = find(b);
            if (pa !== pb) parent.set(pa, pb);
        }
        // 初始化 parent
        nodes.forEach(n => parent.set(n.id, n.id));
        (Array.isArray(data.links) ? data.links : []).forEach(l => {
            if (l.source && l.target) union(l.source.id || l.source, l.target.id || l.target);
        });
        // 給節點標記 component id
        const compIds = new Map();
        let compIndex = 0;
        nodes.forEach(n => {
            const root = find(n.id);
            if (!compIds.has(root)) compIds.set(root, compIndex++);
            n.component = compIds.get(root);
        });
        const componentCount = compIndex;

        // 為每個 component 預先算一個目標中心，分佈在圓周上
        const componentCenters = {};
        const radiusForClusters = Math.min(width, height) * 0.55; // 拉大羣與羣之間距離
        for (let i = 0; i < componentCount; i++) {
            const angle = (2 * Math.PI * i) / componentCount;
            componentCenters[i] = {
                x: width / 2 + Math.cos(angle) * radiusForClusters,
                y: height / 2 + Math.sin(angle) * radiusForClusters
            };
        }

        // ===== 創建力導向模擬 =====
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(Array.isArray(data.links) ? data.links : [])
                .id(d => d.id)
                // 優化距離計算：減少倍數，使視覺布局更緊湊，節省計算量
                .distance(d => (120 * (1 - d.score) + 20) * 3) 
                .strength(d => Math.min(d.score * 0.8, 0.9))) // 增強連接強度，更快達到穩定
            // 減少排斥力強度，降低計算成本
            .force('charge', d3.forceManyBody()
                .strength(-200)
                .theta(0.9) // 增加theta值以改進Barnes-Hut近似演算法效率
                .distanceMax(300)) // 限制排斥力最大距離
            .force('center', d3.forceCenter(width / 2, height / 2)) // 居中力
            // 每個 component 向自己中心吸引，讓不同羣分開
            .force('clusterX', d3.forceX(d => componentCenters[d.component].x).strength(0.15))
            .force('clusterY', d3.forceY(d => componentCenters[d.component].y).strength(0.15))
            // 碰撞半徑加大一點避免節點重疊
            .force('collision', d3.forceCollide().radius(nodeStyles.defaultRadius + 12).strength(1));
            
            // 設置衰減率，讓模擬更快達到穩定狀態
            simulation.alphaDecay(0.028); // 增加衰減率（默認值是0.0228）

        // 創建連接線 - 宇宙風格
        const link = g.append('g')
            .selectAll('line')
            // 使用 links 而不是 edges 來匹配數據結構
            .data(Array.isArray(data.links) ? data.links : [])
            .join('line')
            .attr('stroke', '#4F7BFF')
            .attr('stroke-opacity', 0.2)
            .attr('stroke-width', d => d.score ? d.score * 10 : 2); // 相似度越高，線越粗，預設為1

        // ===== 為不同 component 指定隨機顏色 =====
        let color;
        try {
            // 為每個 component 隨機產生一個 HSL 顏色（偏亮方便閱讀）
            const compColors = Array.from({length: componentCount}, () => {
                const h = Math.floor(Math.random()*360);
                const s = 60 + Math.random()*20; // 60–80%
                const l = 50 + Math.random()*10; // 50–60%
                return `hsl(${h},${s}%,${l}%)`;
            });
            color = d3.scaleOrdinal()
                .domain(d3.range(componentCount))
                .range(compColors);
        } catch (error) {
            console.error('Error initializing color scale:', error);
            // 提供默認顏色比例尺
            color = d3.scaleOrdinal()
                .domain(['default'])
                .range(['#8A6BFF']);
        }
        
        // 創建節點
        const node = g.append('g')
            .selectAll('.node')
            .data(nodes, d => d.id) // 使用唯一ID作為鍵
            .join('g')
            .attr('class', 'node')
            .call(drag(simulation)); // 啟用拖拽功能

        // 為每個節點添加圓形 - 根據效能模式調整視覺效果
        node.append('circle')
            .attr('r', nodeStyles.defaultRadius)
            .attr('fill', d => color(d.component))
            .attr('stroke', nodeStyles.stroke)
            .attr('stroke-width', performanceSettings.highPerformanceMode ? 0.5 : nodeStyles.strokeWidth)
            .style('opacity', nodeStyles.opacity)
            // 高效能模式下移除昂貴的drop-shadow效果，改用更輕量的CSS
            .style('filter', performanceSettings.highPerformanceMode ? 'none' : `drop-shadow(0 0 ${nodeStyles.glowStrength} ${nodeStyles.glowColor})`);

        // 為每個節點添加標籤 - 使用自定義樣式，根據效能模式調整
        const labels = node.append('text')
            .text(d => d.title)
            .attr('x', 12)
            .attr('y', 3)
            .style('font-size', nodeStyles.fontSize)
            .style('font-weight', nodeStyles.fontWeight)
            .style('pointer-events', 'none')
            .style('fill', nodeStyles.fontColor)
            .style('display', 'block'); // 始終顯示標籤

        // 添加節點懸停效果
        node.on('mouseover', function(event, d) {
            // 顯示工具提示（如果存在）
            if (tooltip) {
                tooltip.style.display = 'block';
                tooltip.innerHTML = `
                    <div class="tooltip-title">${d.title}</div>
                    <div class="tooltip-group">${d.group}</div>
                    <div class="tooltip-path">${d.path}</div>
                `;
                tooltip.style.left = (event.pageX + 10) + 'px';
                tooltip.style.top = (event.pageY - 10) + 'px';
            }
            
            // 高效能模式下簡化滑鼠互動效果
            if (performanceSettings.highPerformanceMode) {
                // 僅對當前節點和直接連接的節點進行簡單高亮
                d3.select(this).select('circle')
                    .transition().duration(100)
                    .attr('r', nodeStyles.defaultRadius * 1.3)
                    .attr('stroke', '#ffffff')
                    .attr('stroke-width', 2);
                    
                // 顯示當前節點的標籤
                d3.select(this).select('text')
                    .style('display', 'block')
                    .style('font-weight', 'bold');
                    
                return; // 不執行下面更複雜的高亮效果
            }
                
            // 標準模式下的完整高亮效果宇宙風格
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
            
            // 高效能模式下的簡化還原
            if (performanceSettings.highPerformanceMode) {
                // 只還原當前節點
                d3.select(this).select('circle')
                    .transition().duration(100)
                    .attr('r', nodeStyles.defaultRadius)
                    .attr('stroke', nodeStyles.stroke)
                    .attr('stroke-width', 0.5);
                    
                // 標籤始終顯示
                d3.select(this).select('text').style('display', 'block');
                
                return; // 不執行下面更複雜的還原效果
            }
            
            // 標準模式下的完整樣式還原
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

        // 優化tick事件處理，減少DOM操作
        let tickCounter = 0;
        simulation.on('tick', () => {
            // 限制更新頻率，不是每一個tick都更新DOM，降低渲染負擔
            tickCounter++;
            if (tickCounter % 3 !== 0) return; // 只在每3個tick更新一次
            
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
            
            // 當模擬達到一定穩定性時停止，節省CPU資源
            if (simulation.alpha() < 0.01) {
                simulation.stop();
                console.log('模擬已穩定，已停止進一步計算');
            }
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
            return data.links.some(l => 
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
        
        // 應用拖拽行為到節點
        node.call(drag(simulation));
        
        // 返回模擬對象以便外部訪問
        return simulation;
    } catch (error) {
        console.error('Error initializing graph:', error);
        return null;
    }
}
