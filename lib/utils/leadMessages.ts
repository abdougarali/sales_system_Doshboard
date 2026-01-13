// Static message templates for each lead status
// These are pre-written Arabic messages for outreach to small brands

export interface MessageTemplate {
  status: string;
  title: string;
  titleAr: string;
  message: string;
  description: string;
}

export const leadMessages: Record<string, MessageTemplate> = {
  new: {
    status: 'new',
    title: 'Initial Contact',
    titleAr: 'التواصل الأول',
    message: `السلام عليكم 👋

شفت حسابكم وعجبني شغلكم كتير! 💜

أنا متخصص في بناء صفحات طلب احترافية للبراندات الصغيرة.

لاحظت إن كتير من العملاء ممكن يضيعوا بسبب صعوبة الطلب من الـ DM أو الواتساب.

عندي عرض مجاني: أعمللكم تحليل سريع لوضع الطلبات عندكم وأوريكم كيف ممكن تزيدوا مبيعاتكم.

هل تحبوا نتكلم؟ 🙏`,
    description: 'First message to introduce yourself and offer free audit',
  },

  contacted: {
    status: 'contacted',
    title: 'Follow-up Message',
    titleAr: 'متابعة',
    message: `السلام عليكم مرة تانية 😊

بعتلكم رسالة قبل كذا يوم عن خدمة صفحات الطلب.

فقط حبيت أتأكد إن الرسالة وصلتكم!

لو عندكم أي أسئلة أنا موجود 🙏`,
    description: 'Follow-up if no response after initial contact',
  },

  replied: {
    status: 'replied',
    title: 'After Reply - Build Interest',
    titleAr: 'بعد الرد',
    message: `أهلاً وسهلاً! شكراً على الرد 🙏

الخدمة ببساطة:
✅ صفحة طلب احترافية باسم براندكم
✅ لوحة تحكم لإدارة الطلبات والمنتجات
✅ تتبع حالة كل طلب
✅ تصميم يناسب هوية البراند

النتيجة: طلبات أكتر + وقت أقل في الردود + شكل احترافي

حابين أوريكم demo سريع؟ 🎯`,
    description: 'Explain the service after they show interest',
  },

  demo_sent: {
    status: 'demo_sent',
    title: 'After Demo - Close the Deal',
    titleAr: 'بعد الديمو',
    message: `أهلاً! 👋

إن شاء الله عجبكم الـ Demo اللي بعتته 🎯

الباقة تشمل:
📱 صفحة طلب بتصميم خاص
💻 لوحة تحكم كاملة
📦 إدارة المنتجات والمخزون
📊 تتبع الطلبات والإحصائيات

السعر: [أضف السعر هنا]
مدة التنفيذ: [أضف المدة هنا]

جاهزين نبدأ؟ 🚀`,
    description: 'Follow up after sending demo to close the sale',
  },

  converted: {
    status: 'converted',
    title: 'Welcome & Onboarding',
    titleAr: 'ترحيب',
    message: `مبروك! 🎉

أهلاً بيكم في العائلة!

الخطوات الجاية:
1️⃣ هنحتاج منكم: اسم البراند + الشعار + الألوان المفضلة
2️⃣ قائمة المنتجات مع الأسعار والصور
3️⃣ معلومات التواصل (رقم الواتساب للطلبات)

متى يناسبكم نبدأ؟ 💪`,
    description: 'Welcome message after successful conversion',
  },

  lost: {
    status: 'lost',
    title: 'Re-engagement',
    titleAr: 'إعادة التواصل',
    message: `السلام عليكم 👋

أتمنى تكونوا بخير!

تواصلنا قبل فترة عن خدمة صفحات الطلب.

حبيت أخبركم إن عندنا عروض جديدة الفترة دي 🎁

لو حابين تسمعوا أكتر، أنا موجود!

تحياتي 🙏`,
    description: 'Try to re-engage lost leads with new offers',
  },
};

export function getMessageByStatus(status: string): MessageTemplate | null {
  return leadMessages[status] || null;
}

export function getAllMessages(): MessageTemplate[] {
  return Object.values(leadMessages);
}
