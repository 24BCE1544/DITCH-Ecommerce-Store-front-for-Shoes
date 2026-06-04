/* DITCH Footwear — client-side auth helpers (demo / coursework; not production security) */

const AUTH_STORAGE = {
    customers: 'ditchCustomerAccounts',
    admins: 'ditchAdminAccounts'
};

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

/**
 * @returns {{ ok: boolean, email?: string, message?: string }}
 */
function validateEmailFormat(email) {
    const e = normalizeEmail(email);
    if (!e) {
        return { ok: false, message: 'Email is required.' };
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!re.test(e)) {
        return {
            ok: false,
            message: 'Use a valid email format (e.g. someone@example.com).'
        };
    }
    return { ok: true, email: e };
}

/**
 * @returns {{ ok: boolean, message?: string }}
 */
function validatePasswordFormat(password) {
    const p = String(password || '');
    if (p.length < 8) {
        return { ok: false, message: 'Password must be at least 8 characters.' };
    }
    if (!/[a-z]/.test(p)) {
        return { ok: false, message: 'Add at least one lowercase letter.' };
    }
    if (!/[A-Z]/.test(p)) {
        return { ok: false, message: 'Add at least one uppercase letter.' };
    }
    if (!/\d/.test(p)) {
        return { ok: false, message: 'Add at least one number.' };
    }
    return { ok: true };
}

function readAccounts(key) {
    try {
        const raw = localStorage.getItem(key);
        const list = JSON.parse(raw || '[]');
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

function writeAccounts(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
}

function registerCustomer(email, password, confirmPassword) {
    const eCheck = validateEmailFormat(email);
    if (!eCheck.ok) {
        return eCheck;
    }
    const pCheck = validatePasswordFormat(password);
    if (!pCheck.ok) {
        return pCheck;
    }
    if (password !== confirmPassword) {
        return { ok: false, message: 'Passwords do not match.' };
    }
    const accounts = readAccounts(AUTH_STORAGE.customers);
    if (accounts.some((a) => a.email === eCheck.email)) {
        return {
            ok: false,
            message: 'This email is already registered. Sign in instead.'
        };
    }
    accounts.push({ email: eCheck.email, password: password });
    writeAccounts(AUTH_STORAGE.customers, accounts);
    return { ok: true };
}

function registerAdmin(email, password, confirmPassword) {
    const eCheck = validateEmailFormat(email);
    if (!eCheck.ok) {
        return eCheck;
    }
    const pCheck = validatePasswordFormat(password);
    if (!pCheck.ok) {
        return pCheck;
    }
    if (password !== confirmPassword) {
        return { ok: false, message: 'Passwords do not match.' };
    }
    const accounts = readAccounts(AUTH_STORAGE.admins);
    if (accounts.some((a) => a.email === eCheck.email)) {
        return {
            ok: false,
            message: 'This admin email is already registered. Sign in instead.'
        };
    }
    accounts.push({ email: eCheck.email, password: password });
    writeAccounts(AUTH_STORAGE.admins, accounts);
    return { ok: true };
}

/**
 * Login: require existing account; validate email format; password non-empty + format (same as signup).
 */
function loginCustomer(email, password) {
    const eCheck = validateEmailFormat(email);
    if (!eCheck.ok) {
        return eCheck;
    }
    const p = String(password || '');
    if (!p) {
        return { ok: false, message: 'Password is required.' };
    }
    const pCheck = validatePasswordFormat(password);
    if (!pCheck.ok) {
        return pCheck;
    }
    const accounts = readAccounts(AUTH_STORAGE.customers);
    const acc = accounts.find((a) => a.email === eCheck.email);
    if (!acc) {
        return {
            ok: false,
            message: 'No customer account for this email. Sign up first.'
        };
    }
    if (acc.password !== password) {
        return { ok: false, message: 'Incorrect password.' };
    }
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userEmail', eCheck.email);
    return { ok: true };
}

function loginAdmin(email, password) {
    const eCheck = validateEmailFormat(email);
    if (!eCheck.ok) {
        return eCheck;
    }
    const p = String(password || '');
    if (!p) {
        return { ok: false, message: 'Password is required.' };
    }
    const pCheck = validatePasswordFormat(password);
    if (!pCheck.ok) {
        return pCheck;
    }
    const accounts = readAccounts(AUTH_STORAGE.admins);
    const acc = accounts.find((a) => a.email === eCheck.email);
    if (!acc) {
        return {
            ok: false,
            message: 'No admin account for this email. Register as admin first.'
        };
    }
    if (acc.password !== password) {
        return { ok: false, message: 'Incorrect password.' };
    }
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('adminEmail', eCheck.email);
    return { ok: true };
}

function logoutCustomer() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
}

function logoutAdmin() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
}

/** Live feedback while typing */
function attachEmailValidation(input, errorEl) {
    function run() {
        const r = validateEmailFormat(input.value);
        errorEl.textContent = r.ok ? '' : r.message;
        input.classList.toggle('auth-input-invalid', !r.ok && input.value.trim() !== '');
        if (input.value.trim() === '') {
            errorEl.textContent = '';
            input.classList.remove('auth-input-invalid');
        }
    }
    input.addEventListener('blur', run);
    input.addEventListener('input', () => {
        if (errorEl.textContent) {
            run();
        }
    });
}

function attachPasswordValidation(input, errorEl) {
    function run() {
        const r = validatePasswordFormat(input.value);
        errorEl.textContent = r.ok ? '' : r.message;
        input.classList.toggle('auth-input-invalid', !r.ok && input.value.length > 0);
        if (!input.value) {
            errorEl.textContent = '';
            input.classList.remove('auth-input-invalid');
        }
    }
    input.addEventListener('blur', run);
    input.addEventListener('input', () => {
        if (errorEl.textContent || input.value.length >= 8) {
            run();
        }
    });
}
