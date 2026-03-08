import { useState } from 'preact/hooks';

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Props {
  lang: 'ru' | 'en';
  cards: Card[];
  bookingUrl: string;
}

const ctaLabels = {
  ru: {
    pregnancy: 'Записаться на стартовую встречу',
    postpartum: 'Записаться на восстановление',
    unsure: 'Записаться на стартовую встречу',
  },
  en: {
    pregnancy: 'Book an intro session',
    postpartum: 'Book postpartum recovery',
    unsure: 'Book an intro session',
  },
};

export default function RouteSelectorIsland({ lang, cards, bookingUrl }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelected(card.id === selected ? null : card.id)}
            class={`card text-left cursor-pointer transition-all duration-200 ${
              selected === card.id
                ? 'border-[var(--color-primary)] shadow-[0_5px_25px_rgba(196,145,142,0.2)]'
                : 'hover:border-[var(--color-primary)]/50'
            }`}
          >
            <h3 class="text-xl mb-3 font-[var(--font-heading)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {card.title}
            </h3>
            <p class="text-[15px] text-[var(--color-text-body)] leading-relaxed">
              {card.description}
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <div class="mt-8 text-center animate-fadeIn">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener"
            class="btn btn-primary inline-block"
          >
            {ctaLabels[lang][selected as keyof typeof ctaLabels.ru]}
          </a>
        </div>
      )}
    </div>
  );
}
