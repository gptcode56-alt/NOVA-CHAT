// ============================================
// Firebase
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// إعدادات Firebase الخاصة بـ Nova Chat

const firebaseConfig = {
    apiKey: "AIzaSyALknAXGEt4k_5c26WUYT2-tE00lwG6CMc",
    authDomain: "my-we-7be7c.firebaseapp.com",
    projectId: "my-we-7be7c",
    storageBucket: "my-we-7be7c.firebasestorage.app",
    messagingSenderId: "286975925668",
    appId: "1:286975925668:web:cb30205ff611ead38f7531",
    measurementId: "G-8BDHDE8TF7"
};


// تشغيل Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// ============================================
// عناصر الصفحة
// ============================================

const phoneInput =
    document.getElementById("phone");

const otpInput =
    document.getElementById("otp");

const sendCodeBtn =
    document.getElementById("sendCodeBtn");

const verifyBtn =
    document.getElementById("verifyBtn");

const backBtn =
    document.getElementById("backBtn");

const otpSection =
    document.getElementById("otpSection");

const message =
    document.getElementById("message");


// ============================================
// متغير التحقق
// ============================================

let confirmationResult = null;


// ============================================
// إظهار رسالة
// ============================================

function showMessage(text, type = "info") {

    message.textContent = text;

    message.className = "message " + type;
}


// ============================================
// تجهيز reCAPTCHA
// ============================================

let recaptchaVerifier;

function setupRecaptcha() {

    recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "sendCodeBtn",
        {
            size: "invisible",

            callback: () => {
                console.log("reCAPTCHA completed");
            }
        }
    );
}


// ============================================
// إرسال كود SMS
// ============================================

sendCodeBtn.addEventListener("click", async () => {

    const phone = phoneInput.value.trim();


    // التأكد من وجود رقم

    if (!phone) {

        showMessage(
            "اكتب رقم الهاتف أولاً.",
            "error"
        );

        return;
    }


    // لازم يكون بصيغة دولية
    // مثال مصر:
    // +2010xxxxxxxx

    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {

        showMessage(
            "اكتب الرقم بصيغة دولية مثل +2010xxxxxxxx.",
            "error"
        );

        return;
    }


    try {

        sendCodeBtn.disabled = true;

        sendCodeBtn.textContent =
            "جاري الإرسال...";


        // إنشاء reCAPTCHA

        if (!recaptchaVerifier) {
            setupRecaptcha();
        }


        // إرسال OTP

        confirmationResult =
            await signInWithPhoneNumber(
                auth,
                phone,
                recaptchaVerifier
            );


        // إظهار خانة OTP

        otpSection.classList.remove("hidden");

        phoneInput.disabled = true;

        sendCodeBtn.classList.add("hidden");


        showMessage(
            "تم إرسال كود التحقق إلى هاتفك.",
            "success"
        );

    }

    catch (error) {

        console.error(error);

        showMessage(
            "لم نتمكن من إرسال الكود. تأكد من الرقم وإعدادات Firebase.",
            "error"
        );


        // إعادة تفعيل الزر

        sendCodeBtn.disabled = false;

        sendCodeBtn.textContent =
            "إرسال كود التحقق";


        // إعادة إنشاء reCAPTCHA

        if (recaptchaVerifier) {

            try {
                recaptchaVerifier.clear();
            } catch (e) {}

            recaptchaVerifier = null;
        }
    }
});


// ============================================
// تأكيد OTP
// ============================================

verifyBtn.addEventListener("click", async () => {

    const code =
        otpInput.value.trim();


    if (!confirmationResult) {

        showMessage(
            "اطلب كود التحقق أولاً.",
            "error"
        );

        return;
    }


    if (!/^\d{6}$/.test(code)) {

        showMessage(
            "اكتب كود التحقق المكون من 6 أرقام.",
            "error"
        );

        return;
    }


    try {

        verifyBtn.disabled = true;

        verifyBtn.textContent =
            "جاري التحقق...";


        // تسجيل الدخول الحقيقي

        const result =
            await confirmationResult.confirm(code);


        const user =
            result.user;


        console.log("User:", user);


        showMessage(
            "تم تسجيل الدخول بنجاح 🎉",
            "success"
        );


        /*
            هنا في الخطوة القادمة
            هننقل المستخدم إلى:

            home.html

            وهي الصفحة الرئيسية
            الخاصة بـ Nova Chat.
        */


    }

    catch (error) {

        console.error(error);

        showMessage(
            "كود التحقق غير صحيح أو انتهت صلاحيته.",
            "error"
        );


        verifyBtn.disabled = false;

        verifyBtn.textContent =
            "تأكيد الرقم";
    }
});


// ============================================
// تغيير رقم الهاتف
// ============================================

backBtn.addEventListener("click", () => {

    otpSection.classList.add("hidden");

    phoneInput.disabled = false;

    sendCodeBtn.classList.remove("hidden");

    sendCodeBtn.disabled = false;

    sendCodeBtn.textContent =
        "إرسال كود التحقق";


    otpInput.value = "";

    showMessage("");


    // إعادة تهيئة reCAPTCHA

    if (recaptchaVerifier) {

        try {
            recaptchaVerifier.clear();
        } catch (e) {}

        recaptchaVerifier = null;
    }
});
