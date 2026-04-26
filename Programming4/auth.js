/* ==================== 用户认证系统 ==================== */

// 检查用户是否登录
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// 获取当前用户信息
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// 获取所有注册用户
function getAllUsers() {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
}

// 保存所有用户
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// 用户注册
function registerUser(username, email, password) {
    const users = getAllUsers();
    
    // 检查用户名是否已存在
    if (users.find(u => u.username === username)) {
        alert('Username already exists!');
        return false;
    }
    
    // 检查邮箱是否已存在
    if (users.find(u => u.email === email)) {
        alert('Email already registered!');
        return false;
    }
    
    // 创建新用户
    const newUser = {
        username: username,
        email: email,
        password: password,  
        registeredDate: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    alert('Registration successful! Please login.');
    return true;
}

// 用户登录
function loginUser(usernameOrEmail, password) {
    const users = getAllUsers();
    
    // 查找用户（可以用用户名或邮箱登录）
    const user = users.find(u => 
        (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
        u.password === password
    );
    
    if (user) {
        // 保存当前登录用户
        const userInfo = {
            username: user.username,
            email: user.email
        };
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        return true;
    }
    
    return false;
}

// 用户登出
function logoutUser() {
    localStorage.removeItem('currentUser');

    if (window.location.pathname.includes('/observations/')) {
        window.location.href = '../observations.html';
    } else {
        window.location.href = 'observations.html';
    }
}

// ==================== 页面加载时执行 ====================

document.addEventListener('DOMContentLoaded', function() {
    
    // 注册表单处理
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            // 验证密码
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters!');
                return;
            }
            
            // 注册用户
            if (registerUser(username, email, password)) {
                window.location.href = 'login.html';
            }
        });
    }
    
    // 登录表单处理
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const usernameOrEmail = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            // 登录验证
            if (loginUser(usernameOrEmail, password)) {
                alert('Login successful!');
                window.location.href = 'observations.html';
            } else {
                alert('Invalid username/email or password!');
            }
        });
    }
});


    
    

