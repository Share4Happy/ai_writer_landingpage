/**
 * NT AI Writer - FAQ Accordion
 */

export function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Đóng các câu hỏi khác nếu muốn chế độ single accordion
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
