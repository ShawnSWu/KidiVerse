// 宇宙背景動畫效果
document.addEventListener('DOMContentLoaded', function() {
    const space = document.querySelector('.space-stars');
    if (!space) return;

    // 創建星星
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // 隨機大小 (1-3px)
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // 隨機位置
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // 隨機動畫持續時間 (30-100秒)
        const duration = Math.random() * 70 + 30;
        star.style.animation = `twinkle ${duration}s infinite`;
        
        // 隨機動畫延遲
        star.style.animationDelay = `${Math.random() * 20}s`;
        
        // 隨機透明度
        star.style.opacity = Math.random() * 0.7 + 0.3;
        
        space.appendChild(star);
    }

    // 創建多個星星
    for (let i = 0; i < 100; i++) {
        createStar();
    }

    // 滑鼠移動效果
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        space.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
    });
});
