// ==========================================
// Nova Chat
// Firebase Authentication
// ==========================================


// ==========================================
// Firebase Imports
// ==========================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ==========================================
// Firebase Configuration
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyABwXUC5h576QgbxuGeXI3HxnycK9PoyRU",
    authDomain: "nova-a3c5e.firebaseapp.com",
    projectId: "nova-a3c5e",
    storageBucket: "nova-a3c5e.firebasestorage.app",
    messagingSenderId: "732785402897",
    appId: "1:732785402897:web:ccf12d216699e409b17db0",
    measurementId: "G-YJY3HSB394"
};


// ==========================================
// تشغيل Firebase
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// ==========================================
// عناصر الصفحة
// ==========================================

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");

const loginSection =
    document.getElementById("loginSection");

const registerSection =
    document.getElementById("registerSection");

const loginButton =
    document.getElementById("loginButton");

const registerButton =
    document.getElementById("registerButton");

const message =
    document.getElementById("message");


// ==========================================
// التأكد من تحميل العناصر
// ==========================================

console.log("Nova Chat بدأ التشغيل ✅");


// ==========================================
// إظهار الرسائل
// ==========================================

function showMessage(text, type = "") {

    message.textContent = text;

    message.className = "message";

    if (type !== "") {
        message.classList.add(type);
    }
}


// ==========================================
// تنظيف رقم الهاتف
// ==========================================

function cleanPhone(phone) {

    return phone
        .replace(/\s/g, "")
        .replace(/-/g, "")
        .trim();
}


// ==========================================
// التحقق من رقم الهاتف المصري
// ==========================================

function isValidPhone(phone) {

    return /^01[0-9]{9}$/.test(phone);
}


// ==========================================
// التحقق من الرقم السري
// ==========================================

function isValidPin(pin) {

    return /^[0-9]{6}$/.test(pin);
}


// ==========================================
// تحويل رقم الهاتف إلى Email داخلي
// ==========================================

function phoneToEmail(phone) {

    return phone + "@nova-chat.local";
}


// ==========================================
// تبديل تسجيل الدخول
// ==========================================

loginTab.addEventListener("click", () => {

    loginTab.classList.add("active");

    registerTab.classList.remove("active");

    loginSection.classList.remove("hidden");

    registerSection.classList.add("hidden");

    showMessage("");

});


// ==========================================
// تبديل إنشاء الحساب
// ==========================================

registerTab.addEventListener("click", () => {

    registerTab.classList.add("active");

    loginTab.classList.remove("active");

    registerSection.classList.remove("hidden");

    loginSection.classList.add("hidden");

    showMessage("");

});


// ==========================================
// إنشاء حساب جديد
// ==========================================

registerButton.addEventListener("click", async () => {

    let phone =
        document.getElementById(
            "registerPhone"
        ).value;

    const pin =
        document.getElementById(
            "registerPin"
        ).value;

    const pinConfirm =
        document.getElementById(
            "registerPinConfirm"
        ).value;


    // تنظيف الرقم

    phone = cleanPhone(phone);


    // التحقق من رقم الهاتف

    if (!isValidPhone(phone)) {

        showMessage(
            "❌ اكتب رقم هاتف مصري صحيح مثل 01012345678",
            "error"
        );

        return;
    }


    // التحقق من الرقم السري

    if (!isValidPin(pin)) {

        showMessage(
            "❌ الرقم السري يجب أن يكون 6 أرقام.",
            "error"
        );

        return;
    }


    // تأكيد الرقم السري

    if (pin !== pinConfirm) {

        showMessage(
            "❌ الرقم السري غير متطابق.",
            "error"
        );

        return;
    }


    try {

        registerButton.disabled = true;

        registerButton.textContent =
            "جاري إنشاء الحساب...";


        // تحويل رقم الهاتف إلى معرف داخلي

        const email =
            phoneToEmail(phone);


        console.log(
            "إنشاء حساب:",
            email
        );


        // إنشاء الحساب في Firebase

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                pin
            );


        const user =
            userCredential.user;


        console.log(
            "تم إنشاء الحساب ✅",
            user.uid
        );


        // حفظ رقم الهاتف فقط

        localStorage.setItem(
            "novaPhone",
            phone
        );


        showMessage(
            "✅ تم إنشاء الحساب بنجاح!",
            "success"
        );


        // تفريغ الحقول

        document.getElementById(
            "registerPhone"
        ).value = "";

        document.getElementById(
            "registerPin"
        ).value = "";

        document.getElementById(
            "registerPinConfirm"
        ).value = "";


    } catch (error) {

        console.error(
            "Register Error:",
            error
        );


        // رسالة الخطأ

        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            showMessage(
                "❌ رقم الهاتف ده مسجل بالفعل.",
                "error"
            );

        }

        else if (
            error.code ===
            "auth/operation-not-allowed"
        ) {

            showMessage(
                "❌ لازم تفعيل Email/Password من Firebase Authentication.",
                "error"
            );

        }

        else if (
            error.code ===
            "auth/weak-password"
        ) {

            showMessage(
                "❌ Firebase رفض الرقم السري لأنه ضعيف.",
                "error"
            );

        }

        else {

            showMessage(
                "❌ حدث خطأ: " + error.message,
                "error"
            );

        }

    }


    registerButton.disabled = false;

    registerButton.textContent =
        "إنشاء الحساب";

});


// ==========================================
// تسجيل الدخول
// ==========================================

loginButton.addEventListener("click", async () => {

    let phone =
        document.getElementById(
            "loginPhone"
        ).value;

    const pin =
        document.getElementById(
            "loginPin"
        ).value;


    // تنظيف الهاتف

    phone = cleanPhone(phone);


    // التحقق من الهاتف

    if (!isValidPhone(phone)) {

        showMessage(
            "❌ اكتب رقم هاتف مصري صحيح مثل 01012345678",
            "error"
        );

        return;
    }


    // التحقق من PIN

    if (!isValidPin(pin)) {

        showMessage(
            "❌ الرقم السري يجب أن يكون 6 أرقام.",
            "error"
        );

        return;
    }


    try {

        loginButton.disabled = true;

        loginButton.textContent =
            "جاري تسجيل الدخول...";


        const email =
            phoneToEmail(phone);


        console.log(
            "محاولة تسجيل الدخول:",
            email
        );


        // تسجيل الدخول

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                pin
            );


        const user =
            userCredential.user;


        console.log(
            "تم تسجيل الدخول ✅",
            user.uid
        );


        // حفظ الرقم

        localStorage.setItem(
            "novaPhone",
            phone
        );


        showMessage(
            "✅ تم تسجيل الدخول بنجاح!",
            "success"
        );


        // بعد إنشاء الصفحة الرئيسية
        // هنضع هنا:
        //
        // window.location.href = "home.html";


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            showMessage(
                "❌ رقم الهاتف أو الرقم السري غير صحيح.",
                "error"
            );

        }

        else if (
            error.code ===
            "auth/operation-not-allowed"
        ) {

            showMessage(
                "❌ لازم تفعيل Email/Password من Firebase Authentication.",
                "error"
            );

        }

        else {

            showMessage(
                "❌ حدث خطأ: " + error.message,
                "error"
            );

        }

    }


    loginButton.disabled = false;

    loginButton.textContent =
        "تسجيل الدخول";

});


// ==========================================
// السماح بالأرقام فقط
// ==========================================

const numericInputs =
    document.querySelectorAll(
        'input[inputmode="numeric"]'
    );


numericInputs.forEach(input => {

    input.addEventListener(
        "input",
        () => {

            input.value =
                input.value.replace(
                    /[^0-9]/g,
                    ""
                );

        }
    );

});


// ==========================================
// الضغط على Enter
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Enter") {
            return;
        }


        if (
            !loginSection.classList.contains(
                "hidden"
            )
        ) {

            loginButton.click();

        }

        else {

            registerButton.click();

        }

    }
);


// ==========================================
// اختبار التشغيل
// ==========================================

console.log(
    "🔥 Nova Chat Firebase Connected"
);
