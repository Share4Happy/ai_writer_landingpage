/**
 * NT AI Writer - FAQ Accordion
 */

export function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-question');
    // Nội dung câu trả lời nằm trong .faq-answer-wrapper (giữ fallback .faq-answer cho tương thích)
    const answer = item.querySelector('.faq-answer-wrapper') || item.querySelector('.faq-answer');

    if (!trigger || !answer) return;

    // Đảm bảo có aria-controls để screen reader liên kết câu hỏi với câu trả lời
    if (!answer.id) {
      answer.id = `faq-answer-${Math.random().toString(36).slice(2, 9)}`;
    }
    trigger.setAttribute('aria-controls', answer.id);
    if (!trigger.hasAttribute('aria-expanded')) {
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Chế độ single accordion: đóng các câu hỏi khác
      faqItems.forEach((other) => {
        if (other !== item) {
          const otherTrigger = other.querySelector('.faq-question');
          if (otherTrigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            other.classList.remove('is-open');
          }
        }
      });

      // Đảo trạng thái câu hỏi hiện tại
      trigger.setAttribute('aria-expanded', String(!isExpanded));
      item.classList.toggle('is-open', !isExpanded);
    });
  });
}
