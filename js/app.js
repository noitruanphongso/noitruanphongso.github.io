// 1. CHỨC NĂNG ẨN / HIỆN MẬT KHẨU


const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");


togglePassword.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Ẩn";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Hiện";
    }
});
// KẾT NỐI SUPABASE
const SUPABASE_URL = "https://gcgrdmgzspexwxclzarn.supabase.co";


const SUPABASE_KEY = "sb_publishable_8NUqkqoW1dqw7r7FJZqZCA_cY9vVS_8";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


console.log("Supabase đã được khởi tạo!");
async function testSupabaseConnection() {
    const { data, error } = await supabaseClient
        .from("categories")
        .select("name");


    if (error) {
        console.error("Lỗi kết nối:", error.message);
        return;
    }


    console.log("Kết nối Supabase thành công!");
    console.log("Danh sách chuyên mục:", data);
}


testSupabaseConnection();
// XỬ LÝ ĐĂNG NHẬP
const loginForm = document.getElementById("loginForm");


loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();


    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;


    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });


    if (error) {
        alert("Đăng nhập không thành công. Vui lòng kiểm tra email và mật khẩu.");
        return;
    }


    const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("full_name, role")
        .eq("id", data.user.id)
        .single();


    if (profileError || !profile) {
        await supabaseClient.auth.signOut();
        alert("Không tìm thấy hồ sơ người dùng. Vui lòng liên hệ quản trị viên.");
        return;
    }


    console.log("Đăng nhập thành công!");
    console.log("Họ tên:", profile.full_name);
    console.log("Vai trò:", profile.role);


    alert("Đăng nhập thành công!");


if (profile.role === "admin") {
    window.location.href = "admin.html";
} else if (profile.role === "teacher") {
    window.location.href = "teacher-dashboard.html";
} else {
    await supabaseClient.auth.signOut();
    alert("Vai trò tài khoản không hợp lệ.");
}
});