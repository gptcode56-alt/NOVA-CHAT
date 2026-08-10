// ==========================================
// Nova Chat - app.js
// ==========================================


// ==========================================
// تحميل Firebase
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
// إعدادات Firebase
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

const firebaseApp =
    initializeApp(firebaseConfig);

const auth =
    getAuth(firebaseApp);


// ==========================================
// عناصر HTML
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
// التأكد أن العناصر موجودة
// ==========================================

if (!loginButton) {
    console.error("loginButton غير موجود في index.html");
}

if (!registerButton) {
    console.error("registerButton غير موجود في index.html");
}


// ==========================================
// إظهار رسالة
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

function makeEmail(phone) {

    return phone + "@novachat.local";
}


// ==========================================
// تبديل تسجيل الدخول
// ==========================================

loginTab.addEventListener("click", function () {

    loginTab.classList.add("active");

    registerTab.classList.remove("active");

    loginSection.classList.remove("hidden");

    registerSection.classList.add("hidden");

    showMessage("");

});


// ==========================================
// تبديل إنشاء حساب
// ==========================================

registerTab.addEventListener("click", function () {

    registerTab.classList.add("active");

    loginTab.classList.remove("active");

    registerSection.classList.remove("hidden");

    loginSection.classList.add("hidden");

    showMessage("");

});


// ==========================================
// إنشاء حساب جديد
// ==========================================

registerButton.addEventListener(
    "click",
    async function () {

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


        // فحص الهاتف

        if (!isValidPhone(phone)) {

            showMessage(
                "❌ اكتب رقم هاتف مصري صحيح مثل 01012345678",
                "error"
            );

            return;
        }


        // فحص الرقم السري

        if (!isValidPin(pin)) {

            showMessage(
                "❌ الرقم السري لازم يكون 6 أرقام بالضبط.",
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


            // إنشاء Email داخلي

            const email =
                makeEmail(phone);


            console.log(
                "Creating account:",
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
                "Firebase UID:",
                user.uid
            );


            // حفظ الرقم فقط في الجهاز

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


        }

        catch (error) {

            console.error(
                "Firebase Register Error:",
                error
            );


            let errorText =
                "❌ حصل خطأ أثناء إنشاء الحساب.";


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                errorText =
                    "❌ رقم الهاتف ده مسجل بالفعل.";

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                errorText =
                    "❌ الرقم السري غير مقبول.";

            }

            else if (
                error.code ===
                "auth/operation-not-allowed"
            ) {

                errorText =
                    "❌ لازم تفعّل Email/Password من Firebase Authentication.";

            }

            else if (
                error.code ===
                "auth/invalid-api-key"
            ) {

                errorText =
                    "❌ Firebase API Key غير صحيح.";

            }


            showMessage(
                errorText,
                "error"
            );

        }


        registerButton.disabled = false;

        registerButton.textContent =
            "إنشاء الحساب";

    }
);


// ==========================================
// تسجيل الدخول
// ==========================================

loginButton.addEventListener(
    "click",
    async function () {

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


        // فحص الهاتف

        if (!isValidPhone(phone)) {

            showMessage(
                "❌ اكتب رقم هاتف مصري صحيح مثل 01012345678",
                "error"
            );

            return;
        }


        // فحص PIN

        if (!isValidPin(pin)) {

            showMessage(
                "❌ الرقم السري لازم يكون 6 أرقام بالضبط.",
                "error"
            );

            return;
        }


        try {

            loginButton.disabled = true;

            loginButton.textContent =
                "جاري تسجيل الدخول...";


            // إنشاء الـEmail الداخلي

            const email =
                makeEmail(phone);


            console.log(
                "Login attempt:",
                email
            );


            // تسجيل الدخول في Firebase

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    pin
                );


            const user =
                userCredential.user;


            console.log(
                "Logged in UID:",
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


            // بعد ما نعمل home.html
            // هنضع هنا:
            //
            // window.location.href = "home.html";


        }

        catch (error) {

            console.error(
                "Firebase Login Error:",
                error
            );


            let errorText =
                "❌ رقم الهاتف أو الرقم السري غير صحيح.";


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                errorText =
                    "❌ رقم الهاتف أو الرقم السري غير صحيح.";

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                errorText =
                    "❌ بيانات الحساب غير صحيحة.";

            }

            else if (
                error.code ===
                "auth/operation-not-allowed"
            ) {

                errorText =
                    "❌ فعّل Email/Password من Firebase Authentication.";

            }


            showMessage(
                errorText,
                "error"
            );

        }


        loginButton.disabled = false;

        loginButton.textContent =
            "تسجيل الدخول";

    }
);


// ==========================================
// السماح بالأرقام فقط
// ==========================================

const numericInputs =
    document.querySelectorAll(
        'input[inputmode="numeric"]'
    );


numericInputs.forEach(
    function (input) {

        input.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^0-9]/g,
                        ""
                    );

            }
        );

    }
);


// ==========================================
// زر Enter
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

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
// رسالة بدء التشغيل
// ==========================================

console.log(
    "Nova Chat Firebase App Started Successfully 🚀"
);
