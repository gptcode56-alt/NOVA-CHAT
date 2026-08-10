// ==========================================
// Nova Chat
// app.js
// ==========================================


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
// إظهار الرسائل
// ==========================================

function showMessage(text, type = "") {

    message.textContent = text;

    message.className = "message";

    if (type) {
        message.classList.add(type);
    }
}


// ==========================================
// تبديل تسجيل الدخول
// ==========================================

loginTab.addEventListener("click", function () {

    // تفعيل زر تسجيل الدخول
    loginTab.classList.add("active");

    // إلغاء تفعيل حساب جديد
    registerTab.classList.remove("active");


    // إظهار تسجيل الدخول
    loginSection.classList.remove("hidden");

    // إخفاء التسجيل
    registerSection.classList.add("hidden");


    // مسح الرسالة
    showMessage("");
});


// ==========================================
// تبديل إنشاء حساب
// ==========================================

registerTab.addEventListener("click", function () {

    // تفعيل حساب جديد
    registerTab.classList.add("active");

    // إلغاء تفعيل تسجيل الدخول
    loginTab.classList.remove("active");


    // إظهار التسجيل
    registerSection.classList.remove("hidden");

    // إخفاء تسجيل الدخول
    loginSection.classList.add("hidden");


    // مسح الرسالة
    showMessage("");
});


// ==========================================
// تنظيف رقم الهاتف
// ==========================================

function cleanPhone(phone) {

    return phone
        .replace(/\s/g, "")
        .replace(/-/g, "");
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
// تسجيل الدخول
// ==========================================

loginButton.addEventListener("click", function () {

    let phone =
        document.getElementById("loginPhone").value;

    const pin =
        document.getElementById("loginPin").value;


    // تنظيف الرقم
    phone = cleanPhone(phone);


    // التحقق من الهاتف

    if (!isValidPhone(phone)) {

        showMessage(
            "من فضلك اكتب رقم هاتف مصري صحيح.",
            "error"
        );

        return;
    }


    // التحقق من الرقم السري

    if (!isValidPin(pin)) {

        showMessage(
            "الرقم السري يجب أن يكون 6 أرقام.",
            "error"
        );

        return;
    }


    // مؤقتاً
    // Firebase هنضيفه في الخطوة التالية

    showMessage(
        "بيانات الدخول صحيحة. جاهز للربط مع Firebase.",
        "success"
    );

});


// ==========================================
// إنشاء حساب
// ==========================================

registerButton.addEventListener("click", function () {

    let phone =
        document.getElementById("registerPhone").value;

    const pin =
        document.getElementById("registerPin").value;

    const pinConfirm =
        document.getElementById("registerPinConfirm").value;


    // تنظيف الهاتف

    phone = cleanPhone(phone);


    // التحقق من الهاتف

    if (!isValidPhone(phone)) {

        showMessage(
            "من فضلك اكتب رقم هاتف مصري صحيح.",
            "error"
        );

        return;
    }


    // التحقق من الرقم السري

    if (!isValidPin(pin)) {

        showMessage(
            "الرقم السري يجب أن يكون 6 أرقام.",
            "error"
        );

        return;
    }


    // تأكيد الرقم السري

    if (pin !== pinConfirm) {

        showMessage(
            "الرقم السري غير متطابق.",
            "error"
        );

        return;
    }


    // مؤقتاً
    // Firebase هنضيفه في الخطوة التالية

    showMessage(
        "البيانات صحيحة. جاهز لإنشاء الحساب.",
        "success"
    );

});


// ==========================================
// السماح بالأرقام فقط في حقول الـ PIN
// ==========================================

const pinInputs = document.querySelectorAll(
    'input[inputmode="numeric"]'
);


pinInputs.forEach(function (input) {

    input.addEventListener("input", function () {

        this.value =
            this.value.replace(/[^0-9]/g, "");

    });

});


// ==========================================
// Enter لتسجيل الدخول
// ==========================================

document.addEventListener("keydown", function (event) {

    if (event.key !== "Enter") {
        return;
    }


    // لو تسجيل الدخول ظاهر
    if (!loginSection.classList.contains("hidden")) {

        loginButton.click();

    }

    // لو إنشاء الحساب ظاهر
    else {

        registerButton.click();

    }

});
