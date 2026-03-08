import { useState } from 'preact/hooks';

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Props {
  lang: 'ru' | 'en';
  cards: Card[];
  contactUrl: string;
}

const ctaLabels = {
  ru: {
    pregnancy: 'Связаться по поводу беременности',
    postpartum: 'Связаться по поводу восстановления',
    unsure: 'Связаться для консультации',
  },
  en: {
    pregnancy: 'Get in touch about pregnancy',
    postpartum: 'Get in touch about recovery',
    unsure: 'Get in touch for guidance',
  },
};

export default function RouteSelectorIsland({ lang, cards, contactUrl }: Props) {
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
                ? 'border-[var(--color-primary)] shadow-[0_5px_25px_rgba(105,70,113,0.15)]'
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
            href={contactUrl}
            class="btn btn-primary inline-block"
          >
            {ctaLabels[lang][selected as keyof typeof ctaLabels.ru]}
          </a>
        </div>
      )}
    </div>
  );
}
