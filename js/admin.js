// KẾT NỐI SUPABASE
const SUPABASE_URL = "https://gcgrdmgzspexwxclzarn.supabase.co";

const SUPABASE_KEY = "sb_publishable_8NUqkqoW1dqw7r7FJZqZCA_cY9vVS_8";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// KIỂM TRA QUYỀN QUẢN TRỊ VIÊN
async function checkAdmin() {

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        window.location.href = "index.html";
        return false;
    }

    const { data: profile, error: profileError } =
        await supabaseClient
            .from("profiles")
            .select("full_name, role")
            .eq("id", userData.user.id)
            .single();

    if (
        profileError ||
        !profile ||
        profile.role !== "admin"
    ) {
        await supabaseClient.auth.signOut();
        window.location.href = "index.html";
        return false;
    }

    document.querySelector(".admin-user span").textContent =
        profile.full_name || "Quản trị viên";

    return true;
}


// LẤY SỐ LIỆU THỐNG KÊ
async function loadDashboard() {

    const results = await Promise.all([

        supabaseClient
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "teacher"),

        supabaseClient
            .from("posts")
            .select("*", { count: "exact", head: true }),

        supabaseClient
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),

                supabaseClient
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("status", "approved"),

        supabaseClient
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("status", "rejected"),

        supabaseClient
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("status", "revision")


    ]);

    const elements = [
    "teacherCount",
    "postCount",
    "pendingCount",
    "approvedCount",
    "rejectedCount",
    "revisionCount"
];

    results.forEach((result, index) => {

        if (result.error) {
            console.error("Lỗi thống kê:", result.error.message);
            return;
        }

        document.getElementById(elements[index]).textContent =
            result.count ?? 0;

    });
}


// XỬ LÝ ĐĂNG XUẤT
document.getElementById("logoutButton")
    .addEventListener("click", async function () {

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            alert("Không thể đăng xuất. Vui lòng thử lại.");
            return;
        }

        window.location.href = "index.html";

    });


// KHỞI ĐỘNG DASHBOARD
async function initDashboard() {

    const isAdmin = await checkAdmin();

    if (!isAdmin) return;

    await loadDashboard();

}

initDashboard();