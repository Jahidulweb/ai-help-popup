(function() {
    // ১. CSS ইনজেক্ট করা
    const style = document.createElement('style');
    style.innerHTML = `
        #custom-ai-widget {
            position: fixed; top: 20%; right: -350px;
            width: 300px; 
            min-height: 190px;
            background: #ffffff; color: #333;
            padding: 20px; border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: all 0.6s ease-in-out;
            z-index: 9999; font-family: 'Segoe UI', Tahoma, sans-serif;
            border-left: 5px solid #00d2ff;
            display: flex;
            flex-direction: column;
            cursor: move;
            touch-action: none;
        }
        #custom-ai-widget.active { right: 20px; }
        
        .ai-img { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; pointer-events: none; }
        .ai-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; pointer-events: none; }
        .ai-title-text { font-weight: bold; font-size: 16px; pointer-events: none; }
        
        #ai-msg { font-size: 14px; line-height: 1.5; min-height: 60px; pointer-events: none; }

        .ai-btns { 
            display: flex; gap: 10px; margin-top: auto; 
            transition: opacity 0.3s ease;
        }
        
        .ai-btns.disabled { 
            opacity: 0; 
            pointer-events: none;
        }

        .ai-btns button { 
            flex: 1; padding: 10px; border: none; border-radius: 8px; 
            cursor: pointer; font-weight: bold;
        }
        .btn-ok { background: #00d2ff; color: white; }
        .btn-no { background: #f1f1f1; color: #666; }
    `;
    document.head.appendChild(style);

    // ২. HTML
    const widget = document.createElement('div');
    widget.id = 'custom-ai-widget';
    widget.innerHTML = `
        <div class="ai-header">
            <img src="ai-image.png" alt="AI" class="ai-img">
            <span class="ai-title-text">TuniAI</span>
        </div>
        <div id="ai-msg">Developed by Jahidul | Owner Of Tuniverse</div>
        <div class="ai-btns" id="ai-actions">
            <button class="btn-ok" onclick="handleAI('yes')">হ্যাঁ</button>
            <button class="btn-no" onclick="handleAI('no')">না</button>
        </div>
    `;
    document.body.appendChild(widget);

    // ৩. ড্র্যাগিং লজিক
    let isDragging = false;
    let offsetX, offsetY;

    function startDragging(e) {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        const rect = widget.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        
        widget.style.transition = 'none'; 
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        
        widget.style.left = (clientX - offsetX) + 'px';
        widget.style.top = (clientY - offsetY) + 'px';
        widget.style.bottom = 'auto';
        widget.style.right = 'auto';
    }

    function stopDragging() {
        isDragging = false;
        // ড্র্যাগ শেষ হলে ট্রানজিশন আবার চালু করা যাতে হাইড হওয়ার সময় স্মুথলি যায়
        widget.style.transition = 'all 0.6s ease-in-out;';
    }

    widget.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    widget.addEventListener('touchstart', startDragging, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDragging);

    // ৪. মূল লজিক (হাইড হওয়ার সমস্যা সমাধান করা হয়েছে)
    window.handleAI = function(type) {
        const msg = document.getElementById('ai-msg');
        const btns = document.getElementById('ai-actions');
        
        if (type === 'yes') {
            msg.innerText = "দারুণ! আমি আপনাকে সবসময় সাহায্য করতে প্রস্তুত...";
            btns.classList.add('disabled');
            setTimeout(() => { window.location.href = "https://example.com/support"; }, 2000);
        } else {
            msg.innerText = "ঠিক আছে ভাই। আমি আপাতত চুপ থাকছি! 🤐";
            btns.classList.add('disabled');
            
            setTimeout(() => {
                widget.classList.remove('active');
                
                // ড্র্যাগ করার কারণে তৈরি হওয়া ইনলাইন স্টাইল রিমুভ করা হচ্ছে
                // যাতে CSS এর ডিফল্ট হাইড পজিশনে ফিরে যেতে পারে
                widget.style.left = '';
                widget.style.top = '';
                widget.style.right = ''; 
                widget.style.bottom = '';
                
                setTimeout(showWidget, 30000); 
            }, 3000);
        }
    };

    function showWidget() {
        const btns = document.getElementById('ai-actions');
        btns.classList.remove('disabled');
        document.getElementById('ai-msg').innerText = "হাই! আপনিও কী এরকম একটি ওয়েবসাইট তৈরি করতে চান?";
        widget.classList.add('active');
    }

    setTimeout(showWidget, 5000);
})();
