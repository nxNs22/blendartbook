const fs = require('fs');

function translateAuth() {
  const path = './app/auth/page.tsx';
  let content = fs.readFileSync(path, 'utf8');

  // Add useLanguage import
  if (!content.includes('useLanguage')) {
    content = content.replace(
      /import \{ Mail.*?\} from "lucide-react";/,
      `import { Mail, Lock, ArrowRight, Loader2, CheckCircle2, UserPlus, User, Phone, ArrowLeft } from "lucide-react";\nimport { useLanguage } from "../../context/LanguageContext";`
    );
  }

  // Add useLanguage hook
  if (!content.includes('const { t } = useLanguage();')) {
    content = content.replace(
      /export default function AuthPage\(\) \{/,
      `export default function AuthPage() {\n  const { t } = useLanguage();`
    );
  }

  const replacements = {
    '"Set your new password"': 't("set_new_password")',
    '"Reset your password"': 't("reset_your_password")',
    '"Welcome back"': 't("welcome_back")',
    '"Create an Account"': 't("create_an_account")',
    '"Choose a secure password and save it."': 't("choose_secure_password")',
    '"We\'ll email you a password reset link."': 't("email_reset_link")',
    '"Enter your details to access your account."': 't("enter_details_access")',
    '"Join us to track orders and save your cart."': 't("join_track_orders")',
    'Error:': '{t("error_label")}',
    'Check your email!': '{t("check_your_email")}',
    'If an account exists for': '{t("if_account_exists")}',
    'you\\\'ll receive a reset link shortly.': '{t("receive_reset_link")}',
    'Return to Login': '{t("return_to_login")}',
    'We\\\'ve sent a confirmation link to': '{t("sent_confirmation_link")}',
    'Please click it to verify your account.': '{t("click_verify_account")}',
    '>Full Name<': '>{t("full_name")}<',
    'placeholder="John Doe"': 'placeholder={t("john_doe")}',
    '>Phone Number<': '>{t("phone_number")}<',
    '>Email Address<': '>{t("email_address")}<',
    '>Password<': '>{t("password_label")}<',
    '>Forgot password\\?<': '>{t("forgot_password")}<',
    'placeholder={isLogin ? "••••••••" : "At least 6 characters"}': 'placeholder={isLogin ? "••••••••" : t("at_least_6_chars")}',
    '>New Password<': '>{t("new_password")}<',
    'placeholder="At least 6 characters"': 'placeholder={t("at_least_6_chars")}',
    '>Confirm Password<': '>{t("confirm_password")}<',
    'placeholder="Repeat new password"': 'placeholder={t("repeat_new_password")}',
    'Update Password ': '{t("update_password")} ',
    'Send Reset Link ': '{t("send_reset_link")} ',
    'Log In ': '{t("log_in")} ',
    'Create Account ': '{t("create_account_btn")} ',
    'Back to Login': '{t("back_to_login")}',
    '"Don\'t have an account? "': 't("dont_have_account") + " "',
    '"Already have an account? "': 't("already_have_account") + " "',
    '"Sign up for free"': 't("sign_up_free")',
    '"Log in here"': 't("log_in_here")'
  };

  for (const [search, replace] of Object.entries(replacements)) {
    // Escape string for string.replace if it's literal, or just use string
    content = content.replace(new RegExp(search.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replace);
  }
  
  // Custom fixes
  content = content.replace(/\{isLogin \? t\("dont_have_account"\) \+ " " : t\("already_have_account"\) \+ " "\}/, '{isLogin ? t("dont_have_account") + " " : t("already_have_account") + " "}');
  
  fs.writeFileSync(path, content, 'utf8');
}

function translateAccount() {
  const path = './app/account/page.tsx';
  let content = fs.readFileSync(path, 'utf8');

  // Add useLanguage import
  if (!content.includes('useLanguage')) {
    content = content.replace(
      /import \{ useAuth.*?\} from "\.\.\/context\/AuthContext";/,
      `import { useAuth } from "../context/AuthContext";\nimport { useLanguage } from "../../context/LanguageContext";`
    );
  }

  // Add useLanguage hook
  if (!content.includes('const { t } = useLanguage();')) {
    content = content.replace(
      /export default function AccountPage\(\) \{/,
      `export default function AccountPage() {\n  const { t } = useLanguage();`
    );
  }

  const replacements = {
    '"My Account"': 't("my_account")',
    'Profile Details': '{t("profile_details")}',
    'My Orders': '{t("my_orders")}',
    'Log Out': '{t("log_out")}',
    'Shipping & Contact Details': '{t("shipping_contact_details")}',
    '"Profile updated successfully!"': 't("profile_updated_success")',
    '>Full Name<': '>{t("full_name")}<',
    'placeholder="John Doe"': 'placeholder={t("john_doe")}',
    '>Phone Number<': '>{t("phone_number")}<',
    '>Delivery Address<': '>{t("delivery_address")}<',
    '"Saving..."': 't("saving")',
    '"Save Changes"': 't("save_changes")',
    'You haven\\\'t placed any orders yet.': '{t("no_orders_yet")}',
    'Order Items': '{t("order_items")}',
    'Qty: ': '{t("qty")} ',
    'Total:': '{t("total")}',
    'Status:': '{t("status")}',
  };

  for (const [search, replace] of Object.entries(replacements)) {
    content = content.replace(new RegExp(search.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replace);
  }
  
  // Custom replaces
  content = content.replace(/>\{order.total\}<\/span>/, '>{order.total}</span>'); // No change needed
  
  fs.writeFileSync(path, content, 'utf8');
}

translateAuth();
translateAccount();
console.log("Translation applied.");
