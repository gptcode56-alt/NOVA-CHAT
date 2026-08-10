// ==========================================
// Firebase
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// Firebase Config
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyALknAXGEt4k_5c26WUYT2-tE00lwG6CMc",

    authDomain:
        "my-we-7be7c.firebaseapp.com",

    projectId:
        "my-we-7be7c",

    storageBucket:
        "my-we-7be7c.firebasestorage.app",

    messagingSenderId:
        "286975925668",

    appId:
        "1:286975925668:web:cb30205ff611ead38f7531",

    measurementId:
        "G-8BDHDE8TF7"
};


// ==========================================
// تشغيل Firebase
// ==========================================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


// ==========================================
// عناصر الصفحة
// ==========================================

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const loginBtn =
    document.getElementById("loginBtn");

const registerBtn =
    document.getElementById("registerBtn");

const message =
    document.getElementById("message");


// ==========================================
// إظهار رسالة
// ==========================================

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        "message " + type;
}


// ==========================================
// تنظيف رقم الهاتف
// ==========================================

function cleanPhone(phone) {

    return phone
        .replace(/\s/g, "")
        .replace(/[^\d]/g, "");
}


// ==========================================
// إنشاء Email داخلي
// ==========================================

function createInternalEmail(phone) {

    return phone + "@nova-chat.local";
}


// ==========================================
// التحقق من الهاتف
// ==========================================

function validPhone(phone) {

    return /^01[0-9]{9}$/.test(phone);
}


// ==========================================
// التحقق من PIN
// ==========================================

function validPin(pin) {

    return /^[0-9]{6}$/.test(pin);
}


// ==========================================
// التبديل بين الدخول والتسجيل
// ==========================================

loginTab.addEventListener("click", () => {

    loginTab.classList.add("active");

    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");

    registerForm.classList.add("hidden");

    showMessage("", "");
});


registerTab.addEventListener("click", () => {

    registerTab.classList.add("active");

    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");

    loginForm.classList.add("hidden");

    showMessage("", "");
});


// ==========================================
// إنشاء حساب
// ==========================================

registerBtn.addEventListener("click", async () => {

    let phone =
        document.getElementById("registerPhone")
        .value;

    const pin =
        document.getElementById("registerPin")
        .value;

    const pin2 =
        document.getElementById("registerPin2")
        .value;


    phone = cleanPhone(phone);


    // التحقق من الرقم

    if (!validPhone(phone)) {

        showMessage(
            "اكتب رقم هاتف مصري صحيح.",
            "error"
        );

        return;
    }


    // التحقق من PIN

    if (!validPin(pin)) {

        showMessage(
            "الرقم السري يجب أن يكون 6 أرقام.",
            "error"
        );

        return;
    }


    // تأكيد PIN

    if (pin !== pin2) {

        showMessage(
            "الرقم السري غير متطابق.",
            "error"
        );

        return;
    }


    try {

        registerBtn.disabled = true;

        registerBtn.textContent =
            "جاري إنشاء الحساب...";


        const email =
            createInternalEmail(phone);


        // إنشاء حساب Firebase

        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                pin
            );


        const user =
            result.user;


        // حفظ بيانات المستخدم العامة فقط

        await setDoc(
            doc(db, "users", user.uid),
            {
                phone: phone,

                name: "مستخدم جديد",

                photoURL: "",

                createdAt:
                    new Date().toISOString()
            }
        );


        showMessage(
            "تم إنشاء حسابك بنجاح 🎉",
            "success"
        );


        // لاحقاً هننتقل إلى home.html

    }

    catch (error) {

        console.error(error);


        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            showMessage(
                "رقم الهاتف مستخدم بالفعل.",
                "error"
            );

        } else {

            showMessage(
                "حدث خطأ أثناء إنشاء الحساب.",
                "error"
            );
        }
    }


    registerBtn.disabled = false;

    registerBtn.textContent =
        "إنشاء الحساب";
});


// ==========================================
// تسجيل الدخول
// ==========================================

loginBtn.addEventListener("click", async () => {

    let phone =
        document.getElementById("loginPhone")
        .value;

    const pin =
        document.getElementById("loginPin")
        .value;


    phone = cleanPhone(phone);


    if (!validPhone(phone)) {

        showMessage(
            "اكتب رقم هاتف مصري صحيح.",
            "error"
        );

        return;
    }


    if (!validPin(pin)) {

        showMessage(
            "الرقم السري يجب أن يكون 6 أرقام.",
            "error"
        );

        return;
    }


    try {

        loginBtn.disabled = true;

        loginBtn.textContent =
            "جاري تسجيل الدخول...";


        const email =
            createInternalEmail(phone);


        // تسجيل الدخول

        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                pin
            );


        const user =
            result.user;


        // التأكد من وجود بيانات المستخدم

        const userDoc =
            await getDoc(
                doc(db, "users", user.uid)
            );


        if (userDoc.exists()) {

            console.log(
                "User:",
                userDoc.data()
            );
        }


        showMessage(
            "تم تسجيل الدخول بنجاح 🎉",
            "success"
        );


        // =====================================
        // الخطوة القادمة:
        // window.location.href = "home.html";
        // =====================================

    }

    catch (error) {

        console.error(error);


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            showMessage(
                "رقم الهاتف أو الرقم السري غير صحيح.",
                "error"
            );

        } else {

            showMessage(
                "حدث خطأ أثناء تسجيل الدخول.",
                "error"
            );
        }
    }


    loginBtn.disabled = false;

    loginBtn.textContent =
        "تسجيل الدخول";
});
